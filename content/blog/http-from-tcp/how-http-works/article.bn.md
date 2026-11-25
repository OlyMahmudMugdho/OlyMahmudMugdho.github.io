---
title: "HTTP প্রোটোকল বোঝা: Request, Response এবং Wire Format"
date: "2026-11-24"
excerpt: "TCP stream-এর ওপর HTTP/1.1 request আর response কীভাবে plain text হিসেবে সাজানো থাকে, হেডার, status code, CRLF আর body framing সহ।"
category: "Coding"
tags: ["coding", "networking", "tcp", "http", "golang", "http-from-tcp"]
featured: false
coverImage: "https://res.cloudinary.com/dnmubeloc/image/upload/v1795594765/blog/d621b812-a99a-4f40-bbfb-8bf74989bc16_stzooi.webp"
author: "M. Oly Mahmud"
---

# HTTP প্রোটোকল বোঝা: Request, Response এবং Wire Format

TCP দুইটা প্রোগ্রামের মধ্যে একটা সাজানো byte stream দেয়, কিন্তু URL, header, বা status code সম্পর্কে তার কোনো ধারণা নেই। HTTP/1.1 হলো সেই plain-text প্রোটোকল, যা মেনে ক্লায়েন্ট (ব্রাউজার, `curl`, API ক্লায়েন্ট) আর সার্ভার ওই TCP stream-এর ওপর দিয়ে মেসেজ আদান-প্রদান করে।

## Request-Response প্রক্রিয়া

HTTP সহজ একটা request-response ধাপে কাজ করে:

```sequence
title: HTTP Request-Response Cycle
actors: Client (curl / browser) | Server (Ant) !accent
<-> TCP Connection !muted
-> HTTP Request (plain text bytes) !accent
<- HTTP Response (plain text bytes) !hit
```

1. ক্লায়েন্ট সার্ভারের সাথে TCP connection খোলে এবং একটা HTTP request পাঠায়।
2. সার্ভার request পড়ে ফলাফল তৈরি করে এবং একটা HTTP response ফেরত পাঠায়।
3. HTTP/1.0-এ প্রতিটা request-এর পর কানেকশন বন্ধ হয়ে যেত। HTTP/1.1-এ একই কানেকশন পুনরায় ব্যবহার করা যায় (`keep-alive`), অথবা রেসপন্স পাঠানোর পর বন্ধ করে দেওয়া যায়।

HTTP নিজে stateless। প্রতিটা request-এ প্রয়োজনীয় তথ্য সাথে পাঠাতে হয়। লগইন বা সেশনের মতো কাজগুলো `Cookie` বা `Authorization` হেডারের মাধ্যমে এর ওপর তৈরি করা হয়।

## HTTP Request-এর গঠন

টার্মিনালে নিচের কমান্ডটি চালালে:

```bash
curl -v http://localhost:8080/hello
```

`curl` `localhost:8080`-এ একটা TCP connection খোলে এবং ঠিক এই বাইটগুলো পাঠায়:

```text
GET /hello HTTP/1.1\r\n
Host: localhost:8080\r\n
User-Agent: curl/8.5.0\r\n
Accept: */*\r\n
\r\n
```

প্রতিটা HTTP/1.1 request-এ চারটা অংশ থাকে:

```stack
title: HTTP/1.1 Request-এর গঠন
Request Line | METHOD SP PATH SP VERSION \r\n !accent
Headers | Key: Value \r\n (প্রতি লাইনে একটি)
Blank Line | \r\n (হেডার শেষ হওয়ার সংকেত) !muted
Body | ঐচ্ছিক ডেটা (যেমন JSON) !hit
```

