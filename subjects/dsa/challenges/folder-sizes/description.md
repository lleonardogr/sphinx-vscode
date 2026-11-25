# Folder Sizes

Disk-usage tools show how much space each folder takes, including everything inside its subfolders, so you can see what to clean up. The folders form a **tree**, and a folder's total is its own files plus its subfolders' totals: you have to finish the children before the parent, a **post-order** traversal.

Read a list of files with their paths and sizes, and report:

- `folders: ` how many folders there are (the root, where the paths start, doesn't count);
- `total size: ` the size of all files;
- `folders over limit: ` how many folders have a total of at least `limit`;
- `largest folder: ` the path of the folder with the largest total (the alphabetically first path on a tie), and `largest folder size: ` its total. If there are no folders, print `none` and `0`.

For these files and a limit of 1000:

```
docs/report.txt 500
docs/old/draft.txt 300
photos/2024/beach.jpg 2000
photos/2024/city.jpg 1500
photos/notes.txt 10
readme.md 5
```

The folders are docs (800), docs/old (300), photos (3510) and photos/2024 (3500):

```
folders: 4
total size: 4315
folders over limit: 2
largest folder: photos
largest folder size: 3510
```

**Input**

- Line 1: `n` and `limit` (1 ≤ n ≤ 100,000; 1 ≤ limit ≤ 10¹⁵)
- Then `n` lines with a path and a size (1 to 1,000,000,000). Paths use `/` between folders; the last part is the file name. Names use letters, digits, `.`, `-` and `_`, and no file is listed twice.

**Output**

Five lines, as in the example.

**Things to know**

- Two folders with the same name in different places are different folders: docs/old and photos/old.
- A `Map<String, Folder>` of children per folder makes the tree; `path.split("/")` gives the parts.
- Totals can pass 10¹⁴: use `long`.
