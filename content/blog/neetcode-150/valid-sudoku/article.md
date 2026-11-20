---
title: "Valid Sudoku"
date: "2026-11-20"
excerpt: "Determine if a 9x9 Sudoku board is valid by tracking seen digits in rows, columns, and 3x3 boxes using hash sets."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Valid Sudoku

Problem Link: https://leetcode.com/problems/valid-sudoku/

## Problem

Determine if a `9 x 9` Sudoku board is valid.

Only the filled cells need to be validated according to three rules:

1. Each **row** must contain the digits `1-9` without repetition.
2. Each **column** must contain the digits `1-9` without repetition.
3. Each of the nine `3 x 3` **sub-boxes** must contain the digits `1-9` without repetition.

Empty cells are represented by `"."`.

Note:

- A valid Sudoku board is not necessarily solvable.
- You only need to check that the filled cells do not break the rules.

---

# Example 1

```text
Input: board =
[["5","3",".",".","7",".",".",".","."]
,["6",".",".","1","9","5",".",".","."]
,[".","9","8",".",".",".",".","6","."]
,["8",".",".",".","6",".",".",".","3"]
,["4",".",".","8",".","3",".",".","1"]
,["7",".",".",".","2",".",".",".","6"]
,[".","6",".",".",".",".","2","8","."]
,[".",".",".","4","1","9",".",".","5"]
,[".",".",".",".","8",".",".","7","9"]]

Output: true
```

No row, column, or `3 x 3` box has duplicate digits.

---

# Example 2

If the top-left cell `"5"` were `"8"` instead, then:

- Column `0` would have two `"8"`s.
- The top-left `3 x 3` box would also have two `"8"`s.

So the output would be `false`.

---

# Easy Explanation

For every cell `(row, col)` that is not `"."`, we need to check three things:

1. Have we seen this digit in `row` already?
2. Have we seen this digit in `col` already?
3. Have we seen this digit in its `3 x 3` box already?

If the answer to any of those is **yes**, the board is invalid and we return `False` immediately.

Otherwise, we record the digit in all three places and keep going.

---

# The Main Idea

We create `9` sets for rows, `9` sets for columns, and `9` sets for boxes:

```python
rows = [set() for _ in range(9)]
columns = [set() for _ in range(9)]
boxes = [set() for _ in range(9)]
```

A `set` lets us check for duplicates in `O(1)` average time.

---

# The Most Important Trick: Mapping `(row, col)` to a Box Index

The `9 x 9` board is divided into `9` sub-boxes of size `3 x 3`, numbered `0` through `8`:

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

How do we find which box `(row, col)` belongs to?

Using integer division `// 3`:

```python
box = (row // 3) * 3 + (col // 3)
```

Let's verify:

- `row = 0, col = 0` -> `(0 // 3) * 3 + (0 // 3) = 0`
- `row = 1, col = 4` -> `(1 // 3) * 3 + (4 // 3) = 0 * 3 + 1 = 1`
- `row = 4, col = 7` -> `(4 // 3) * 3 + (7 // 3) = 1 * 3 + 2 = 5`
- `row = 8, col = 8` -> `(8 // 3) * 3 + (8 // 3) = 2 * 3 + 2 = 8`

This formula cleanly maps all `81` cells to the right box from `0` to `8`.

---

# Algorithm

1. Create `9` empty sets for `rows`, `9` for `columns`, and `9` for `boxes`.
2. Loop `row` from `0` to `8` and `col` from `0` to `8`:
   - Let `value = board[row][col]`.
   - If `value == "."`, skip to the next cell.
   - Compute `box = (row // 3) * 3 + (col // 3)`.
   - If `value` is already in `rows[row]`, `columns[col]`, or `boxes[box]`, return `False`.
   - Otherwise, add `value` to `rows[row]`, `columns[col]`, and `boxes[box]`.
3. If no duplicates are found across all cells, return `True`.

```text
function isValidSudoku(board)
    rows = 9 empty sets
    columns = 9 empty sets
    boxes = 9 empty sets

    for row in 0..8
        for col in 0..8
            value = board[row][col]
            if value == "." continue
            box = (row // 3) * 3 + (col // 3)
            if value in rows[row] or value in columns[col] or value in boxes[box]
                return False
            add value to rows[row], columns[col], boxes[box]

    return True
```

---

# Step-by-Step Dry Run

Suppose we are checking the first row:

```text
row 0: ["5", "3", ".", ".", "7", ...]
```

### Cell `(0, 0)` = `"5"`

- `box = (0 // 3) * 3 + (0 // 3) = 0`
- `"5"` is not in `rows[0]`, `columns[0]`, or `boxes[0]`.
- Add `"5"` to `rows[0]`, `columns[0]`, and `boxes[0]`.

### Cell `(0, 1)` = `"3"`

- `box = 0`
- `"3"` is not in `rows[0]`, `columns[1]`, or `boxes[0]`.
- Add `"3"` to `rows[0]`, `columns[1]`, and `boxes[0]`.

### Cell `(0, 2)` = `"."`

- Empty cell, so `continue`.

If we later see `"5"` again in row `0`, column `0`, or box `0`, the check catches it and returns `False`.

If we finish all `81` cells without conflicts, we return `True`.

---

# Understanding the Code

```python
from typing import List

class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        rows = [set() for _ in range(9)]
        columns = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]

        for row in range(0, 9):
            for col in range(0, 9):
                value = board[row][col]
                box = (row // 3) * 3 + (col // 3)

                if value == ".":
                    continue

                if value in rows[row]:
                    return False

                if value in columns[col]:
                    return False

                if value in boxes[box]:
                    return False

                rows[row].add(value)
                columns[col].add(value)
                boxes[box].add(value)

        return True
```

---

# Time Complexity

The board is always `9 x 9 = 81` cells.

Each cell does `O(1)` set lookups and insertions.

```text
Time Complexity: O(81) = O(1)
```

(Or `O(n^2)` for a generalized `n x n` board.)

---

# Space Complexity

We store at most `81` digits across `rows`, `columns`, and `boxes`.

```text
Space Complexity: O(81) = O(1)
```

---

# The Pattern to Remember

```text
For each cell (row, col):
  ↓
Skip if "."
  ↓
Compute box = (row // 3) * 3 + (col // 3)
  ↓
Check row, col, and box sets for duplicates
  ↓
Add digit to all three sets
```

> **Use hash sets to track seen values per row, column, and `3 x 3` box in a single pass.**