1. Request Line (`GET /hello HTTP/1.1`): এতে HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `HEAD`), রিকোয়েস্ট path (`/hello`), এবং প্রোটোকল ভার্সন (`HTTP/1.1`) থাকে।
2. Headers: `: ` দিয়ে আলাদা করা key-value জোড়া, প্রতি লাইনে একটা করে। HTTP/1.1-এ `Host` হেডার বাধ্যতামূলক।
3. খালি লাইন (`\r\n`): HTTP/1.1-এ প্রতিটা লাইন CRLF (`\r\n`, Carriage Return + Line Feed) দিয়ে শেষ হয়। শেষ হেডারের পর একটা খালি লাইন থাকলে `\r\n\r\n` তৈরি হয়, যা হেডার শেষ হওয়ার সংকেত দেয়।
4. Body: ঐচ্ছিক অংশ, সাধারণত `POST` বা `PUT` রিকোয়েস্টে JSON বা ফর্ম ডেটা পাঠাতে ব্যবহৃত হয়। `GET` রিকোয়েস্টে সাধারণত body থাকে না।

## HTTP Response-এর গঠন

সার্ভার উত্তর পাঠানোর সময় HTTP response ফরম্যাটে বাইট লেখে:

```text
HTTP/1.1 200 OK\r\n
Content-Type: text/plain\r\n
Content-Length: 11\r\n
\r\n
Hello World
```

এর গঠনও request-এর মতোই:

```stack
title: HTTP/1.1 Response-এর গঠন
Status Line | VERSION SP CODE SP REASON \r\n !accent
Headers | Key: Value \r\n (Content-Type, Content-Length)
Blank Line | \r\n (হেডার ও body আলাদা করে) !muted
Body | Hello World !hit
```

1. Status Line (`HTTP/1.1 200 OK`): এতে HTTP ভার্সন, ৩ অঙ্কের status code, এবং ছোট একটা reason phrase থাকে। প্রথম অঙ্ক অনুযায়ী status code-গুলো ভাগ করা হয়:
   - `2xx`: সফল (`200 OK`, `201 Created`)
   - `3xx`: রিডাইরেক্ট (`301 Moved Permanently`, `304 Not Modified`)
   - `4xx`: ক্লায়েন্টের ত্রুটি (`400 Bad Request`, `404 Not Found`)
   - `5xx`: সার্ভারের ত্রুটি (`500 Internal Server Error`)
2. Headers: রেসপন্স সম্পর্কিত তথ্য। সাধারণত `Content-Type` (যেমন `text/plain`, `text/html`, `application/json`) এবং `Content-Length` (বাইটে body-র সঠিক দৈর্ঘ্য) ব্যবহার করা হয়।
3. খালি লাইন (`\r\n`): হেডার আর body আলাদা করে।
4. Body: মূল ডেটা। `"Hello World"` হলো ১১ byte।

## Body কোথায় শেষ হলো ক্লায়েন্ট কীভাবে বোঝে

TCP শুধু byte stream হওয়ায় ক্লায়েন্টকে জানতে হয় রেসপন্স body কোথায় শেষ হয়েছে। HTTP/1.1 তিনভাবে এটা সমাধান করে:

1. `Content-Length`: সার্ভার আগেই body-র সঠিক বাইট সংখ্যা জানিয়ে দেয়। `\r\n\r\n` পড়ার পর ক্লায়েন্ট ঠিক তত বাইট পড়ে থেমে যায়।
2. কানেকশন বন্ধ করা: সার্ভার TCP socket বন্ধ করে দিলে ক্লায়েন্ট `EOF` না পাওয়া পর্যন্ত পড়ে।
3. `Transfer-Encoding: chunked`: আগে থেকে পুরো body-র দৈর্ঘ্য জানা না থাকলে ডেটা ছোট ছোট অংশে (chunk) পাঠানো হয়।

নেটওয়ার্কে ছোট ফরম্যাটিং ভুলও সমস্যা তৈরি করে। দুটো হেডারের মাঝে `\r\n` বাদ পড়লে সেগুলো মিশে একটা ভুল হেডার হয়ে যায়, আর `Content-Length` ভুল থাকলে স্ট্রিক্ট ক্লায়েন্ট বাকি বাইটের জন্য আটকে থাকতে পারে বা উত্তর কেটে ফেলতে পারে।

TCP আর HTTP ফরম্যাট পরিষ্কার হওয়ার পর এবার আমরা Go দিয়ে raw TCP-র ওপর প্রথম HTTP সার্ভার লিখব।
