---
title: "Evaluate Reverse Polish Notation"
date: "2026-11-20"
excerpt: "Evaluate arithmetic expressions in Reverse Polish Notation (postfix) using a stack."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Evaluate Reverse Polish Notation

Problem Link: https://leetcode.com/problems/evaluate-reverse-polish-notation/

## Problem

You are given an array of strings `tokens` that represents an arithmetic expression in **Reverse Polish Notation** (postfix notation).

Evaluate the expression and return an integer that represents its value.

Note that:

- The valid operators are `'+'`, `'-'`, `'*'`, and `'/'`.
- Each operand may be an integer or another expression.
- Division between two integers always **truncates toward zero**.
- There will not be any division by zero.

---

# Example 1

Input:

```text
tokens = ["2", "1", "+", "3", "*"]
```

Output:

```text
9
```

Explanation:

`((2 + 1) * 3) = 9`

---

# Example 2

Input:

```text
tokens = ["4", "13", "5", "/", "+"]
```

Output:

```text
6
```

Explanation:

`(4 + (13 / 5)) = (4 + 2) = 6`

---

# Easy Explanation

In Reverse Polish Notation, operators come **after** their two operands:

```text
2 1 +   means   2 + 1
```

Whenever we see a number, we save it for later.

Whenever we see an operator (`+`, `-`, `*`, `/`), we apply it to the **two most recent numbers** and put the result back.

A **stack** is the perfect data structure for this!

---

# The Main Idea

Scan `tokens` from left to right:

1. If `token` is a number (not in `{'+', '-', '*', '/'}`), convert it to `int(token)` and push it onto `stack`.
2. If `token` is an operator:
   - Pop `b = stack.pop()` (the **second** operand).
   - Pop `a = stack.pop()` (the **first** operand).
   - Compute `a <op> b` and push the result back onto `stack`.

### Watch Out for Two Details!

1. **Order of operands matters** for `-` and `/`:
   - The first popped value is `b` (right side), and the second popped value is `a` (left side), so we compute `a - b` and `a / b`.
2. **Truncating toward zero in Python**:
   - Python's `//` floors toward negative infinity (e.g., `-3 // 2 == -2`).
   - Using `int(a / b)` truncates toward zero (e.g., `int(-3 / 2) == -1`), which is what the problem requires!

---

# Algorithm

1. Create an empty `stack` and a set `operations = {'+', '-', '*', '/'}`.
2. For each `token` in `tokens`:
   - If `token` is not in `operations`, push `int(token)` onto `stack`.
   - Else:
     - Pop `b = stack.pop()` and `a = stack.pop()`.
     - Compute `res` using `a <op> b` (for `'/'`, use `int(a / b)` to truncate toward zero).
     - Push `res` onto `stack`.
3. Return `int(stack[-1])`.

```text
function evalRPN(tokens)
    stack = empty stack
    operations = {'+', '-', '*', '/'}

    for token in tokens
        if token not in operations
            push int(token) to stack
        else
            b = pop(stack)
            a = pop(stack)
            res = apply(token, a, b)  // truncate division toward zero
            push res to stack

    return int(top(stack))
```

---

# Step-by-Step Dry Run

Suppose:

```text
tokens = ["4", "13", "5", "/", "+"]
```

1. `"4"` -> push `4` -> `stack = [4]`
2. `"13"` -> push `13` -> `stack = [4, 13]`
3. `"5"` -> push `5` -> `stack = [4, 13, 5]`
4. `"/"`:
   - `b = 5`, `a = 13`
   - `int(13 / 5) = 2`
   - push `2` -> `stack = [4, 2]`
5. `"+"`:
   - `b = 2`, `a = 4`
   - `4 + 2 = 6`
   - push `6` -> `stack = [6]`

Return `stack[-1]` -> `6`.

---

# Understanding the Code

```python
from collections import deque

class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = deque()
        operations = {'+', '-', '*', '/'}

        for token in tokens:
            if token not in operations:
                stack.append(int(token))
            else:
                if token == '+':
                    b = stack.pop()
                    a = stack.pop()
                    res = a + b
                    stack.append(res)

                elif token == '-':
                    b = stack.pop()
                    a = stack.pop()
                    res = a - b
                    stack.append(res)

                elif token == '*':
                    b = stack.pop()
                    a = stack.pop()
                    res = a * b
                    stack.append(res)

                elif token == '/':
                    b = stack.pop()
                    a = stack.pop()
                    res = a / b
                    stack.append(int(res))

        return int(stack[-1])
```

---

# Time Complexity

We process each token once, and each stack push/pop is `O(1)`.

```text
Time Complexity: O(n)
```

---

# Space Complexity

In the worst case, the stack holds up to `O(n)` numbers.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
Number -> push onto stack
  ↓
Operator -> pop b, pop a, compute (a op b), push result
  ↓
Return stack[-1]
```

> **In postfix evaluation, pop `b` before `a` and use `int(a / b)` in Python to truncate division toward zero.**
