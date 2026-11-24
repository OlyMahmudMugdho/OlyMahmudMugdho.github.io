---
title: "কম্বিনেশন সাম (Combination Sum)"
date: "2026-11-24"
excerpt: "একই সংখ্যা যতবার খুশি ব্যবহার করে টার্গেট যোগফল বানানোর সব ইউনিক কম্বিনেশন ব্যাকট্র্যাকিং দিয়ে বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# কম্বিনেশন সাম (Combination Sum)

সমস্যার লিংক: https://leetcode.com/problems/combination-sum/

## সমস্যাটা কী?

আলাদা আলাদা পূর্ণসংখ্যার একটি অ্যারে `candidates` এবং একটি `target` দেওয়া আছে। `candidates` থেকে সংখ্যা নিয়ে এমন সব ইউনিক কম্বিনেশন বের করতে হবে যাদের যোগফল `target` হয়। মজার শর্ত হলো—একই সংখ্যা **যতবার খুশি** নেওয়া যাবে!

যেমন `candidates = [2, 3, 6, 7], target = 7` হলে উত্তর `[[2, 2, 3], [7]]`।

---

# সহজভাবে চিন্তা করি

এটা অনেকটা **Subsets**-এর মতোই, শুধু একটা পার্থক্য আছে—একটা সংখ্যা নেওয়ার পর আমরা ওটাকে **আবারও** নিতে পারি!

তাই ইনডেক্স `i`-তে দাঁড়িয়ে আমাদের দুটো রাস্তা:
1. `candidates[i]`-কে **নিলাম**, আর পরের কলে `dfs(i)`-তেই থাকলাম (যাতে চাইলে ওটা আবার নেওয়া যায়)।
2. `candidates[i]`-কে **বাদ দিলাম** (`path.pop()`), আর পরের কলে `dfs(i + 1)`-এ চলে গেলাম। যেহেতু `i + 1`-এ যাওয়ার পর আর পেছনে ফিরে `candidates[i]` নেওয়া হয় না, তাই `[2, 2, 3]` আর `[2, 3, 2]`-এর মতো ডুপ্লিকেট কম্বিনেশনও তৈরি হয় না!

আর `sum(path) > target` বা `i >= len(candidates)` হলেই থেমে যাব।

---

# ডিসিশন ট্রি (Decision Tree)

`candidates = [2, 3, 6, 7], target = 7`-এর জন্য বাম শাখায় সংখ্যাটি **নেওয়া হয়** (`dfs(i)`) আর ডান শাখায় **বাদ দিয়ে পরের সংখ্যায়** যাওয়া হয় (`dfs(i + 1)`):

```text
                             []
                   /                    \
                 [2]                     []
              /       \                /    \
           [2,2]      [2]            [3]     ... (3 বাদ -> [6], [7])
          /     \     /  \          /   \
     [2,2,2]  [2,2,3] ...       [3,3]   [3]
      /   \    (মিল!)           /  \
[2,2,2,2] ...               [3,3,3] [3,6]
(sum>7 X)                   (sum>7 X) (sum>7 X)
```

- `sum == 7` হলে (`[2, 2, 3]` আর `[7]`) সেভ হয়।
- `sum > 7` হলেই ওই শাখা কেটে ফেলা হয়!

---

# অ্যালগরিদম

1. `result = []` ও `path = []` নিই।
2. `dfs(i)` ফাংশনে:
   - `sum(path) > target` অথবা `i >= len(candidates)` হলে `return` করি।
   - `sum(path) == target` হলে `result.append(path.copy())` করে `return` করি।
   - `candidates[i]` যোগ করে `dfs(i)` চালাই।
   - `path.pop()` করে `dfs(i + 1)` চালাই।
3. `dfs(0)` চালিয়ে `result` রিটার্ন করি।

```text
function combinationSum(candidates, target)
    result = []
    path = []

    function dfs(i)
        if sum(path) > target or i >= len(candidates): return
        if sum(path) == target:
            result.append(path.copy())
            return
        path.append(candidates[i])
        dfs(i)
        path.pop()
        dfs(i + 1)

    dfs(0)
    return result
```

---

# ধাপে ধাপে ড্রাই রান

`candidates = [2, 3, 6, 7], target = 7`:

1. `2 -> 2 -> 2 -> 2` (`sum = 8 > 7`, ব্যাকট্র্যাক)।
2. শেষের `2` বাদ দিয়ে `3` নিলাম → `[2, 2, 3]` (`sum = 7 == target` → সেভ!)।
3. আরও ব্যাকট্র্যাক করে `2, 3, 6` বাদ দিয়ে `7` নিলাম → `[7]` (`sum = 7 == target` → সেভ!)।

উত্তর: `[[2, 2, 3], [7]]`।

---

# কোড বিশ্লেষণ

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        path = []

        def dfs(i: int):
            if sum(path) > target or i >= len(candidates):
                return

            if sum(path) == target:
                result.append(path.copy())
                return

            path.append(candidates[i])
            dfs(i)

            path.pop()
            dfs(i + 1)

        dfs(0)
        return result
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(2^(T / M))` — যেখানে `T` হলো `target` আর `M` হলো সবচেয়ে ছোট ক্যান্ডিডেট।
- **Space Complexity:** `O(T / M)` — রিকার্শন স্ট্যাক ও `path`-এর জন্য।

---

# মূল কথা

> **নিলে `dfs(i)`-তে থাকুন (পুনর্ব্যবহার), বাদ দিলে `dfs(i + 1)`-এ যান (ডুপ্লিকেট এড়াতে)।**
