---
title: "কে-থ স্মলেস্ট এলিমেন্ট ইন এ বিএসটি (Kth Smallest Element in a BST)"
date: "2026-11-22"
excerpt: "BST-তে ইন-অর্ডার ট্র্যাভার্সাল (Left -> Root -> Right) চালিয়ে ছোট থেকে বড় সাজানো তালিকা থেকে k-তম ছোট সংখ্যাটি বের করা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# কে-থ স্মলেস্ট এলিমেন্ট ইন এ বিএসটি (Kth Smallest Element in a BST)

সমস্যার লিংক: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

## সমস্যাটা কী?

একটা Binary Search Tree (BST)-এর `root` আর একটা সংখ্যা `k` দেওয়া আছে। ট্রি-র ভেতর থাকা সংখ্যাগুলোর মধ্যে **ছোট দিক থেকে `k`-তম** (`1`-বেসড) সংখ্যাটা বের করতে হবে।

---

# সহজভাবে চিন্তা করি

BST-এর দারুণ একটা বৈশিষ্ট্য আছে—আপনি যদি এর ওপর **In-Order Traversal** (`বাম -> রুট -> ডান`) চালান, তাহলে সংখ্যাগুলো আপনাআপনি **ছোট থেকে বড়** ক্রমে সাজানো অবস্থায় পাওয়া যায়!

তাই আমরা ইন-অর্ডার ঘুরে সবগুলো মান `res` লিস্টে তুলে নেব। এরপর `1`-বেসড `k`-তম ছোট সংখ্যা মানেই হলো `res[k - 1]`!

---

# অ্যালগরিদম

1. একটা খালি লিস্ট `res = []` নিই।
2. `traverse(root, res)` দিয়ে ইন-অর্ডার ট্র্যাভার্সাল চালাই:
   - `root` `None` হলে রিটার্ন করি।
   - `root.left` থাকলে বামে যাই।
   - `res.append(root.val)` করি।
   - `root.right` থাকলে ডানে যাই।
3. শেষে `res[k - 1]` রিটার্ন করি।

```text
function kthSmallest(root, k)
    res = []
    traverse(root, res)
    return res[k - 1]

function traverse(root, res)
    if root is None: return
    if root.left: traverse(root.left, res)
    res.append(root.val)
    if root.right: traverse(root.right, res)
```

---

# ধাপে ধাপে ড্রাই রান

`[3, 1, 4, null, 2]`, `k = 1`

1. `3` থেকে বামে `1`-এ যাই।
2. `1`-এর বাম নেই → `res = [1]`। ডানে `2` → `res = [1, 2]`।
3. `3`-এ ফিরে → `res = [1, 2, 3]`।
4. `3`-এর ডানে `4` → `res = [1, 2, 3, 4]`।

এবার `res[1 - 1] = res[0] = 1` রিটার্ন!

---

# কোড বিশ্লেষণ

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def kthSmallest(self, root: TreeNode | None, k: int) -> int:
        res = []

        self.traverse(root, res)

        return res[k - 1]

    def traverse(self, root: TreeNode | None, res: list[int]):
        if not root:
            return

        if root.left:
            self.traverse(root.left, res)

        res.append(root.val)

        if root.right:
            self.traverse(root.right, res)
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — পুরো ট্রি একবার ঘোরা হয়।
- **Space Complexity:** `O(n)` — `res` লিস্ট এবং রিকার্শন স্ট্যাকের জন্য।

---

# মূল কথা

> **BST-তে ইন-অর্ডার ট্র্যাভার্সাল মানেই ছোট থেকে বড় সর্টেড লিস্ট—তারপর `res[k - 1]` নিলেই উত্তর!**
