---
title: "Top K Frequent Elements"
date: "2026-11-20"
excerpt: "ফ্রিকোয়েন্সি কাউন্টার আর k সাইজের মিন-হিপ ব্যবহার করে অ্যারের সবচেয়ে বেশি বার আসা kটা সংখ্যা খুঁজে বের করা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Top K Frequent Elements

সমস্যার লিংক: https://leetcode.com/problems/top-k-frequent-elements/

## সমস্যাটা কী?

আমাদের একটা সংখ্যার অ্যারে `nums` আর একটা সংখ্যা `k` দেওয়া আছে। বের করতে হবে—অ্যারের ভেতর কোন `k`টা সংখ্যা সবচেয়ে বেশি বার এসেছে। যেকোনো ক্রমে রিটার্ন করলেই চলবে।

যেমন `nums = [1, 1, 1, 2, 2, 3]`, `k = 2` হলে, `1` এসেছে ৩ বার আর `2` এসেছে ২ বার। তাই উত্তর `[1, 2]`।

---

# সহজভাবে চিন্তা করি

কাজটা দুই ধাপে ভাগ করা যায়:

1. প্রথমে গুনে নেওয়া কোন সংখ্যা কতবার এসেছে (`Counter(nums)` দিয়েই কাজ সেরে ফেলা যায়)।
2. সেই কাউন্ট থেকে সবচেয়ে বড় `k`টা সংখ্যা বেছে নেওয়া।

সব সংখ্যা সর্ট করে শেষ থেকে `k`টা নিলে `O(m log m)` সময় লাগে (যেখানে `m` হলো ইউনিক সংখ্যার পরিমাণ)। কিন্তু যদি `m` অনেক বড় হয় আর `k` ছোট হয়, তাহলে পুরোটা সর্ট করার দরকার কী?

আমরা মাত্র `k` সাইজের একটা **মিন-হিপ (min-heap)** ব্যবহার করতে পারি। মিন-হিপের ধর্ম হলো—সবচেয়ে ছোট মানটা সবসময় একদম ওপরে থাকে। তাই হিপে `(freq, num)` ঢোকাতে ঢোকাতে যখনই সাইজ `k`-এর বেশি হয়ে যাবে, ওপর থেকে সবচেয়ে কম ফ্রিকোয়েন্সির আইটেমটা ফেলে দেব! শেষে হিপে ঠিক টপ `k`টা সংখ্যাই টিকে থাকবে।

---

# অ্যালগরিদম

1. `counter = Counter(nums)` দিয়ে ফ্রিকোয়েন্সি গুনে নিই।
2. একটা খালি লিস্ট `min_heap = []` নিই।
3. `counter`-এর প্রতিটা `(num, freq)`-এর জন্য:
   - `heapq.heappush(min_heap, (freq, num))` করি (যেহেতু Python-এ টুপল বাম থেকে ডানে তুলনা হয়, তাই `freq` আগে রাখছি)।
   - যদি `len(min_heap) > k` হয়, তাহলে `heapq.heappop(min_heap)` করে সবচেয়ে ছোটটা বাদ দিই।
4. শেষে `min_heap`-এ থাকা প্রতিটা টুপল থেকে `num` বের করে রিটার্ন করি।

```text
function topKFrequent(nums, k)
    counter = Counter(nums)
    min_heap = []
    for num, freq in counter
        heappush(min_heap, (freq, num))
        if len(min_heap) > k
            heappop(min_heap)
    return [num for freq, num in min_heap]
```

---

# ধাপে ধাপে ড্রাই রান

`nums = [1, 1, 1, 2, 2, 3]`, `k = 2`

প্রথমে `counter = {1: 3, 2: 2, 3: 1}`।

- `(1, 3)` → হিপে গেল `(3, 1)`। সাইজ `1 <= 2`, কিছু বাদ যাবে না।
- `(2, 2)` → হিপে গেল `(2, 2)`। এখন হিপে `[(2, 2), (3, 1)]`। সাইজ `2 <= 2`।
- `(3, 1)` → হিপে গেল `(1, 3)`। সাইজ `3 > 2`! সাথে সাথে সবচেয়ে কম ফ্রিকোয়েন্সি `(1, 3)` পপ হয়ে যাবে।

হিপে বাকি রইল `(2, 2)` আর `(3, 1)`। এখান থেকে সংখ্যা দুটো নিলে উত্তর `[2, 1]`।

---

# কোড বিশ্লেষণ

```python
import heapq
from typing import List
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counter = Counter(nums)
        min_heap = []

        for num, freq in counter.items():
            heapq.heappush(min_heap, (freq, num))

            if len(min_heap) > k:
                heapq.heappop(min_heap)

        return [num for freq, num in min_heap]
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n + m log k)` — কাউন্ট করতে `O(n)` এবং হিপে `m`টি ইউনিক উপাদান প্রসেস করতে `O(m log k)`।
- **Space Complexity:** `O(n)` — কাউন্টার এবং হিপের জন্য।

---

# মূল কথা

> **যেকোনো "Top K" সমস্যায় পুরোটা সর্ট না করে `k` সাইজের মিন-হিপ রাখুন—ছোটগুলো ঝরে যাবে, সেরা `k`টা ঠিকই থেকে যাবে।**
