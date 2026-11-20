---
title: "Binary Tree Level Order Traversal"
date: "2026-11-20"
excerpt: "Traverse a binary tree level by level from left to right using Breadth-First Search (BFS) with a queue."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Binary Tree Level Order Traversal

Problem Link: https://leetcode.com/problems/binary-tree-level-order-traversal/

## Problem

Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).

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
[[3], [9, 20], [15, 7]]
```

---

# Example 2

Input: `root = [1]`

Output: `[[1]]`

---

# Example 3

Input: `root = []`

Output: `[]`

---

# Easy Explanation

Unlike DFS (which dives deep down one branch first), **level order traversal** visits all nodes at depth `0`, then all nodes at depth `1`, then depth `2`, and so on.

That is **Breadth-First Search (BFS)**, and BFS always uses a **Queue** (`collections.deque`).

---

# The Main Idea: Process One Level at a Time

1. Start by putting `root` into `queue`.
2. While `queue` is not empty:
   - Check how many nodes are currently in `queue`: `len(queue)`. That exact count is the number of nodes in the **current level**!
   - Loop `len(queue)` times:
     - Pop a node from the left (`queue.popleft()`).
     - Add `node.val` to `level_values`.
     - If `node.left` exists, append it to `queue`.
     - If `node.right` exists, append it to `queue`.
   - Append `level_values` to `result`.

Because we snapshot `range(len(queue))` at the start of each level, newly added children won't be processed until the **next** iteration!

---

# Algorithm

1. If `root` is `None`, return `[]`.
2. Initialize `result = []` and a `deque` `queue` containing `root`.
3. While `queue` is not empty:
   - Initialize `level_values = []`.
   - Loop `len(queue)` times:
     - Pop `node = queue.popleft()` and append `node.val` to `level_values`.
     - If `node.left` exists, append `node.left` to `queue`.
     - If `node.right` exists, append `node.right` to `queue`.
   - Append `level_values` to `result`.
4. Return `result`.

```text
function levelOrder(root)
    if root is None return []
    result = []
    queue = deque([root])

    while queue not empty
        level_values = []
        for i in 0 .. length(queue) - 1
            node = queue.popleft()
            level_values.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level_values)

    return result
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

Initially: `queue = [3]`, `result = []`.

### Level 0 (`len(queue) = 1`)
- Pop `3`, `level_values = [3]`.
- Push children `9` and `20`.
- `result = [[3]]`, `queue = [9, 20]`.

### Level 1 (`len(queue) = 2`)
- Pop `9` -> `level_values = [9]` (no children).
- Pop `20` -> `level_values = [9, 20]`, push `15` and `7`.
- `result = [[3], [9, 20]]`, `queue = [15, 7]`.

### Level 2 (`len(queue) = 2`)
- Pop `15`, pop `7` -> `level_values = [15, 7]`.
- `result = [[3], [9, 20], [15, 7]]`, `queue = []`.

Queue is empty -> return `[[3], [9, 20], [15, 7]]`.

---

# Understanding the Code

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        if root is None:
            return []

        result = []
        queue = deque()
        queue.append(root)

        while queue:
            level_values = []

            for i in range(len(queue)):
                node = queue.popleft()
                level_values.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(level_values)

        return result
```

---

# Time Complexity

Every node is enqueued once and dequeued once, with `O(1)` work per node.

```text
Time Complexity: O(n)
```

---

# Space Complexity

In the worst case (a full binary tree), the bottom level holds up to `n / 2` nodes in the queue at once.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
Push root to deque
  ↓
While queue is not empty:
  Loop len(queue) times (one full level)
    ↓
    Pop left, record value, push left & right children
```

> **Use `for _ in range(len(queue))` inside a BFS `while queue:` loop to group nodes cleanly by level.**
