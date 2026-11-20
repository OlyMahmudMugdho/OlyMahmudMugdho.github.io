---
title: "Best Time to Buy and Sell Stock"
date: "2026-11-20"
excerpt: "Maximize profit from a single buy and sell transaction by tracking the minimum price seen so far in one pass."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Best Time to Buy and Sell Stock

Problem Link: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/

## Problem

You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.

---

# Example 1

Input:

```text
prices = [7, 1, 5, 3, 6, 4]
```

Output:

```text
5
```

Explanation:

Buy on day 2 (`price = 1`) and sell on day 5 (`price = 6`).

Profit = `6 - 1 = 5`.

Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

---

# Example 2

Input:

```text
prices = [7, 6, 4, 3, 1]
```

Output:

```text
0
```

Prices only go down, so no profitable transaction is possible.

---

# Easy Explanation

Suppose you decide to sell on day `i`.

To get the maximum profit on day `i`, when should you have bought?

> At the **lowest price** seen on any day **before** day `i`!

That single observation turns an `O(n^2)` pair-checking problem into a single `O(n)` scan.

---

# The Main Idea

Keep track of two values as we walk through `prices`:

1. `min_price`: the lowest stock price seen so far.
2. `max_profit`: the largest profit we could have made so far.

At each day `i`:

- Update `min_price = min(price, min_price)`
- Calculate `profit = price - min_price`
- Update `max_profit = max(profit, max_profit)`

---

# Algorithm

1. Initialize `min_price = prices[0]` and `max_profit = 0`.
2. Loop `i` from `1` to `len(prices) - 1`:
   - `min_price = min(prices[i], min_price)`
   - `profit = prices[i] - min_price`
   - `max_profit = max(profit, max_profit)`
3. Return `max_profit`.

```text
function maxProfit(prices)
    min_price = prices[0]
    max_profit = 0

    for i from 1 to length(prices) - 1
        min_price = min(prices[i], min_price)
        profit = prices[i] - min_price
        max_profit = max(profit, max_profit)

    return max_profit
```

---

# Step-by-Step Dry Run

Suppose:

```text
prices = [7, 1, 5, 3, 6, 4]
```

Initially:

```text
min_price = 7
max_profit = 0
```

### Day 1: `price = 1`

- `min_price = min(1, 7) = 1`
- `profit = 1 - 1 = 0`
- `max_profit = 0`

### Day 2: `price = 5`

- `min_price = min(5, 1) = 1`
- `profit = 5 - 1 = 4`
- `max_profit = max(4, 0) = 4`

### Day 3: `price = 3`

- `min_price = min(3, 1) = 1`
- `profit = 3 - 1 = 2`
- `max_profit = max(2, 4) = 4`

### Day 4: `price = 6`

- `min_price = min(6, 1) = 1`
- `profit = 6 - 1 = 5`
- `max_profit = max(5, 4) = 5`

### Day 5: `price = 4`

- `min_price = min(4, 1) = 1`
- `profit = 4 - 1 = 3`
- `max_profit = max(3, 5) = 5`

Final answer: `5`.

---

# Understanding the Code

```python
class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = prices[0]
        max_profit = 0

        i = 1

        while i < len(prices):
            price = prices[i]
            min_price = min(price, min_price)
            profit = price - min_price
            max_profit = max(profit, max_profit)

            i += 1

        return max_profit
```

---

# Time Complexity

We iterate through the `prices` array once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

We only store a few variables (`min_price`, `max_profit`, `i`).

```text
Space Complexity: O(1)
```

---

# The Pattern to Remember

```text
Track min_price seen so far
  ↓
For each price: profit = price - min_price
  ↓
Keep the maximum profit
```

> **To maximize `sell - buy` in one pass, always remember the smallest `buy` price seen before the current day.**
