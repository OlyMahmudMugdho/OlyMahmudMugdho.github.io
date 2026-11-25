---
title: "Go দিয়ে Raw HTTP Request পার্স করা"
date: "2026-11-24"
excerpt: "buffered TCP stream parser এবং HTTP Request struct তৈরি করে incoming কানেকশন থেকে method, path, protocol, headers এবং body আলাদা করে বের করা।"
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "parsing", "http-from-tcp"]
featured: false
author: "M. Oly Mahmud"
---

# Go দিয়ে Raw HTTP Request পার্স করা

এতক্ষণ আমাদের সার্ভার ক্লায়েন্টের পাঠানো ডেটা একটি স্থির 1024-byte বাফারে পড়ে শুধু প্রিন্ট করছিল। আলাদা রুট হ্যান্ডেল করতে বা JSON বডি পড়তে হলে raw TCP byte stream-কে Go-এর স্ট্রাকচার্ড ডেটায় রূপান্তর করতে হবে।

এই ধাপে আমরা Project Ant-এ দুটি নতুন প্যাকেজ যোগ করব: buffered reader থেকে লাইন ও নির্দিষ্ট সংখ্যক বাইট পড়ার জন্য `parser`, এবং request line, headers আর body পার্স করে `Request` struct-এ রাখার জন্য `requests`।

## প্রজেক্টের ফোল্ডার কাঠামো

```filetree
title: ant/
ant/ !accent
  go.mod
  main.go
  httpserver/
    server.go
  parser/ : নতুন !hit
    parser.go : নতুন !hit
  requests/ : নতুন !hit
    request.go : নতুন !hit
```

## TCP Stream থেকে Parser কীভাবে পড়ে

TCP একটি অবিচ্ছিন্ন byte stream দেয় বলে আমরা `net.Conn`-কে `bufio.Reader`-এ মুড়ে নিই এবং তিনটি ধাপে HTTP/1.1 মেসেজ পার্স করি:

```flow
title: তিন ধাপে HTTP Stream Parser
TCP Stream (net.Conn) !accent
bufio.Reader (parser.Parser)
1. ParseLine() : "POST /users HTTP/1.1" !hit
2. ParseLine() loop : খালি লাইন "" না আসা পর্যন্ত Headers !hit
3. ParseExactBytes(len) : Request Body (Content-Length থাকলে) !hit
```

## Buffered Stream Parser (parser/parser.go)

```go
package parser

import (
	"bufio"
	"io"
	"strings"
)

type Parser struct {
	BufferedReader *bufio.Reader
}

func NewParser(r io.Reader) *Parser {
	return &Parser{
		BufferedReader: bufio.NewReader(r),
	}
}

// Parses a line from the buffered reader
func (p *Parser) ParseLine() (string, error) {
	line, err := p.BufferedReader.ReadBytes('\n')

	if err != nil {
		return "", err
	}

	// Trim the trailing newline characters and return the line as a string
	return strings.TrimRight(string(line), "\r\n"), nil
}

// Parses the request body based on the specified content length
func (p *Parser) ParseExactBytes(count int) ([]byte, error) {
	body := make([]byte, count)
	_, err := io.ReadFull(p.BufferedReader, body)

	if err != nil {
		return nil, err
	}

	return body, nil
}
```

### কেন bufio.Reader এবং io.Reader

`NewParser` ফাংশনটি সরাসরি `net.Conn` না নিয়ে `io.Reader` নেয়। যেহেতু `net.Conn` নিজেই `io.Reader` ইন্টারফেস ইমপ্লিমেন্ট করে, সার্ভার সরাসরি লাইভ TCP কানেকশন পাস করতে পারে এবং টেস্টের সময় `strings.Reader` বা `bytes.Buffer` ব্যবহার করা যায়।

`bufio.Reader`-এর `ReadBytes('\n')` মেথড পুরো একটি লাইন না আসা পর্যন্ত TCP থেকে ডেটা বাফার করে পড়ে। এরপর `strings.TrimRight(string(line), "\r\n")` দিয়ে শেষের HTTP CRLF বাদ দেওয়া হয়।

Body পড়ার জন্য `ParseExactBytes` ফাংশনে `io.ReadFull` ব্যবহার করা হয়েছে, যাতে payload একাধিক TCP packet-এ ভেঙে এলেও ঠিক `count` সংখ্যক বাইট পড়া নিশ্চিত হয়।

## Request Struct-এ পার্স করা (requests/request.go)

