---
title: "Binary Tree Level Order Traversal"
date: "2026-11-20"
excerpt: "কিউ (Queue) এবং Breadth-First Search (BFS) দিয়ে বাইনারি ট্রি-কে ধাপে ধাপে ওপর থেকে নিচে ট্র্যাভার্স করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Binary Tree Level Order Traversal

সমস্যার লিংক: https://leetcode.com/problems/binary-tree-level-order-traversal/

## সমস্যাটা কী?

একটা বাইনারি ট্রির `root` দেওয়া আছে। এর নোডগুলোর মান **লেভেল অনুযায়ী** (উপরের তলা থেকে নিচের তলা, প্রতি তলায় বাম থেকে ডান) আলাদা আলাদা লিস্টে সাজিয়ে রিটার্ন করতে হবে।

যেমন `[3, 9, 20, null, null, 15, 7]` হলে আউটপুট আসবে `[[3], [9, 20], [15, 7]]`।

---

# সহজভাবে চিন্তা করি

এক তলা করে করে নিচে নামার জন্য সবচেয়ে চমৎকার পদ্ধতি হলো **Breadth-First Search (BFS)**, আর BFS করতে গেলে আমাদের লাগে একটা **Queue (`deque`)**।

এখানে আসল ট্রিকটা কী জানেন? প্রতিটা লেভেলের শুরুতে আমরা দেখে নেব `queue`-তে ঠিক কয়টা নোড দাঁড়িয়ে আছে (`len(queue)`)। ব্যাস, ঠিক ততবার লুপ ঘুরিয়ে ওই নোডগুলো বের করব, তাদের মান `level_values`-এ রাখব, আর তাদের বাচ্চাকাচ্চা (`left`, `right`) থাকলে কিউয়ের পেছনে লাইনে দাঁড় করিয়ে দেব।

যেহেতু আমরা আগেই `len(queue)` গুনে নিয়েছি, তাই নতুন যোগ হওয়া বাচ্চারা এই লেভেলে ঢুকে পড়বে না—ওরা পরের লেভেলের জন্য অপেক্ষা করবে!

---

# অ্যালগরিদম

1. `root` খালি (`None`) হলে খালি লিস্ট `[]` রিটার্ন করি।
2. `result = []` এবং `queue = deque()` নিয়ে `root`-কে `queue`-তে রাখি।
3. যতক্ষণ `queue` খালি না হয়:
   - বর্তমান লেভেলের জন্য খালি লিস্ট `level_values = []` নিই।
   - `range(len(queue))` বার লুপ চালাই:
     - `node = queue.popleft()` করে `level_values`-এ `node.val` যোগ করি।
     - `node.left` থাকলে কিউতে যোগ করি, `node.right` থাকলে কিউতে যোগ করি।
   - `result.append(level_values)` করি।
4. শেষে `result` রিটার্ন করি।

```text
function levelOrder(root)
    if root is None: return []
    result = []
    queue = deque([root])
    while queue
        level_values = []
        for i in range(len(queue))
            node = queue.popleft()
            level_values.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level_values)
    return result
```

---

# ধাপে ধাপে ড্রাই রান

`[3, 9, 20, null, null, 15, 7]`

- **লেভেল ০ (`len=1`):** কিউ থেকে `3` বের হলো, তার বাচ্চা `9` ও `20` লাইনে দাঁড়াল। `result = [[3]]`।
- **লেভেল ১ (`len=2`):** `9` বের হলো (বাচ্চা নেই), `20` বের হলো (বাচ্চা `15` ও `7` লাইনে দাঁড়াল)। `result = [[3], [9, 20]]`।
- **লেভেল ২ (`len=2`):** `15` আর `7` বের হলো (বাচ্চা নেই)। `result = [[3], [9, 20], [15, 7]]`।

কিউ খালি! কাজ শেষ।

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
    def levelOrder(self, root: TreeNode | None) -> list[list[int]]:
        if root is None:
            return []

        result = []
        queue = deque()
        queue.append(root)

        while queue:
            level_values = []

            for i in range(len(queue)):
                node = queue.popleft()
                level_values.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(level_values)

        return result
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — প্রতিটা নোড ঠিক একবার কিউতে ঢোকে এবং একবার বের হয়।
- **Space Complexity:** `O(n)` — সবচেয়ে বড় লেভেলটা কিউতে রাখার জন্য।

---

# মূল কথা

> **BFS লুপের ভেতরে `for i in range(len(queue)):` দিলেই লেভেলগুলো একদম আলাদা হয়ে যায়।**
