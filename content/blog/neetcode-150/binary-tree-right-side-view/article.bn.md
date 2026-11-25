---
title: "বাইনারি ট্রি রাইট সাইড ভিউ (Binary Tree Right Side View)"
date: "2026-11-20"
excerpt: "BFS দিয়ে লেভেল অনুযায়ী এগিয়ে প্রতি লেভেলের শেষ নোডটি নিয়ে বাইনারি ট্রির ডান পাশের দৃশ্য বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# বাইনারি ট্রি রাইট সাইড ভিউ (Binary Tree Right Side View)

সমস্যার লিংক: https://leetcode.com/problems/binary-tree-right-side-view/

## সমস্যাটা কী?

ধরুন আপনি একটা বাইনারি ট্রির **ডান পাশে** দাঁড়িয়ে ওপর থেকে নিচে তাকাচ্ছেন। প্রতিটি লেভেল থেকে ডান দিক দিয়ে সবচেয়ে বাইরে যে নোডগুলো দেখা যাবে, তাদের মানগুলো ওপর থেকে নিচের ক্রমে রিটার্ন করতে হবে।

যেমন:

```tree
1 : দেখা যায় !hit
  2
    _ !ghost
    5
  3 : দেখা যায় !hit
    _ !ghost
    4 : দেখা যায় !hit
```

এখানে ডান পাশ থেকে তাকালে দেখা যাবে `[1, 3, 4]`। (মজার ব্যাপার হলো, কোনো লেভেলে ডান দিকে নোড না থাকলে বাম পাশের নোডটাও ডান দিক থেকে দেখা যায়!)

---

# সহজভাবে চিন্তা করি

একটু খেয়াল করলেই দেখবেন—প্রতিটা লেভেলে আপনি আসলে কোন নোডটা দেখতে পান?

ওই লেভেলের **একদম ডানের (শেষ) নোডটা**!

আমরা যদি **BFS (Breadth-First Search)** দিয়ে বাম থেকে ডানে লেভেল বাই লেভেল যাই, তাহলে প্রতিটা লেভেল শুরু হওয়ার ঠিক আগে `queue`-এর ভেতর ওই লেভেলের সব নোড বাম থেকে ডানে সাজানো থাকে। তার মানে ওই লেভেলের সবার ডানের নোড হলো `level[-1].val`! ব্যাস, ওটাই `result`-এ তুলে নিয়ে বাকি নোডগুলো পপ করে পরের লেভেলের বাচ্চাদের কিউতে ঢুকিয়ে দিলেই কাজ শেষ।

---

# অ্যালগরিদম

1. `root` খালি (`None`) হলে `[]` রিটার্ন করি।
2. `queue = deque([root])` আর খালি লিস্ট `result = []` নিই।
3. যতক্ষণ `queue` খালি না হয়:
   - বর্তমান লেভেলের শেষ নোডের মান `queue[-1].val` সরাসরি `result`-এ যোগ করি।
   - `range(len(queue))` বার লুপ চালিয়ে প্রতিটা `node = queue.popleft()` বের করি এবং তার `left` ও `right` সন্তান থাকলে `queue`-তে ঢোকাই।
4. শেষে `result` রিটার্ন করি।

```text
function rightSideView(root)
    if root is None: return []
    queue = deque([root])
    result = []
    while queue
        result.append(queue[-1].val)
        for _ in range(len(queue))
            node = queue.popleft()
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return result
```

---

# ধাপে ধাপে ড্রাই রান

`[1, 2, 3, null, 5, null, 4]` নিয়ে দেখি:

1. **লেভেল ০ (`queue = [1]`):** শেষ নোড `1` → `result = [1]`। `1` বের হয়ে `2, 3` ঢোকে।
2. **লেভেল ১ (`queue = [2, 3]`):** শেষ নোড `3` → `result = [1, 3]`। `2` বের হয়ে `5` ঢোকে, `3` বের হয়ে `4` ঢোকে।
3. **লেভেল ২ (`queue = [5, 4]`):** শেষ নোড `4` → `result = [1, 3, 4]`। `5, 4` বের হয়, আর কোনো সন্তান নেই।

কিউ খালি, তাই উত্তর `[1, 3, 4]`।

---

# কোড বিশ্লেষণ

```python
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        if root is None:
            return []

        queue = deque()
        queue.append(root)

        result = []

        while queue:
            level = queue

            result.append(level[-1].val)

            for _ in range(len(level)):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

        return result
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — প্রতিটি নোড একবার কিউতে ঢোকে এবং একবার বের হয়।
- **Space Complexity:** `O(n)` — সবচেয়ে বড় লেভেলটা কিউতে রাখার জন্য।

---

# মূল কথা

> **রাইট সাইড ভিউ মানেই হলো BFS-এর প্রতিটি লেভেলের একদম শেষ নোড (`level[-1].val`) তুলে নেওয়া।**
