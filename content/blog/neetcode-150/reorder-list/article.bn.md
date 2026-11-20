---
title: "রিঅর্ডার লিস্ট (Reorder List)"
date: "2026-11-20"
excerpt: "অ্যারে ও দুই প্রান্তের টু-পয়েন্টার দিয়ে লিংকড লিস্টকে L0 -> Ln -> L1 -> Ln-1 ক্রমে সাজানোর সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# রিঅর্ডার লিস্ট (Reorder List)

সমস্যার লিংক: https://leetcode.com/problems/reorder-list/

## সমস্যাটা কী?

একটা সিঙ্গলি লিংকড লিস্ট `L0 -> L1 -> ... -> Ln` দেওয়া আছে। কিছু রিটার্ন না করে লিস্টটাকে ইন-প্লেস পরিবর্তন করে `L0 -> Ln -> L1 -> Ln-1 -> ...` ক্রমে সাজাতে হবে।

যেমন `[1, 2, 3, 4, 5]` হয়ে যাবে `[1, 5, 2, 4, 3]`।

---

# সহজভাবে চিন্তা করি

প্যাটার্নটা খেয়াল করুন: একবার শুরু থেকে প্রথমটা, তারপর শেষ থেকে শেষেরটা, আবার শুরু থেকে দ্বিতীয়টা, তারপর শেষ থেকে আগেরটা!

সিঙ্গলি লিংকড লিস্টে যেহেতু পেছন দিকে আসা যায় না, তাই কাজটা সহজ করতে আমরা প্রথমেই সব নোডের মান একটা সাধারণ লিস্ট `num_arrays`-এ তুলে নেব। এরপর অ্যারের দুই মাথায় দুটো পয়েন্টার (`p1 = 0` আর `p2 = n - 1`) বসিয়ে পালাক্রমে মানগুলো মূল লিংকড লিস্টে বসিয়ে দেব।

---

# অ্যালগরিদম

১. লিংকড লিস্ট ঘুরে সব নোডের মান `num_arrays`-এ জমা করি।
২. `p1 = 0`, `p2 = len(num_arrays) - 1`, আর `temp = head` নিই।
৩. যতক্ষণ `p1 <= p2`:
   - `temp.val = num_arrays[p1]` বসিয়ে `temp = temp.next` করি (যদি `temp` `None` হয়, ওখানেই `return`)।
   - `temp.val = num_arrays[p2]` বসিয়ে `temp = temp.next` করি (`None` হলে `return`)।
   - `p1 += 1` এবং `p2 -= 1` করি।

```text
function reorderList(head)
    num_arrays = values from head
    p1 = 0, p2 = len(num_arrays) - 1, temp = head
    while p1 <= p2
        temp.val = num_arrays[p1]; temp = temp.next; if not temp: return
        temp.val = num_arrays[p2]; temp = temp.next; if not temp: return
        p1 += 1; p2 -= 1
```

---

# ধাপে ধাপে ড্রাই রান

`head = [1, 2, 3, 4, 5]` → `num_arrays = [1, 2, 3, 4, 5]`

- `p1 = 0, p2 = 4`: প্রথম দুই নোডে বসল `1` আর `5`।
- `p1 = 1, p2 = 3`: পরের দুই নোডে বসল `2` আর `4`।
- `p1 = 2, p2 = 2`: পরের নোডে বসল `3`, এরপর `temp` `None` হয়ে যাওয়ায় `if not temp: return` দিয়ে সুন্দরভাবে থেমে গেল!

ফলাফল: `1 -> 5 -> 2 -> 4 -> 3`।

---

# কোড বিশ্লেষণ

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: ListNode | None) -> None:
        num_arrays = []
        current = head

        while current:
            num_arrays.append(current.val)
            current = current.next

        n = len(num_arrays)
        p1 = 0
        p2 = n - 1
        temp = head

        while p1 <= p2:
            temp.val = num_arrays[p1]
            temp = temp.next
            if not temp:
                return
            temp.val = num_arrays[p2]
            temp = temp.next
            if not temp:
                return

            p1 += 1
            p2 -= 1
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — মান তোলার জন্য একবার, আর বসানোর জন্য একবার লিস্ট ঘুরতে হয়।
- **Space Complexity:** `O(n)` — `num_arrays` লিস্টের জন্য।

---

# মূল কথা

> **মানগুলো অ্যারেতে তুলে দুই প্রান্তের পয়েন্টার (`p1`, `p2`) দিয়ে পালাক্রমে বসালেই কোনো পয়েন্টার জটলা ছাড়াই সমাধান হয়ে যায়।**
