---
title: "Min Stack"
date: "2026-11-20"
excerpt: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time using an auxiliary min-stack."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Min Stack

Problem Link: https://leetcode.com/problems/min-stack/

## Problem

Design a stack that supports `push`, `pop`, `top`, and retrieving the minimum element in **constant time** `O(1)`.

Implement the `MinStack` class:

- `MinStack()` initializes the stack object.
- `void push(int val)` pushes the element `val` onto the stack.
- `void pop()` removes the element on the top of the stack.
- `int top()` gets the top element of the stack.
- `int getMin()` retrieves the minimum element in the stack.

---

# Example 1

```text
Input:
["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]

Output:
[null,null,null,null,-3,null,0,-2]
```

Explanation:

- `push(-2)` -> stack: `[-2]`, min: `-2`
- `push(0)` -> stack: `[-2, 0]`, min: `-2`
- `push(-3)` -> stack: `[-2, 0, -3]`, min: `-3`
- `getMin()` -> returns `-3`
- `pop()` -> removes `-3`, stack: `[-2, 0]`, min: `-2`
- `top()` -> returns `0`
- `getMin()` -> returns `-2`

---

# Easy Explanation

`push`, `pop`, and `top` are already `O(1)` on a normal stack.

The tricky part is `getMin()` in `O(1)`!

Why can't we just store a single variable `min_val`?

Because if we `pop()` the current minimum, how would we know what the **previous** minimum was without scanning the whole stack (`O(n)`)?

---

# The Main Idea: Two Synchronized Stacks

We keep **two** stacks:

1. `self.stack`: stores the actual values.
2. `self.minStack`: stores the minimum value **at each level** of `self.stack`.

Whenever we `push(val)`:

- Push `val` onto `self.stack`.
- Push `min(val, self.minStack[-1])` onto `self.minStack` (or `val` if `self.minStack` is empty).

Whenever we `pop()`:

- Pop from **both** `self.stack` and `self.minStack`.

That way, `self.minStack[-1]` **always** holds the minimum of all elements currently in `self.stack`!

---

# Algorithm

1. Maintain two stacks: `stack` (actual values) and `minStack` (running minimums).
2. **`push(val)`**:
   - Push `val` onto `stack`.
   - If `minStack` is empty, push `val` onto `minStack`; otherwise push `min(val, minStack[-1])`.
3. **`pop()`**:
   - Pop from both `stack` and `minStack`.
4. **`top()`**:
   - Return `stack[-1]`.
5. **`getMin()`**:
   - Return `minStack[-1]`.

```text
class MinStack
    stack = []
    minStack = []

    push(val):
        stack.append(val)
        if minStack empty: minStack.append(val)
        else: minStack.append(min(val, minStack[-1]))

    pop():
        stack.pop()
        minStack.pop()

    top():    return stack[-1]
    getMin(): return minStack[-1]
```

---

# Step-by-Step Dry Run

Let's trace: `push(-2)`, `push(0)`, `push(-3)`, `getMin()`, `pop()`, `getMin()`.

1. `push(-2)`:
   - `stack = [-2]`
   - `minStack = [-2]`
2. `push(0)`:
   - `stack = [-2, 0]`
   - `min(0, -2) = -2` -> `minStack = [-2, -2]`
3. `push(-3)`:
   - `stack = [-2, 0, -3]`
   - `min(-3, -2) = -3` -> `minStack = [-2, -2, -3]`
4. `getMin()`:
   - Return `minStack[-1]` -> `-3`
5. `pop()`:
   - Pop from both: `stack = [-2, 0]`, `minStack = [-2, -2]`
6. `getMin()`:
   - Return `minStack[-1]` -> `-2`

Notice how popping `-3` automatically restores `-2` as the minimum in `O(1)` time!

---

# Understanding the Code

```python
class MinStack:

    def __init__(self):
        self.stack = []
        self.minStack = []

    def push(self, val: int) -> None:
        self.stack.append(val)

        if not self.minStack:
            self.minStack.append(val)
        else:
            self.minStack.append(min(val, self.minStack[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.minStack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.minStack[-1]
```

---

# Time Complexity

Every operation (`push`, `pop`, `top`, `getMin`) only appends, pops, or reads the last element of a list.

```text
Time Complexity: O(1) for all operations
```

---

# Space Complexity

For `n` elements in `stack`, `minStack` also stores `n` elements.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
stack:     [-2,  0, -3]
minStack:  [-2, -2, -3]
```

> **Store the running minimum at every stack height in a parallel stack so `pop()` restores the previous minimum in `O(1)`.**
