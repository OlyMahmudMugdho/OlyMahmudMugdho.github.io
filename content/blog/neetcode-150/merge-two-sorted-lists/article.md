---
title: "Merge Two Sorted Lists"
date: "2026-11-20"
excerpt: "Merge two sorted singly linked lists into one sorted list by comparing node values one by one."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Merge Two Sorted Lists

Problem Link: https://leetcode.com/problems/merge-two-sorted-lists/

## Problem

You are given the heads of two sorted linked lists `list1` and `list2`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists (or building the sorted sequence).

Return the head of the merged linked list.

---

# Example 1

Input:

```text
list1 = [1, 2, 4]
list2 = [1, 3, 4]
```

Output:

```text
[1, 1, 2, 3, 4, 4]
```

---

# Example 2

Input:

```text
list1 = []
list2 = []
```

Output:

```text
[]
```

---

# Easy Explanation

Because both `list1` and `list2` are **already sorted**, the smallest remaining value must be either at the front of `list1` (`left.val`) or at the front of `list2` (`right.val`).

So we can use two pointers (`left` and `right`):

1. Compare `left.val` and `right.val`.
2. Pick the smaller one and advance that pointer.
3. Once one list runs out, append all remaining values from the other list.

---

# Algorithm

1. Initialize an empty list `nums`, `left = list1`, and `right = list2`.
2. While both `left` and `right` are not `None`:
   - Append the smaller of `left.val` and `right.val` to `nums`, and advance that pointer.
3. Append any remaining values from `left`, then any remaining values from `right`.
4. If `nums` is empty, return `None`.
5. Build and return a new linked list from `nums`.

```text
function mergeTwoLists(list1, list2)
    nums = []
    left = list1, right = list2

    while left != None and right != None
        if left.val < right.val
            nums.append(left.val); left = left.next
        else
            nums.append(right.val); right = right.next

    append remaining nodes from left and right into nums
    if nums is empty return None
    return linked list built from nums
```

---

# Step-by-Step Dry Run

Suppose:

```text
list1: 1 -> 2 -> 4
list2: 1 -> 3 -> 4
```

1. `left = 1`, `right = 1` -> `1 < 1` is false -> take `1` from `right`. `nums = [1]`, `right = 3`.
2. `left = 1`, `right = 3` -> `1 < 3` -> take `1` from `left`. `nums = [1, 1]`, `left = 2`.
3. `left = 2`, `right = 3` -> `2 < 3` -> take `2` from `left`. `nums = [1, 1, 2]`, `left = 4`.
4. `left = 4`, `right = 3` -> `4 < 3` is false -> take `3` from `right`. `nums = [1, 1, 2, 3]`, `right = 4`.
5. `left = 4`, `right = 4` -> take `4` from `right`. `nums = [1, 1, 2, 3, 4]`, `right = None`.
6. `right` is `None`, so append remaining `left` (`4`) -> `nums = [1, 1, 2, 3, 4, 4]`.

Then build the linked list from `nums` and return `result`.

---

# Understanding the Code

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        nums = []

        left = list1
        right = list2

        while (left is not None) and (right is not None):
            if left.val < right.val:
                nums.append(left.val)
                left = left.next
            else:
                nums.append(right.val)
                right = right.next

        while left is not None:
            nums.append(left.val)
            left = left.next

        while right is not None:
            nums.append(right.val)
            right = right.next

        if len(nums) == 0:
            return None

        result = ListNode(nums[0], None)
        current = result

        i = 1
        while i < len(nums):
            current.next = ListNode(nums[i], None)
            current = current.next
            i += 1

        return result
```

---

# Alternative `O(1)` Space Approach (Dummy Node)

You can also link the existing `ListNode` objects directly using a dummy node, avoiding the `nums` array:

```python
class Solution:
    def mergeTwoLists(self, list1: ListNode | None, list2: ListNode | None) -> ListNode | None:
        dummy = ListNode()
        tail = dummy

        while list1 and list2:
            if list1.val < list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next

        tail.next = list1 or list2
        return dummy.next
```

---

# Time Complexity

Let `m` and `n` be the lengths of `list1` and `list2`. Each node is visited once.

```text
Time Complexity: O(m + n)
```

---

# Space Complexity

- **Array-based solution:** `O(m + n)` for `nums` and new nodes.
- **Dummy-node in-place merge:** `O(1)` extra space.

---

# The Pattern to Remember

```text
Compare list1.val and list2.val
  ↓
Pick the smaller node and advance its pointer
  ↓
Attach whatever remains of the non-empty list
```

> **Merging two sorted linked lists uses the exact same two-pointer merge step as Merge Sort.**
