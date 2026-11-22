---
title: "Climbing Stairs"
date: "2026-11-22"
excerpt: "Count the number of distinct ways to climb n stairs taking 1 or 2 steps at a time using 1D Dynamic Programming."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Climbing Stairs

Problem Link: https://leetcode.com/problems/climbing-stairs/

## Problem

You are climbing a staircase. It takes `n` steps to reach the top.

Each time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?

---

# Example 1

Input: `n = 2`

Output: `2` (`1 + 1` or `2`).

---

# Example 2

Input: `n = 3`

Output: `3` (`1 + 1 + 1`, `1 + 2`, or `2 + 1`).

---

# Easy Explanation

How can you reach step `i`?

Since you can only take `1` step or `2` steps at a time, your last jump to step `i` must have come from either:
- step `i - 1` (taking `1` step), OR
- step `i - 2` (taking `2` steps).

Therefore, the total number of ways to reach step `i` is simply:

```text
dp[i] = dp[i - 1] + dp[i - 2]
```

That is the Fibonacci recurrence! By storing previous answers in `dp`, we avoid recomputing the same subproblems.

---

# Algorithm

1. Initialize `dp = [0, 1, 2, 3]` (base cases for `n = 0, 1, 2, 3`).
2. If `n > 3`, loop `i` from `4` up to `n`:
   - Append `dp[i - 1] + dp[i - 2]` to `dp`.
3. Return `dp[n]`.

```text
function climbStairs(n)
    dp = [0, 1, 2, 3]
    for i from 4 to n
        dp.append(dp[i - 1] + dp[i - 2])
    return dp[n]
```

---

# Step-by-Step Dry Run

Suppose `n = 5`:

1. Start: `dp = [0, 1, 2, 3]`
2. `i = 4`: `dp[3] + dp[2] = 3 + 2 = 5` → `dp = [0, 1, 2, 3, 5]`
3. `i = 5`: `dp[4] + dp[3] = 5 + 3 = 8` → `dp = [0, 1, 2, 3, 5, 8]`

Return `dp[5] = 8`.

---

# Understanding the Code

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        dp = [0, 1, 2, 3]

        if n > 3:
            i = 4

            while i <= n:
                self.calculate(dp, i)
                i += 1

        return dp[n]

    def calculate(self, dp: list, n: int):
        dp.append(dp[n - 1] + dp[n - 2])
```

---

# Time Complexity

We compute each step from `4` to `n` once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

`dp` stores `n + 1` integers.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
dp[i] = dp[i - 1] + dp[i - 2]
```

> **When each step depends on the previous 1 or 2 steps, build up the answer iteratively with 1D DP.**
