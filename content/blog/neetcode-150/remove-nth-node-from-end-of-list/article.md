---
title: "Remove Nth Node From End of List"
date: "2026-11-20"
excerpt: "Remove the nth node from the end of a singly linked list by computing the total length and stepping to length - n."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Remove Nth Node From End of List

Problem Link: https://leetcode.com/problems/remove-nth-node-from-end-of-list/

## Problem

Given the `head` of a linked list, remove the `n`-th node from the **end** of the list and return its head.

---

# Example 1

Input:

```text
head = [1, 2, 3, 4, 5], n = 2
```

Output:

```text
[1, 2, 3, 5]
```

The 2nd node from the end is `4`, so we remove `4`.

---

# Example 2

Input:

```text
head = [1], n = 1
```

Output:

```text
[]
```

---

# Example 3

Input:

```text
head = [1, 2], n = 1
```

Output:

```text
[1]
```

---

# Easy Explanation

In a singly linked list, we can't count backward from the tail.

So how do we know which node is `n`-th from the end?

If the total length of the list is `length`, then the `n`-th node from the end is at index:

```text
toRemove = length - n
```

(using 0-based indexing from the head).

To delete a node at index `toRemove`:

- **Special case (`toRemove == 0`):** We are removing the `head` itself, so we simply return `head.next`!
- **General case:** Walk to the node **just before** it (at index `toRemove - 1`) and skip over the target node:
  ```python
  temp.next = temp.next.next
  ```

---

# Algorithm

1. If `head` is `None`, return `None`.
2. Traverse the list to count its `length`.
3. Compute `toRemove = length - n`.
4. If `toRemove == 0`, return `head.next`.
5. Walk `temp` from `head` for `toRemove - 1` steps to stop right before the target node.
6. Set `temp.next = temp.next.next` and return `head`.

```text
function removeNthFromEnd(head, n)
    if head is None return None
    length = count nodes in head
    toRemove = length - n

    if toRemove == 0
        return head.next

    temp = head
    repeat (toRemove - 1) times
        temp = temp.next

    temp.next = temp.next.next
    return head
```

---

# Step-by-Step Dry Run

Suppose:

```text
head = [1, 2, 3, 4, 5], n = 2
```

### Pass 1: Find `length`

Walk from `1` to `5` -> `length = 5`.

### Compute `toRemove`

```text
toRemove = 5 - 2 = 3
```

Index `3` is node `4` (`0->1, 1->2, 2->3, 3->4, 4->5`).

### Pass 2: Stop at `toRemove - 1 = 2`

Start `temp = head` (index `0`), advance `2` times:
- `i = 0` -> `temp` moves to `2`
- `i = 1` -> `temp` moves to `3` (index `2`)

Now `temp` is at node `3`, and `temp.next` is node `4`.

Set:

```python
temp.next = temp.next.next
```

So `3` now points directly to `5`, bypassing `4`!

Result: `[1, 2, 3, 5]`.

---

# Understanding the Code

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def removeNthFromEnd(self, head: ListNode | None, n: int) -> ListNode | None:
        if head is None:
            return None

        lastNode = head
        length = 0

        while lastNode:
            lastNode = lastNode.next
            length += 1

        if length == 1 and n == 1:
            return None

        toRemove = length - n

        if toRemove == 0:
            head = head.next
            return head

        temp = head
        i = 0

        while i < toRemove - 1:
            temp = temp.next
            i += 1

        temp.next = temp.next.next

        return head
```

---

# Time Complexity

We make at most two passes through the list: one to find `length` and one to reach `toRemove - 1`.

```text
Time Complexity: O(n)
```

---

# Space Complexity

We only use a few pointer and integer variables.

```text
Space Complexity: O(1)
```

---

# The Pattern to Remember

```text
Pass 1: Count total length
  ↓
toRemove = length - n
  ↓
If toRemove == 0: return head.next
Else: walk to (toRemove - 1) and set temp.next = temp.next.next
```

> **To remove a node in a singly linked list, always stop at the node right before it (`toRemove - 1`).**
