---
title: "ইভ্যালুয়েট রিভার্স পোলিশ নোটেশন (Evaluate Reverse Polish Notation)"
date: "2026-11-20"
excerpt: "স্ট্যাক ব্যবহার করে পোস্টফিক্স (Reverse Polish Notation) অঙ্কের ফলাফল বের করার সহজ ও পরিষ্কার ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# ইভ্যালুয়েট রিভার্স পোলিশ নোটেশন (Evaluate Reverse Polish Notation)

সমস্যার লিংক: https://leetcode.com/problems/evaluate-reverse-polish-notation/

## সমস্যাটা কী?

আমাদের কাছে পোস্টফিক্স নোটেশনে (Reverse Polish Notation) লেখা একটা গাণিতিক এক্সপ্রেশন `tokens` দেওয়া আছে। যেমন `["4", "13", "5", "/", "+"]`—যার মানে হলো `4 + (13 / 5)`। আমাদের এর চূড়ান্ত মান বের করতে হবে। ভাগের ক্ষেত্রে পূর্ণসংখ্যায় শূন্যের দিকে truncate করতে হবে (যেমন `-3 / 2` হবে `-1`, `-2` নয়)।

---

# সহজভাবে চিন্তা করি

পোস্টফিক্স লেখার নিয়মই হলো—দুটো সংখ্যার **পরে** অপারেটর বসে (`2 1 +` মানে `2 + 1`)।

তাই আমরা বাম থেকে ডানে যেতে যেতে যখনই কোনো সংখ্যা দেখব, সেটা স্ট্যাকে জমিয়ে রাখব। আর যখনই কোনো অপারেটর (`+`, `-`, `*`, `/`) দেখব, স্ট্যাক থেকে **সবচেয়ে ওপরের দুটো সংখ্যা** বের করে হিসাবটা সেরে ফলাফলটা আবার স্ট্যাকে ঢুকিয়ে দেব!

### দুটো জিনিস খেয়াল রাখবেন:
1. `-` আর `/` করার সময় ক্রম খুব গুরুত্বপূর্ণ: প্রথমে যেটা পপ হবে সেটা হলো ডান পাশের সংখ্যা `b`, আর পরেরটা হলো বাম পাশের সংখ্যা `a`। তাই হিসাব হবে `a - b` বা `a / b`।
2. Python-এ `//` করলে নেগেটিভ সংখ্যা নিচের দিকে (floor) চলে যায় (`-3 // 2 == -2`)। কিন্তু আমাদের দরকার শূন্যের দিকে truncate, তাই `int(a / b)` ব্যবহার করতে হবে।

---

# অ্যালগরিদম

1. খালি `stack` আর `operations = {'+', '-', '*', '/'}` নিই।
2. `tokens`-এর প্রতিটা `token`-এর জন্য:
   - অপারেটর না হলে `int(token)` স্ট্যাকে পুশ করি।
   - অপারেটর হলে `b = stack.pop()`, `a = stack.pop()` নিই, `token` অনুযায়ী `a <op> b` হিসাব করে (ভাগের ক্ষেত্রে `int(a / b)`) স্ট্যাকে পুশ করি।
3. শেষে `int(stack[-1])` রিটার্ন করি।

```text
function evalRPN(tokens)
    stack = deque()
    for token in tokens
        if token not in {'+', '-', '*', '/'}
            stack.append(int(token))
        else
            b = stack.pop()
            a = stack.pop()
            push (a op b) to stack
    return int(stack[-1])
```

---

# ধাপে ধাপে ড্রাই রান

`tokens = ["4", "13", "5", "/", "+"]`

- `"4"` → স্ট্যাকে `4` → `[4]`
- `"13"` → স্ট্যাকে `13` → `[4, 13]`
- `"5"` → স্ট্যাকে `5` → `[4, 13, 5]`
- `"/"` → `b = 5, a = 13`। `int(13 / 5) = 2` → `[4, 2]`
- `"+"` → `b = 2, a = 4`। `4 + 2 = 6` → `[6]`

ব্যাস, স্ট্যাকের শেষ সংখ্যা `6`-ই উত্তর!

---

# কোড বিশ্লেষণ

```python
from collections import deque

class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = deque()
        operations = {'+', '-', '*', '/'}

        for token in tokens:
            if token not in operations:
                stack.append(int(token))
            else:
                if token == '+':
                    b = stack.pop()
                    a = stack.pop()
                    stack.append(a + b)
                elif token == '-':
                    b = stack.pop()
                    a = stack.pop()
                    stack.append(a - b)
                elif token == '*':
                    b = stack.pop()
                    a = stack.pop()
                    stack.append(a * b)
                elif token == '/':
                    b = stack.pop()
                    a = stack.pop()
                    stack.append(int(a / b))

        return int(stack[-1])
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — প্রতিটা টোকেন একবারই প্রসেস হয়।
- **Space Complexity:** `O(n)` — স্ট্যাকে সংখ্যা জমা রাখার জন্য।

---

# মূল কথা

> **পোস্টফিক্স সমাধানে `b` আগে পপ করে `a` পরে পপ করুন, আর Python-এ ভাগের সময় `int(a / b)` ব্যবহার করুন।**
