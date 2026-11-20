---
title: "Reorder List"
date: "2026-11-20"
excerpt: "Reorder a linked list from L0 -> L1 -> ... -> Ln to L0 -> Ln -> L1 -> Ln-1 using two pointers on an array of values."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Reorder List

Problem Link: https://leetcode.com/problems/reorder-list/

## Problem

You are given the head of a singly linked list:

```text
L0 -> L1 -> ... -> Ln-1 -> Ln
```

Reorder the list to be in the following form:

```text
L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ...
```

You must modify the list **in-place** (do not return anything).

---

# Example 1

Input:

```text
head = [1, 2, 3, 4]
```

Output:

```text
[1, 4, 2, 3]
```

---

# Example 2

Input:

```text
head = [1, 2, 3, 4, 5]
```

Output:

```text
[1, 5, 2, 4, 3]
```

---

# Easy Explanation

Look at the pattern of the reordered list:

- First element (`p1 = 0`)
- Last element (`p2 = n - 1`)
- Second element (`p1 = 1`)
- Second-to-last element (`p2 = n - 2`)
- ...and so on!

In a singly linked list, you cannot easily jump to the end or move backward.

So a very clean way to solve this is:

1. Store all node values in an array `num_arrays`.
2. Use two pointers `p1 = 0` (start) and `p2 = n - 1` (end).
3. Walk `temp` through the linked list and alternate writing `num_arrays[p1]` and `num_arrays[p2]`.

---

# Algorithm

1. Traverse the linked list and store all node values in `num_arrays`.
2. Initialize two pointers `p1 = 0`, `p2 = len(num_arrays) - 1`, and `temp = head`.
3. While `p1 <= p2`:
   - Set `temp.val = num_arrays[p1]` and advance `temp = temp.next`; if `temp` is `None`, return.
   - Set `temp.val = num_arrays[p2]` and advance `temp = temp.next`; if `temp` is `None`, return.
   - Increment `p1 += 1` and decrement `p2 -= 1`.

```text
function reorderList(head)
    num_arrays = values from head
    p1 = 0, p2 = length(num_arrays) - 1
    temp = head

    while p1 <= p2
        temp.val = num_arrays[p1]; temp = temp.next
        if temp is None return
        temp.val = num_arrays[p2]; temp = temp.next
        if temp is None return
        p1 += 1; p2 -= 1
```

---

# Step-by-Step Dry Run

Suppose:

```text
head = [1, 2, 3, 4, 5]
```

### Pass 1: Collect Values

```text
num_arrays = [1, 2, 3, 4, 5]
p1 = 0, p2 = 4, temp = head
```

### Pass 2: Overwrite Values Alternatingly

1. `p1 = 0, p2 = 4`:
   - `temp.val = num_arrays[0] = 1`, `temp` moves to node 2.
   - `temp.val = num_arrays[4] = 5`, `temp` moves to node 3.
   - `p1 = 1, p2 = 3`.
2. `p1 = 1, p2 = 3`:
   - `temp.val = num_arrays[1] = 2`, `temp` moves to node 4.
   - `temp.val = num_arrays[3] = 4`, `temp` moves to node 5.
   - `p1 = 2, p2 = 2`.
3. `p1 = 2, p2 = 2`:
   - `temp.val = num_arrays[2] = 3`, `temp` moves to `None`.
   - `if not temp: return` stops cleanly!

Final list: `1 -> 5 -> 2 -> 4 -> 3`.

---

# Understanding the Code

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reorderList(self, head: ListNode | None) -> None:
        """
        Do not return anything, modify head in-place instead.
        """
        num_arrays = []
        current = head

        while current:
            num_arrays.append(current.val)
            current = current.next

        n = len(num_arrays)
        p1 = 0
        p2 = n - 1

        temp = head

        while p1 <= p2:
            temp.val = num_arrays[p1]
            temp = temp.next
            if not temp:
                return
            temp.val = num_arrays[p2]
            temp = temp.next
            if not temp:
                return

            p1 += 1
            p2 -= 1
```

Note: The `if not temp: return` checks handle both odd-length lists (where the middle node is written once) and the end of even-length lists!

---

# Time Complexity

We traverse the linked list twice: once to read values and once to write them back.

```text
Time Complexity: O(n)
```

---

# Space Complexity

`num_arrays` stores `n` values.

```text
Space Complexity: O(n)
```

(Note: An `O(1)` space approach also exists by finding the middle with slow/fast pointers, reversing the second half, and merging the two halves.)

---

# The Pattern to Remember

```text
Collect values into array
  ↓
Two pointers: p1 = 0, p2 = n - 1
  ↓
Alternate writing arr[p1] and arr[p2] back into the list
```

> **Two pointers from opposite ends (`p1`, `p2`) give the exact `L0, Ln, L1, Ln-1, ...` interleaving order.**
