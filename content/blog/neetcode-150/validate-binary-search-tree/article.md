---
title: "Validate Binary Search Tree"
date: "2026-11-22"
excerpt: "Verify whether a binary tree is a valid Binary Search Tree (BST) by passing valid (low, high) value bounds down through DFS."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Validate Binary Search Tree

Problem Link: https://leetcode.com/problems/validate-binary-search-tree/

## Problem

Given the `root` of a binary tree, determine if it is a valid **Binary Search Tree (BST)**.

A valid BST is defined as follows:

1. The left subtree of a node contains only nodes with keys **strictly less than** the node's key.
2. The right subtree of a node contains only nodes with keys **strictly greater than** the node's key.
3. Both the left and right subtrees must also be binary search trees.

---

# Example 1

```text
    2
   / \
  1   3
```

Output: `true`

---

# Example 2

```text
      5
     / \
    1   4
       / \
      3   6
```

Output: `false` (Node `4` is in the right subtree of `5`, but `4 < 5`).

---

# Easy Explanation

A common mistake is only checking `root.left.val < root.val < root.right.val` locally at each node.

Why isn't that enough? Consider:

```text
      5
     / \
    1   7
       / \
      3   8
```

Locally, `3 < 7 < 8` looks fine — **but `3` is in the right subtree of `5`**, so `3` violates `3 > 5`!

Every node must satisfy a **valid range `(low, high)`** inherited from all its ancestors:
- Going **left** tightens the upper bound (`high = root.val`).
- Going **right** tightens the lower bound (`low = root.val`).

---

# Algorithm

1. Start `checkBST(root, float('-inf'), float('inf'))`.
2. In `checkBST(root, low, high)`:
   - If `not root`, return `True`.
   - If `not (low < root.val < high)`, return `False`.
   - Return `checkBST(root.left, low, root.val) and checkBST(root.right, root.val, high)`.

```text
function isValidBST(root)
    return checkBST(root, -inf, +inf)

function checkBST(root, low, high)
    if root is None: return True
    if not (low < root.val < high): return False
    return checkBST(root.left, low, root.val) and checkBST(root.right, root.val, high)
```

---

# Step-by-Step Dry Run

Using Example 2 (`[5, 1, 4, null, null, 3, 6]`):

1. `checkBST(5, -inf, +inf)`: `-inf < 5 < +inf` → valid!
2. Left `checkBST(1, -inf, 5)`: `-inf < 1 < 5` → valid!
3. Right `checkBST(4, 5, +inf)`: is `5 < 4 < +inf`? **No!** → returns `False` immediately.

Overall result: `False`.

---

# Understanding the Code

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

# Time Complexity

Every node is visited at most once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

The recursion call stack takes `O(h)` space (`O(log n)` for a balanced tree, `O(n)` for a skewed tree).

---

# The Pattern to Remember

```text
Go left  -> (low, root.val)
Go right -> (root.val, high)
```

> **Validate BSTs by passing `(low, high)` bounds down through DFS rather than checking only immediate children.**
