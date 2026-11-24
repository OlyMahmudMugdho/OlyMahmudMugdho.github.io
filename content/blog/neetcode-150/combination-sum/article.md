---
title: "Combination Sum"
date: "2026-11-24"
excerpt: "Find all unique combinations of candidates that sum to a target when each number can be chosen unlimited times using backtracking."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Combination Sum

Problem Link: https://leetcode.com/problems/combination-sum/

## Problem

Given an array of **distinct** integers `candidates` and a target integer `target`, return a list of all **unique combinations** of `candidates` where the chosen numbers sum to `target`.

The **same** number may be chosen from `candidates` an **unlimited number of times**.

---

# Example 1

Input: `candidates = [2, 3, 6, 7], target = 7`

Output: `[[2, 2, 3], [7]]`

---

# Example 2

Input: `candidates = [2, 3, 5], target = 8`

Output: `[[2, 2, 2, 2], [2, 3, 3], [3, 5]]`

---

# Easy Explanation

This looks a lot like **Subsets**, with one twist:

> You can reuse the **same** candidate `candidates[i]` as many times as you want!

So at index `i`, our two choices are:
1. **Pick `candidates[i]`** and stay at index `i` (`dfs(i)`), so we can pick it again if we want.
2. **Skip `candidates[i]`** (pop it) and move to index `i + 1` (`dfs(i + 1)`), so we never pick `candidates[i]` again — which guarantees **no duplicate combinations** like `[2, 2, 3]` and `[2, 3, 2]`!

And we stop early if `sum(path) > target` or `i >= len(candidates)`.

---

# Decision Tree

For `candidates = [2, 3, 6, 7], target = 7`, left branches **pick** `candidates[i]` (staying on `i`) and right branches **skip** `candidates[i]` (moving to `i + 1`):

```text
                             []
                   /                    \
                 [2]                     []
              /       \                /    \
           [2,2]      [2]            [3]     ... (skip 3 -> [6], [7])
          /     \     /  \          /   \
     [2,2,2]  [2,2,3] ...       [3,3]   [3]
      /   \     (HIT!)           /  \
[2,2,2,2] ...               [3,3,3] [3,6]
(sum>7 X)                   (sum>7 X) (sum>7 X)
```

- Paths with `sum == 7` (`[2, 2, 3]` and `[7]`) are saved.
- Paths with `sum > 7` stop immediately (pruned).

---

# Algorithm

1. Initialize `result = []` and `path = []`.
2. Define `dfs(i)`:
   - If `sum(path) > target` or `i >= len(candidates)`, return.
   - If `sum(path) == target`, append `path.copy()` to `result` and return.
   - **Pick** `candidates[i]`: `path.append(candidates[i])`, call `dfs(i)`.
   - **Skip** `candidates[i]`: `path.pop()`, call `dfs(i + 1)`.
3. Call `dfs(0)` and return `result`.

```text
function combinationSum(candidates, target)
    result = []
    path = []

    function dfs(i)
        if sum(path) > target or i >= len(candidates): return
        if sum(path) == target:
            result.append(path.copy())
            return

        path.append(candidates[i])
        dfs(i)

        path.pop()
        dfs(i + 1)

    dfs(0)
    return result
```

---

# Step-by-Step Dry Run

Suppose `candidates = [2, 3, 6, 7], target = 7`:

1. Pick `2` → `2` → `2` → `2` (`sum = 8 > 7`, backtrack!).
2. Pop `2`, skip `2`, pick `3`: `[2, 2, 3]` (`sum = 7 == target` → save `[2, 2, 3]`!).
3. Backtrack further, skip `2, 3, 6`, pick `7`: `[7]` (`sum = 7 == target` → save `[7]`!).

Result: `[[2, 2, 3], [7]]`.

---

# Understanding the Code

```python
class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        path = []

        def dfs(i: int):
            if sum(path) > target or i >= len(candidates):
                return

            if sum(path) == target:
                result.append(path.copy())
                return

            path.append(candidates[i])
            dfs(i)

            path.pop()
            dfs(i + 1)

        dfs(0)
        return result
```

---

# Time Complexity

Let `T` be `target` and `M` be the minimum value in `candidates`. The recursion tree depth is at most `T / M`.

```text
Time Complexity: O(2^(T / M))
```

---

# Space Complexity

```text
Space Complexity: O(T / M)
```

for the recursion stack and `path`.

---

# The Pattern to Remember

```text
Pick candidates[i] -> dfs(i)     (unlimited reuse)
Skip candidates[i] -> dfs(i + 1) (avoid duplicates)
```

> **Staying on `i` when picking and moving to `i + 1` when skipping gives unlimited reuse without duplicate combinations.**
