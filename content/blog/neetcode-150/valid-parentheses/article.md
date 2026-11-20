---
title: "Valid Parentheses"
date: "2026-11-20"
excerpt: "Check if a string of brackets is valid using a stack and a hash map of matching bracket pairs."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Valid Parentheses

Problem Link: https://leetcode.com/problems/valid-parentheses/

## Problem

You are given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`.

Determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

---

# Example 1

Input:

```text
s = "()"
```

Output:

```text
true
```

---

# Example 2

Input:

```text
s = "()[]{}"
```

Output:

```text
true
```

---

# Example 3

Input:

```text
s = "(]"
```

Output:

```text
false
```

---

# Example 4

Input:

```text
s = "([)]"
```

Output:

```text
false
```

Even though the counts match, the closing order is wrong: `]` cannot close before `)`.

---

# Easy Explanation

Whenever we see an **opening** bracket (`(`, `{`, `[`), we remember it.

When we see a **closing** bracket (`)`, `}`, `]`), it must match the **most recently opened** bracket that hasn't been closed yet.

"Most recently opened" is **Last-In, First-Out (LIFO)** — which is exactly what a **stack** does!

---

# The Main Idea

Use a stack and a dictionary that maps each closing bracket to its matching opening bracket:

```python
pdict = {
    ')': '(',
    '}': '{',
    ']': '['
}
```

For each character `p` in `s`:

1. If `p` is an opening bracket (`(`, `{`, `[`), push it onto the stack.
2. Otherwise (`p` is a closing bracket):
   - Check if the stack is non-empty AND the top of the stack (`stack[-1]`) equals `pdict[p]`.
   - If yes, pop the top of the stack (they cancel each other out).
   - Otherwise, the bracket is unmatched.

At the end, the string is valid if and only if the stack is empty (`len(stack) == 0`).

---

# Algorithm

1. Create an empty `stack` and a map `pdict` mapping each closing bracket to its opening bracket (`')': '('`, `'}': '{'`, `']': '['`).
2. For each character `p` in `s`:
   - If `p` is an opening bracket (`'('`, `'{'`, `'['`), push `p` onto `stack`.
   - Else (`p` is a closing bracket):
     - If `stack` is non-empty and `stack[-1] == pdict[p]`, pop from `stack`.
     - Else, push `p` onto `stack` (or return `False`).
3. Return `len(stack) == 0`.

```text
function isValid(s)
    stack = empty stack
    pdict = { ')': '(', '}': '{', ']': '[' }

    for p in s
        if p in ('(', '{', '[')
            push p to stack
        else
            if stack not empty and top(stack) == pdict[p]
                pop stack
            else
                push p to stack

    return isEmpty(stack)
```

---

# Step-by-Step Dry Run

Suppose:

```text
s = "({[]})"
```

1. `'('` -> open bracket -> push -> `stack = ['(']`
2. `'{'` -> open bracket -> push -> `stack = ['(', '{']`
3. `'['` -> open bracket -> push -> `stack = ['(', '{', '[']`
4. `']'` -> matches `stack[-1]` (`'['`) -> pop -> `stack = ['(', '{']`
5. `'}'` -> matches `stack[-1]` (`'{'`) -> pop -> `stack = ['(']`
6. `')'` -> matches `stack[-1]` (`'('`) -> pop -> `stack = []`

`len(stack) == 0` -> returns `True`.

---

# Understanding the Code

```python
from collections import deque

class Solution:
    def isValid(self, s: str) -> bool:
        stack = deque()
        pdict = {
            ')': '(',
            '}': '{',
            ']': '['
        }

        for p in s:
            if p == '(' or p == '{' or p == '[':
                stack.append(p)
            else:
                if len(stack) > 0 and stack[-1] == pdict[p]:
                    stack.pop()
                else:
                    stack.append(p)

        return len(stack) == 0
```

### Important Detail About Your Code

In the `else` branch, when a closing bracket doesn't match `stack[-1]` (or the stack is empty), your code appends `p` to `stack`. Because a closing bracket is never popped later, `len(stack)` will be non-zero at the end, so it still returns `False`!

As a small optimization, you can `return False` immediately in that `else` branch so you don't even have to scan the rest of the string.

---

# Time Complexity

We iterate through each character in `s` once, and stack push/pop/peek are `O(1)`.

```text
Time Complexity: O(n)
```

---

# Space Complexity

In the worst case (e.g. `"(((("`), all characters are pushed onto the stack.

```text
Space Complexity: O(n)
```

---

# The Pattern to Remember

```text
Opening bracket -> push onto stack
  ↓
Closing bracket -> check if stack top matches
  ↓
At the end -> stack must be empty
```

> **Any problem about matching nested pairs in LIFO order is a classic Stack problem.**
