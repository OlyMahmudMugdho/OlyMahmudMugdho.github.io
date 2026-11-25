---
title: "Best Time to Buy and Sell Stock"
date: "2026-11-20"
excerpt: "একবার অ্যারে ঘুরে এখন পর্যন্ত দেখা সবচেয়ে কম দাম মনে রেখে স্টক কেনাবেচায় সর্বোচ্চ লাভ বের করার সহজ উপায়।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Best Time to Buy and Sell Stock

সমস্যার লিংক: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

## সমস্যাটা কী?

আমাদের একটা অ্যারে `prices` দেওয়া আছে, যেখানে `prices[i]` হলো `i`-তম দিনে একটা স্টকের দাম। আপনি যেকোনো একদিন স্টক কিনে **ভবিষ্যতের** অন্য একদিন বিক্রি করতে পারবেন (আগে বিক্রি করে পরে কেনা যাবে না)। সবচেয়ে বেশি কত লাভ করা সম্ভব, সেটাই বের করতে হবে। কোনো লাভ না হলে `0` রিটার্ন করবেন।

যেমন `prices = [7, 1, 5, 3, 6, 4]` হলে, `1` টাকায় কিনে `6` টাকায় বিক্রি করলে সর্বোচ্চ `5` টাকা লাভ হয়।

---

# সহজভাবে চিন্তা করি

একটা সহজ প্রশ্ন দিয়ে শুরু করি: ধরুন আপনি ঠিক করলেন `i`-তম দিনে স্টকটা বিক্রি করবেন। তাহলে আপনার সর্বোচ্চ লাভ পেতে কোন দিন কেনা উচিত ছিল?

উত্তর একদম সোজা—`i`-তম দিনের **আগে** যেদিন দাম সবচেয়ে কম ছিল (`min_price`), সেদিন!

ব্যাস, এটাই পুরো সমাধান! আমরা অ্যারের শুরু থেকে শেষ পর্যন্ত যেতে যেতে দুটো জিনিস মনে রাখব: এখন পর্যন্ত পাওয়া সর্বনিম্ন দাম `min_price`, আর এখন পর্যন্ত পাওয়া সর্বোচ্চ লাভ `max_profit`।

---

# অ্যালগরিদম

1. প্রথম দিনের দামকে ধরে নিই `min_price = prices[0]` এবং `max_profit = 0`।
2. দ্বিতীয় দিন থেকে শেষ দিন পর্যন্ত (`i = 1` থেকে) লুপ চালাই:
   - আজকের দাম আরও কম হলে `min_price` আপডেট করি: `min_price = min(price, min_price)`।
   - আজ বিক্রি করলে লাভ হতো `profit = price - min_price`।
   - এটা আগের চেয়ে বেশি হলে `max_profit = max(profit, max_profit)` আপডেট করি।
3. সবশেষে `max_profit` রিটার্ন করি।

```text
function maxProfit(prices)
    min_price = prices[0]
    max_profit = 0
    for i from 1 to len(prices) - 1
        min_price = min(prices[i], min_price)
        profit = prices[i] - min_price
        max_profit = max(profit, max_profit)
    return max_profit
```

---

# ধাপে ধাপে ড্রাই রান

`prices = [7, 1, 5, 3, 6, 4]`

শুরুতে `min_price = 7`, `max_profit = 0`।

- **দিন ১ (দাম ১):** নতুন সর্বনিম্ন `min_price = 1`, লাভ `1 - 1 = 0`।
- **দিন ২ (দাম ৫):** `min_price = 1`, লাভ `5 - 1 = 4` → `max_profit = 4`।
- **দিন ৩ (দাম ৩):** `min_price = 1`, লাভ `3 - 1 = 2` → `max_profit` আগের মতোই `4`।
- **দিন ৪ (দাম ৬):** `min_price = 1`, লাভ `6 - 1 = 5` → `max_profit = 5`।
- **দিন ৫ (দাম ৪):** `min_price = 1`, লাভ `4 - 1 = 3` → `max_profit = 5`।

সুতরাং চূড়ান্ত উত্তর `5`।

---

# কোড বিশ্লেষণ

```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = prices[0]
        max_profit = 0

        i = 1

        while i < len(prices):
            price = prices[i]
            min_price = min(price, min_price)
            profit = price - min_price
            max_profit = max(profit, max_profit)

            i += 1

        return max_profit
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — পুরো অ্যারে একবারই দেখা হয়।
- **Space Complexity:** `O(1)` — মাত্র কয়েকটা ভেরিয়েবল ব্যবহার করা হয়েছে।

---

# মূল কথা

> **কেনার পর বিক্রি—এই সমস্যায় অতীতের সর্বনিম্ন দামটা মনে রাখলেই `O(n)` সময়ে সমাধান হয়ে যায়।**
