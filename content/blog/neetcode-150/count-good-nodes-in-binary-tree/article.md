---
title: "Count Good Nodes in Binary Tree"
date: "2026-11-20"
excerpt: "Count all good nodes in a binary tree using DFS while tracking the maximum value seen along the path from the root."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Count Good Nodes in Binary Tree

Problem Link: https://leetcode.com/problems/count-good-nodes-in-binary-tree/

## Problem

Given a binary tree `root`, a node `X` in the tree is named **good** if in the path from `root` to `X` there are no nodes with a value **greater than** `X`.

Return the number of **good** nodes in the binary tree.

---

# Example 1

```text
        3
       / \
      1   4
     /   / \
    3   1   5
```

Output:

```text
4
```

Explanation:

- Root `3` is always good.
- Left path `3 -> 1`: `1 < 3`, not good.
- Left path `3 -> 1 -> 3`: `3 >= 3`, **good**!
- Right path `3 -> 4`: `4 >= 3`, **good**!
- Right path `3 -> 4 -> 1`: `1 < 4`, not good.
- Right path `3 -> 4 -> 5`: `5 >= 4`, **good**!

Total good nodes = `4`.

---

# Easy Explanation

Notice what the condition *"no node on the path from `root` to `X` has a value greater than `X`"* really means:

> **`X.val >= mx`**, where `mx` is the **maximum value** seen along the path from `root` down to `X`!

If we use **DFS** and pass `mx` down as a parameter to each child call, every node can decide in `O(1)` time whether it is good, update `mx = max(root.val, mx)`, and ask its left and right subtrees how many good nodes they have!

---

# Algorithm

1. Start `dfs(root, root.val)`.
2. Inside `dfs(root, mx)`:
   - If `root` is `None`, return `0`.
   - Set `good = 1` if `root.val >= mx`, else `0`.
   - Update `mx = max(root.val, mx)`.
   - Return `good + dfs(root.left, mx) + dfs(root.right, mx)`.

```text
function goodNodes(root)
    return dfs(root, root.val)

function dfs(node, mx)
    if node is None return 0
    good = 1 if node.val >= mx else 0
    mx = max(node.val, mx)
    return good + dfs(node.left, mx) + dfs(node.right, mx)
```

---

# Step-by-Step Dry Run

Using Example 1 (`root = 3`):

1. `dfs(3, 3)`: `3 >= 3` → `good = 1`, `mx = 3`.
2. Left `dfs(1, 3)`: `1 < 3` → `good = 0`, `mx = 3`.
   - Left `dfs(3, 3)`: `3 >= 3` → `good = 1`, returns `1`.
   - `dfs(1, 3)` returns `0 + 1 + 0 = 1`.
3. Right `dfs(4, 3)`: `4 >= 3` → `good = 1`, `mx = 4`.
   - Left `dfs(1, 4)`: `1 < 4` → `good = 0`, returns `0`.
   - Right `dfs(5, 4)`: `5 >= 4` → `good = 1`, returns `1`.
   - `dfs(4, 3)` returns `1 + 0 + 1 = 2`.
4. Back at root: `1 + 1 + 2 = 4`.

---

# Understanding the Code

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        return self.dfs(root, root.val)

    def dfs(self, root: TreeNode, mx: int):
        if root is None:
            return 0

        good = 0
        if root.val >= mx:
            good = 1

        mx = max(root.val, mx)

        return good + self.dfs(root.left, mx) + self.dfs(root.right, mx)
```

---

# Time Complexity

Every node is visited once during the DFS traversal.

```text
Time Complexity: O(n)
```

---

# Space Complexity

The extra space is the recursion call stack (`h` is the height of the tree).

- **Balanced tree:** `O(log n)`
- **Skewed tree:** `O(n)`

---

# The Pattern to Remember

```text
Pass path-max (mx) down through DFS
  ↓
If node.val >= mx: count += 1
  ↓
Update mx = max(node.val, mx) for children
```

> **In top-down tree DFS, pass path state like `mx` as a function parameter so each branch stays isolated.**
