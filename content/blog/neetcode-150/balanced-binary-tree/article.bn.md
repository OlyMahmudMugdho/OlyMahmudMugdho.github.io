---
title: "Balanced Binary Tree"
date: "2026-11-20"
excerpt: "প্রতিটি নোডের বাম ও ডান সাবট্রির উচ্চতার পার্থক্য সর্বোচ্চ ১ কি না তা যাচাই করে ট্রি ব্যালেন্সড কি না বের করার সহজ ব্যাখ্যা।"
category: "Coding"
tags: ["coding", "dsa", "interview", "neetc-150"]
featured: false
author: "M. Oly Mahmud"
---

# Balanced Binary Tree

সমস্যার লিংক: https://leetcode.com/problems/balanced-binary-tree/

## সমস্যাটা কী?

একটা বাইনারি ট্রি দেওয়া আছে। আমাদের বলতে হবে ট্রি-টা **হাইট-ব্যালেন্সড (height-balanced)** কি না।

সহজ ভাষায়, ট্রি-র **প্রতিটা নোডের** বাম পাশের উচ্চতা আর ডান পাশের উচ্চতার পার্থক্য `1`-এর বেশি হওয়া যাবে না। কোনো একটা জায়গায় `2` বা তার বেশি পার্থক্য দেখলেই পুরো ট্রি-টা আনব্যালেন্সড!

---

# সহজভাবে চিন্তা করি

যেকোনো একটা নোড `root`-এর দিক থেকে ভাবলে ট্রি ব্যালেন্সড হওয়ার জন্য তিনটা কথা সত্যি হতে হবে:

1. `root`-এর বাম সাবট্রি আর ডান সাবট্রির উচ্চতার পার্থক্য `<= 1` (`abs(lefth - righth) <= 1`)।
2. `root.left` নিজে একটা ব্যালেন্সড ট্রি।
3. `root.right` নিজে একটা ব্যালেন্সড ট্রি।

আর নোড যদি খালি (`None`) হয়, তাহলে তো কোনো ঝামেলাই নেই—ওটা ব্যালেন্সড (`True`)!

---

# অ্যালগরিদম

1. `root` `None` হলে `True` রিটার্ন করি।
2. `getHeight` ফাংশন দিয়ে `lefth = getHeight(root.left)` আর `righth = getHeight(root.right)` বের করি।
3. চেক করি `abs(lefth - righth) <= 1` এবং `isBalanced(root.left)` এবং `isBalanced(root.right)`—তিনটাই `True` কি না।

```text
function isBalanced(root)
    if root is None: return True
    lefth = getHeight(root.left)
    righth = getHeight(root.right)
    return abs(lefth - righth) <= 1
           and isBalanced(root.left)
           and isBalanced(root.right)

function getHeight(node)
    if node is None: return 0
    return 1 + max(getHeight(node.left), getHeight(node.right))
```

---

# ধাপে ধাপে ড্রাই রান

ধরুন ট্রি-টা হলো `[3, 9, 20, null, null, 15, 7]`:

- **নোড `3`:** বামে `9`-এর উচ্চতা `1`, ডানে `20`-এর উচ্চতা `2`। পার্থক্য `|1 - 2| = 1 <= 1` → ঠিক আছে!
- **নোড `9`:** কোনো সন্তান নেই, উচ্চতা `0` ও `0` → ঠিক আছে!
- **নোড `20`:** বামে `15` (উচ্চতা `1`), ডানে `7` (উচ্চতা `1`)। পার্থক্য `|1 - 1| = 0 <= 1` → ঠিক আছে!

সবগুলো শর্ত পাস করেছে, তাই উত্তর `True`।

---

# কোড বিশ্লেষণ

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def isBalanced(self, root: TreeNode | None) -> bool:
        if root is None:
            return True

        lefth = self.getHeight(root.left)
        righth = self.getHeight(root.right)

        return (
            abs(lefth - righth) <= 1
            and self.isBalanced(root.left)
            and self.isBalanced(root.right)
        )

    def getHeight(self, root: TreeNode | None) -> int:
        if root is None:
            return 0

        return 1 + max(
            self.getHeight(root.left),
            self.getHeight(root.right)
        )
```

*(একটা বোনাস টিপস: এই টপ-ডাউন পদ্ধতিতে প্রতি নোডে উচ্চতা বের করায় খারাপ ক্ষেত্রে `O(n^2)` সময় লাগে। চাইলে বটম-আপ DFS দিয়ে আনব্যালেন্সড দেখলেই `-1` রিটার্ন করে `O(n)` সময়েও এটা করা যায়।)*

---

# টাইম ও স্পেস কমপ্লেক্সিটি

- **Time Complexity:** টপ-ডাউন পদ্ধতিতে `O(n^2)` (বটম-আপ DFS-এ `O(n)`)।
- **Space Complexity:** `O(h)` — রিকার্শন কল স্ট্যাকের জন্য।

---

# মূল কথা

> **শুধু রুট দেখলেই হবে না—ট্রি-র প্রতিটি নোডেই বাম ও ডান উচ্চতার পার্থক্য `<= 1` হতে হবে।**
