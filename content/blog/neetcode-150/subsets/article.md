---
title: "Subsets"
date: "2026-11-24"
excerpt: "Generate all possible subsets (the power set) of a list of unique integers using include/exclude backtracking."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Subsets

Problem Link: https://leetcode.com/problems/subsets/

## Problem

Given an integer array `nums` of **unique** elements, return all possible subsets (the power set).

The solution set **must not** contain duplicate subsets. Return the solution in any order.

---

# Example 1

Input: `nums = [1, 2, 3]`

Output: `[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]`

---

# Example 2

Input: `nums = [0]`

Output: `[[], [0]]`

---

# Easy Explanation

For every element `nums[i]`, you have exactly **two choices**:

1. **Include** `nums[i]` in the current subset `path`.
2. **Exclude** `nums[i]` from the current subset `path`.

With `n` elements and `2` choices per element, there are `2^n` total subsets.

When our index `i` reaches the end (`i >= len(nums)`), we have made a decision for every element, so we save a copy of `path` (`path.copy()`) into `result`!

---

# Decision Tree

For `nums = [1, 2, 3]`, every branch chooses whether to **include** or **exclude** the current number:

```tree
[]
  [1] | +1
    [1,2] | +2
      [1,2,3] !hit
      [1,2] !hit
    [1] | skip 2
      [1,3] !hit
      [1] !hit
  [] | skip 1
    [2] | +2
      [2,3] !hit
      [2] !hit
    [] | skip 2
      [3] !hit
      [] !hit
```

Every leaf at the bottom gives one unique subset!

---

# Algorithm

1. Initialize `result = []` and `path = []`.
2. Define `dfs(i)`:
   - If `i >= len(nums)`, append `path.copy()` to `result` and return.
   - **Include** `nums[i]`: `path.append(nums[i])`, then call `dfs(i + 1)`.
   - **Exclude** `nums[i]`: `path.pop()`, then call `dfs(i + 1)`.
3. Call `dfs(0)` and return `result`.

```text
function subsets(nums)
    result = []
    path = []

    function dfs(i)
        if i >= len(nums)
            result.append(path.copy())
            return

        path.append(nums[i])
        dfs(i + 1)

        path.pop()
        dfs(i + 1)

    dfs(0)
    return result
```

---

# Step-by-Step Dry Run

Suppose `nums = [1, 2]`:

1. `dfs(0)`:
   - Include `1` → `path = [1]`, call `dfs(1)`:
     - Include `2` → `path = [1, 2]`, `dfs(2)` → save `[1, 2]`.
     - Pop `2` → `path = [1]`, `dfs(2)` → save `[1]`.
   - Pop `1` → `path = []`, call `dfs(1)`:
     - Include `2` → `path = [2]`, `dfs(2)` → save `[2]`.
     - Pop `2` → `path = []`, `dfs(2)` → save `[]`.

Result: `[[1, 2], [1], [2], []]`.

---

# Understanding the Code

```python
class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []

        def dfs(i: int):
            if i >= len(nums):
                result.append(path.copy())
                return

            path.append(nums[i])
            dfs(i + 1)

            path.pop()
            dfs(i + 1)

        dfs(0)
        return result
```

Note: `path.copy()` is essential because `path` is mutated in-place during backtracking—without copying, `result` would end up containing references to the same empty list!

---

# Time Complexity

There are `2^n` subsets, and copying each subset takes up to `O(n)`.

```text
Time Complexity: O(n * 2^n)
```

---

# Space Complexity

- Recursion stack + `path`: `O(n)` auxiliary space.
- Output list `result`: `O(n * 2^n)`.

---

# The Pattern to Remember

```text
Choose (append) -> Explore dfs(i + 1) -> Unchoose (pop) -> Explore dfs(i + 1)
```

> **Every subset is just a sequence of Include / Exclude decisions.**
