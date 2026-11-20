---
title: "Daily Temperatures"
date: "2026-11-20"
excerpt: "Find how many days you have to wait for a warmer temperature using a monotonic decreasing stack."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Daily Temperatures

Problem Link: https://leetcode.com/problems/daily-temperatures/

## Problem

Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i`-th day to get a warmer temperature.

If there is no future day for which this is possible, keep `answer[i] == 0` instead.

---

# Example 1

Input:

```text
temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
```

Output:

```text
[1, 1, 4, 2, 1, 1, 0, 0]
```

Explanation:

- Day 0 (`73`): warmer day is Day 1 (`74`) -> wait `1` day.
- Day 2 (`75`): warmer day is Day 6 (`76`) -> wait `4` days.
- Day 6 (`76`) and Day 7 (`73`): no warmer future day -> `0`.

---

# Example 2

Input:

```text
temperatures = [30, 40, 50, 60]
```

Output:

```text
[1, 1, 1, 0]
```

---

# Easy Explanation

A brute-force approach checks every future day for each day `i`, which takes `O(n^2)` time.

Instead, think about it this way:

As we walk through the days, some past days are still **"waiting" for a warmer day**.

Whenever today's temperature `temperatures[i]` is warmer than a waiting day `j` on top of our stack, we immediately know the answer for day `j`:

```text
res[j] = i - j
```

---

# The Main Idea: Monotonic Decreasing Stack

We store **indices** of days in a stack, ordered so their temperatures are **decreasing** from bottom to top.

For each day `i`:

1. While the stack is not empty and `temperatures[stack[-1]] < temperatures[i]`:
   - Pop index `j = stack.pop()`.
   - Record `res[j] = i - j`.
2. Push `i` onto the stack (since day `i` itself is now waiting for a warmer day).

Any index left in the stack at the end has no warmer future day, so its value in `res` stays `0`.

---

# Algorithm

1. Initialize an empty `stack` (to hold indices) and `res = [0] * len(temperatures)`.
2. For each day index `i` from `0` to `len(temperatures) - 1`:
   - While `stack` is not empty and `temperatures[stack[-1]] < temperatures[i]`:
     - Pop `j = stack.pop()`.
     - Set `res[j] = i - j`.
   - Push `i` onto `stack`.
3. Return `res`.

```text
function dailyTemperatures(temperatures)
    stack = empty stack
    res = array of 0s of length(temperatures)

    for i from 0 to length(temperatures) - 1
        while stack not empty and temperatures[top(stack)] < temperatures[i]
            j = pop(stack)
            res[j] = i - j
        push i to stack

    return res
```

---

# Step-by-Step Dry Run

Suppose:

```text
temperatures = [73, 74, 75, 71, 69, 72, 76, 73]
res = [0, 0, 0, 0, 0, 0, 0, 0]
```

1. `i = 0 (73)`: stack empty -> push `0`. `stack = [0]`
2. `i = 1 (74)`: `74 > 73` -> pop `0`, `res[0] = 1 - 0 = 1`. Push `1`. `stack = [1]`
3. `i = 2 (75)`: `75 > 74` -> pop `1`, `res[1] = 2 - 1 = 1`. Push `2`. `stack = [2]`
4. `i = 3 (71)`: `71 < 75` -> push `3`. `stack = [2, 3]`
5. `i = 4 (69)`: `69 < 71` -> push `4`. `stack = [2, 3, 4]`
6. `i = 5 (72)`:
   - `72 > 69` -> pop `4`, `res[4] = 5 - 4 = 1`.
   - `72 > 71` -> pop `3`, `res[3] = 5 - 3 = 2`.
   - `72 < 75` -> stop popping, push `5`. `stack = [2, 5]`
7. `i = 6 (76)`:
   - `76 > 72` -> pop `5`, `res[5] = 6 - 5 = 1`.
   - `76 > 75` -> pop `2`, `res[2] = 6 - 2 = 4`.
   - Push `6`. `stack = [6]`
8. `i = 7 (73)`: `73 < 76` -> push `7`. `stack = [6, 7]`

Final `res`: `[1, 1, 4, 2, 1, 1, 0, 0]`.

---

# Understanding the Code

```python
from collections import deque

class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        stack = deque()
        res = [0] * len(temperatures)

        i = 0

        while i < len(temperatures):
            while (len(stack) != 0) and (temperatures[stack[-1]] < temperatures[i]):
                j = stack.pop()
                res[j] = i - j

            stack.append(i)
            i += 1

        return res
```

---

# Time Complexity

Even though there is a `while` loop inside a `while` loop, each index `i` is pushed onto the stack **once** and popped **at most once**.

```text
Time Complexity: O(n)
```

---

# Space Complexity

In the worst case (strictly decreasing temperatures), all `n` indices sit in the stack.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
Keep indices in a monotonic decreasing stack
  ↓
When a warmer day i arrives, pop all cooler days j
  ↓
Set res[j] = i - j
```

> **Whenever you need the "next greater element" for each item in an array, use a monotonic decreasing stack.**
