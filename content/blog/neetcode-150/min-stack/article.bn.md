---
title: "মিন স্ট্যাক (Min Stack)"
date: "2026-11-20"
excerpt: "আসল স্ট্যাকের পাশাপাশি আরেকটি মিনিমাম স্ট্যাক রেখে O(1) সময়ে getMin() করার সহজ কৌশল।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# মিন স্ট্যাক (Min Stack)

সমস্যার লিংক: https://leetcode.com/problems/min-stack/

## সমস্যাটা কী?

এমন একটা `MinStack` বানাতে হবে যেখানে `push`, `pop`, `top` তো থাকবেই, সাথে `getMin()` কল করলে স্ট্যাকের ভেতর থাকা সবচেয়ে ছোট সংখ্যাটা পাওয়া যাবে—আর প্রতিটা অপারেশনই হতে হবে **`O(1)`** সময়ে।

---

# সহজভাবে চিন্তা করি

সাধারণ স্ট্যাকে `push`, `pop`, `top` এমনিতেই `O(1)` সময়ে হয়। ঝামেলাটা বাধে `getMin()` নিয়ে।

আপনি ভাবতে পারেন—একটা `min_val` ভেরিয়েবল রাখলেই তো হয়! কিন্তু সমস্যা হলো, যদি ওই সবচেয়ে ছোট সংখ্যাটাই `pop()` করে বের করে দেওয়া হয়, তাহলে তার আগের দ্বিতীয় সর্বনিম্ন সংখ্যাটা কী ছিল, সেটা স্ট্যাক স্ক্যান না করে জানবেন কীভাবে?

এর দারুণ সমাধান হলো: **দুটো স্ট্যাক পাশাপাশি রাখা**।

- `self.stack`: এখানে আসল সংখ্যাগুলো থাকবে।
- `self.minStack`: এখানে প্রতিটি ধাপে *এখন পর্যন্ত সবচেয়ে ছোট* সংখ্যাটা জমা থাকবে।

তাহলে যখনই `pop()` করবেন, দুটো স্ট্যাক থেকেই একটা করে উপাদান বের হবে—আর সাথে সাথেই আগের মিনিমামটা আবার `minStack`-এর একদম ওপরে চলে আসবে!

---

# অ্যালগরিদম

1. ক্লাস তৈরি করার সময় দুটো খালি লিস্ট `stack` আর `minStack` নিই।
2. `push(val)`: `stack`-এ `val` রাখি, আর `minStack` খালি থাকলে `val` রাখি; না থাকলে `min(val, minStack[-1])` রাখি।
3. `pop()`: `stack` আর `minStack` দুটো থেকেই শেষ উপাদান বের করি।
4. `top()`: `stack[-1]` রিটার্ন করি।
5. `getMin()`: `minStack[-1]` রিটার্ন করি।

```text
class MinStack
    stack = [], minStack = []
    push(val):
        stack.append(val)
        minStack.append(val if not minStack else min(val, minStack[-1]))
    pop():    stack.pop(); minStack.pop()
    top():    return stack[-1]
    getMin(): return minStack[-1]
```

---

# ধাপে ধাপে ড্রাই রান

- `push(-2)` → `stack: [-2]`, `minStack: [-2]`
- `push(0)` → `min(0, -2) = -2` → `stack: [-2, 0]`, `minStack: [-2, -2]`
- `push(-3)` → `min(-3, -2) = -3` → `stack: [-2, 0, -3]`, `minStack: [-2, -2, -3]`
- `getMin()` → `minStack[-1]` অর্থাৎ `-3`
- `pop()` → দুটো থেকেই পপ → `stack: [-2, 0]`, `minStack: [-2, -2]`
- `getMin()` → `minStack[-1]` অর্থাৎ `-2` (আগের মিনিমাম ফিরে এল!)

---

# কোড বিশ্লেষণ

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(self, val: int) -> None:
        self.stack.append(val)

        if not self.minStack:
            self.minStack.append(val)
        else:
            self.minStack.append(min(val, self.minStack[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.minStack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.minStack[-1]
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(1)` — প্রতিটা অপারেশনই শুধু লিস্টের শেষ উপাদান নিয়ে কাজ করে।
- **Space Complexity:** `O(n)` — সমান্তরাল `minStack`-এ `n`টা মান রাখার জন্য।

---

# মূল কথা

> **প্রতিটা ধাপের মিনিমাম আলাদা একটা স্ট্যাকে ধরে রাখলে `pop()` করার পরও আগের মিনিমাম খুঁজতে হয় না।**
