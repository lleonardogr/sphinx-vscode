# Download Time

Read the size of a file and the speed of an internet connection, and print how long the download takes.

Sizes are measured in **bytes** (B), but connection speeds in **bits** per second (bps), and a byte is 8 bits. A 700 MB file is 700 × 1,000,000 × 8 = 5,600,000,000 bits; at 100 Mbps (100,000,000 bits per second) it takes **56 seconds**.

| Size units | Bytes | Speed units | Bits per second |
|------------|-------|-------------|-----------------|
| `B` | 1 | `bps` | 1 |
| `KB`, `MB`, `GB`, `TB` | 1000, 1000², 1000³, 1000⁴ | `Kbps` | 1000 |
| `KiB`, `MiB`, `GiB`, `TiB` | 1024, 1024², 1024³, 1024⁴ | `Mbps` | 1000² |
| | | `Gbps` | 1000³ |

**Input**

Two lines. The first is the size: a whole number (0 to 1000), a space and a size unit. The second is the speed: a whole number (1 to 1000), a space and a speed unit. Units are written exactly as in the table.

**Output**

`Time: ` followed by the time as `hours:minutes:seconds`, with minutes and seconds in two digits, such as `Time: 0:00:56`. Round **up** to a whole second: a download that takes 687.2 seconds needs 688.

If a unit isn't in the table, print `Invalid unit: ` followed by it, checking the size first.

**Things to know**

- Write methods that turn an amount and a unit into bytes, and into bits per second: `long bytes(long amount, String unit)`. Return `-1` for a unit you don't know.
- Use `long`: 2 TB is 16 trillion bits, far beyond what fits in an `int`.
- With whole numbers, `(a + b - 1) / b` divides and rounds up.
