---
title: "Combination Sum II"
date: "2026-11-24"
excerpt: "Find all unique combinations that sum to target where each candidate can be used at most once, using sorting and duplicate-skipping backtracking."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Combination Sum II

Problem Link: https://leetcode.com/problems/combination-sum-ii/

## Problem

Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all **unique combinations** in `candidates` where the candidate numbers sum to `target`.

Each number in `candidates` may only be used **once** in the combination.

Note: The solution set **must not** contain duplicate combinations.

---

# Example 1

Input: `candidates = [10, 1, 2, 7, 6, 1, 5], target = 8`

Output:

```text
[
  [1, 1, 6],
  [1, 2, 5],
  [1, 7],
  [2, 6]
]
```

---

# Example 2

Input: `candidates = [2, 5, 2, 1, 2], target = 5`

Output: `[[1, 2, 2], [5]]`

---

# Easy Explanation

Two things make **Combination Sum II** different from **Combination Sum**:

1. **Each element can be used at most once** — so when we pick `candidates[i]`, we move to `dfs(i + 1)` instead of staying on `i`.
2. **`candidates` can contain duplicate numbers** (like `[1, 1, 2, ...]`) — so if we skip `candidates[i]`, we must skip **all** consecutive copies of `candidates[i]`!

Why? Because if you skip the first `1` and later pick the second `1`, you would generate the exact same combinations as picking the first `1` and skipping the second `1`. Sorting `candidates` first puts all duplicates next to each other so a simple `while` loop skips them cleanly!

---

# Decision Tree

For `candidates = [1, 1, 2], target = 3` (after sorting):

```text
                          []
               /                      \
             [1]                       []  (skip ALL 1s!)
           /     \                    /   \
       [1,1]     [1]                [2]    []
       /   \     /  \              /   \
  [1,1,2] [1,1] [1,2] [1]        ...   ...
  (sum>3 X)    (HIT!)
```

Notice how the right branch from `[]` skips **both** `1`s and jumps straight to `2`, preventing a duplicate `[1, 2]`!

---

# Algorithm

1. Sort `candidates` in ascending order.
2. Initialize `result = []` and `path = []`.
3. Define `dfs(i)`:
   - If `sum(path) == target`, append `path.copy()` to `result` and return.
   - If `i == len(candidates)` or `sum(path) > target`, return.
   - **Pick** `candidates[i]`: `path.append(candidates[i])`, call `dfs(i + 1)`, then `path.pop()`.
   - **Skip all duplicates** of `candidates[i]`: `while (i + 1) < len(candidates) and candidates[i] == candidates[i + 1]: i += 1`.
   - Call `dfs(i + 1)`.
4. Call `dfs(0)` and return `result`.

```text
function combinationSum2(candidates, target)
    candidates.sort()
    result = []
    path = []

    function dfs(i)
        if sum(path) == target:
            result.append(path.copy())
            return
        if i == len(candidates) or sum(path) > target:
            return

        path.append(candidates[i])
        dfs(i + 1)
        path.pop()

        while (i + 1) < len(candidates) and candidates[i] == candidates[i + 1]:
            i += 1
        dfs(i + 1)

    dfs(0)
    return result
```

---

# Step-by-Step Dry Run

Suppose `candidates = [1, 1, 2], target = 3`:

1. `dfs(0)` (`candidates[0] = 1`):
   - Pick `1` → `path = [1]`, `dfs(1)`:
     - Pick `1` → `path = [1, 1]`, `dfs(2)`:
       - Pick `2` → `path = [1, 1, 2]` (`sum = 4 > 3`, return).
       - Skip `2` → `dfs(3)` (`i == 3`, return).
     - Pop second `1` → `path = [1]`, skip duplicates of `candidates[1]` (none), call `dfs(2)`:
       - Pick `2` → `path = [1, 2]` (`sum = 3 == target` → save `[1, 2]`!).
   - Pop first `1` → `path = []`.
   - `while` skips index `0 -> 1` because `candidates[0] == candidates[1] == 1`.
   - Calls `dfs(2)` (`candidates[2] = 2`) → `[2]` (`sum = 2 != 3`, return).

Result: `[[1, 2]]`.

---

# Understanding the Code

```python
class Solution:
    def combinationSum2(self, candidates: list[int], target: int) -> list[list[int]]:
        result = []
        path = []

        candidates.sort()

        def dfs(i: int):
            if sum(path) == target:
                result.append(path.copy())
                return

            if i == len(candidates) or sum(path) > target:
                return

            path.append(candidates[i])
            dfs(i + 1)
            path.pop()

            while (i + 1) < len(candidates) and (candidates[i] == candidates[i + 1]):
                i += 1

            dfs(i + 1)

        dfs(0)
        return result
```

---

# Time Complexity

In the worst case, we explore up to `2^n` subsets, and copying/summing takes `O(n)`.

```text
Time Complexity: O(n * 2^n)
```

---

# Space Complexity

`O(n)` auxiliary space for the recursion stack and `path`.

---

# The Pattern to Remember

```text
Sort array -> Pick (dfs(i + 1)) -> Pop -> Skip duplicates with while loop -> dfs(i + 1)
```

> **Sort first, then skip consecutive equal elements on the exclude branch to avoid duplicate combinations.**
