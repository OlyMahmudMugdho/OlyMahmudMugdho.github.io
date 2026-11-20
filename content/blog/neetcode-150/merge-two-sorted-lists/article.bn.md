---
title: "মার্জ টু সর্টেড লিস্টস (Merge Two Sorted Lists)"
date: "2026-11-20"
excerpt: "দুটি সর্টেড সিঙ্গলি লিংকড লিস্টের মান তুলনা করে একটি সর্টেড লিংকড লিস্টে মিলিয়ে দেওয়ার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# মার্জ টু সর্টেড লিস্টস (Merge Two Sorted Lists)

সমস্যার লিংক: https://leetcode.com/problems/merge-two-sorted-lists/

## সমস্যাটা কী?

আমাদের দুটো সর্টেড লিংকড লিস্ট `list1` আর `list2` দেওয়া আছে। দুটোকে মিলিয়ে একটা বড় **সর্টেড** লিংকড লিস্ট বানিয়ে হেড রিটার্ন করতে হবে।

যেমন `list1 = [1, 2, 4]` আর `list2 = [1, 3, 4]` হলে, আউটপুট হবে `[1, 1, 2, 3, 4, 4]`।

---

# সহজভাবে চিন্তা করি

যেহেতু দুটো লিস্টই আগে থেকেই ছোট থেকে বড় সাজানো, তাই সবচেয়ে ছোট মানটা সবসময় হয় `list1`-এর মাথায় থাকবে, না হয় `list2`-এর মাথায় থাকবে!

তাই আমরা দুটো পয়েন্টার `left` ও `right` নিয়ে প্রতি ধাপে দুটোর সামনের মান তুলনা করব—যেটা ছোট, সেটা `nums` লিস্টে তুলে ওই পয়েন্টারটা এক ঘর এগিয়ে দেব। একটা লিস্ট শেষ হয়ে গেলে অন্য লিস্টে যা বাকি থাকবে, সবগুলো একে একে তুলে নেব। শেষে `nums` থেকে একটা লিংকড লিস্ট বানিয়ে দিলেই কাজ শেষ!

---

# অ্যালগরিদম

১. খালি লিস্ট `nums = []`, `left = list1`, আর `right = list2` নিই।
২. যতক্ষণ `left` আর `right` দুটোই `None` না হয়, ছোট মানটা `nums`-এ যোগ করে সেই পয়েন্টারটা সামনে এগোই।
৩. এরপর `left` বা `right`-এ যা বাকি থাকে, সব `nums`-এ যোগ করি।
৪. `nums` খালি হলে `None` রিটার্ন করি, নাহলে `nums` দিয়ে নতুন লিংকড লিস্ট বানিয়ে রিটার্ন করি।

```text
function mergeTwoLists(list1, list2)
    nums = []
    left = list1, right = list2
    while left and right
        if left.val < right.val: nums.append(left.val); left = left.next
        else: nums.append(right.val); right = right.next
    append remaining from left and right
    build and return linked list from nums
```

---

# ধাপে ধাপে ড্রাই রান

`list1: 1 -> 2 -> 4`, `list2: 1 -> 3 -> 4`

- `1` বনাম `1` → `1` নিলাম (`right` এগোল `3`-এ) → `[1]`
- `1` বনাম `3` → `1` নিলাম (`left` এগোল `2`-এ) → `[1, 1]`
- `2` বনাম `3` → `2` নিলাম (`left` এগোল `4`-এ) → `[1, 1, 2]`
- `4` বনাম `3` → `3` নিলাম (`right` এগোল `4`-এ) → `[1, 1, 2, 3]`
- `4` বনাম `4` → `4` নিলাম (`right` শেষ!) → `[1, 1, 2, 3, 4]`
- এবার `left`-এ বাকি থাকা `4` তুলে নিলাম → `[1, 1, 2, 3, 4, 4]`।

---

# কোড বিশ্লেষণ

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        nums = []

        left = list1
        right = list2

        while (left is not None) and (right is not None):
            if left.val < right.val:
                nums.append(left.val)
                left = left.next
            else:
                nums.append(right.val)
                right = right.next

        while left is not None:
            nums.append(left.val)
            left = left.next

        while right is not None:
            nums.append(right.val)
            right = right.next

        if len(nums) == 0:
            return None

        result = ListNode(nums[0], None)
        current = result

        i = 1
        while i < len(nums):
            current.next = ListNode(nums[i], None)
            current = current.next
            i += 1

        return result
```

*(টিপস: ইন্টারভিউতে চাইলে একটা dummy node দিয়ে `O(1)` স্পেসে সরাসরি নোডগুলোর `next` পয়েন্টার জুড়েও কাজটা করা যায়।)*

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(m + n)` — যেখানে `m` ও `n` হলো দুটো লিস্টের দৈর্ঘ্য।
- **Space Complexity:** `O(m + n)` — `nums` এবং নতুন লিস্টের জন্য (ইন-প্লেস ডামি নোড পদ্ধতিতে `O(1)`)।

---

# মূল কথা

> **মার্জ সর্টের মার্জ ধাপের মতোই—দুটো লিস্টের মাথা থেকে ছোটটা নিন, শেষে বাকি অংশটা জুড়ে দিন।**
