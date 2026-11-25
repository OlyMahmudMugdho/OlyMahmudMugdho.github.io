---
title: "পারমুটেশনস (Permutations)"
date: "2026-11-24"
excerpt: "ব্যাকট্র্যাকিং ব্যবহার করে একটি অ্যারের সংখ্যাগুলোর সব সম্ভাব্য বিন্যাস (Permutations) বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# পারমুটেশনস (Permutations)

সমস্যার লিংক: https://leetcode.com/problems/permutations/

## সমস্যাটা কী?

আলাদা আলাদা পূর্ণসংখ্যার একটি অ্যারে `nums` দেওয়া আছে। এর সংখ্যাগুলোকে যতভাবে সাজানো সম্ভব—সবগুলো **পারমুটেশন (permutation)** রিটার্ন করতে হবে।

যেমন `nums = [1, 2, 3]` হলে মোট `3! = 6`টি বিন্যাস পাওয়া যাবে: `[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]`।

---

# সহজভাবে চিন্তা করি

সাবসেটে ক্রম কোনো ব্যাপার ছিল না, কিন্তু পারমুটেশনে **ক্রমই আসল** (`[1, 2]` আর `[2, 1]` আলাদা), এবং প্রতিবার **সবগুলো** সংখ্যা ব্যবহার করতে হবে!

তাই প্রতিটি ধাপে:
- `nums`-এর প্রতিটা সংখ্যা `num` ঘুরে দেখি।
- `num` যদি আগে থেকেই `path`-এ **না থাকে**, তাহলে সেটা নিয়ে (`path.append(num)`) পরের ধাপে যাই (`dfs()`), আর ফিরে এসে `path.pop()` করে সরিয়ে দিই।
- যখনই `len(path) == len(nums)` হবে, বুঝব একটা সম্পূর্ণ বিন্যাস তৈরি হয়ে গেছে—`path.copy()` করে `result`-এ রাখব!

---

# ডিসিশন ট্রি (Decision Tree)

`nums = [1, 2, 3]`-এর জন্য প্রতি লেভেলে এখনো ব্যবহার না হওয়া সংখ্যাগুলো থেকে একটি করে বেছে নেওয়া হয়:

```tree
[]
  [1]
    [1,2]
      [1,2,3] !hit
    [1,3]
      [1,3,2] !hit
  [2]
    [2,1]
      [2,1,3] !hit
    [2,3]
      [2,3,1] !hit
  [3]
    [3,1]
      [3,1,2] !hit
    [3,2]
      [3,2,1] !hit
```

একদম নিচের `6`টি পাতাই (leaf) হলো আমাদের `6`টি পারমুটেশন!

---

# অ্যালগরিদম

1. `result = []` ও `path = []` নিই।
2. `dfs()` ফাংশনে:
   - `len(nums) == len(path)` হলে `result.append(path.copy())` করে `return` করি।
   - `nums`-এর প্রতিটি `num`-এর জন্য:
     - `num not in path` হলে `path.append(num)`, `dfs()`, তারপর `path.pop()` করি।
3. `dfs()` চালিয়ে `result` রিটার্ন করি।

```text
function permute(nums)
    result = []
    path = []

    function dfs()
        if len(nums) == len(path):
            result.append(path.copy())
            return
        for num in nums
            if num not in path:
                path.append(num)
                dfs()
                path.pop()

    dfs()
    return result
```

---

# ধাপে ধাপে ড্রাই রান

`nums = [1, 2]` ধরুন:

1. `path = []`:
   - `1` নিলাম → `path = [1]`: `1` আগেই আছে (স্কিপ), `2` নিলাম → `path = [1, 2]` (`len == 2`, সেভ!), `2` পপ।
   - `1` পপ → `path = []`।
   - `2` নিলাম → `path = [2]`: `1` নিলাম → `path = [2, 1]` (`len == 2`, সেভ!), `1` পপ।
   - `2` পপ।

উত্তর: `[[1, 2], [2, 1]]`।

---

# কোড বিশ্লেষণ

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []

        def dfs():
            if len(nums) == len(path):
                result.append(path.copy())
                return

            for num in nums:
                if num not in path:
                    path.append(num)
                    dfs()
                    path.pop()

        dfs()
        return result
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n * n!)` — মোট `n!`টি পারমুটেশন।
- **Space Complexity:** `O(n)` রিকার্শন স্ট্যাক ও `path`-এর জন্য (আউটপুটসহ `O(n * n!)`)।

---

# মূল কথা

> **পারমুটেশনে প্রতি ধাপে সব উপাদান দেখে যেটা এখনো `path`-এ নেই, সেটাই বেছে নিয়ে এগোন।**
