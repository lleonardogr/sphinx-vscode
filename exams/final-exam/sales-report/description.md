# Sales Report

Read the sales of a company and print a report with streams (no loops). The revenue of a sale is `quantity × price`.

For

```
North Pen 10 2.50
South Pen 15 2.50
North Notebook 3 12.00
South Ruler 4 1.25
```

the report is

```
Total revenue: 103.50
By region:
  North: 61.00
  South: 42.50
Best seller: Pen (25 units)
```

Regions are sorted by revenue, **highest first**; on a tie, alphabetically.

The **best seller** is the product with the most units sold in total; on a tie, the name that comes first alphabetically.

**Input**

- Line 1: `n` (at least 1)
- Then `n` lines `REGION PRODUCT QUANTITY PRICE` (single words; the price has two decimals)

**Output**

As above, amounts with two decimals and two spaces before each region.

**Things to know**

- `Collectors.groupingBy(key, Collectors.summingDouble(...))` and `summingInt(...)` add up values per group.
- Sort map entries with `Map.Entry.<String, Double>comparingByValue().reversed().thenComparing(Map.Entry.comparingByKey())`.
- `Stream.generate(IO::readln).limit(n)` reads the lines without a loop.
