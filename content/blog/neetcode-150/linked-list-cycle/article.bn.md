---
title: "Linked List Cycle"
date: "2026-11-20"
excerpt: "হ্যাশ সেটে ভিজিটেড নোড মনে রেখে লিংকড লিস্টের ভেতর লুপ বা সাইকেল আছে কি না তা ধরার সহজ উপায়।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Linked List Cycle

সমস্যার লিংক: https://leetcode.com/problems/linked-list-cycle/

## সমস্যাটা কী?

একটা লিংকড লিস্টের `head` দেওয়া আছে। বের করতে হবে এই লিস্টের ভেতর কোনো **সাইকেল (cycle)** বা চক্র আছে কি না—মানে `next` ধরে হাঁটতে হাঁটতে শেষ না হয়ে আবার আগের কোনো নোডে ফিরে আসা হয় কি না।

---

# সহজভাবে চিন্তা করি

যদি কোনো সাইকেল না থাকে, তাহলে `head = head.next` করতে করতে একসময় `None`-এ পৌঁছে থেমে যাবে। আর যদি সাইকেল থাকে, তাহলে লুপের ভেতর ঘুরপাক খেয়ে ঠিকই **আগে দেখা একই `ListNode` অবজেক্টে** আবার এসে পড়বেন!

এখানে একটা সতর্কতা: আমরা নোডের ভ্যালু (`node.val`) নয়, পুরো **নোড অবজেক্টটাই** `set`-এ রাখব। কারণ দুটো আলাদা নোডের মান একই হতেই পারে, তাতে সাইকেল হয় না।

---

# অ্যালগরিদম

1. একটা খালি সেট `visited = set()` তৈরি করি।
2. যতক্ষণ `head is not None`:
   - যদি `head` আগে থেকেই `visited`-এ থাকে, তার মানে সাইকেল আছে—`True` রিটার্ন করি।
   - না থাকলে `visited.add(head)` করে `head = head.next`-এ চলে যাই।
3. লুপ শেষ হয়ে `None`-এ পৌঁছালে `False` রিটার্ন করি।

```text
function hasCycle(head)
    visited = set()
    while head is not None
        if head in visited: return True
        visited.add(head)
        head = head.next
    return False
```

---

# ধাপে ধাপে ড্রাই রান

ধরুন লিস্টটা হলো: `nodeA(3) -> nodeB(2) -> nodeC(0) -> nodeB(2)`

- `nodeA`: সেটে নেই → সেটে ঢুকল `{nodeA}`।
- `nodeB`: সেটে নেই → সেটে ঢুকল `{nodeA, nodeB}`।
- `nodeC`: সেটে নেই → সেটে ঢুকল `{nodeA, nodeB, nodeC}`।
- `nodeB`: আরে! `nodeB` তো `visited`-এ আগে থেকেই আছে! তার মানে ঘুরপাক খাচ্ছি → সরাসরি `True` রিটার্ন।

---

# কোড বিশ্লেষণ

```python
from typing import Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        visited = set()

        while head is not None:
            if head in visited:
                return True

            visited.add(head)
            head = head.next

        return False
```

*(বোনাস: বাড়তি মেমোরি ছাড়া `O(1)` স্পেসে করতে চাইলে Floyd's Slow & Fast Pointer ব্যবহার করতে পারেন—যেখানে `slow` ১ ঘর আর `fast` ২ ঘর করে আগায়, সাইকেল থাকলে দুজন এক জায়গায় দেখা করবেই।)*

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — প্রতিটা নোড সর্বোচ্চ একবারই দেখা হয়।
- **Space Complexity:** `O(n)` — `visited` সেটের জন্য (স্লো/ফাস্ট পয়েন্টারে `O(1)`)।

---

# মূল কথা

> **হাঁটার পথে দেখা প্রতিটা নোড সেটে টুকে রাখুন—একই নোডে দ্বিতীয়বার পা রাখলেই বুঝবেন সাইকেল আছে!**
