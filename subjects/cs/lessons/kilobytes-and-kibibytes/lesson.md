## Why it matters

You buy a 1 TB disk, plug it into a Windows computer, and it says **931 GB**. Your internet plan promises **100 megabits**, but downloads never go faster than about **12 megabytes** per second. Nobody is cheating you: these are two measuring mix-ups, and once you know them you can always do the math yourself.

## Two kinds of "kilo"

In everyday life, *kilo* means 1000: a kilometre is 1000 metres. These are the **SI prefixes**, and disk makers, network speeds and macOS use them for bytes too:

| Unit | Name | Bytes |
|------|------|-------|
| KB | kilobyte | 1000 |
| MB | megabyte | 1000² = 1,000,000 |
| GB | gigabyte | 1000³ = 1,000,000,000 |
| TB | terabyte | 1000⁴ |

Computers, however, count in powers of 2, and 2¹⁰ = **1024** is very close to 1000. So for decades memory was also measured in "kilobytes" of 1024 bytes. To avoid confusion, these **binary prefixes** got their own names, with an *i* in them:

| Unit | Name | Bytes |
|------|------|-------|
| KiB | kibibyte | 1024 |
| MiB | mebibyte | 1024² = 1,048,576 |
| GiB | gibibyte | 1024³ = 1,073,741,824 |
| TiB | tebibyte | 1024⁴ |

RAM is always sold in binary sizes: an "8 GB" memory stick holds 8 GiB.

## The case of the missing gigabytes

A **1 TB** disk holds 1,000,000,000,000 bytes. Windows divides by 1024³, which gives:

1,000,000,000,000 ÷ 1,073,741,824 ≈ **931.3**

and shows the result with the label "GB", although it means GiB. Not a single byte is missing: the same bytes are counted with a bigger unit. The bigger the prefix, the bigger the gap: a KiB is 2.4% bigger than a KB, but a TiB is almost 10% bigger than a TB.

## Converting between units

To find the right unit for a size, keep dividing by 1000 (or 1024) **while the value is at least 1000** (or 1024), and count the divisions:

1,500,000 bytes ÷ 1000 = 1500 KB, ÷ 1000 = **1.5 MB** (two divisions: M).

1,500,000 bytes ÷ 1024 = 1464.8 KiB, ÷ 1024 = **1.43 MiB**.

## Bits per second, bytes per file

The second mix-up is between **bits** and **bytes**. Look at the letter case:

- **b** (lower case) is a **bit**: speeds are in Mbps, megabits per second.
- **B** (upper case) is a **byte**: file sizes are in MB, megabytes.

Since a byte is 8 bits, divide a speed by 8 to get bytes per second. A 100 Mbps connection moves at most 100 ÷ 8 = **12.5 MB per second**. Real downloads are a little slower, because some of the bits are used to address and check the data.

## How long will a download take?

Turn everything into bits, then divide:

> time = size in bytes × 8 ÷ speed in bits per second

A 700 MB file is 700 × 1,000,000 × 8 = 5,600,000,000 bits. At 100 Mbps, that is 5,600,000,000 ÷ 100,000,000 = **56 seconds**. A 4 GiB game is 4 × 1,073,741,824 × 8 bits; at 50 Mbps it takes about 687 seconds, more than 11 minutes.

## Summary

- SI prefixes (KB, MB, GB, TB) multiply by 1000; binary prefixes (KiB, MiB, GiB, TiB) multiply by 1024.
- A 1 TB disk shows 931 "GB" on Windows because Windows divides by 1024³.
- Speeds are in bits (b), sizes in bytes (B): divide a speed by 8 to get bytes per second.
- Download time = bytes × 8 ÷ bits per second.
