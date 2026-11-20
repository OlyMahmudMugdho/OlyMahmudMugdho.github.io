---
title: "Subtree of Another Tree"
date: "2026-11-20"
excerpt: "Check if one binary tree is a subtree of another by combining tree traversal with a same-tree comparison helper."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Subtree of Another Tree

Problem Link: https://leetcode.com/problems/subtree-of-another-tree/

## Problem

Given the roots of two binary trees `root` and `subRoot`, return `True` if there is a subtree of `root` with the same structure and node values of `subRoot`, and `False` otherwise.

A **subtree** of a binary tree `tree` is a tree that consists of a node in `tree` and all of this node's descendants.

---

# Example 1

```text
root:               subRoot:
      3                 4
     / \               / \
    4   5             1   2
   / \
  1   2
```

Output:

```text
true
```

The subtree rooted at node `4` in `root` matches `subRoot` completely.

---

# Example 2

```text
root:               subRoot:
      3                 4
     / \               / \
    4   5             1   2
   / \
  1   2
     /
    0
```

Output:

```text
false
```

Node `2` in `root` has an extra child `0`, so the subtree does not match `subRoot`.

---

# Easy Explanation

Think of this problem as two smaller questions:

1. **At the current node `root`:** Is the tree starting at `root` identical to `subRoot`? (This is the exact **Same Tree** problem!)
2. **If not:** Could `subRoot` be hiding inside `root.left` OR inside `root.right`?

So we simply walk through every node of `root` and run `isSameTree(node, subRoot)`!

---

# Algorithm

1. If both `root` and `subRoot` are `None`, return `True`.
2. If either `root` or `subRoot` is `None`, return `False`.
3. If `isSameTree(root, subRoot)` is `True`, return `True`.
4. Otherwise, return `isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)`.

```text
function isSubtree(root, subRoot)
    if root is None and subRoot is None return True
    if root is None or subRoot is None return False

    if isSameTree(root, subRoot) return True

    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

---

# Step-by-Step Dry Run

Using Example 1:

1. Start at `root = 3`:
   - `isSameTree(3, 4)` -> `3 != 4` -> `False`.
   - Check left and right: `isSubtree(4, 4) or isSubtree(5, 4)`.
2. At `node = 4`:
   - `isSameTree(4, 4)`:
     - `4 == 4` -> check `isSameTree(1, 1)` (`True`) and `isSameTree(2, 2)` (`True`).
     - Returns `True`!
3. Since `isSubtree(4, 4)` returned `True`, `isSubtree(3, 4)` returns `True` immediately.

---

# Understanding the Code

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

# Time Complexity

Let `m` be the number of nodes in `root` and `n` be the number of nodes in `subRoot`.

In the worst case, we run `isSameTree` (up to `O(n)`) at each of the `m` nodes of `root`.

```text
Time Complexity: O(m * n)
```

---

# Space Complexity

The recursion call stack goes as deep as the height of `root`.

```text
Space Complexity: O(h)
```

(`O(log m)` for a balanced tree, `O(m)` for a skewed tree.)

---

# The Pattern to Remember

```text
At each node in root:
  if isSameTree(root, subRoot) -> return True
  else -> return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)
```

> **Subtree of Another Tree = Traverse `root` + call `isSameTree` at every node.**
