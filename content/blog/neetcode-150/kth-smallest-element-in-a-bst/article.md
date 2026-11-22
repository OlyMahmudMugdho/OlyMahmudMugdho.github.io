---
title: "Kth Smallest Element in a BST"
date: "2026-11-22"
excerpt: "Find the kth smallest element in a Binary Search Tree using in-order traversal, which visits BST nodes in sorted order."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Kth Smallest Element in a BST

Problem Link: https://leetcode.com/problems/kth-smallest-element-in-a-bst/

## Problem

Given the `root` of a binary search tree, and an integer `k`, return the `k`-th smallest value (**1-indexed**) of all the values of the nodes in the tree.

---

# Example 1

```text
      3
     / \
    1   4
     \
      2
```

Input: `k = 1`

Output: `1`

---

# Example 2

```text
        5
       / \
      3   6
     / \
    2   4
   /
  1
```

Input: `k = 3`

Output: `3`

---

# Easy Explanation

A **Binary Search Tree (BST)** has a superpower:

> **An In-Order Traversal (`Left -> Root -> Right`) of a BST always visits nodes in ascending sorted order!**

So if we collect all node values in `res` during an in-order traversal, `res` is automatically sorted from smallest to largest, and the `k`-th smallest element (1-indexed) is simply `res[k - 1]`!

---

# Algorithm

1. Initialize an empty list `res = []`.
2. Run in-order `traverse(root, res)`:
   - If `not root`, return.
   - Traverse `root.left`.
   - Append `root.val` to `res`.
   - Traverse `root.right`.
3. Return `res[k - 1]`.

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

# Step-by-Step Dry Run

Using Example 1 (`[3, 1, 4, null, 2]`, `k = 1`):

1. Start at `3`, go left to `1`.
2. `1` has no left child → append `1` → `res = [1]`.
3. `1` goes right to `2` → append `2` → `res = [1, 2]`.
4. Back at `3` → append `3` → `res = [1, 2, 3]`.
5. `3` goes right to `4` → append `4` → `res = [1, 2, 3, 4]`.

Return `res[1 - 1] = res[0] = 1`.

---

# Understanding the Code

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

# Time Complexity

We visit every node once during in-order traversal.

```text
Time Complexity: O(n)
```

---

# Space Complexity

`res` stores `n` values and the recursion stack uses `O(h)` space.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
In-order traversal (Left -> Root -> Right) on a BST
  ↓
Produces sorted array res
  ↓
Return res[k - 1]
```

> **In-order traversal turns any BST into a sorted list.**
