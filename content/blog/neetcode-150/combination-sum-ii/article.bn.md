---
title: "কম্বিনেশন সাম ২ (Combination Sum II)"
date: "2026-11-24"
excerpt: "প্রতিটি সংখ্যা সর্বোচ্চ একবার ব্যবহার করে এবং সর্টিং ও ডুপ্লিকেট-স্কিপিং ব্যাকট্র্যাকিংয়ের মাধ্যমে টার্গেট যোগফল বানানোর সব ইউনিক কম্বিনেশন বের করা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# কম্বিনেশন সাম ২ (Combination Sum II)

সমস্যার লিংক: https://leetcode.com/problems/combination-sum-ii/

## সমস্যাটা কী?

একটি অ্যারে `candidates` এবং একটি `target` দেওয়া আছে। `candidates` থেকে সংখ্যা নিয়ে এমন সব ইউনিক কম্বিনেশন বের করতে হবে যাদের যোগফল `target` হয়।

আগের **Combination Sum**-এর সাথে পার্থক্য দুটো:
1. প্রতিটি সংখ্যা **সর্বোচ্চ একবারই** নেওয়া যাবে।
2. `candidates`-এর ভেতরে একই সংখ্যা **একাধিকবার** থাকতে পারে, তবে উত্তরে কোনো ডুপ্লিকেট কম্বিনেশন থাকা যাবে না।

---

# সহজভাবে চিন্তা করি

প্রথমত, প্রতিটা সংখ্যা একবারই নেওয়া যাবে বলে `candidates[i]` নিলে পরের কলে `dfs(i + 1)`-এ চলে যাব।

দ্বিতীয়ত, ডুপ্লিকেট কম্বিনেশন কীভাবে আটকাব? প্রথমেই `candidates.sort()` করে অ্যারেটা সাজিয়ে নিই, যাতে একই সংখ্যাগুলো পাশাপাশি বসে। এবার আমরা যখন `candidates[i]`-কে **বাদ দেব**, তখন ওর মতো দেখতে পাশের **সবগুলো ডুপ্লিকেটকেও** একটা `while` লুপ দিয়ে টপকে যাব! কারণ প্রথম `1`-টা বাদ দিয়ে পরের `1`-টা নিলে তো একই কম্বিনেশন আবার তৈরি হবে।

---

# ডিসিশন ট্রি (Decision Tree)

`candidates = [1, 1, 2], target = 3` (সর্ট করার পর):

```tree
[]
  [1] | 1 নিই
    [1,1] | 1 নিই
      [1,1,2] : sum>3 !pruned
      [1,1]
    [1] | 1 বাদ
      [1,2] : মিল! !hit
      [1]
  [] | সব 1 বাদ
    [2] | 2 নিই
      ... !muted
    [] | 2 বাদ
```

খেয়াল করুন, ডান শাখায় `[]` থেকে দুটো `1`-ই বাদ দিয়ে সরাসরি `2`-এ চলে যাওয়ায় আর ডুপ্লিকেট `[1, 2]` তৈরি হয়নি!

---

# অ্যালগরিদম

1. `candidates.sort()` করে অ্যারেটা সর্ট করি।
2. `result = []` ও `path = []` নিই।
3. `dfs(i)` ফাংশনে:
   - `sum(path) == target` হলে `result.append(path.copy())` করে `return` করি।
   - `i == len(candidates)` অথবা `sum(path) > target` হলে `return` করি।
   - `candidates[i]` যোগ করে `dfs(i + 1)` চালাই, তারপর `path.pop()` করি।
   - `while (i + 1) < len(candidates) and candidates[i] == candidates[i + 1]: i += 1` দিয়ে সব ডুপ্লিকেট স্কিপ করে `dfs(i + 1)` চালাই।
4. `dfs(0)` চালিয়ে `result` রিটার্ন করি।

```text
function combinationSum2(candidates, target)
    candidates.sort()
    result = []
    path = []

    function dfs(i)
        if sum(path) == target:
            result.append(path.copy())
            return
        if i == len(candidates) or sum(path) > target:
            return
        path.append(candidates[i])
        dfs(i + 1)
        path.pop()
        while (i + 1) < len(candidates) and candidates[i] == candidates[i + 1]:
            i += 1
        dfs(i + 1)

    dfs(0)
    return result
```

---

# ধাপে ধাপে ড্রাই রান

`candidates = [1, 1, 2], target = 3`

1. `dfs(0)` (`1`): `1` নিলাম → `path = [1]`, `dfs(1)`:
   - দ্বিতীয় `1` নিলাম → `[1, 1]`, এরপর `2` নিলে যোগফল `4 > 3` (বাদ)।
   - দ্বিতীয় `1` পপ করে `2` নিলাম → `[1, 2]` (`sum = 3 == target` → সেভ!)।
2. প্রথম `1` পপ করে `path = []`। `while` লুপ দিয়ে পরের `1`-টাও স্কিপ করে `dfs(2)`-এ যায় (`[2]`, যোগফল `2 != 3`)।

উত্তর: `[[1, 2]]`।

---

# কোড বিশ্লেষণ

```python
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        path = []

        candidates.sort()

        def dfs(i: int):
            if sum(path) == target:
                result.append(path.copy())
                return

            if i == len(candidates) or sum(path) > target:
                return

            path.append(candidates[i])
            dfs(i + 1)
            path.pop()

            while (i + 1) < len(candidates) and (candidates[i] == candidates[i + 1]):
                i += 1

            dfs(i + 1)

        dfs(0)
        return result
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n * 2^n)` — সবচেয়ে খারাপ ক্ষেত্রে `2^n`টি সাবসেট তৈরি হতে পারে।
- **Space Complexity:** `O(n)` — রিকার্শন স্ট্যাক ও `path`-এর জন্য।

---

# মূল কথা

> **অ্যারে সর্ট করে নিন, আর বাদ দেওয়ার শাখায় পাশাপাশি সমান উপাদানগুলো `while` লুপ দিয়ে স্কিপ করুন—তাহলেই ডুপ্লিকেট কম্বিনেশন আসবে না।**
