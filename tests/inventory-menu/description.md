# Inventory Menu

Build a **store inventory** app with a menu. It keeps track of how many units of each product are in stock. This test combines **conditionals**, **loops**, **strings**, a **map** and your own **methods**.

**What your program does**

1. Print the menu **once**, at the start:

   ```
   === Inventory ===
   1. Add stock
   2. Sell
   3. Show inventory
   4. Search
   0. Exit
   ```

2. Then read options, one per line, until the option is `0`:

| Option | Reads | Prints |
|--------|-------|--------|
| `1` | a line `<product> <quantity>` | `<product>: <new total>` |
| `2` | a line `<product> <quantity>` | `Sold <quantity> <product>, <left> left`. See the rules below |
| `3` | nothing | each product as `<product>: <quantity>`, **sorted by name**, then `Total units: <sum>`. If there are no products: `Inventory is empty` |
| `4` | a line with some text | every product whose name **contains** the text, as `<product>: <quantity>` sorted by name, or `No matches` |
| `0` | nothing | `Goodbye!`, and the program ends |
| anything else | nothing | `Invalid option` |

**Rules**

- Product names are one word and **not case-sensitive**: `Apple`, `APPLE` and `apple` are the same product. Always print them in **lowercase**. The search text isn't case-sensitive either.
- A quantity must be **greater than 0**. Otherwise print `Invalid quantity` and change nothing (for options `1` and `2`).
- Selling a product that isn't in stock prints `<product> not found`.
- Selling more than is in stock prints `Not enough <product> (only <quantity> left)` and changes nothing.
- When a product's stock reaches `0`, remove it from the inventory.

**Example**

Input:

```
1
Apple 5
1
banana 3
1
apple 2
2
apple 10
2
banana 3
3
4
an
0
```

Output:

```
=== Inventory ===
1. Add stock
2. Sell
3. Show inventory
4. Search
0. Exit
apple: 5
banana: 3
apple: 7
Not enough apple (only 7 left)
Sold 3 banana, 0 left
apple: 7
Total units: 7
No matches
Goodbye!
```

**Things to know**

- A `TreeMap<String, Integer>` keeps its keys sorted, so the inventory prints in name order for free.
- `map.getOrDefault(name, 0)`, `map.put(name, value)`, `map.remove(name)` and `map.containsKey(name)` cover most of what you need.
- `text.toLowerCase()` and `name.contains(text)` help with names and searching.
- Small methods, such as `void printItems(Map<String, Integer> items)`, keep the menu loop readable.
