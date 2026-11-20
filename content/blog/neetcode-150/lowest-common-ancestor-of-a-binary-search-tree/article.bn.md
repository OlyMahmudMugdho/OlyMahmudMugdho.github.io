---
title: "লোয়েস্ট কমন অ্যানসেস্টর অব এ বাইনারি সার্চ ট্রি (LCA of BST)"
date: "2026-11-20"
excerpt: "রিকার্সিভ সাবট্রি সার্চ এবং BST-এর অর্ডারিং প্রপার্টি ব্যবহার করে দুটি নোডের Lowest Common Ancestor (LCA) খুঁজে বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# লোয়েস্ট কমন অ্যানসেস্টর অব এ বাইনারি সার্চ ট্রি

সমস্যার লিংক: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

## সমস্যাটা কী?

একটা বাইনারি সার্চ ট্রি (BST) এবং তার দুটো নোড `p` ও `q` দেওয়া আছে। এদের **Lowest Common Ancestor (LCA)** বের করতে হবে—মানে সবচেয়ে নিচের দিকে থাকা এমন একটা নোড, যার নিচে `p` আর `q` দুটোই আছে (নিজেকে নিজের সন্তান বা descendant হিসেবে ধরা যাবে)।

---

# সহজভাবে চিন্তা করি

রুট থেকে শুরু করে আমরা `p` আর `q`-কে খুঁজতে বেরোলাম। ভাবুন তো কী কী ঘটতে পারে?

১. যদি দেখি বর্তমান নোড `root` নিজেই `p` বা `q`-এর সমান, তাহলে এর চেয়ে নিচে যাওয়ার তো প্রশ্নই আসে না—`root` নিজেই হতে পারে উত্তর! তাই `root` রিটার্ন করি।
২. নাহলে বাম পাশ (`left`) আর ডান পাশ (`right`) দুদিকেই খুঁজি।
৩. যদি দেখি `left` থেকে একটা পাওয়া গেছে **এবং** `right` থেকেও আরেকটা পাওয়া গেছে—তার মানে এই `root` নোডটা থেকেই `p` আর `q` দুই দিকে ভাগ হয়ে গেছে! অর্থাৎ `root`-ই হলো এদের LCA!
৪. আর যদি এক পাশ `None` হয় (কিছুই পাওয়া যায়নি), তাহলে দুটোই নিশ্চয়ই অন্য পাশে আছে—তাই অন্য পাশের উত্তরটাই রিটার্ন করে দেব।

---

# অ্যালগরিদম

১. `root` `None` হলে `None` রিটার্ন করি।
২. `root.val == p.val` অথবা `root.val == q.val` হলে `root` রিটার্ন করি।
৩. বাম ও ডান সাবট্রিতে রিকার্সিভ কল দিই: `left` এবং `right`।
৪. `left` `None` হলে `right` রিটার্ন করি; `right` `None` হলে `left` রিটার্ন করি।
৫. দুটোই নন-`None` হলে `root` রিটার্ন করি।

```text
function lowestCommonAncestor(root, p, q)
    if root is None: return None
    if root.val == p.val or root.val == q.val: return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left is None: return right
    if right is None: return left
    return root
```

---

# ধাপে ধাপে ড্রাই রান

ধরুন `root = 6`, বামে `2`, ডানে `8`, আর আমাদের খুঁজতে হবে `p = 2, q = 8`:

- `6` থেকে বামে কল গেল: `2` মিলে গেছে, তাই `left` পেল নোড `2`।
- `6` থেকে ডানে কল গেল: `8` মিলে গেছে, তাই `right` পেল নোড `8`।
- `6`-এ ফিরে দেখা গেল `left` আর `right` দুটোই খালি নয়! তার মানে `6`-ই হলো বিভাজন বিন্দু—উত্তর `6`!

---

# কোড বিশ্লেষণ

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if root is None:
            return None

        if root.val == p.val or root.val == q.val:
            return root

        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)

        if left is None:
            return right

        if right is None:
            return left

        return root
```

*(বোনাস টিপস: যেহেতু এটা একটা BST, তাই `p.val` আর `q.val` দুটোই যদি `root.val`-এর চেয়ে ছোট হয় তাহলে শুধু বামে, আর দুটোই বড় হলে শুধু ডানে গেলেই হয়—এভাবে `while` লুপ দিয়ে `O(h)` সময় ও `O(1)` স্পেসেও সমাধান করা যায়।)*

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` সাধারণ রিকার্সিভ LCA-তে (BST প্রপার্টি কাজে লাগালে `O(h)`)।
- **Space Complexity:** `O(h)` রিকার্শন স্ট্যাকের জন্য (ইটারেটিভ BST ভার্সনে `O(1)`)।

---

# মূল কথা

> **যে নোডে এসে `p` আর `q` দুই আলাদা রাস্তায় ভাগ হয়ে যায় (বা একটা রুট নিজেই হয়), সেটাই এদের Lowest Common Ancestor।**
