---
title: "Linked List Cycle"
date: "2026-11-20"
excerpt: "Detect whether a singly linked list contains a cycle by tracking visited nodes in a hash set, plus Floyd's O(1) space slow/fast pointer method."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Linked List Cycle

Problem Link: https://leetcode.com/problems/linked-list-cycle/

## Problem

Given `head`, the head of a linked list, determine if the linked list has a **cycle** in it.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.

Return `True` if there is a cycle in the linked list. Otherwise, return `False`.

---

# Example 1

```text
3 -> 2 -> 0 -> -4
     ^          |
     |__________|
```

Output:

```text
true
```

Explanation: The tail (`-4`) connects back to the node with value `2`, forming a loop.

---

# Example 2

```text
1 -> 2 -> None
```

Output:

```text
false
```

The list ends at `None`, so there is no cycle.

---

# Easy Explanation

If a linked list has **no cycle**, walking `head = head.next` will eventually hit `None`.

If a linked list **has a cycle**, you will walk in a circle forever and visit the **exact same `ListNode` object** again!

Note: We compare **node references** (the objects themselves), not `node.val`, because two different nodes can have the same value without forming a cycle.

---

# The Main Idea

Keep a `set()` called `visited`:

1. Walk through the list while `head is not None`.
2. If `head` is already in `visited`, we found a cycle -> return `True`!
3. Otherwise, add `head` to `visited` and move to `head = head.next`.
4. If the loop reaches `None`, return `False`.

---

# Algorithm

1. Initialize an empty set `visited`.
2. While `head is not None`:
   - If `head` is in `visited`, return `True`.
   - Add `head` to `visited`.
   - Advance `head = head.next`.
3. Return `False`.

```text
function hasCycle(head)
    visited = empty set

    while head != None
        if head in visited
            return True
        add head to visited
        head = head.next

    return False
```

---

# Step-by-Step Dry Run

Suppose:

```text
nodeA(3) -> nodeB(2) -> nodeC(0) -> nodeB(2) ...
```

1. `head = nodeA`: not in `visited` -> `visited = {nodeA}`, move to `nodeB`.
2. `head = nodeB`: not in `visited` -> `visited = {nodeA, nodeB}`, move to `nodeC`.
3. `head = nodeC`: not in `visited` -> `visited = {nodeA, nodeB, nodeC}`, move to `nodeB`.
4. `head = nodeB`: `nodeB in visited` is `True`! Return `True`.

---

# Understanding the Code

```python
from typing import Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        visited = set()

        while head is not None:
            if head in visited:
                return True

            visited.add(head)
            head = head.next

        return False
```

---

# Alternative `O(1)` Space Approach (Floyd's Tortoise and Hare)

You can also detect a cycle with **two pointers** (`slow` moves 1 step, `fast` moves 2 steps) without using a set:

```python
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        slow = fast = head

        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow == fast:
                return True

        return False
```

If there is a cycle, `fast` will eventually lap `slow` and they will meet!

---

# Time Complexity

Each node is visited at most once before we either hit `None` or revisit a node.

```text
Time Complexity: O(n)
```

---

# Space Complexity

- **Hash Set solution:** `O(n)` to store visited nodes.
- **Slow/Fast pointers:** `O(1)` extra space.

---

# The Pattern to Remember

```text
Walk node by node
  ↓
If node already in visited set -> Cycle! (return True)
  ↓
If we reach None -> No cycle (return False)
```

> **Track visited node references (not values) in a set, or use fast & slow pointers for `O(1)` space.**
