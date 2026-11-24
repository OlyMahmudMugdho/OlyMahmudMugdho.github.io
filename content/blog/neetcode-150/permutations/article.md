---
title: "Permutations"
date: "2026-11-24"
excerpt: "Generate all possible permutations of an array of distinct integers using backtracking."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Permutations

Problem Link: https://leetcode.com/problems/permutations/

## Problem

Given an array `nums` of distinct integers, return all the possible **permutations**. You can return the answer in any order.

---

# Example 1

Input: `nums = [1, 2, 3]`

Output: `[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]`

---

# Example 2

Input: `nums = [0, 1]`

Output: `[[0, 1], [1, 0]]`

---

# Easy Explanation

Unlike subsets (where order does not matter), in **permutations**, **order matters** (`[1, 2]` and `[2, 1]` are different), and every permutation uses **all** elements of `nums`!

So at each step of building `path`:
- Look through every `num` in `nums`.
- If `num` is **not already in `path`**, pick it (`path.append(num)`), recurse `dfs()`, and then undo the choice (`path.pop()`).
- As soon as `len(path) == len(nums)`, we have a complete permutation, so we save `path.copy()`!

---

# Decision Tree

For `nums = [1, 2, 3]`, each level picks one unused element from `nums`:

```text
                          []
            /             |             \
          [1]            [2]            [3]
         /   \          /   \          /   \
     [1,2]  [1,3]   [2,1]  [2,3]   [3,1]  [3,2]
       |      |       |      |       |      |
   [1,2,3][1,3,2] [2,1,3][2,3,1] [3,1,2][3,2,1]
```

Every leaf at depth `3` is one complete permutation!

---

# Algorithm

1. Initialize `result = []` and `path = []`.
2. Define `dfs()`:
   - If `len(nums) == len(path)`, append `path.copy()` to `result` and return.
   - For each `num` in `nums`:
     - If `num not in path`:
       - `path.append(num)`
       - `dfs()`
       - `path.pop()`
3. Call `dfs()` and return `result`.

```text
function permute(nums)
    result = []
    path = []

    function dfs()
        if len(nums) == len(path)
            result.append(path.copy())
            return

        for num in nums
            if num not in path
                path.append(num)
                dfs()
                path.pop()

    dfs()
    return result
```

---

# Step-by-Step Dry Run

Suppose `nums = [1, 2]`:

1. `dfs()` with `path = []`:
   - Pick `1` → `path = [1]`, call `dfs()`:
     - `1` is in `path` (skip).
     - Pick `2` → `path = [1, 2]`, `dfs()` → `len == 2`, save `[1, 2]`.
     - Pop `2`.
   - Pop `1`.
   - Pick `2` → `path = [2]`, call `dfs()`:
     - Pick `1` → `path = [2, 1]`, `dfs()` → `len == 2`, save `[2, 1]`.
     - Pop `1`.
   - Pop `2`.

Result: `[[1, 2], [2, 1]]`.

---

# Understanding the Code

```python
class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []
        path = []

        def dfs():
            if len(nums) == len(path):
                result.append(path.copy())
                return

            for num in nums:
                if num not in path:
                    path.append(num)
                    dfs()
                    path.pop()

        dfs()
        return result
```

---

# Time Complexity

There are `n!` permutations, and each permutation checks `O(n)` candidates per level.

```text
Time Complexity: O(n * n!)
```

---

# Space Complexity

- Recursion stack + `path`: `O(n)` auxiliary space.
- Output `result`: `O(n * n!)`.

---

# The Pattern to Remember

```text
For every unused num in nums:
  path.append(num) -> dfs() -> path.pop()
```

> **In permutations, iterate over all elements at every level and skip the ones already in `path`.**
