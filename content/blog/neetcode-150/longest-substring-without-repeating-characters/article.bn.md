---
title: "লংগেস্ট সাবস্ট্রিং উইদাউট রিপিটিং ক্যারেক্টার্স (Longest Substring Without Repeating Characters)"
date: "2026-11-20"
excerpt: "স্লাইডিং উইন্ডো আর হ্যাশ সেট ব্যবহার করে কোনো অক্ষর রিপিট না করে সবচেয়ে লম্বা সাবস্ট্রিং বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# লংগেস্ট সাবস্ট্রিং উইদাউট রিপিটিং ক্যারেক্টার্স

সমস্যার লিংক: https://leetcode.com/problems/longest-substring-without-repeating-characters/

## সমস্যাটা কী?

একটা স্ট্রিং `s` দেওয়া আছে। এর ভেতর পাশাপাশি থাকা (contiguous) সবচেয়ে লম্বা সাবস্ট্রিংটার দৈর্ঘ্য বের করতে হবে, যেখানে কোনো অক্ষর দুবার আসেনি।

যেমন `s = "abcabcbb"` হলে, `"abc"` হলো সবচেয়ে লম্বা এমন সাবস্ট্রিং যার ভেতর কোনো ডুপ্লিকেট অক্ষর নেই। এর দৈর্ঘ্য `3`।

---

# সহজভাবে চিন্তা করি

সব সম্ভাব্য সাবস্ট্রিং আলাদা করে চেক করলে `O(n^2)` বা `O(n^3)` সময় লেগে যাবে। এর বদলে আমরা একটা **স্লাইডিং উইন্ডো (Sliding Window)** চালাব, যেটার বাম প্রান্ত `left` আর ডান প্রান্ত `right`। আর উইন্ডোর ভেতর বর্তমানে কী কী অক্ষর আছে, তা মনে রাখতে একটা `set` (`charset`) ব্যবহার করব।

ব্যাপারটা অনেকটা এরকম:
- `right` সামনে এগোতে থাকবে। নতুন অক্ষরটা যদি আমাদের উইন্ডোতে আগে না থাকে, তাহলে ওটাকে সেটে ঢোকাব আর উইন্ডোর দৈর্ঘ্য (`right - left + 1`) মেপে দেখব আগের চেয়ে বড় হলো কি না।
- আর যদি দেখি `s[right]` আগে থেকেই সেটে বসে আছে—তার মানে ডুপ্লিকেট ধরা পড়েছে! তখন ডুপ্লিকেটটা না সরা পর্যন্ত বাম দিক থেকে (`left`) একটা একটা করে অক্ষর সেট থেকে বাদ দিয়ে উইন্ডো ছোট করব।

---

# অ্যালগরিদম

১. `charset = set()`, `left = 0`, `right = 0`, `ans = 0` সেট করি।
২. যতক্ষণ `right < len(s)`:
   - যদি `s[right]` `charset`-এ না থাকে:
     - `charset.add(s[right])`
     - `ans = max(ans, right - left + 1)`
     - `right += 1`
   - আর যদি `s[right]` আগে থেকেই `charset`-এ থাকে:
     - `charset.remove(s[left])`
     - `left += 1`
৩. শেষে `ans` রিটার্ন করি।

```text
function lengthOfLongestSubstring(s)
    charset = set()
    left = 0, right = 0, ans = 0
    while right < len(s)
        if s[right] not in charset
            charset.add(s[right])
            ans = max(ans, right - left + 1)
            right += 1
        else
            charset.remove(s[left])
            left += 1
    return ans
```

---

# ধাপে ধাপে ড্রাই রান

`s = "abcabcbb"`

- `right = 0 ('a')`: নেই → সেটে `'a'`, উইন্ডো `"a"`, `ans = 1`।
- `right = 1 ('b')`: নেই → সেটে `'a', 'b'`, উইন্ডো `"ab"`, `ans = 2`।
- `right = 2 ('c')`: নেই → সেটে `'a', 'b', 'c'`, উইন্ডো `"abc"`, `ans = 3`।
- `right = 3 ('a')`: আরে, `'a'` তো আগে থেকেই আছে! তাই বাম পাশ থেকে `s[0]` (`'a'`) সরিয়ে `left = 1` করলাম। পরের ধাপে `'a'` না থাকায় আবার যোগ হলো → উইন্ডো `"bca"`, `ans = 3`।

এভাবেই শেষ পর্যন্ত উত্তর থাকে `3`।

---

# কোড বিশ্লেষণ

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        charset = set()

        length = 0
        ans = 0

        left = 0
        right = left

        while right < len(s):
            if s[right] not in charset:
                charset.add(s[right])
                length = right - left + 1
                ans = max(ans, length)
                right += 1
            else:
                charset.remove(s[left])
                left += 1

        return ans
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — `left` এবং `right` দুটো পয়েন্টারই কেবল সামনের দিকে যায়, তাই প্রতিটি অক্ষর সর্বোচ্চ দুবার প্রসেস হয়।
- **Space Complexity:** `O(min(n, m))` — যেখানে `m` হলো মোট ইউনিক অক্ষরের সংখ্যা।

---

# মূল কথা

> **ডুপ্লিকেট না পাওয়া পর্যন্ত ডানে উইন্ডো বাড়ান, আর ডুপ্লিকেট দেখলেই বাম দিক থেকে ছেঁটে ফেলুন।**
