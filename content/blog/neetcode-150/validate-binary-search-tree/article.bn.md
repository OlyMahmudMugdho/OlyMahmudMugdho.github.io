---
title: "ভ্যালিডেট বাইনারি সার্চ ট্রি (Validate Binary Search Tree)"
date: "2026-11-22"
excerpt: "DFS-এ প্রতিটি নোডের জন্য বৈধ (low, high) সীমা পাঠিয়ে বাইনারি ট্রি আসলেই BST কি না তা যাচাই করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# ভ্যালিডেট বাইনারি সার্চ ট্রি (Validate Binary Search Tree)

সমস্যার লিংক: https://leetcode.com/problems/validate-binary-search-tree/

## সমস্যাটা কী?

একটা বাইনারি ট্রি `root` দেওয়া আছে। বলতে হবে এটা একটা বৈধ **Binary Search Tree (BST)** কি না।

বৈধ BST মানে:
1. কোনো নোডের বাম সাবট্রির **সব** নোডের মান ওই নোডের চেয়ে ছোট হতে হবে।
2. ডান সাবট্রির **সব** নোডের মান ওই নোডের চেয়ে বড় হতে হবে।
3. বাম ও ডান সাবট্রি দুটোকেও একই নিয়ম মানতে হবে।

---

# সহজভাবে চিন্তা করি

এখানে অনেকেই একটা সাধারণ ভুল করে—শুধু পাশাপাশি সন্তান দুটো চেক করে (`left.val < root.val < right.val`)।

কিন্তু ভাবুন তো, রুটে `5` আছে, তার ডানে `7` আছে, আর `7`-এর বামে `3` আছে! `3 < 7` ঠিকই আছে, কিন্তু `3` তো `5`-এর ডান সাবট্রিতে বসে আছে—যেখানে `5`-এর চেয়ে ছোট কিছু থাকতেই পারে না!

তাই প্রতিটা নোডের জন্য ওপর থেকে একটা **বৈধ রেঞ্জ `(low, high)`** পাঠাতে হবে:
- **বামে গেলে** সর্বোচ্চ সীমা কমে `root.val` হয়ে যায়: `(low, root.val)`।
- **ডানে গেলে** সর্বনিম্ন সীমা বেড়ে `root.val` হয়ে যায়: `(root.val, high)`।

---

# অ্যালগরিদম

1. রুট থেকে `checkBST(root, float('-inf'), float('inf'))` কল করি।
2. `checkBST(root, low, high)`-এর ভেতর:
   - `root` খালি হলে `True` রিটার্ন করি।
   - `low < root.val < high` না মানলে সাথে সাথে `False` রিটার্ন করি।
   - বাম ও ডান সাবট্রিতে আপডেটেড রেঞ্জসহ কল দিই: `checkBST(root.left, low, root.val) and checkBST(root.right, root.val, high)`।

```text
function isValidBST(root)
    return checkBST(root, -inf, +inf)

function checkBST(root, low, high)
    if root is None: return True
    if not (low < root.val < high): return False
    return checkBST(root.left, low, root.val) and checkBST(root.right, root.val, high)
```

---

# ধাপে ধাপে ড্রাই রান

`[5, 1, 4, null, null, 3, 6]` নিয়ে দেখি:

1. `checkBST(5, -inf, +inf)`: `-inf < 5 < +inf` → পাস!
2. বামে `checkBST(1, -inf, 5)`: `-inf < 1 < 5` → পাস!
3. ডানে `checkBST(4, 5, +inf)`: `5 < 4 < +inf` কি সত্য? **না!** → সাথে সাথে `False`!

উত্তর: `False`।

---

# কোড বিশ্লেষণ

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isValidBST(self, root: TreeNode | None) -> bool:
        return self.checkBST(root, float('-inf'), float('inf'))

    def checkBST(self, root: TreeNode | None, low, high):
        if not root:
            return True

        if not (low < root.val < high):
            return False

        return self.checkBST(root.left, low, root.val) and self.checkBST(root.right, root.val, high)
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — প্রতিটা নোড একবারই চেক হয়।
- **Space Complexity:** `O(h)` — রিকার্শন কল স্ট্যাকের জন্য।

---

# মূল কথা

> **BST যাচাই করতে শুধু সরাসরি সন্তান দেখলে হবে না—উপর থেকে `(low, high)` রেঞ্জ নিচে পাঠিয়ে দিতে হবে।**
