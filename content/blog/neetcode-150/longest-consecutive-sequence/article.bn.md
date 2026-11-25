---
title: "Longest Consecutive Sequence"
date: "2026-09-20"
excerpt: "অ্যারে সর্ট না করেই হ্যাশ সেটের সাহায্যে O(n) সময়ে সবচেয়ে বড় ধারাবাহিক সংখ্যার চেইন খুঁজে বের করার সহজ কৌশল।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
coverImage: "https://res.cloudinary.com/dnmubeloc/image/upload/v1789888100/blog/longest-consecutive-sequence_vjj4dz.png"
author: "M. Oly Mahmud"
---

# Longest Consecutive Sequence

সমস্যার লিংক: https://leetcode.com/problems/longest-consecutive-sequence

## সমস্যাটা কী?

আমাদের কাছে এলোমেলো কিছু পূর্ণসংখ্যার একটা অ্যারে `nums` আছে। বের করতে হবে, এই সংখ্যাগুলোর মধ্যে পরপর (ধারাবাহিকভাবে) থাকা সবচেয়ে লম্বা চেইনটার দৈর্ঘ্য কত। শর্ত একটাই: সমাধানটা `O(n)` সময়ে হতে হবে।

যেমন ধরুন:

```text
nums = [100, 4, 200, 1, 3, 2]
```

এখানে `1, 2, 3, 4` সংখ্যাগুলো অ্যারের ভেতর ছড়িয়ে ছিটিয়ে থাকলেও এরা পরপর আসে। তাই সবচেয়ে লম্বা চেইনের দৈর্ঘ্য হলো `4`।

---

# সহজভাবে চিন্তা করি

অ্যারেটা সর্ট করে নিলে কাজটা পানির মতো সহজ হয়ে যেত—পাশাপাশি সংখ্যা মিলিয়ে নিলেই হতো। কিন্তু সর্টিংয়ে `O(n log n)` সময় লাগে, যেটা প্রশ্ন অনুযায়ী করা যাবে না।

তাহলে `O(n)` সময়ে কীভাবে করব?

প্রথমেই সব সংখ্যাকে একটা `set`-এ ঢুকিয়ে নিই। সেটের সুবিধা হলো—কোনো সংখ্যা সেটে আছে কি না, সেটা `O(1)` সময়েই বলে দেওয়া যায়, আর ডুপ্লিকেট সংখ্যাগুলোও আপনাআপনি বাদ পড়ে যায়।

### আসল ট্রিকটা কোথায়?

ধরুন সেটে `{1, 2, 3, 4}` আছে। আমরা যদি `3` থেকে গোনা শুরু করি (`3 -> 4`), আবার `2` থেকে (`2 -> 3 -> 4`), আবার `1` থেকে (`1 -> 2 -> 3 -> 4`)—তাহলে একই কাজ বারবার করা হবে, আর টাইম কমপ্লেক্সিটি `O(n^2)` হয়ে যাবে।

এর বদলে আমরা শুধু **চেইনের একদম শুরুর সংখ্যাটা** থেকেই গুনব!

কীভাবে বুঝব কোনো সংখ্যা `num` চেইনের শুরু কি না? খুব সহজ: যদি `(num - 1)` সেটের মধ্যে **না থাকে**, তার মানে `num`-এর আগে কোনো সংখ্যা নেই—অর্থাৎ এখান থেকেই নতুন একটা চেইন শুরু হয়েছে!

---

# অ্যালগরিদম

1. সব সংখ্যা দিয়ে `nums_set = set(nums)` তৈরি করি এবং `longest = 0` ধরি।
2. `nums_set`-এর প্রতিটা `num`-এর জন্য দেখি:
   - যদি `(num - 1)` সেটে থাকে, তাহলে এটা চেইনের মাঝখানের সংখ্যা—সোজা `continue` করে পরেরটায় চলে যাই।
   - আর যদি `(num - 1)` না থাকে, তাহলে এটাই শুরু! `current_longest = 1` এবং `current_num = num` নিই।
   - এবার `while (current_num + 1) in nums_set:` লুপ চালিয়ে পরের সংখ্যাগুলো খুঁজতে থাকি আর দৈর্ঘ্য `1` করে বাড়াই।
   - লুপ শেষে `longest = max(longest, current_longest)` আপডেট করি।
3. সবশেষে `longest` রিটার্ন করি।

```text
function longestConsecutive(nums)
    nums_set = set(nums)
    longest = 0

    for num in nums_set
        if (num - 1) in nums_set
            continue
        current_longest = 1
        current_num = num
        while (current_num + 1) in nums_set
            current_longest += 1
            current_num += 1
        longest = max(longest, current_longest)

    return longest
```

---

# ধাপে ধাপে ড্রাই রান

`nums = [100, 4, 200, 1, 3, 2]` → `nums_set = {100, 4, 200, 1, 3, 2}`

- **100**: `99` নেই, তাই শুরু। `101` নেই → দৈর্ঘ্য `1`, `longest = 1`।
- **4**: `3` আছে, তাই এটা শুরু নয়। স্কিপ!
- **200**: `199` নেই, তাই শুরু। `201` নেই → দৈর্ঘ্য `1`।
- **1**: `0` নেই, তাই এটাই শুরু! `2` আছে, `3` আছে, `4` আছে, `5` নেই → দৈর্ঘ্য `4`, `longest = 4`।
- **3** আর **2**: দুটোরই আগের সংখ্যা (`2` ও `1`) সেটে আছে, তাই স্কিপ!

দিনশেষে উত্তর `4`।

---

# কোড বিশ্লেষণ

```python
from typing import List

class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        nums_set = set(nums)
        longest = 0

        for num in nums_set:
            current_longest = 0
            if (num - 1) in nums_set:
                continue
            else:
                current_longest += 1
                current_num = num
                while (current_num + 1) in nums_set:
                    current_longest += 1
                    current_num += 1

            longest = max(longest, current_longest)

        return longest
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — বাইরে ফর-লুপ আর ভেতরে হোয়াইল-লুপ দেখে `O(n^2)` মনে হতে পারে, কিন্তু আসলে প্রতিটি সংখ্যা শুধু তার নিজের চেইন গোনার সময় একবারই `while` লুপে আসে।
- **Space Complexity:** `O(n)` — সেট রাখার জন্য।

---

# মূল কথা

> **`(num - 1)` সেটে না থাকলে কেবল সেখান থেকেই সামনে গুনতে শুরু করুন—এই একটা লাইনই সমাধানটাকে `O(n^2)` থেকে `O(n)` বানিয়ে দেয়।**
