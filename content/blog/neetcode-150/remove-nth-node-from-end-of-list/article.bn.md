---
title: "Remove Nth Node From End of List"
date: "2026-11-20"
excerpt: "লিংকড লিস্টের মোট দৈর্ঘ্য মেপে (length - n) তম অবস্থানের নোডটি খুব সহজে বাদ দেওয়ার কৌশল।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Remove Nth Node From End of List

সমস্যার লিংক: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

## সমস্যাটা কী?

একটা লিংকড লিস্টের `head` দেওয়া আছে। লিস্টের **শেষ দিক থেকে `n`-তম** নোডটা মুছে ফেলে বাকি লিস্টের হেড রিটার্ন করতে হবে।

যেমন `head = [1, 2, 3, 4, 5]` আর `n = 2` হলে, শেষ থেকে ২ নম্বর নোড হলো `4`। তাই `4` বাদ দিয়ে `[1, 2, 3, 5]` রিটার্ন করতে হবে।

---

# সহজভাবে চিন্তা করি

সিঙ্গলি লিংকড লিস্টে আমরা পেছন থেকে গুনতে পারি না। তাহলে সমাধান কী?

খুব সহজ—প্রথমে পুরো লিস্টটা একবার ঘুরে জেনে নিই এর মোট দৈর্ঘ্য `length` কত! তাহলে শুরু থেকে কোন নোডটা বাদ দিতে হবে, সেটা সহজেই বের করা যায়:

```text
toRemove = length - n
```

এবার দুটো কেস হতে পারে:

- যদি `toRemove == 0` হয়, তার মানে একদম প্রথম নোড (`head`)-টাই বাদ পড়বে! সেক্ষেত্রে সোজা `head.next` রিটার্ন করে দিলেই হয়।
- নাহলে `toRemove - 1` নম্বর নোডটার কাছে গিয়ে দাঁড়াতে হবে, আর ওর পরের নোডটাকে টপকে `temp.next = temp.next.next` করে দিতে হবে। ব্যাস, মাঝের নোডটা গায়েব!

---

# অ্যালগরিদম

1. `head` খালি (`None`) হলে `None` রিটার্ন করি।
2. পুরো লিস্ট ঘুরে মোট নোড সংখ্যা `length` গুনে নিই।
3. `toRemove = length - n` হিসাব করি। যদি `toRemove == 0` হয়, তবে `head.next` রিটার্ন করি।
4. নাহলে `head` থেকে `toRemove - 1` ঘর এগিয়ে `temp`-এ থামি।
5. `temp.next = temp.next.next` করে `head` রিটার্ন করি।

```text
function removeNthFromEnd(head, n)
    if head is None: return None
    length = count nodes in head
    toRemove = length - n
    if toRemove == 0: return head.next
    temp = head
    repeat (toRemove - 1) times: temp = temp.next
    temp.next = temp.next.next
    return head
```

---

# ধাপে ধাপে ড্রাই রান

`head = [1, 2, 3, 4, 5]`, `n = 2`

- **প্রথম পাস:** গুনে পেলাম `length = 5`।
- **হিসাব:** `toRemove = 5 - 2 = 3` (মানে `0`-বেসড ইনডেক্সে `3` নম্বর নোড `4` বাদ যাবে)।
- **দ্বিতীয় পাস:** `toRemove - 1 = 2` ঘর এগিয়ে `temp` এসে থামল নোড `3`-এ।
- এবার `temp.next = temp.next.next` করার সাথে সাথে `3` সরাসরি `5`-কে ধরে ফেলল, আর `4` বাদ পড়ে গেল!

উত্তর: `[1, 2, 3, 5]`।

---

# কোড বিশ্লেষণ

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        if head is None:
            return None

        lastNode = head
        length = 0

        while lastNode:
            lastNode = lastNode.next
            length += 1

        if length == 1 and n == 1:
            return None

        toRemove = length - n

        if toRemove == 0:
            head = head.next
            return head

        temp = head
        i = 0

        while i < toRemove - 1:
            temp = temp.next
            i += 1

        temp.next = temp.next.next

        return head
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — সর্বোচ্চ দুবার লিস্টটা ঘোরা লাগে।
- **Space Complexity:** `O(1)` — বাড়তি কোনো মেমোরি লাগে না।

---

# মূল কথা

> **যেকোনো নোড মুছতে হলে তার ঠিক আগের নোডে (`toRemove - 1`) এসে `temp.next = temp.next.next` করে দিন—আর প্রথম নোড হলে সোজা `head.next`।**
