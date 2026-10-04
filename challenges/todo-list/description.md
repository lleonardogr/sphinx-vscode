# To-Do List (ArrayList)

Arrays have a fixed size. An **`ArrayList`** grows and shrinks as you add and remove items. Use one to manage a to-do list.

**Input**

- Line 1: the number of commands `n`
- Next `n` lines: one command each:
  - `add <item>`: add the item (one word) to the end of the list; prints nothing
  - `remove <item>`: remove the first occurrence of the item
  - `count`: how many items are in the list
  - `print`: show the list

**Output**

| Command | Prints |
|---------|--------|
| `remove` | `Removed <item>`, or `<item> not found` |
| `count` | `Items: <size>` |
| `print` | the items separated by `, `, or `(empty)` |

**Things to know**

- `List<String> items = new ArrayList<>();` creates an empty list.
- `items.add(x)`, `items.remove(x)` (returns `true` if it removed something), `items.size()`, `items.isEmpty()`.
- `String.join(", ", items)` joins the items into one String.
