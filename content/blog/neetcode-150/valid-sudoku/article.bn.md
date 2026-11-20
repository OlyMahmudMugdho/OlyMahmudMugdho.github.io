---
title: "ভ্যালিড সুডোকু (Valid Sudoku)"
date: "2026-11-20"
excerpt: "হ্যাশ সেটের সাহায্যে ৯x৯ সুডোকু বোর্ডের প্রতিটি সারি, কলাম এবং ৩x৩ বক্সে ডুপ্লিকেট আছে কি না তা যাচাই করার সহজ উপায়।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# ভ্যালিড সুডোকু (Valid Sudoku)

সমস্যার লিংক: https://leetcode.com/problems/valid-sudoku/

## সমস্যাটা কী?

একটা `9 x 9` সুডোকু বোর্ড দেওয়া আছে। আমাদের শুধু চেক করতে হবে বোর্ডটা সুডোকুর নিয়ম মানছে কি না (বোর্ডটা সমাধানযোগ্য কি না সেটা দেখার দরকার নেই):

১. প্রতিটা সারিতে `1-9` এর কোনো অঙ্ক দুবার থাকতে পারবে না।
২. প্রতিটা কলামে `1-9` এর কোনো অঙ্ক দুবার থাকতে পারবে না।
৩. প্রতিটা `3 x 3` সাব-বক্সে `1-9` এর কোনো অঙ্ক দুবার থাকতে পারবে না।

খালি ঘরগুলো `"."` দিয়ে বোঝানো হয়েছে, ওগুলো আমরা এড়িয়ে যাব।

---

# সহজভাবে চিন্তা করি

প্রতিটা পূর্ণ ঘরের `(row, col)` জন্য আমাদের তিন জায়গায় নজর রাখতে হবে—ওই সারি, ওই কলাম, আর ওই `3 x 3` বক্স।

সারি আর কলাম তো `row` এবং `col` দিয়েই চেনা যায়। কিন্তু `(row, col)` ঘরটা `9`টা বক্সের ঠিক কোন বক্সে পড়ে, সেটা কীভাবে বের করব?

এখানেই ছোট্ট একটা ফর্মুলা কাজে লাগে:

```python
box = (row // 3) * 3 + (col // 3)
```

দেখুন তো মিলে কি না: `row = 4, col = 7` হলে `(4 // 3) * 3 + (7 // 3) = 1 * 3 + 2 = 5`। পুরো বোর্ডের `0` থেকে `8` নম্বর বক্স একদম নিখুঁতভাবে আলাদা হয়ে যায়!

তাহলে প্রতিটা সারি, কলাম আর বক্সের জন্য একটা করে `set` রাখলেই এক পাসে পুরো বোর্ড চেক করে ফেলা যাবে।

---

# অ্যালগরিদম

১. `rows`, `columns`, `boxes`—প্রত্যেকটার জন্য `9`টা করে খালি `set` তৈরি করি।
২. `row` (`0..8`) আর `col` (`0..8`) লুপ ঘুরিয়ে প্রতিটা ঘর `value = board[row][col]` দেখি:
   - `value == "."` হলে কিছু না করে পরের ঘরে যাই।
   - `box = (row // 3) * 3 + (col // 3)` বের করি।
   - `value` যদি `rows[row]`, `columns[col]`, বা `boxes[box]`-এর কোনোটাতে আগে থেকেই থাকে, তবে সাথে সাথে `False` রিটার্ন করি।
   - না থাকলে তিনটা সেটেই `value` যোগ করে দিই।
৩. কোনো ঝামেলা ছাড়া পুরো বোর্ড শেষ হলে `True` রিটার্ন করি।

```text
function isValidSudoku(board)
    rows, columns, boxes = 9 empty sets each
    for row in 0..8
        for col in 0..8
            value = board[row][col]
            if value == "." continue
            box = (row // 3) * 3 + (col // 3)
            if value in rows[row] or value in columns[col] or value in boxes[box]
                return False
            add value to rows[row], columns[col], boxes[box]
    return True
```

---

# ধাপে ধাপে ড্রাই রান

ধরুন প্রথম সারিতে আছে `["5", "3", ".", ...]`

- `(0, 0)`-তে `"5"`: `box = 0`। সারি `0`, কলাম `0`, বা বক্স `0`—কোথাও `"5"` নেই। তাই তিন জায়গাতেই `"5"` যোগ হলো।
- `(0, 1)`-এ `"3"`: `box = 0`। কোথাও নেই, তাই তিন জায়গায় `"3"` যোগ হলো।
- `(0, 2)`-এ `"."`: খালি ঘর, সোজা স্কিপ।

পরে যদি আবার বক্স `0`-এ বা কলাম `0`-এ `"5"` পাওয়া যায়, সেট সাথে সাথে ধরে ফেলবে এবং `False` রিটার্ন করবে।

---

# কোড বিশ্লেষণ

```python
from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        rows = [set() for _ in range(9)]
        columns = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for row in range(0, 9):
            for col in range(0, 9):
                value = board[row][col]
                box = (row // 3) * 3 + (col // 3)

                if value == ".":
                    continue

                if value in rows[row]:
                    return False

                if value in columns[col]:
                    return False

                if value in boxes[box]:
                    return False

                rows[row].add(value)
                columns[col].add(value)
                boxes[box].add(value)

        return True
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

সুডোকু বোর্ড সবসময় ফিক্সড `9 x 9 = 81` ঘরের হয়। তাই:

- **Time Complexity:** `O(81) = O(1)`
- **Space Complexity:** `O(81) = O(1)`

---

# মূল কথা

> **`(row // 3) * 3 + (col // 3)` সূত্রটা মনে রাখলে সুডোকু বা গ্রিডের যেকোনো `3x3` সাব-বক্সের হিসাব একদম সহজ হয়ে যায়।**
