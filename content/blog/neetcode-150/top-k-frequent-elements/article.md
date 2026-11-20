---
title: "Top K Frequent Elements"
date: "2026-11-20"
excerpt: "Given an integer array nums and an integer k, return the k most frequent elements using a frequency counter and a min-heap."
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Top K Frequent Elements

Problem Link: https://leetcode.com/problems/top-k-frequent-elements/

## Problem

You are given an integer array `nums` and an integer `k`.

Your task is to return the `k` most frequent elements.

You may return the answer in any order.

---

# Example 1

Input:

```text
nums = [1, 1, 1, 2, 2, 3], k = 2
```

Output:

```text
[1, 2]
```

Explanation:

- `1` appears `3` times
- `2` appears `2` times
- `3` appears `1` time

The `2` most frequent numbers are `1` and `2`.

---

# Example 2

Input:

```text
nums = [1], k = 1
```

Output:

```text
[1]
```

There is only one element, so it is the most frequent.

---

# Easy Explanation

The problem has two parts:

1. Count how many times each number appears.
2. Pick the `k` numbers with the highest counts.

Counting is straightforward with a hash map (or `Counter` in Python):

```text
1 -> 3
2 -> 2
3 -> 1
```

Now, how do we find the top `k`?

One simple idea is to sort all `(number, frequency)` pairs by frequency.

Sorting takes:

```text
O(m log m)
```

where `m` is the number of unique elements.

Can we do better when `k` is smaller than `m`?

Yes! Instead of sorting everything, we can keep a **min-heap** of size at most `k`.

---

# The Main Idea

A **min-heap** always keeps the smallest item at the top.

If we push `(frequency, num)` into a min-heap and never let its size grow past `k`:

- Whenever the heap has more than `k` items, we pop the smallest frequency.
- After checking every unique number, only the `k` largest frequencies remain in the heap!

Think of it like a VIP list with `k` seats:

> Whenever a new candidate arrives, if the list has more than `k` people, the person with the lowest score gets removed.

---

# Why `(freq, num)` in the Tuple?

Python's `heapq` compares tuples from left to right.

So when we push:

```python
(freq, num)
```

the heap orders items by `freq` first.

That means `heapq.heappop(min_heap)` will always remove the element with the **lowest frequency**.

---

# Algorithm

1. Count the frequency of every number in `nums` using a hash map (`Counter`).
2. Create an empty `min_heap`.
3. For each `(num, freq)` pair in the counter:
   - Push `(freq, num)` into `min_heap`.
   - If `len(min_heap) > k`, pop the smallest frequency element.
4. Return the `num` from each remaining `(freq, num)` pair in `min_heap`.

```text
function topKFrequent(nums, k)
    counter = frequency map of nums
    min_heap = empty heap

    for (num, freq) in counter
        push (freq, num) into min_heap
        if size(min_heap) > k
            pop smallest from min_heap

    return [num for (freq, num) in min_heap]
```

---

# Step-by-Step Dry Run

Suppose:

```text
nums = [1, 1, 1, 2, 2, 3], k = 2
```

### Step 1: Count Frequencies

```text
counter = {1: 3, 2: 2, 3: 1}
```

Initially:

```text
min_heap = []
```

---

### Step 2: Process `(1, 3)`

Push `(3, 1)`:

```text
min_heap = [(3, 1)]
```

Size is `1 <= 2`, so no pop.

---

### Step 3: Process `(2, 2)`

Push `(2, 2)`:

```text
min_heap = [(2, 2), (3, 1)]
```

Size is `2 <= 2`, so no pop.

---

### Step 4: Process `(3, 1)`

Push `(1, 3)`:

```text
min_heap = [(1, 3), (3, 1), (2, 2)]
```

Now size is `3 > 2`.

So we pop the smallest frequency `(1, 3)`:

```text
min_heap = [(2, 2), (3, 1)]
```

---

### Step 5: Extract the Numbers

We collect the `num` from each `(freq, num)` pair in `min_heap`:

```text
[2, 1]
```

Since any order is valid, `[2, 1]` is accepted.

---

# Understanding the Code

Here is the solution:

```python
import heapq
from typing import List
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counter = Counter(nums)
        min_heap = []

        for num, freq in counter.items():
            heapq.heappush(min_heap, (freq, num))

            if len(min_heap) > k:
                heapq.heappop(min_heap)

        return [num for freq, num in min_heap]
```

Let's break it down:

1. `counter = Counter(nums)` counts the frequency of every number in `O(n)` time.
2. For each `(num, freq)` pair, we push `(freq, num)` onto `min_heap`.
3. If `len(min_heap) > k`, we pop the smallest-frequency element.
4. Finally, we return `[num for freq, num in min_heap]`.

---

# Time Complexity

Let `n` be the length of `nums` and `m` be the number of unique elements.

- Building `Counter(nums)` takes `O(n)`.
- Pushing and popping from a heap of size at most `k` takes `O(log k)` per unique element, so `O(m log k)` total.

Overall time complexity:

```text
O(n + m log k)
```

In the worst case where all elements are unique (`m = n`), this is `O(n log k)`.

---

# Space Complexity

- `counter` stores up to `m` unique elements: `O(m)`
- `min_heap` stores at most `k` elements: `O(k)`

Overall space complexity:

```text
O(n)
```

---

# The Pattern to Remember

```text
Array
  ↓
Count frequencies with Hash Map / Counter
  ↓
Maintain a Min-Heap of size k
  ↓
Return the k elements left in the heap
```

Whenever you see **"Top K"** or **"K largest / most frequent"**, think:

> **Frequency Map + Min-Heap of size `k`.**
