---
title: "কন্টেইনার উইথ মোস্ট ওয়াটার (Container With Most Water)"
date: "2026-11-20"
excerpt: "টু-পয়েন্টার টেকনিক ব্যবহার করে দুই দেয়ালের মাঝে সর্বোচ্চ কতটুকু পানি ধরে, তা O(n) সময়ে বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# কন্টেইনার উইথ মোস্ট ওয়াটার (Container With Most Water)

সমস্যার লিংক: https://leetcode.com/problems/container-with-most-water/

## সমস্যাটা কী?

আমাদের `height` নামের একটা অ্যারে দেওয়া আছে, যেখানে প্রতিটি মান একটা করে খাড়া দেয়ালের উচ্চতা। এমন দুটো দেয়াল বেছে নিতে হবে, যাদের মাঝে সবচেয়ে বেশি পানি ধরে।

যেমন `height = [1, 8, 6, 2, 5, 4, 8, 3, 7]` হলে, ইনডেক্স `1` (উচ্চতা `8`) আর ইনডেক্স `8` (উচ্চতা `7`)-এর মাঝে প্রস্থ `8 - 1 = 7` এবং উচ্চতা `min(8, 7) = 7`। তাই সর্বোচ্চ পানি ধরবে `7 * 7 = 49`।

---

# সহজভাবে চিন্তা করি

যেকোনো দুটো দেয়াল `left` আর `right`-এর মাঝে পানি উপচে পড়বে **ছোট দেয়ালটার** দিক দিয়ে। তাই পানির উচ্চতা হবে `min(height[left], height[right])`, আর প্রস্থ `right - left`।

সব জোড়া দেয়াল চেক করলে `O(n^2)` সময় লাগবে। এর বদলে আমরা **টু-পয়েন্টার** দিয়ে একদম দুই প্রান্ত থেকে শুরু করব (`left = 0`, `right = n - 1`), যাতে প্রস্থটা শুরুতে সবচেয়ে বেশি থাকে।

এখন প্রশ্ন হলো—কোন পয়েন্টারটা ভেতরে সরাব?

ধরুন `height[left] < height[right]`। এখন আপনি যদি বড় দেয়ালটা (`right`) ভেতরে সরান, তাহলে প্রস্থ তো কমবেই, আবার উচ্চতা কোনোভাবেই `height[left]`-এর চেয়ে বাড়তে পারবে না! অর্থাৎ ক্ষেত্রফল বাড়ার কোনো সুযোগই নেই। একমাত্র আশা হলো—ছোট দেয়ালটা (`left`) বাদ দিয়ে ভেতরে আরও লম্বা কোনো দেয়াল খোঁজা। তাই **সবসময় ছোট দেয়ালটাকেই ভেতরে সরাতে হবে**।

---

# অ্যালগরিদম

১. `left = 0`, `right = len(height) - 1`, আর `max_container = 0` নিই।
২. যতক্ষণ `left < right`:
   - `area = min(height[left], height[right]) * (right - left)` হিসাব করি।
   - `max_container = max(area, max_container)` আপডেট করি।
   - `height[left] < height[right]` হলে `left += 1`, নাহলে `right -= 1`।
৩. `max_container` রিটার্ন করি।

```text
function maxArea(height)
    left = 0, right = len(height) - 1
    max_container = 0
    while left < right
        area = min(height[left], height[right]) * (right - left)
        max_container = max(max_container, area)
        if height[left] < height[right]: left += 1
        else: right -= 1
    return max_container
```

---

# ধাপে ধাপে ড্রাই রান

`height = [1, 8, 6, 2, 5, 4, 8, 3, 7]`

- `left = 0 (1), right = 8 (7)`: `area = 1 * 8 = 8`, `max_container = 8`। যেহেতু `1 < 7`, তাই `left` এগোবে `1`-এ।
- `left = 1 (8), right = 8 (7)`: `area = 7 * 7 = 49`, `max_container = 49`। এবার `8 > 7`, তাই `right` কমবে `7`-এ।
- এরপর পয়েন্টারগুলো ভেতরে আসতে থাকলেও আর `49`-এর বড় ক্ষেত্রফল তৈরি হয় না।

তাই উত্তর `49`।

---

# কোড বিশ্লেষণ

```python
class Solution:
    def maxArea(self, height: list[int]) -> int:
        left = 0
        right = len(height) - 1

        max_container = 0

        while left <= right:
            container_h = min(height[left], height[right])
            container_w = abs(left - right)

            area = container_h * container_w

            max_container = max(area, max_container)

            if height[left] < height[right]:
                left += 1
            else:
                right -= 1

        return max_container
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — দুই পয়েন্টার মিলে অ্যারেটা একবারই অতিক্রম করে।
- **Space Complexity:** `O(1)` — বাড়তি কোনো মেমোরি লাগে না।

---

# মূল কথা

> **দুই প্রান্ত থেকে শুরু করে সবসময় ছোট দেয়ালটাকে ভেতরে সরান, কারণ ছোট দেয়ালটা রেখে প্রস্থ কমালে লাভ হওয়ার কোনো পথ নেই।**
