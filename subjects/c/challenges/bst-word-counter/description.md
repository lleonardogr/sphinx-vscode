# BST Word Counter

Count how often each word appears in a text, and list the words alphabetically. A **binary search tree** does both: each node holds a word and its count, smaller words go into the left subtree and larger ones into the right, so finding a word takes as many steps as the tree is tall, and an in-order walk visits the words in order.

```
the cat and the hat   →   and 1
                          cat 1
                          hat 1
                          the 2
                          Total: 5
                          Distinct: 4
                          Height: 3
```

`the` is the root; `cat` goes left, then `and` left of `cat`, `hat` right of `cat`: three levels.

**Input**

Text until the end of the input. A word is a run of letters `A`–`Z` or `a`–`z`, compared in lowercase; every other character (digits, punctuation, spaces) separates words. Words have at most 50 letters.

**Output**

Each distinct word and its count, alphabetically; then `Total: ` (all words), `Distinct: ` and `Height: ` (the number of levels of the tree, 0 for an empty tree), with the words inserted in the order they appear.

**Things to know**

- A node: the word, its count, and `left` and `right` pointers. A recursive `insert` that returns the node it was given (or a new one) links new nodes neatly.
- In-order walk: left subtree, the node, right subtree.
- `Don't` is two words, `don` and `t`, because `'` is not a letter.
- Free every node at the end: free the children before the node.
