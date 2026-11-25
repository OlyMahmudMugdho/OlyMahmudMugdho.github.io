---
title: "Go-তে সার্ভারের কোড সাজানো এবং Goroutine দিয়ে Concurrent Connection হ্যান্ডলিং"
date: "2026-11-24"
excerpt: "Project Ant-কে আলাদা httpserver প্যাকেজে ভাগ করা, Server struct থেকে error রিটার্ন করা এবং goroutine ব্যবহার করে একসাথে একাধিক ক্লায়েন্ট কানেকশন হ্যান্ডেল করা।"
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "concurrency", "http-from-tcp"]
featured: false
coverImage: "https://res.cloudinary.com/dnmubeloc/image/upload/v1795591763/blog/e03948de-b3a6-4967-8007-81a58e5b4bc4_lkrjsg.webp"
author: "M. Oly Mahmud"
---

# Go-তে সার্ভারের কোড সাজানো এবং Goroutine দিয়ে Concurrent Connection হ্যান্ডলিং

আগের লেখায় পুরো সার্ভারের কোড একটি `main()` ফাংশনের ভেতর ছিল এবং একসময়ে একটি করে ক্লায়েন্ট কানেকশন হ্যান্ডেল করা হচ্ছিল। সামনে যখন request parsing, header ম্যানেজমেন্ট, আর routing যোগ হবে, তখন সবকিছু `main.go`-তে রাখলে কোড সামলানো কঠিন হয়ে যাবে।

এই ধাপে আমরা সার্ভারের লজিক আলাদা `httpserver` প্যাকেজে সরিয়ে নেব, `Server` struct থেকে সঠিকভাবে error রিটার্ন করব, এবং প্রতিটি নতুন TCP কানেকশন আলাদা goroutine-এ চালাব।

## প্রজেক্টের ফোল্ডার কাঠামো

কাজের ধরন অনুযায়ী এখন প্রজেক্টের কোড দুটি ফাইলে ভাগ করা হয়েছে:

```filetree
title: ant/
ant/ !accent
  go.mod
  main.go
  httpserver/ : নতুন !hit
    server.go : নতুন !hit
```

- `httpserver/server.go` ফাইলে `Server` struct, TCP listener, এবং ক্লায়েন্ট কানেকশন হ্যান্ডলিংয়ের কোড আছে।
- `main.go` সার্ভার তৈরি করে, কোনো error এলে তা হ্যান্ডেল করে এবং সার্ভার চালু করে।

## Server Struct এবং Concurrent Loop (httpserver/server.go)

```go
package httpserver

import (
	"fmt"
	"net"
)

type Server struct {
	Port     int
	Listener net.Listener
}

func NewServer(port int) (*Server, error) {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return nil, err
	}

	return &Server{
		Port:     port,
		Listener: lis,
	}, nil
}

func (s *Server) Start() error {
	defer s.Listener.Close()

	for {
		conn, err := s.Listener.Accept()
		if err != nil {
			return err
		}

		go s.HandleConnection(conn)
	}
}

func (s *Server) HandleConnection(conn net.Conn) {
	defer conn.Close()

	fmt.Println(conn.RemoteAddr())

	// prints the accepted request data
	b := make([]byte, 1024)
	conn.Read(b)
	fmt.Println(string(b))

	// gives a response
	body := "Hello World"
	response := fmt.Sprintf("HTTP/1.1 200 OK \r\n Content-Type: text/plain Content-Length: %d \r\n\r\n %s ",
		len(body),
		body)

	conn.Write([]byte(response))
}
```

### Server Struct এবং Error রিটার্ন করা

`main()`-এর ভেতর আলাদা ভেরিয়েবলে listener রাখার বদলে আমরা `Port` এবং `Listener`-কে একসাথে `Server` struct-এ রেখেছি।

`NewServer` এবং `Start` দুটি ফাংশনই `if err != nil` চেক করে এবং `httpserver` প্যাকেজের ভেতর `log.Fatal` কল না করে সরাসরি error রিটার্ন করে। এতে প্যাকেজটি পরিষ্কার থাকে এবং error হলে প্রোগ্রাম কীভাবে থামবে সেই সিদ্ধান্ত `main()`-এর হাতে থাকে।

### Goroutine দিয়ে Concurrent Connection হ্যান্ডলিং

সবচেয়ে বড় আচরণগত পরিবর্তন এসেছে `Start()` মেথডে:

```go
for {
	conn, err := s.Listener.Accept()
	if err != nil {
		return err
	}

	go s.HandleConnection(conn)
}
```

আগে `for` লুপের ভেতরেই request পড়া, response লেখা, আর connection বন্ধ করা হতো। ফলে কোনো একটি ক্লায়েন্ট ধীর হলে পরের ক্লায়েন্টকে অপেক্ষা করতে হতো।

`go` কিওয়ার্ড যোগ করায় প্রতিটা নতুন কানেকশন নিজের আলাদা goroutine-এ চলে:

```tree
listener.Accept() !accent
  go HandleConnection : Client 1 !hit
  go HandleConnection : Client 2 !hit
  go HandleConnection : Client 3 !hit
```

মূল লুপটি সাথে সাথে আবার `s.Listener.Accept()`-এ ফিরে গিয়ে পরবর্তী কানেকশন নিতে পারে, আর চালু থাকা কানেকশনগুলো সমান্তরালে (concurrently) কাজ করে। `HandleConnection`-এর শুরুতে `defer conn.Close()` থাকায় ফাংশন শেষ হওয়ার সাথে সাথেই TCP socket বন্ধ হয়ে যায়।

## মূল ফাইল (main.go)

TCP ও HTTP লজিক `httpserver` প্যাকেজে সরিয়ে নেওয়ায় `main.go` এখন সার্ভার তৈরি করে, error চেক করে, এবং সার্ভার চালু করে:

```go
package main

import (
	"log"

	"github.com/OlyMahmudMugdho/ant/httpserver"
)

func main() {
	server, err := httpserver.NewServer(8080)
	if err != nil {
		log.Fatal(err)
	}

	if err := server.Start(); err != nil {
		log.Fatal(err)
	}
}
```

## রান ও টেস্ট করা

সার্ভার চালু করুন:

```bash
go run .
```

এবার `curl` দিয়ে একসাথে একাধিক request পাঠিয়ে টেস্ট করতে পারেন:

```bash
curl -v http://localhost:8080 &
curl -v http://localhost:8080 &
wait
```

প্রতিটি request আলাদা goroutine-এ গ্রহণ হবে, ক্লায়েন্টের ঠিকানা প্রিন্ট হবে, এবং উত্তর হিসেবে `Hello World` ফেরত যাবে।
