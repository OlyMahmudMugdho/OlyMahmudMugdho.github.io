---
title: "Parsing Raw HTTP Requests in Go"
date: "2026-11-24"
excerpt: "Building a buffered TCP stream parser and an HTTP Request struct in Go to extract the method, path, protocol, headers, and body from incoming connections."
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "parsing", "http-from-tcp"]
featured: false
author: "M. Oly Mahmud"
---

# Parsing Raw HTTP Requests in Go

So far, our server read incoming data into a fixed 1024-byte slice and printed it out without inspecting what the client actually asked for. To route endpoints or read JSON payloads, the server needs to turn that raw TCP byte stream into structured Go data.

In this step, we add two new packages to Project Ant: `parser` for reading lines and fixed-length byte slices from a buffered reader, and `requests` for parsing the request line, headers, and body into a `Request` struct.

## Project Layout

```filetree
title: ant/
ant/ !accent
  go.mod
  main.go
  httpserver/
    server.go
  parser/ : new !hit
    parser.go : new !hit
  requests/ : new !hit
    request.go : new !hit
```

## How the Parser Reads From the TCP Stream

Because TCP delivers a continuous byte stream, we wrap `net.Conn` in a `bufio.Reader` and parse the HTTP/1.1 message in three stages:

```flow
title: Three-Stage HTTP Stream Parser
TCP Stream (net.Conn) !accent
bufio.Reader (parser.Parser)
1. ParseLine() : "POST /users HTTP/1.1" !hit
2. ParseLine() loop : Headers until empty line "" !hit
3. ParseExactBytes(len) : Request Body (if Content-Length exists) !hit
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

### Why bufio.Reader and io.Reader

`NewParser` accepts an `io.Reader` instead of a concrete `net.Conn`. Since `net.Conn` implements `io.Reader`, the server can pass a live TCP connection directly, and tests can pass a `strings.Reader` or `bytes.Buffer`.

Wrapping the reader in `bufio.Reader` gives us `ReadBytes('\n')`, which buffers incoming chunks from TCP until a full line arrives. `strings.TrimRight(string(line), "\r\n")` removes the HTTP CRLF line ending.

For the body, `ParseExactBytes` uses `io.ReadFull` so the server keeps reading until all `count` bytes have arrived, even if TCP splits the payload across multiple packets.

## Parsing Into a Request Struct (requests/request.go)

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

### Walking Through ParseRequest

1. Request line: `parser.ParseLine()` reads the first line (for example, `POST /users HTTP/1.1`). `strings.Fields` splits it into three tokens: `Method`, `Path`, and `Protocol`.
2. Headers: A loop reads line by line until `headerLine == ""` (the blank line between headers and body). `strings.SplitN(headerLine, ":", 2)` splits only on the first colon, which preserves colons inside header values such as `Host: localhost:8080`.
3. Body: If the `Content-Length` header is present, `strconv.Atoi` converts it to an integer and `parser.ParseExactBytes(contentLength)` reads that exact number of bytes into `r.Body`.

## Wiring the Parser Into the Server (httpserver/server.go)

Inside `HandleConnection`, we replace the fixed 1024-byte `conn.Read` with our parser and echo the parsed fields back to the client:

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

## Testing With curl

Start the server:

```bash
go run .
```

Send a `POST` request with a JSON body:

```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Oly"}'
```

The server parses every part of the incoming HTTP request and sends back the extracted `Method`, `Path`, `Protocol`, `Headers`, and `Body`:

```text
Your request details are as follows:
				Method: POST
				Path: /users
				Protocol: HTTP/1.1
				Headers: map[Accept:*/* Content-Length:14 Content-Type:application/json Host:localhost:8080 User-Agent:curl/8.5.0]
				Body: {"name":"Oly"}
```
