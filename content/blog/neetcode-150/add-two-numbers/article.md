---
title: "Add Two Numbers"
date: "2026-11-20"
excerpt: "Add two numbers represented in reverse order by linked lists by reconstructing the integers, summing them, and building the result list."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Add Two Numbers

Problem Link: https://leetcode.com/problems/add-two-numbers/

## Problem

You are given two non-empty linked lists representing two non-negative integers.

The digits are stored in **reverse order**, and each of their nodes contains a single digit.

Add the two numbers and return the sum as a linked list (also in reverse order).

---

# Example 1

Input:

```text
l1 = [2, 4, 3]
l2 = [5, 6, 4]
```

Output:

```text
[7, 0, 8]
```

Explanation:

`342 + 465 = 807`, which in reverse order is `[7, 0, 8]`.

---

# Example 2

Input:

```text
l1 = [0]
l2 = [0]
```

Output:

```text
[0]
```

---

# Easy Explanation

Because the digits are stored in **reverse order**, the first node is the `1`s place, the second node is the `10`s place, the third node is the `100`s place, and so on!

So we can:

1. Convert `l1` into an integer `num1` using a place-value multiplier (`1, 10, 100, ...`).
2. Convert `l2` into an integer `num2` the same way.
3. Add them: `total = num1 + num2`.
4. Extract each digit of `total` using `% 10` and `// 10` (which naturally gives the digits in reverse order!) and build the resulting linked list.

---

# Algorithm

1. Convert `l1` into integer `num1` using multiplier `mul1 = 1, 10, 100, ...`.
2. Convert `l2` into integer `num2` using multiplier `mul2 = 1, 10, 100, ...`.
3. Compute `total = num1 + num2`. If `total == 0`, return `ListNode(0)`.
4. Repeatedly extract `total % 10` and divide `total //= 10` into `result`.
5. Build a new linked list from `result` using a dummy node and return `temp.next`.

```text
function addTwoNumbers(l1, l2)
    num1 = integer from l1 (place values 1, 10, 100...)
    num2 = integer from l2 (place values 1, 10, 100...)
    total = num1 + num2

    if total == 0 return ListNode(0)

    result = digits of total in reverse (total % 10, total //= 10)
    return linked list built from result
```

---

# Step-by-Step Dry Run

Suppose:

```text
l1 = [2, 4, 3]
l2 = [5, 6, 4]
```

### Step 1: Convert `l1` to `num1`

- `2 * 1 = 2` (`mul1 = 10`)
- `4 * 10 = 40` -> `num1 = 42` (`mul1 = 100`)
- `3 * 100 = 300` -> `num1 = 342`

### Step 2: Convert `l2` to `num2`

- `5 * 1 + 6 * 10 + 4 * 100 = 465`

### Step 3: Add & Extract Digits

```text
total = 342 + 465 = 807
```

- `807 % 10 = 7` -> `807 // 10 = 80`
- `80 % 10 = 0` -> `80 // 10 = 8`
- `8 % 10 = 8` -> `8 // 10 = 0`

`result = [7, 0, 8]` -> linked list `7 -> 0 -> 8`.

---

# Understanding the Code

```python
# Definition for singly-linked list.
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: ListNode | None, l2: ListNode | None) -> ListNode | None:
        num1 = 0
        num2 = 0

        mul1 = 1
        while l1:
            num1 += (mul1 * l1.val)
            mul1 *= 10
            l1 = l1.next

        mul2 = 1
        while l2:
            num2 += (mul2 * l2.val)
            mul2 *= 10
            l2 = l2.next

        total = num1 + num2

        if total == 0:
            return ListNode(0)

        result = []
        while total != 0:
            digit = total % 10
            result.append(digit)
            total = total // 10

        sumList = ListNode(-1)
        temp = sumList

        for num in result:
            sumList.next = ListNode(num)
            sumList = sumList.next

        return temp.next
```

*(Note: Python supports arbitrarily large integers, so `num1 + num2` works even for 100-digit lists! In languages with fixed 64-bit integers, you would add digit-by-digit with a `carry` variable instead.)*

---

# Time Complexity

Let `m` and `n` be the lengths of `l1` and `l2`.

```text
Time Complexity: O(max(m, n))
```

---

# Space Complexity

`result` and the new linked list store at most `max(m, n) + 1` digits.

```text
Space Complexity: O(max(m, n))
```

---

# The Pattern to Remember

```text
Walk l1 and l2 with place multiplier (1, 10, 100...)
  ↓
Sum num1 + num2
  ↓
Extract digits with (% 10) and (// 10) into a dummy-headed linked list
```

> **Reverse-order digits align directly with `1, 10, 100...` place values and `% 10` digit extraction.**
