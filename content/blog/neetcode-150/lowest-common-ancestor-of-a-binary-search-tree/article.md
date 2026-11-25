---
title: "Lowest Common Ancestor of a Binary Search Tree"
date: "2026-11-20"
excerpt: "Find the lowest common ancestor (LCA) of two nodes in a Binary Search Tree using recursive subtree search and BST ordering."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Lowest Common Ancestor of a Binary Search Tree

Problem Link: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/

## Problem

Given a binary search tree (BST), find the **lowest common ancestor (LCA)** of two given nodes `p` and `q` in the BST.

The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**).

---

# Example 1

```tree
6 : LCA !hit
  2
    0
    4
      3
      5
  8
    7
    9
```

Input: `p = 2, q = 8`

Output: `6`

Explanation: The LCA of `2` and `8` is `6`.

---

# Example 2

Using the same tree:

Input: `p = 2, q = 4`

Output: `2`

Explanation: Since a node can be a descendant of itself, `2` is the LCA of `2` and `4`.

---

# Easy Explanation

How do we find the lowest common ancestor of `p` and `q`?

Think about what happens when we search for `p` and `q` starting from `root`:

1. If `root` is `None`, return `None`.
2. If `root` equals `p` or `q`, then `root` is one of the targets — return `root`!
3. Otherwise, recursively search both `root.left` and `root.right`:
   - If **both** `left` and `right` return non-`None`, that means `p` is in one subtree and `q` is in the other — so `root` is the **split point (LCA)**!
   - If `left` is `None`, both nodes must be in `right`, so return `right`.
   - If `right` is `None`, both nodes must be in `left`, so return `left`.

---

# Algorithm

1. If `root` is `None`, return `None`.
2. If `root.val == p.val` or `root.val == q.val`, return `root`.
3. Recursively search `left = lowestCommonAncestor(root.left, p, q)` and `right = lowestCommonAncestor(root.right, p, q)`.
4. If `left` is `None`, return `right`.
5. If `right` is `None`, return `left`.
6. Otherwise, both `left` and `right` are non-`None`, so return `root`.

```text
function lowestCommonAncestor(root, p, q)
    if root is None return None
    if root.val == p.val or root.val == q.val return root

    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)

    if left is None return right
    if right is None return left
    return root
```

---

# Step-by-Step Dry Run

Using Example 1 with `p = 2, q = 8`:

1. Start at `root = 6`:
   - `6 != 2` and `6 != 8`.
   - `left = lowestCommonAncestor(2, 2, 8)` -> `2 == p.val`, returns node `2`.
   - `right = lowestCommonAncestor(8, 2, 8)` -> `8 == q.val`, returns node `8`.
2. Back at `root = 6`:
   - `left` is `2` (not `None`), `right` is `8` (not `None`).
   - Return `root` (`6`)!

---

# Understanding the Code

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

---

# Bonus: Using the BST Property (`O(h)` Time, `O(1)` Space)

Because this is a **Binary Search Tree** (left < root < right), we can actually tell which side `p` and `q` are on just by comparing values:

- If both `p.val < root.val` and `q.val < root.val`, move `root = root.left`.
- If both `p.val > root.val` and `q.val > root.val`, move `root = root.right`.
- Otherwise, they split here (or one equals `root`), so `root` is the LCA!

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        while root:
            if p.val < root.val and q.val < root.val:
                root = root.left
            elif p.val > root.val and q.val > root.val:
                root = root.right
            else:
                return root
```

---

# Time Complexity

- **General recursive LCA:** `O(n)` (visits up to all nodes).
- **BST iterative LCA:** `O(h)` where `h` is the height of the tree (`O(log n)` balanced, `O(n)` skewed).

---

# Space Complexity

- **General recursive LCA:** `O(h)` for the recursion stack.
- **BST iterative LCA:** `O(1)`.

---

# The Pattern to Remember

```text
If p and q are in different subtrees -> current node is the LCA
If both are in left -> go left
If both are in right -> go right
```

> **The Lowest Common Ancestor is simply the first node where `p` and `q` split into different branches (or where one of them equals the node itself).**
