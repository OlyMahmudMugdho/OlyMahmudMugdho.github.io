---
title: "অ্যাড টু নাম্বারস (Add Two Numbers)"
date: "2026-11-20"
excerpt: "উল্টো ক্রমে লিংকড লিস্টে রাখা দুটো সংখ্যা যোগ করে ফলাফলটা আবার লিংকড লিস্ট বানিয়ে রিটার্ন করার সহজ উপায়।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# অ্যাড টু নাম্বারস (Add Two Numbers)

সমস্যার লিংক: https://leetcode.com/problems/add-two-numbers/

## সমস্যাটা কী?

আমাদের দুটো লিংকড লিস্ট `l1` আর `l2` দেওয়া আছে, যেখানে দুটো সংখ্যার অঙ্কগুলো **উল্টো করে** সাজানো। যেমন `2 -> 4 -> 3` মানে আসলে `342`, আর `5 -> 6 -> 4` মানে `465`। এই দুটো যোগ করে (`342 + 465 = 807`) যোগফলটাকেও একইভাবে উল্টো করে (`7 -> 0 -> 8`) লিংকড লিস্ট আকারে রিটার্ন করতে হবে।

---

# সহজভাবে চিন্তা করি

এখানে উল্টো ক্রমটা আসলে আমাদের জন্য আশীর্বাদ! কারণ প্রথম নোডটাই হলো `1`-এর ঘর, পরেরটা `10`-এর ঘর, তারপরেরটা `100`-এর ঘর।

তাই আমরা:
১. `1, 10, 100...` দিয়ে গুণ করে `l1` থেকে আসল সংখ্যা `num1` আর `l2` থেকে `num2` বের করে নেব।
২. এরপর সাধারণ যোগ: `total = num1 + num2`।
৩. এবার `% 10` আর `// 10` করে যোগফলের শেষ অঙ্ক থেকে একটা একটা করে বের করব—আর সেটাই তো সরাসরি আমাদের কাঙ্ক্ষিত উল্টো ক্রম! সেগুলো দিয়ে একটা নতুন লিংকড লিস্ট বানিয়ে দিলেই কাজ শেষ।

---

# অ্যালগরিদম

১. `mul1 = 1` ধরে `l1` ঘুরে `num1 += mul1 * l1.val` এবং `mul1 *= 10` করে পুরো সংখ্যাটা বানাই।
২. একইভাবে `l2` থেকে `num2` বানাই।
৩. `total = num1 + num2` বের করি। যদি `total == 0` হয়, তবে `ListNode(0)` রিটার্ন করি।
৪. `total != 0` থাকা পর্যন্ত `total % 10` নিয়ে `result`-এ রাখি আর `total = total // 10` করি।
৫. একটা ডামি নোড `sumList = ListNode(-1)` নিয়ে `result`-এর প্রতিটা অঙ্ক দিয়ে নতুন নোড জুড়ে `temp.next` রিটার্ন করি।

```text
function addTwoNumbers(l1, l2)
    num1 = integer from l1 (mul = 1, 10, 100...)
    num2 = integer from l2 (mul = 1, 10, 100...)
    total = num1 + num2
    if total == 0: return ListNode(0)
    result = digits from (total % 10), total //= 10
    build linked list from result and return head
```

---

# ধাপে ধাপে ড্রাই রান

`l1 = [2, 4, 3]`, `l2 = [5, 6, 4]`

- `l1` থেকে: `2*1 + 4*10 + 3*100 = 342`
- `l2` থেকে: `5*1 + 6*10 + 4*100 = 465`
- যোগফল: `total = 342 + 465 = 807`
- অঙ্ক আলাদা করা:
  - `807 % 10 = 7`, বাকি `80`
  - `80 % 10 = 0`, বাকি `8`
  - `8 % 10 = 8`, বাকি `0`

তাহলে `result = [7, 0, 8]`, যা থেকে তৈরি হবে `7 -> 0 -> 8`।

---

# কোড বিশ্লেষণ

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        num1 = 0
        num2 = 0

        mul1 = 1
        while l1:
            num1 += (mul1 * l1.val)
            mul1 *= 10
            l1 = l1.next

        mul2 = 1
        while l2:
            num2 += (mul2 * l2.val)
            mul2 *= 10
            l2 = l2.next

        total = num1 + num2

        if total == 0:
            return ListNode(0)

        result = []
        while total != 0:
            digit = total % 10
            result.append(digit)
            total = total // 10

        sumList = ListNode(-1)
        temp = sumList

        for num in result:
            sumList.next = ListNode(num)
            sumList = sumList.next

        return temp.next
```

*(মজার বিষয়: Python-এ integer-এর কোনো সাইজ লিমিট না থাকায় ১০০ অঙ্কের সংখ্যাও এভাবে অনায়াসে যোগ করা যায়!)*

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(max(m, n))` — যেখানে `m` ও `n` হলো দুটো লিস্টের দৈর্ঘ্য।
- **Space Complexity:** `O(max(m, n))` — `result` এবং নতুন লিংকড লিস্টের জন্য।

---

# মূল কথা

> **উল্টো ক্রমের অঙ্কগুলো `1, 10, 100...` দিয়ে সংখ্যা বানানো আর `% 10` দিয়ে ভাঙার সাথে একদম মিলে যায়।**
