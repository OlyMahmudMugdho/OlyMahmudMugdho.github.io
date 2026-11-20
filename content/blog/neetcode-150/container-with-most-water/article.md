---
title: "Container With Most Water"
date: "2026-11-20"
excerpt: "Find two vertical lines that together with the x-axis form a container holding the most water using the two-pointer technique."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Container With Most Water

Problem Link: https://leetcode.com/problems/container-with-most-water/

## Problem

You are given an integer array `height` of length `n`.

There are `n` vertical lines drawn such that the two endpoints of the `i`-th line are `(i, 0)` and `(i, height[i])`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.

---

# Example 1

Input:

```text
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
```

Output:

```text
49
```

Explanation:

The lines at index `1` (height `8`) and index `8` (height `7`) form a container with:

- Width = `8 - 1 = 7`
- Height = `min(8, 7) = 7`
- Area = `7 * 7 = 49`

---

# Example 2

Input:

```text
height = [1, 1]
```

Output:

```text
1
```

Width is `1`, height is `1`, so area is `1`.

---

# Easy Explanation

For any two lines at indices `left` and `right`:

- The **width** is `right - left`.
- The **water height** is limited by the shorter line: `min(height[left], height[right])`.

So the area is:

```text
area = min(height[left], height[right]) * (right - left)
```

A brute-force approach checks every pair `(left, right)`, which takes `O(n^2)` time.

We can solve this in `O(n)` time using **two pointers**.

---

# The Main Idea

Start with the widest possible container:

```python
left = 0
right = len(height) - 1
```

At each step, compute the area and update `max_container`.

Then, which pointer should we move inward?

---

# The Most Important Trick: Always Move the Shorter Line

Suppose `height[left] < height[right]`.

Moving `right` inward decreases the width, and the height **cannot** exceed `height[left]` (because `height[left]` is already the bottleneck). So moving `right` can never give a larger area.

The only way to possibly find a larger area with a smaller width is to find a **taller** line on the shorter side.

Therefore:

- If `height[left] < height[right]`, move `left += 1`.
- Otherwise, move `right -= 1`.

---

# Algorithm

1. Initialize `left = 0`, `right = len(height) - 1`, and `max_container = 0`.
2. While `left < right`:
   - `container_h = min(height[left], height[right])`
   - `container_w = right - left`
   - `area = container_h * container_w`
   - `max_container = max(area, max_container)`
   - If `height[left] < height[right]`, increment `left += 1`; otherwise, decrement `right -= 1`.
3. Return `max_container`.

```text
function maxArea(height)
    left = 0
    right = length(height) - 1
    max_container = 0

    while left < right
        area = min(height[left], height[right]) * (right - left)
        max_container = max(max_container, area)

        if height[left] < height[right]
            left += 1
        else
            right -= 1

    return max_container
```

---

# Step-by-Step Dry Run

Suppose:

```text
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
```

Initially:

```text
left = 0, right = 8, max_container = 0
```

### Step 1: `left = 0 (1)`, `right = 8 (7)`

- `container_h = min(1, 7) = 1`
- `container_w = 8 - 0 = 8`
- `area = 1 * 8 = 8` -> `max_container = 8`
- `1 < 7`, so `left` moves to `1`.

### Step 2: `left = 1 (8)`, `right = 8 (7)`

- `container_h = min(8, 7) = 7`
- `container_w = 8 - 1 = 7`
- `area = 7 * 7 = 49` -> `max_container = 49`
- `8 > 7`, so `right` moves to `7`.

### Remaining Steps

As `left` and `right` continue moving inward:
- `left = 1 (8), right = 7 (3)` -> `area = 3 * 6 = 18`
- `left = 1 (8), right = 6 (8)` -> `area = 8 * 5 = 40`
- ...and so on, none exceeding `49`.

Final answer: `49`.

---

# Understanding the Code

```python
class Solution:
    def maxArea(self, height: list[int]) -> int:
        left = 0
        right = len(height) - 1

        max_container = 0

        while left <= right:
            container_h = min(height[left], height[right])
            container_w = abs(left - right)

            area = container_h * container_w

            max_container = max(area, max_container)

            if height[left] < height[right]:
                left += 1
            else:
                right -= 1

        return max_container
```

Note: Using `while left < right:` is also common because when `left == right`, the width is `0` and the area is `0`.

---

# Time Complexity

Each pointer moves inward at most `n` times, so we visit each element at most once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

We only use a few integer variables (`left`, `right`, `max_container`).

```text
Space Complexity: O(1)
```

---

# The Pattern to Remember

```text
Start pointers at both ends (maximum width)
  ↓
Compute area = min(height[left], height[right]) * (right - left)
  ↓
Update max area
  ↓
Move the pointer with the smaller height inward
```

> **Start wide and always discard the shorter wall, because keeping it with a smaller width can never improve the area.**
