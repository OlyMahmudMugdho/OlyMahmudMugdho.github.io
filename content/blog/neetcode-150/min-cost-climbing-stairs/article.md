---
title: "Min Cost Climbing Stairs"
date: "2026-11-22"
excerpt: "Find the minimum cost to reach the top of the staircase using O(1) space 1D Dynamic Programming."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Min Cost Climbing Stairs

Problem Link: https://leetcode.com/problems/min-cost-climbing-stairs/

## Problem

You are given an integer array `cost` where `cost[i]` is the cost of `i`-th step on a staircase. Once you pay the cost, you can either climb `1` or `2` steps.

You can either start from step `0`, or step `1`.

Return the **minimum cost** to reach the top of the floor (one step past the last index `len(cost)`).

---

# Example 1

Input: `cost = [10, 15, 20]`

Output: `15` (Start at index `1`, pay `15`, and jump 2 steps to the top).

---

# Example 2

Input: `cost = [1, 100, 1, 1, 1, 100, 1, 1, 100, 1]`

Output: `6`

---

# Easy Explanation

To reach step `i`, you must come from either:
- step `i - 1` (paying `cost[i - 1]`), OR
- step `i - 2` (paying `cost[i - 2]`).

So the minimum cost to reach step `i` is:

```text
dp[i] = min(dp[i - 1] + cost[i - 1], dp[i - 2] + cost[i - 2])
```

And since `dp[i]` only depends on the **last two** values (`dp[i - 1]` and `dp[i - 2]`), we don't even need an array — just two variables `a` and `b`!

Starting from step `0` or `1` is free (`a = 0, b = 0`), because you only pay when you *leave* a step.

---

# Algorithm

1. Initialize `a = 0` (`dp[0]`) and `b = 0` (`dp[1]`).
2. Loop `i` from `2` to `len(cost)`:
   - Compute `next_cost = min(b + cost[i - 1], a + cost[i - 2])`.
   - Shift `a = b`, `b = next_cost`.
3. Return `b`.

```text
function minCostClimbingStairs(cost)
    a = 0, b = 0
    for i from 2 to len(cost)
        a, b = b, min(b + cost[i - 1], a + cost[i - 2])
    return b
```

---

# Step-by-Step Dry Run

Suppose `cost = [10, 15, 20]`:

Initially: `a = 0`, `b = 0`.

1. `i = 2`:
   - `b + cost[1] = 0 + 15 = 15`
   - `a + cost[0] = 0 + 10 = 10`
   - `min(15, 10) = 10` → `a = 0, b = 10`
2. `i = 3` (the top!):
   - `b + cost[2] = 10 + 20 = 30`
   - `a + cost[1] = 0 + 15 = 15`
   - `min(30, 15) = 15` → `a = 10, b = 15`

Return `b = 15`.

---

# Understanding the Code

```python
class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        a, b = 0, 0

        for i in range(2, len(cost) + 1):
            a, b = b, min(
                b + cost[i - 1],
                a + cost[i - 2]
            )

        return b
```

---

# Time Complexity

We iterate through `cost` once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

Only two integer variables `a` and `b` are used.

```text
Space Complexity: O(1)
```

---

# The Pattern to Remember

```text
a, b = b, min(b + cost[i - 1], a + cost[i - 2])
```

> **When a DP recurrence only looks back 2 steps, replace the DP array with two rolling variables for `O(1)` space.**
