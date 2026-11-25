---
title: "Binary Tree Right Side View"
date: "2026-11-20"
excerpt: "Return the values of the nodes visible from the right side of a binary tree by taking the last node of each level using BFS."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Binary Tree Right Side View

Problem Link: https://leetcode.com/problems/binary-tree-right-side-view/

## Problem

Given the `root` of a binary tree, imagine yourself standing on the **right side** of it.

Return the values of the nodes you can see ordered from **top to bottom**.

---

# Example 1

```tree
1 : seen !hit
  2
    _ !ghost
    5
  3 : seen !hit
    _ !ghost
    4 : seen !hit
```

Output:

```text
[1, 3, 4]
```

---

# Example 2

```tree
1 : seen !hit
  2
    4 : seen !hit
    _ !ghost
  3 : seen !hit
```

Output:

```text
[1, 3, 4]
```

Notice that at the bottom level, node `4` is on the left subtree, yet it is still visible from the right side because there is no node to its right on that level!

---

# Easy Explanation

If you stand on the right side of the tree and look at each level from top to bottom, which node do you see at each level?

> **The rightmost node of that level!**

And if we traverse the tree **level by level from left to right** using **Breadth-First Search (BFS)** with a queue, every level sits in `queue` before we expand it—so the rightmost node of the current level is simply the **last element in `queue`** (`level[-1].val`)!

---

# Algorithm

1. If `root` is `None`, return `[]`.
2. Initialize `queue = deque([root])` and `result = []`.
3. While `queue` is not empty:
   - Append the last node's value in the current level (`queue[-1].val`) to `result`.
   - Loop `len(queue)` times:
     - Pop `node = queue.popleft()`.
     - If `node.left` exists, append `node.left` to `queue`.
     - If `node.right` exists, append `node.right` to `queue`.
4. Return `result`.

```text
function rightSideView(root)
    if root is None return []
    queue = deque([root])
    result = []

    while queue not empty
        result.append(queue[-1].val)
        for _ in range(len(queue))
            node = queue.popleft()
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)

    return result
```

---

# Step-by-Step Dry Run

Using Example 1:

```tree
1 !hit
  2
    _ !ghost
    5
  3 !hit
    _ !ghost
    4 !hit
```

Initially: `queue = [1]`, `result = []`.

### Level 0 (`queue = [1]`)
- Rightmost node is `queue[-1] = 1` → `result = [1]`.
- Pop `1`, enqueue `2` and `3`.

### Level 1 (`queue = [2, 3]`)
- Rightmost node is `queue[-1] = 3` → `result = [1, 3]`.
- Pop `2` (enqueue `5`), pop `3` (enqueue `4`).

### Level 2 (`queue = [5, 4]`)
- Rightmost node is `queue[-1] = 4` → `result = [1, 3, 4]`.
- Pop `5` and `4` (no children).

Queue is empty → return `[1, 3, 4]`.

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
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        if root is None:
            return []

        queue = deque()
        queue.append(root)

        result = []

        while queue:
            level = queue

            result.append(level[-1].val)

            for _ in range(len(level)):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

        return result
```

---

# Time Complexity

Every node is enqueued and dequeued once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

In the worst case, the queue holds up to one full level (`O(n)` nodes).

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
Run BFS level by level
  ↓
At the start of each level, take queue[-1].val
  ↓
Expand all nodes in the current level
```

> **The right side view of a binary tree is just the last node (`queue[-1]`) of each BFS level.**
