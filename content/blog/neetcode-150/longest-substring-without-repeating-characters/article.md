---
title: "Longest Substring Without Repeating Characters"
date: "2026-11-20"
excerpt: "Find the length of the longest substring without duplicate characters using a sliding window and a hash set."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Longest Substring Without Repeating Characters

Problem Link: https://leetcode.com/problems/longest-substring-without-repeating-characters/

## Problem

Given a string `s`, find the length of the **longest substring** without repeating characters.

Note: A **substring** is a contiguous sequence of characters within a string (unlike a subsequence, characters must be next to each other).

---

# Example 1

Input:

```text
s = "abcabcbb"
```

Output:

```text
3
```

Explanation:

The answer is `"abc"`, with length `3`.

---

# Example 2

Input:

```text
s = "bbbbb"
```

Output:

```text
1
```

Explanation:

The answer is `"b"`, with length `1`.

---

# Example 3

Input:

```text
s = "pwwkew"
```

Output:

```text
3
```

Explanation:

The answer is `"wke"`, with length `3`. Notice `"pwke"` is a subsequence, not a substring.

---

# Easy Explanation

We want the longest window `[left, right]` in `s` where every character inside the window is unique.

Checking every possible substring would take `O(n^2)` or `O(n^3)` time.

Instead, we can use a **sliding window** with two pointers (`left` and `right`) and a `set` to track the characters currently inside our window.

---

# The Main Idea

We expand the window by moving `right` forward:

- **If `s[right]` is NOT in `charset`:**
  - Add `s[right]` to `charset`.
  - Update the maximum length: `right - left + 1`.
  - Move `right += 1`.
- **If `s[right]` IS already in `charset`:**
  - We have a duplicate!
  - Shrink the window from the left by removing `s[left]` from `charset` and moving `left += 1`.
  - Repeat until the duplicate character is removed, then `right` can advance again.

---

# Algorithm

1. Initialize an empty set `charset`, `left = 0`, `right = 0`, and `ans = 0`.
2. While `right < len(s)`:
   - If `s[right]` is not in `charset`:
     - Add `s[right]` to `charset`.
     - Update `ans = max(ans, right - left + 1)`.
     - Increment `right += 1`.
   - Else (`s[right]` is already in `charset`):
     - Remove `s[left]` from `charset`.
     - Increment `left += 1`.
3. Return `ans`.

```text
function lengthOfLongestSubstring(s)
    charset = empty set
    left = 0, right = 0, ans = 0

    while right < length(s)
        if s[right] not in charset
            add s[right] to charset
            ans = max(ans, right - left + 1)
            right += 1
        else
            remove s[left] from charset
            left += 1

    return ans
```

---

# Step-by-Step Dry Run

Suppose:

```text
s = "abcabcbb"
```

Initially: `left = 0`, `right = 0`, `charset = set()`, `ans = 0`.

### 1. `right = 0` (`'a'`)
- `'a'` not in `charset` -> add `'a'`, window `"a"`, `ans = 1`, `right = 1`.

### 2. `right = 1` (`'b'`)
- `'b'` not in `charset` -> add `'b'`, window `"ab"`, `ans = 2`, `right = 2`.

### 3. `right = 2` (`'c'`)
- `'c'` not in `charset` -> add `'c'`, window `"abc"`, `ans = 3`, `right = 3`.

### 4. `right = 3` (`'a'`)
- `'a'` IS in `charset`!
- Remove `s[left]` (`'a'`) and move `left = 1`. Window is now `"bc"`.
- Next iteration: `'a'` is no longer in `charset` -> add `'a'`, window `"bca"`, `length = 3`, `right = 4`.

### 5. `right = 4` (`'b'`), `right = 5` (`'c'`), `right = 6` (`'b'`), `right = 7` (`'b'`)
- Each duplicate shrinks `left` until the duplicate leaves `charset`.
- `ans` remains `3`.

Final answer: `3`.

---

# Understanding the Code

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        charset = set()

        length = 0
        ans = 0

        left = 0
        right = left

        while right < len(s):
            if s[right] not in charset:
                charset.add(s[right])
                length = right - left + 1
                ans = max(ans, length)
                right += 1
            else:
                charset.remove(s[left])
                left += 1

        return ans
```

---

# Time Complexity

Both `left` and `right` only move forward from `0` to `n`.

Each character is added to `charset` at most once and removed at most once.

```text
Time Complexity: O(n)
```

---

# Space Complexity

`charset` stores at most `min(n, m)` characters, where `m` is the size of the character set.

```text
Space Complexity: O(min(n, m))
```

---

# The Pattern to Remember

```text
Expand right while window has no duplicates
  ↓
Update max window length (right - left + 1)
  ↓
If duplicate appears, shrink left until it's gone
```

> **Sliding window + hash set lets you maintain a valid substring in linear time.**