```go
package requests

import (
	"strconv"
	"strings"

	"github.com/OlyMahmudMugdho/ant/parser"
)

type Request struct {
	Method   string
	Path     string
	Protocol string
	Headers  map[string]string
	Body     []byte
}

func NewRequest() *Request {
	return &Request{}
}

func (r *Request) ParseRequest(parser *parser.Parser) (*Request, error) {
	// Parse the request line
	requestLine, err := parser.ParseLine()
	if err != nil {
		return nil, err
	}

	// Split the request line into method, path, and protocol
	parts := splitRequestLine(requestLine)
	if len(parts) != 3 {
		return nil, err
	}

	r.Method = parts[0]
	r.Path = parts[1]
	r.Protocol = parts[2]

	// Parse headers
	r.Headers = make(map[string]string)

	// Read headers until an empty line is encountered
	for {
		headerLine, err := parser.ParseLine()
		if err != nil {
			return nil, err
		}

		if headerLine == "" {
			break // End of headers
		}

		key, value := parseHeader(headerLine)
		r.Headers[key] = value
	}

	// Parse body if Content-Length header is present
	if contentLengthStr, ok := r.Headers["Content-Length"]; ok {
		contentLength := parseContentLength(contentLengthStr)
		body, err := parser.ParseExactBytes(contentLength)
		if err != nil {
			return nil, err
		}
		r.Body = body
	}

	return r, nil
}

// Helper functions for parsing request line and headers
func splitRequestLine(requestLine string) []string {
	return strings.Fields(requestLine)
}

// parseHeader splits a header line into key and value.
func parseHeader(headerLine string) (string, string) {
	parts := strings.SplitN(headerLine, ":", 2)
	if len(parts) != 2 {
		return "", ""
	}
	key := strings.TrimSpace(parts[0])
	value := strings.TrimSpace(parts[1])
	return key, value
}

// parseContentLength converts the Content-Length header value to an integer.
func parseContentLength(contentLengthStr string) int {
	contentLength, err := strconv.Atoi(contentLengthStr)
	if err != nil {
		return 0
	}
	return contentLength
}
```

### ParseRequest-এর ধাপগুলো

1. Request line: `parser.ParseLine()` প্রথম লাইনটি পড়ে (যেমন `POST /users HTTP/1.1`)। `strings.Fields` এটিকে তিনটি অংশে ভাগ করে: `Method`, `Path`, এবং `Protocol`।
2. Headers: খালি লাইন (`headerLine == ""`) না আসা পর্যন্ত লুপ চালিয়ে প্রতিটা হেডার লাইন পড়া হয়। `strings.SplitN(headerLine, ":", 2)` শুধু প্রথম কোলন ধরে ভাগ করে, যাতে `Host: localhost:8080`-এর মতো ভ্যালুর ভেতরের কোলন অক্ষত থাকে।
3. Body: হেডারে `Content-Length` থাকলে `strconv.Atoi` দিয়ে সেটিকে সংখ্যায় রূপান্তর করে `parser.ParseExactBytes(contentLength)` দিয়ে ঠিক তত বাইট `r.Body`-তে পড়া হয়।

## সার্ভারে Parser যুক্ত করা (httpserver/server.go)

`HandleConnection`-এর ভেতর স্থির 1024-byte `conn.Read`-এর বদলে এখন আমরা parser ব্যবহার করে পার্স করা ডেটা রেসপন্সে ফেরত পাঠাই:

```go
func (s *Server) HandleConnection(conn net.Conn) {
	defer conn.Close()

	// parse the request
	parser := parser.NewParser(conn)
	request, err := requests.NewRequest().ParseRequest(parser)

	if err != nil {
		fmt.Println("Error parsing request:", err)
		return
	}

	// gives a response
	body := `Your request details are as follows:
				Method: ` + request.Method + `
				Path: ` + request.Path + `
				Protocol: ` + request.Protocol + `
				Headers: ` + fmt.Sprintf("%v", request.Headers) + `
				Body: ` + string(request.Body)

	response := fmt.Sprintf("HTTP/1.1 200 OK \r\n Content-Type: text/plain Content-Length: %d \r\n\r\n %s ",
		len(body),
		body)

	conn.Write([]byte(response))
}
```

## curl দিয়ে টেস্ট করা

সার্ভার চালু করুন:

```bash
go run .
```

এবার JSON body সহ একটি `POST` রিকোয়েস্ট পাঠান:

```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Oly"}'
```

সার্ভার পুরো HTTP request পার্স করে `Method`, `Path`, `Protocol`, `Headers`, এবং `Body` রেসপন্স হিসেবে ফেরত দেবে:

```text
Your request details are as follows:
				Method: POST
				Path: /users
				Protocol: HTTP/1.1
				Headers: map[Accept:*/* Content-Length:14 Content-Type:application/json Host:localhost:8080 User-Agent:curl/8.5.0]
				Body: {"name":"Oly"}
```
