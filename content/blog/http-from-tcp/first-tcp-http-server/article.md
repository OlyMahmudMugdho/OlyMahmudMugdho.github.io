---
title: "Building Your First HTTP Server Over Raw TCP in Go"
date: "2026-11-24"
excerpt: "Starting Project Ant by opening a TCP listener in Go, accepting connections, printing raw HTTP requests, and writing a response that works with curl."
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "http-from-tcp"]
featured: false
author: "M. Oly Mahmud"
---

# Building Your First HTTP Server Over Raw TCP in Go

Now that we know how TCP streams and HTTP/1.1 messages work, we can start writing code for Project Ant (`github.com/OlyMahmudMugdho/ant`). We will use Go's `net` package directly instead of `net/http`.

For this first working version, the server needs to do five things:

1. Listen on TCP port `8080`.
2. Accept incoming connections in a loop.
3. Read raw bytes from the connection and print the HTTP request.
4. Write back an HTTP response that `curl` can display.
5. Close the connection.

## Server Lifecycle

Here is the flow of our initial server loop:

```flow
title: TCP HTTP Server Loop
net.Listen("tcp", ":8080") !accent
@loop-start
listener.Accept() : Waits for a client TCP handshake !hit
Print conn.RemoteAddr()
conn.Read(b) : Reads raw HTTP request bytes
conn.Write(response) : Sends raw HTTP response bytes
conn.Close() : Closes the TCP connection !muted
@loop-end: next connection
```

## The Code (main.go)

After initializing the module (`go mod init github.com/OlyMahmudMugdho/ant`), here is the initial `main.go`:

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

## Walking Through main.go

### Listening on Port 8080

```go
listener, err := net.Listen("tcp", ":8080")
if err != nil {
	log.Fatal(err)
}
defer listener.Close()
```

`net.Listen("tcp", ":8080")` binds a TCP socket on port `8080` across local network interfaces. If the port is already taken, `log.Fatal(err)` prints the error and exits. `defer listener.Close()` closes the listener when `main()` returns.

### Accepting Connections

```go
for {
	conn, err := listener.Accept()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(conn.RemoteAddr())
```

`listener.Accept()` blocks until a client finishes the TCP three-way handshake, then returns a `net.Conn` representing that connection. Printing `conn.RemoteAddr()` shows the client's IP and ephemeral port (for example, `127.0.0.1:54321` or `[::1]:54321`).

### Reading the Request

```go
b := make([]byte, 1024)
conn.Read(b)
fmt.Println(string(b))
```

We allocate a 1024-byte slice, read bytes from `conn`, and print them as a string. That prints the plain-text HTTP request directly in the terminal.

### Writing the Response and Closing

```go
body := "Hello World"
response := fmt.Sprintf("HTTP/1.1 200 OK \r\n Content-Type: text/plain Content-Length: %d \r\n\r\n %s ",
	len(body),
	body)

conn.Write([]byte(response))

conn.Close()
```

We format an HTTP/1.1 response string, convert it to a byte slice, write it to `conn`, and call `conn.Close()` to terminate the connection.

## Testing With curl

Run the server in one terminal:

```bash
go run .
```

Then send a request from another terminal:

```bash
curl -v http://localhost:8080
```

In the server terminal, you will see the remote address and the raw HTTP request:

```text
[::1]:52840
GET / HTTP/1.1
Host: localhost:8080
User-Agent: curl/8.5.0
Accept: */*
```

And `curl` prints `Hello World`.
