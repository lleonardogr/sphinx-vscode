# Number to Words

Cheques, contracts and screen readers write numbers in words. Read numbers and print each one in English words:

```
123405   →   one hundred twenty-three thousand four hundred five
42       →   forty-two
0        →   zero
1000     →   one thousand
```

**Input**

Whole numbers from 0 to 999,999, one per line, until the end of the input.

**Output**

Each number in lowercase English words:

- `one` to `nineteen`; the tens `twenty`, `thirty`, `forty`, `fifty`, `sixty`, `seventy`, `eighty`, `ninety`, joined to the ones by a hyphen (`ninety-nine`);
- hundreds as `… hundred`, followed by the rest after a space (`one hundred five`, no "and");
- thousands as `… thousand`, followed by the rest after a space;
- single spaces between words, and `zero` for 0.

**Things to know**

- A function that writes 1 to 999 does most of the work: the thousands part uses it too.
- Build the line in a `char` array with `strcat` or `snprintf`, or print the words as you go.
