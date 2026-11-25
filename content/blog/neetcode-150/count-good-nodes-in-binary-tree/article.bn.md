---
title: "Count Good Nodes in Binary Tree"
date: "2026-11-20"
excerpt: "DFS-এর মাধ্যমে রুট থেকে আসার পথে সর্বোচ্চ মান (mx) ট্র্যাক করে বাইনারি ট্রির মোট গুড নোডের সংখ্যা বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Count Good Nodes in Binary Tree

সমস্যার লিংক: https://leetcode.com/problems/count-good-nodes-in-binary-tree/

## সমস্যাটা কী?

একটা বাইনারি ট্রি `root` দেওয়া আছে। কোনো নোড `X`-কে তখনই **গুড (good) নোড** বলা হবে, যখন `root` থেকে `X` পর্যন্ত আসার রাস্তায় `X`-এর চেয়ে বড় কোনো নোড না থাকে। পুরো ট্রিতে মোট কয়টা গুড নোড আছে, সেটাই বের করতে হবে।

যেমন:

```tree
3 : good !hit
  1
    3 : good !hit
    _ !ghost
  4 : good !hit
    1
    5 : good !hit
```

এখানে রুট `3`, নিচের বামের `3`, ডানের `4`, আর ডানের `5`—মোট `4`টা গুড নোড আছে।

---

# সহজভাবে চিন্তা করি

"রুট থেকে আসার পথে আমার চেয়ে বড় কেউ নেই"—এই কথাটাকে আরেকটু সহজভাবে বললে কী দাঁড়ায়?

> ওই রাস্তায় এখন পর্যন্ত পাওয়া **সর্বোচ্চ মান `mx`**-এর চেয়ে আমার মান কম নয় (`root.val >= mx`)!

তাহলে আমরা যদি **DFS** চালানোর সময় ফাংশনের প্যারামিটার হিসেবে `mx` (ওই পথের সর্বোচ্চ মান) নিচে পাঠিয়ে দিই, তাহলে প্রতিটা নোড নিজেই চেক করতে পারবে সে গুড কি না, এরপর `mx = max(root.val, mx)` আপডেট করে বাম ও ডান সন্তানের কাছে পাঠিয়ে দেবে।

---

# অ্যালগরিদম

1. রুট থেকে `dfs(root, root.val)` কল করি।
2. `dfs(root, mx)` ফাংশনে:
   - `root` `None` হলে `0` রিটার্ন করি।
   - `root.val >= mx` হলে `good = 1`, নাহলে `good = 0` ধরি।
   - `mx = max(root.val, mx)` আপডেট করি।
   - `good + dfs(root.left, mx) + dfs(root.right, mx)` রিটার্ন করি।

```text
function goodNodes(root)
    return dfs(root, root.val)

function dfs(node, mx)
    if node is None: return 0
    good = 1 if node.val >= mx else 0
    mx = max(node.val, mx)
    return good + dfs(node.left, mx) + dfs(node.right, mx)
```

---

# ধাপে ধাপে ড্রাই রান

`[3, 1, 4, 3, null, 1, 5]` নিয়ে দেখি:

1. `dfs(3, 3)`: `3 >= 3` → `good = 1`, `mx = 3`।
2. বামে `dfs(1, 3)`: `1 < 3` → `good = 0`, `mx = 3`। এর বামে `dfs(3, 3)` → `3 >= 3` (`good = 1`)। তাই বাম পাশ থেকে এল `1`।
3. ডানে `dfs(4, 3)`: `4 >= 3` → `good = 1`, নতুন `mx = 4`।
   - বামে `dfs(1, 4)`: `1 < 4` → `0`।
   - ডানে `dfs(5, 4)`: `5 >= 4` → `1`।
   - ডান পাশ থেকে এল `1 + 0 + 1 = 2`।
4. রুটে ফিরে মোট যোগফল: `1 + 1 + 2 = 4`।

---

# কোড বিশ্লেষণ

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        return self.dfs(root, root.val)

    def dfs(self, root: TreeNode, mx: int):
        if root is None:
            return 0

        good = 0
        if root.val >= mx:
            good = 1

        mx = max(root.val, mx)

        return good + self.dfs(root.left, mx) + self.dfs(root.right, mx)
```

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** `O(n)` — প্রতিটা নোড ঠিক একবার ভিজিট হয়।
- **Space Complexity:** `O(h)` — রিকার্শন কল স্ট্যাকের জন্য (`O(log n)` ব্যালেন্সড ট্রিতে, `O(n)` স্কিউড ট্রিতে)।

---

# মূল কথা

> **টপ-ডাউন DFS-এ পথের অবস্থা (`mx`) ফাংশনের আর্গুমেন্টে পাঠালে প্রতিটা ব্রাঞ্চের হিসাব একদম আলাদা ও পরিষ্কার থাকে।**
