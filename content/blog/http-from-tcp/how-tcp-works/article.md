---
title: "Understanding TCP and Reliable Byte Streams"
date: "2026-11-24"
excerpt: "How TCP builds an ordered, reliable byte stream on top of IP packets using handshakes, sequence numbers, and acknowledgments."
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "http-from-tcp"]
featured: false
author: "M. Oly Mahmud"
---

# Understanding TCP and Reliable Byte Streams

When we use Express, Gin, or Go's `net/http`, we usually only deal with request and response objects. We rarely look at the transport layer carrying those bytes. In this series, I am building a small HTTP server from scratch in Go (called Ant) using only raw TCP sockets. Before writing server code, it helps to understand what TCP actually provides.

## Why TCP Exists

At the network layer, IP moves data in small packets across routers. IP is best-effort. Packets can be dropped when a router is busy, arrive out of order if they take different paths, or get duplicated along the way.

If an application had to deal with missing or reordered packets directly, loading a webpage or parsing JSON would break constantly. TCP sits on top of IP and gives two programs an ordered, reliable, two-way stream of bytes. If one side writes `"Hello World"` into a TCP connection, the other side reads `"Hello World"` in the same order, or receives an error if the connection drops.

## IP Addresses and Ports

An IP address (such as `127.0.0.1` or `93.184.216.34`) identifies a machine on a network. A port number (such as `80`, `443`, or `8080`) identifies a specific process listening on that machine. One server can run PostgreSQL on port `5432`, a frontend dev server on port `3000`, and our Go server on port `8080` at the same time.

The OS identifies each TCP connection by four values:

```sequence
title: TCP 4-Tuple Connection
actors: Client : 127.0.0.1 : 54321 | Server : 127.0.0.1 : 8080 !accent
<-> (Client IP, Port) <-> (Server IP, Port) !hit
```

The client's OS picks an unused temporary port (called an ephemeral port) for each outgoing connection. That is how a browser can keep multiple connections open to the same server port without mixing up their data.

## The Three-Way Handshake

Before application data moves across the wire, the client and server establish a connection and agree on starting sequence numbers. This takes three packets:

```sequence
title: TCP Three-Way Handshake
actors: Client | Server !accent
-> 1. SYN (seq=x)
<- 2. SYN-ACK (seq=y, ack=x+1)
-> 3. ACK (ack=y+1)
== Connection Established ==
```

1. The client sends a `SYN` packet with an initial sequence number `x`.
2. The server replies with `SYN-ACK`, acknowledging `x+1` and sending its own starting sequence number `y`.
3. The client sends an `ACK` for `y+1`.

After that third packet, the connection is open and both sides can send and receive bytes.

## How TCP Keeps Data Reliable

Your operating system's network stack handles reliability automatically using a few mechanisms:

- Sequence numbers track the position of every byte. If packet 2 arrives before packet 1, the OS holds packet 2 in a receive buffer until packet 1 shows up, then hands the ordered bytes to your program.
- Acknowledgments (ACKs) let the receiver confirm what it got. If the sender does not receive an ACK before a timeout, it retransmits the missing data.
- Flow control advertises how much buffer space the receiver has left (the receive window) so a fast sender does not flood a slow receiver.
- Congestion control slows transmission down when packet loss indicates network congestion.

Because the kernel handles all of this, our Go code only interacts with socket APIs like `net.Listener` and `net.Conn`.

## TCP Gives You a Byte Stream

One detail matters a lot when writing an HTTP server: TCP has no built-in idea of message boundaries.

Suppose a client writes `"GET / HTTP/1.1\r\n"` followed by `"Host: localhost\r\n\r\n"`. Depending on packet sizes and timing, the server's `Read()` call might get all of those bytes at once, or it might get `"GET / HT"` on the first read and the rest on the second read. If a client pipelines two requests on the same connection, both could even show up in a single `Read()`.

Because TCP only delivers a continuous stream of bytes, the protocol running on top of it has to define where one message ends and the next begins. HTTP does this with markers like `\r\n\r\n` and headers like `Content-Length`.

## Closing a Connection

When both sides finish sending data, TCP closes the connection using `FIN` packets:

```sequence
title: TCP Four-Way Teardown
actors: Client | Server !accent
-> 1. FIN
<- 2. ACK !muted
<- 3. FIN
-> 4. ACK !muted
```

In Go, calling `conn.Close()` starts this teardown for that socket.

Next, we will look at the HTTP/1.1 text format that rides inside this TCP stream.
