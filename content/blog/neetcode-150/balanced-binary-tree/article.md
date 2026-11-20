---
title: "Balanced Binary Tree"
date: "2026-11-20"
excerpt: "Determine if a binary tree is height-balanced by checking that the left and right subtree heights differ by at most 1 at every node."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Balanced Binary Tree

Problem Link: https://leetcode.com/problems/balanced-binary-tree/

## Problem

Given a binary tree, determine if it is **height-balanced**.

A height-balanced binary tree is a binary tree in which the depth of the two subtrees of **every node** never differs by more than `1`.

---

# Example 1

```text
        3
       / \
      9   20
         /  \
        15   7
```

Output:

```text
true
```

At node `3`, left height is `1` and right height is `2` (`|1 - 2| = 1 <= 1`), and all subtrees are also balanced.

---

# Example 2

```text
          1
         / \
        2   2
       / \
      3   3
     / \
    4   4
```

Output:

```text
false
```

At node `1`, the left subtree has height `3` while the right subtree has height `1` (`|3 - 1| = 2 > 1`).

---

# Easy Explanation

For a binary tree rooted at `root` to be balanced, **three** conditions must all be true:

1. `abs(height(root.left) - height(root.right)) <= 1`
2. The left subtree `root.left` is balanced.
3. The right subtree `root.right` is balanced.

An empty tree (`root is None`) is balanced by definition (`True`).

---

# Algorithm

1. If `root` is `None`, return `True`.
2. Compute `lefth = getHeight(root.left)` and `righth = getHeight(root.right)`.
3. Return `abs(lefth - righth) <= 1` AND `isBalanced(root.left)` AND `isBalanced(root.right)`.

```text
function isBalanced(root)
    if root is None return True

    lefth = getHeight(root.left)
    righth = getHeight(root.right)

    return abs(lefth - righth) <= 1
           and isBalanced(root.left)
           and isBalanced(root.right)

function getHeight(node)
    if node is None return 0
    return 1 + max(getHeight(node.left), getHeight(node.right))
```

---

# Step-by-Step Dry Run

Using Example 1:

```text
        3
       / \
      9   20
         /  \
        15   7
```

1. At root `3`:
   - `lefth = height(9) = 1`
   - `righth = height(20) = 2`
   - `abs(1 - 2) = 1 <= 1` -> passes!
2. Recursively check `isBalanced(9)`:
   - `lefth = 0`, `righth = 0`, `abs(0 - 0) <= 1` -> `True`.
3. Recursively check `isBalanced(20)`:
   - `lefth = height(15) = 1`, `righth = height(7) = 1`, `abs(1 - 1) <= 1` -> `True`.

All checks return `True`, so the answer is `True`.

---

# Understanding the Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        if root is None:
            return True

        lefth = self.getHeight(root.left)
        righth = self.getHeight(root.right)

        return (
            abs(lefth - righth) <= 1
            and self.isBalanced(root.left)
            and self.isBalanced(root.right)
        )

    def getHeight(self, root: TreeNode | None) -> int:
        if root is None:
            return 0

        return 1 + max(
            self.getHeight(root.left),
            self.getHeight(root.right)
        )
```

*(Note: Notice that `getLeftHeight` and `getRightHeight` do the exact same thing, so they can be combined into a single `getHeight` helper!)*

---

# Optimization: Bottom-Up `O(n)` DFS

In the top-down version above, `getHeight` is called again at every node, which takes `O(n^2)` in the worst case.

We can make it `O(n)` by returning `-1` immediately whenever a subtree is unbalanced:

```python
class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        def dfs(node):
            if not node:
                return 0
            left = dfs(node.left)
            if left == -1:
                return -1
            right = dfs(node.right)
            if right == -1 or abs(left - right) > 1:
                return -1
            return 1 + max(left, right)

        return dfs(root) != -1
```

---

# Time Complexity

- **Top-down solution:** `O(n^2)` worst case (`O(n log n)` on balanced trees).
- **Bottom-up DFS:** `O(n)` since every node is visited once.

---

# Space Complexity

Recursion stack takes `O(h)` where `h` is the height of the tree (`O(log n)` balanced, `O(n)` skewed).

---

# The Pattern to Remember

```text
Check |height(left) - height(right)| <= 1
  AND
isBalanced(left) AND isBalanced(right)
```

> **A tree is balanced only if every single node's left and right heights differ by at most 1.**
