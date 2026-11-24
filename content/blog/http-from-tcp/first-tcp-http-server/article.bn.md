---
title: "Go দিয়ে Raw TCP-র ওপর প্রথম HTTP সার্ভার তৈরি"
date: "2026-11-24"
excerpt: "Go-এর net প্যাকেজ দিয়ে TCP listener চালু করে, connection গ্রহণ করে, raw HTTP request প্রিন্ট করে এবং curl-এ কাজ করে এমন response পাঠিয়ে শুরু করছি প্রজেক্ট Ant।"
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "http-from-tcp"]
featured: false
author: "M. Oly Mahmud"
---

# Go দিয়ে Raw TCP-র ওপর প্রথম HTTP সার্ভার তৈরি

TCP stream আর HTTP/1.1 মেসেজের গঠন বোঝার পর এবার আমরা প্রজেক্ট Ant (`github.com/OlyMahmudMugdho/ant`)-এর কোড লেখা শুরু করতে পারি। এখানে `net/http` ব্যবহার না করে সরাসরি Go-এর `net` প্যাকেজ ব্যবহার করব।

এই প্রথম সংস্করণে আমাদের সার্ভার পাঁচটা কাজ করবে:

1. TCP পোর্ট `8080`-এ লিসেন করবে।
2. লুপের ভেতর নতুন কানেকশন গ্রহণ করবে।
3. কানেকশন থেকে raw বাইট পড়ে HTTP request প্রিন্ট করবে।
4. `curl`-এ দেখা যায় এমন একটা HTTP response পাঠাবে।
5. কানেকশন বন্ধ করবে।

## সার্ভারের কাজের ধাপ

আমাদের প্রথম সার্ভার লুপটি এভাবে কাজ করে:

```text
net.Listen("tcp", ":8080")
          |
          v
    +--> [ listener.Accept() ]  <--- ক্লায়েন্টের TCP handshake-এর জন্য অপেক্ষা করে
    |          |
    |          v
    |    Print conn.RemoteAddr()
    |          |
    |          v
    |    conn.Read(b)           <--- raw HTTP request-এর বাইট পড়ে
    |          |
    |          v
    |    conn.Write(response)   <--- raw HTTP response-এর বাইট পাঠায়
    |          |
    |          v
    |    conn.Close()           <--- TCP কানেকশন বন্ধ করে
    |          |
    +----------+ (পরবর্তী কানেকশনের জন্য অপেক্ষা)
```

## কোড (`main.go`)

মডিউল তৈরি করার পর (`go mod init github.com/OlyMahmudMugdho/ant`), আমাদের প্রাথমিক `main.go`:

```go
package main

import (
	"fmt"
	"log"
	"net"
)

func main() {
	listener, err := net.Listen("tcp", ":8080")

	if err != nil {
		log.Fatal(err)
	}

	defer listener.Close()

	for {
		conn, err := listener.Accept()

		if err != nil {
			log.Fatal(err)
		}

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

		conn.Close()
	}
}
```

## `main.go` কোড বিশ্লেষণ

### পোর্ট 8080-এ লিসেন করা

```go
listener, err := net.Listen("tcp", ":8080")
if err != nil {
	log.Fatal(err)
}
defer listener.Close()
```

`net.Listen("tcp", ":8080")` লোকাল নেটওয়ার্ক ইন্টারফেসে `8080` পোর্টে একটা TCP socket বাইন্ড করে। পোর্ট আগে থেকেই ব্যবহৃত থাকলে `log.Fatal(err)` এরর দেখিয়ে প্রোগ্রাম বন্ধ করে দেয়। `defer listener.Close()` নিশ্চিত করে যে `main()` শেষ হলে listener বন্ধ হবে।

### কানেকশন গ্রহণ করা

```go
for {
	conn, err := listener.Accept()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(conn.RemoteAddr())
```

`listener.Accept()` ব্লক হয়ে থাকে যতক্ষণ না কোনো ক্লায়েন্ট TCP three-way handshake শেষ করে। এরপর এটি ওই কানেকশনের জন্য একটা `net.Conn` রিটার্ন করে। `conn.RemoteAddr()` প্রিন্ট করলে ক্লায়েন্টের IP আর অস্থায়ী port দেখা যায় (যেমন `127.0.0.1:54321` বা `[::1]:54321`)।

### Request পড়া

```go
b := make([]byte, 1024)
conn.Read(b)
fmt.Println(string(b))
```

আমরা `1024` বাইটের একটা slice নিয়ে `conn` থেকে ডেটা পড়ি এবং string হিসেবে প্রিন্ট করি। এতে সরাসরি টার্মিনালেই plain-text HTTP request দেখা যায়।

### Response লেখা এবং কানেকশন বন্ধ করা

```go
body := "Hello World"
response := fmt.Sprintf("HTTP/1.1 200 OK \r\n Content-Type: text/plain Content-Length: %d \r\n\r\n %s ",
	len(body),
	body)

conn.Write([]byte(response))

conn.Close()
```

এখানে HTTP/1.1 রেসপন্স স্ট্রিং তৈরি করে byte slice হিসেবে `conn`-এ লেখা হয়েছে, এবং শেষে `conn.Close()` দিয়ে কানেকশন বন্ধ করা হয়েছে।

## `curl` দিয়ে টেস্ট করা

একটা টার্মিনালে সার্ভার চালান:

```bash
go run .
```

আরেকটা টার্মিনাল থেকে request পাঠান:

```bash
curl -v http://localhost:8080
```

সার্ভারের টার্মিনালে ক্লায়েন্টের ঠিকানা আর raw HTTP request দেখা যাবে:

```text
[::1]:52840
GET / HTTP/1.1
Host: localhost:8080
User-Agent: curl/8.5.0
Accept: */*
```

আর `curl`-এ আউটপুট হিসেবে `Hello World` দেখা যাবে।
