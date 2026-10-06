# Storage Units

Read a size in **bytes** and print it in two ways: with the **SI** units that disks and file managers on macOS use (KB, MB, GB…, multiples of **1000**), and with the **binary** units that Windows and RAM use (KiB, MiB, GiB…, multiples of **1024**).

1,500,000 bytes is **1.50 MB** but only **1.43 MiB**, because a MiB (1,048,576 bytes) is bigger than a MB (1,000,000 bytes).

| SI | Bytes | Binary | Bytes |
|----|-------|--------|-------|
| KB | 1000 | KiB | 1024 |
| MB | 1000² | MiB | 1024² |
| GB | 1000³ | GiB | 1024³ |
| TB | 1000⁴ | TiB | 1024⁴ |
| PB | 1000⁵ | PiB | 1024⁵ |

For each system, use the **largest unit in which the value is at least 1**, and print the value with **2 decimals**. Sizes below one kilobyte (or kibibyte) are printed as whole bytes, like `512 B`.

**Input**

A whole number of bytes (0 ≤ bytes ≤ 2 × 10¹⁵).

**Output**

Two lines: `SI: ` and the size in SI units, then `Binary: ` and the size in binary units.

**Things to know**

- Dividing by 1000 (or 1024) while the value is still 1000 (or 1024) or more finds the right unit. Count the divisions: 1 is K, 2 is M, 3 is G, …
- Divide a `double`, not a `long`, so the decimals aren't lost: `double value = bytes;`
- `String.format("%.2f", 1.4305)` gives `"1.43"`.
