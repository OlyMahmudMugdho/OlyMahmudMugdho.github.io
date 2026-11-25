---
title: "Structuring the Server and Handling Concurrent Connections in Go"
date: "2026-11-24"
excerpt: "Refactoring Project Ant into a dedicated httpserver package with a Server struct, idiomatic Go error returns, and goroutines so multiple clients can connect at the same time."
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "concurrency", "http-from-tcp"]
featured: false
author: "M. Oly Mahmud"
---

# Structuring the Server and Handling Concurrent Connections in Go

In the previous post, everything lived inside a single `main()` function and handled one client connection at a time. As Project Ant grows to parse requests, manage headers, and route paths, keeping all server logic inside `main.go` becomes hard to maintain.

In this step, we move the server logic into an `httpserver` package, introduce a `Server` struct that returns errors to the caller, and dispatch each incoming TCP connection to its own goroutine.

## Project Layout

The repository now splits server logic and program startup into two files:

```filetree
title: ant/
ant/ !accent
  go.mod
  main.go
  httpserver/ : new !hit
    server.go : new !hit
```

- `httpserver/server.go` defines the `Server` struct and manages the TCP listener and client connections.
- `main.go` creates the server, checks returned errors, and starts listening.

## Defining the Server and Concurrent Loop (httpserver/server.go)

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

### The Server Struct and Returning Errors

Instead of holding the listener in a loose local variable inside `main()`, we group the server state into a `Server` struct containing `Port` and `Listener`.

Both `NewServer` and `Start` check `if err != nil` and return the error directly to the caller instead of calling `log.Fatal` inside the `httpserver` package. That keeps the package reusable and leaves shutdown decisions to `main()`.

### Concurrent Connection Handling With Goroutines

The biggest behavioral change is in `Start()`:

```go
for {
	conn, err := s.Listener.Accept()
	if err != nil {
		return err
	}

	go s.HandleConnection(conn)
}
```

Previously, the `for` loop read the request, wrote the response, and closed the connection before calling `Accept()` again. If one client stalled mid-request, every other client had to wait.

Adding the `go` keyword spawns a lightweight goroutine for each accepted connection:

```tree
listener.Accept() !accent
  go HandleConnection : Client 1 !hit
  go HandleConnection : Client 2 !hit
  go HandleConnection : Client 3 !hit
```

The main loop immediately returns to `s.Listener.Accept()` to take the next connection while active clients run concurrently. Inside `HandleConnection`, `defer conn.Close()` ensures the TCP socket is closed as soon as the function exits.

## Entry Point (main.go)

With the TCP and HTTP logic in the `httpserver` package, `main.go` creates the server, handles any returned errors, and starts the loop:

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

## Running and Testing

Start the server:

```bash
go run .
```

You can test multiple requests in parallel using `curl`:

```bash
curl -v http://localhost:8080 &
curl -v http://localhost:8080 &
wait
```

Each request is accepted on its own goroutine, logged with its remote address, and answered with `Hello World`.
