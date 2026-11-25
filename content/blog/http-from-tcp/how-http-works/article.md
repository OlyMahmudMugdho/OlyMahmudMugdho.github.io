---
title: "Understanding HTTP: Requests, Responses, and the Wire Format"
date: "2026-11-24"
excerpt: "How HTTP/1.1 requests and responses are formatted as plain text over TCP, including headers, status codes, CRLF delimiters, and body framing."
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "http-from-tcp"]
featured: false
coverImage: "https://res.cloudinary.com/dnmubeloc/image/upload/v1795594765/blog/d621b812-a99a-4f40-bbfb-8bf74989bc16_stzooi.webp"
author: "M. Oly Mahmud"
---

# Understanding HTTP: Requests, Responses, and the Wire Format

TCP gives two programs an ordered byte stream, with no concept of URLs, headers, or status codes. HTTP/1.1 is the plain-text protocol that clients (browsers, `curl`, API clients) and servers use to structure messages over that stream.

## The Request-Response Cycle

HTTP follows a straightforward request-response flow:

```sequence
title: HTTP Request-Response Cycle
actors: Client (curl / browser) | Server (Ant) !accent
<-> TCP Connection !muted
-> HTTP Request (plain text bytes) !accent
<- HTTP Response (plain text bytes) !hit
```

1. The client opens a TCP connection to the server and writes an HTTP request.
2. The server reads the request, prepares a result, and writes back an HTTP response.
3. In HTTP/1.0, the connection closed after one exchange. In HTTP/1.1, connections can stay open for reuse (`keep-alive`) or close right after the response is sent.

HTTP itself is stateless. Each request carries all the context it needs, and features like sessions or authentication are layered on top with headers such as `Cookie` or `Authorization`.

## Anatomy of an HTTP Request

When you run:

```bash
curl -v http://localhost:8080/hello
```

`curl` opens a TCP connection to `localhost:8080` and sends these bytes:

```text
GET /hello HTTP/1.1\r\n
Host: localhost:8080\r\n
User-Agent: curl/8.5.0\r\n
Accept: */*\r\n
\r\n
```

Every HTTP/1.1 request has four sections:

```stack
title: HTTP/1.1 Request Anatomy
Request Line | METHOD SP PATH SP VERSION \r\n !accent
Headers | Key: Value \r\n (one per line)
Blank Line | \r\n (marks end of headers) !muted
Body | Optional payload (e.g. JSON) !hit
```

1. Request Line (`GET /hello HTTP/1.1`): Contains the HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `HEAD`), the request path (`/hello`), and the protocol version (`HTTP/1.1`).
2. Headers: Key-value pairs separated by `: `, one per line. In HTTP/1.1, the `Host` header is required.
3. Blank Line (`\r\n`): Every line in HTTP/1.1 ends with CRLF (`\r\n`, Carriage Return + Line Feed). An empty line after the last header produces `\r\n\r\n`, which marks the end of the headers.
4. Body: Optional payload used by methods like `POST` or `PUT` (for example, JSON or form data). `GET` requests normally have no body.

## Anatomy of an HTTP Response

When the server replies, it writes bytes in the HTTP response format:

```text
HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
Content-Length: 11\r\n
\r\n
Hello World
```

It uses the same layout as a request:

```stack
title: HTTP/1.1 Response Anatomy
Status Line | VERSION SP CODE SP REASON \r\n !accent
Headers | Key: Value \r\n (Content-Type, Content-Length)
Blank Line | \r\n (separates headers from body) !muted
Body | Hello World !hit
```

1. Status Line (`HTTP/1.1 200 OK`): Contains the HTTP version, a 3-digit status code, and a short reason phrase. Status codes are grouped by their first digit:
   - `2xx`: Success (`200 OK`, `201 Created`)
   - `3xx`: Redirection (`301 Moved Permanently`, `304 Not Modified`)
   - `4xx`: Client error (`400 Bad Request`, `404 Not Found`)
   - `5xx`: Server error (`500 Internal Server Error`)
2. Headers: Metadata about the response. Two common headers are `Content-Type` (such as `text/plain`, `text/html`, or `application/json`) and `Content-Length` (the exact size of the body in bytes).
3. Blank Line (`\r\n`): Separates headers from the body.
4. Body: The response payload. `"Hello World"` is 11 bytes long.

## Knowing Where the Body Ends

Because TCP is a byte stream, the client needs a way to know when the server has finished sending the response body. HTTP/1.1 handles this in three main ways:

1. `Content-Length`: The server states the exact byte length of the body. After reading `\r\n\r\n`, the client reads that many bytes and stops.
2. Closing the connection: If the server closes the TCP socket, the client reads until `EOF`.
3. `Transfer-Encoding: chunked`: Used when the server streams data without knowing the total length ahead of time.

Small formatting mistakes matter on the wire. Missing a `\r\n` between two headers merges them into a single invalid header line, and an inaccurate `Content-Length` causes strict clients to either wait for missing bytes or truncate the body.

With the TCP and HTTP formats clear, we can now write our first TCP-based HTTP server in Go.
