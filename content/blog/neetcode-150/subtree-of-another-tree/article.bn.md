---
title: "Subtree of Another Tree"
date: "2026-11-20"
excerpt: "মূল ট্রির প্রতিটি নোডে Same Tree চেক চালিয়ে আরেকটি ট্রি এর ভেতর সাবট্রি হিসেবে আছে কি না তা বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Subtree of Another Tree

সমস্যার লিংক: https://leetcode.com/problems/subtree-of-another-tree/

## সমস্যাটা কী?

দুটো বাইনারি ট্রি `root` আর `subRoot` দেওয়া আছে। দেখতে হবে `subRoot` ট্রি-টা হুবহু `root`-এর ভেতর কোনো একটা অংশ (subtree) হিসেবে আছে কি না—গঠন এবং নোডের মান সবদিক থেকেই এক হতে হবে।

---

# সহজভাবে চিন্তা করি

আপনি যদি আগে **Same Tree** সমস্যাটা করে থাকেন, তাহলে এটা একদমই সহজ! এখানে আমাদের শুধু দুটো প্রশ্ন করতে হবে:

1. এখন যে নোড `root`-এ দাঁড়িয়ে আছি, এখান থেকেই কি `subRoot`-এর সাথে হুবহু মিলে যাচ্ছে? (`isSameTree(root, subRoot)`)
2. যদি না মেলে, তাহলে `subRoot` কি `root`-এর বাম পাশে অথবা ডান পাশে লুকিয়ে আছে?

ব্যাস! পুরো `root` ট্রি ঘুরে প্রতিটা নোডে `isSameTree` চালিয়ে দিলেই উত্তর চলে আসে।

---

# অ্যালগরিদম

1. `root` আর `subRoot` দুটোই `None` হলে `True`; যেকোনো একটা `None` হলে `False`।
2. যদি `self.isSameTree(root, subRoot)` সত্য হয়, তাহলে সাথে সাথে `True` রিটার্ন করি।
3. নাহলে বাম আর ডান সাবট্রিতে খুঁজি: `self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)`।

```text
function isSubtree(root, subRoot)
    if root is None and subRoot is None: return True
    if root is None or subRoot is None: return False
    if isSameTree(root, subRoot): return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

---

# ধাপে ধাপে ড্রাই রান

ধরুন `root = [3, 4, 5, 1, 2]` আর `subRoot = [4, 1, 2]`:

- প্রথমে রুট `3`-এ চেক: `isSameTree(3, 4)` → `3 != 4`, তাই `False`। এবার বামে (`4`) আর ডানে (`5`) খুঁজব।
- বামে `4`-এ গিয়ে চেক: `isSameTree(4, 4)` → `4 == 4`, বামে `1 == 1`, ডানে `2 == 2` → সব মিলে গেছে (`True`)!

এক পাশ থেকেই `True` পাওয়ায় পুরো উত্তর `True`।

---

# কোড বিশ্লেষণ

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isSubtree(self, root: TreeNode | None, subRoot: TreeNode | None) -> bool:
        if root is None and subRoot is None:
            return True

        if root is None or subRoot is None:
            return False

        if self.isSameTree(root, subRoot):
            return True

        return self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)

    def isSameTree(self, p: TreeNode | None, q: TreeNode | None) -> bool:
        if p is None and q is None:
            return True

        if p is None or q is None:
            return False

        isSame = False
        if p.val == q.val:
            isSame = True

        return isSame and self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(m * n)` — যেখানে `m` হলো `root`-এর নোড সংখ্যা আর `n` হলো `subRoot`-এর নোড সংখ্যা।
- **Space Complexity:** `O(h)` — রিকার্শন স্ট্যাকের জন্য।

---

# মূল কথা

> **আগে জানা `isSameTree` ফাংশনটাকে `root`-এর প্রতিটা নোডে চালিয়ে দিলেই Subtree সমস্যার সমাধান হয়ে যায়।**
