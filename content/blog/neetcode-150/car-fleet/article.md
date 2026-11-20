---
title: "Car Fleet"
date: "2026-11-20"
excerpt: "Determine how many car fleets will arrive at the target destination by sorting cars by position and tracking arrival times with a stack."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Car Fleet

Problem Link: https://leetcode.com/problems/car-fleet/

## Problem

There are `n` cars at given miles away from the starting mile `0`, traveling to reach the mile `target`.

You are given two integer arrays `position` and `speed`, both of length `n`, where `position[i]` is the starting mile of the `i`-th car and `speed[i]` is the speed of the `i`-th car in miles per hour.

A car cannot pass another car, but it can catch up and then travel next to it at the speed of the slower car.

A **car fleet** is a single car or a group of cars driving next to each other. The speed of the car fleet is the minimum speed of any car in the fleet.

Return the number of car fleets that will arrive at the destination.

---

# Example 1

Input:

```text
target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]
```

Output:

```text
3
```

Explanation:

- Cars starting at `10` (speed `2`) and `8` (speed `4`) both reach `12` at time `1.0`, forming **1 fleet**.
- Car starting at `0` (speed `1`) reaches `12` at time `12.0` -> **1 fleet**.
- Cars starting at `5` (speed `1`) and `3` (speed `3`) meet at `6` and reach `12` at time `7.0` -> **1 fleet**.

Total fleets = `3`.

---

# Example 2

Input:

```text
target = 10, position = [3], speed = [3]
```

Output:

```text
1
```

---

# Easy Explanation

How long would it take a car at `pos` with speed `spd` to reach `target` on an empty road?

```text
time = (target - pos) / spd
```

Now imagine looking at the cars **from closest to `target` to farthest from `target`**.

Why from closest to farthest?

Because a car behind can **catch up** to the car ahead of it, but it can **never pass** it!

- If a car behind has a **smaller or equal** arrival time than the fleet ahead of it (`t <= stack[-1]`), it will catch up before reaching `target` and **merge** into that fleet.
- If a car behind has a **strictly greater** arrival time (`t > stack[-1]`), it can never catch the fleet ahead, so it forms a **new fleet**!

---

# The Main Idea

1. Pair each car's `(position, speed)` and sort in **descending** order of `position` (closest to `target` first).
2. Maintain a `stack` of arrival times for each distinct fleet.
3. For each car `(pos, spd)`:
   - Compute `t = (target - pos) / spd`.
   - If `stack` is empty OR `t > stack[-1]`, push `t` onto `stack` (new fleet!).
   - Otherwise, `t <= stack[-1]`, so this car merges into the fleet ahead and we don't push it.
4. Return `len(stack)`.

---

# Algorithm

1. Pair each car's `(position, speed)` and sort in descending order of `position`.
2. Initialize an empty `stack` to store the arrival time of each fleet.
3. For each `(pos, spd)` in the sorted list:
   - Compute `t = (target - pos) / spd`.
   - If `stack` is empty or `t > stack[-1]`, push `t` onto `stack`.
4. Return `len(stack)`.

```text
function carFleet(target, position, speed)
    cars = sort zip(position, speed) descending by position
    stack = empty stack

    for (pos, spd) in cars
        t = (target - pos) / spd
        if stack is empty or t > top(stack)
            push t to stack

    return length(stack)
```

---

# Step-by-Step Dry Run

Suppose:

```text
target = 12, position = [10, 8, 0, 5, 3], speed = [2, 4, 1, 1, 3]
```

Sorted by position descending:

```text
[(10, 2), (8, 4), (5, 1), (3, 3), (0, 1)]
```

Initially: `stack = []`.

1. `(10, 2)`: `t = (12 - 10) / 2 = 1.0`. Stack empty -> push `1.0`. `stack = [1.0]`
2. `(8, 4)`: `t = (12 - 8) / 4 = 1.0`. `1.0 <= 1.0` -> merges with `1.0`. `stack = [1.0]`
3. `(5, 1)`: `t = (12 - 5) / 1 = 7.0`. `7.0 > 1.0` -> new fleet -> push `7.0`. `stack = [1.0, 7.0]`
4. `(3, 3)`: `t = (12 - 3) / 3 = 3.0`. `3.0 <= 7.0` -> merges with `7.0`. `stack = [1.0, 7.0]`
5. `(0, 1)`: `t = (12 - 0) / 1 = 12.0`. `12.0 > 7.0` -> new fleet -> push `12.0`. `stack = [1.0, 7.0, 12.0]`

Return `len(stack) = 3`.

---

# Understanding the Code

```python
class Solution:
    def carFleet(self, target: int, position: list[int], speed: list[int]) -> int:
        cars = sorted(zip(position, speed), reverse=True)
        stack = []

        for pos, spd in cars:
            t = (target - pos) / spd

            if not stack or t > stack[-1]:
                stack.append(t)

        return len(stack)
```

---

# Time Complexity

Sorting `n` cars takes `O(n log n)`, and the single loop takes `O(n)`.

```text
Time Complexity: O(n log n)
```

---

# Space Complexity

The sorted list and stack each hold up to `n` items.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
Sort cars by position (closest to target first)
  ↓
Compute arrival time t = (target - pos) / spd
  ↓
If t > stack[-1]: new fleet (push t)
Else: merges into fleet ahead
```

> **Sort from front to back and compare arrival times: a faster car behind merges into a slower fleet ahead.**
