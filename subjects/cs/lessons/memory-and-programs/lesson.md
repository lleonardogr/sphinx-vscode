## Why it matters

The processor is so fast that it spends much of its time **waiting for memory**. Understanding the memory hierarchy explains why the same algorithm can run several times faster just by reading data in order. And knowing what happens between your `Main.java` and the running program explains what `javac` and `java` actually do.

## The memory hierarchy

There is no memory that is big, fast and cheap at the same time, so computers combine several kinds:

| Level | Typical size | Time to read | In CPU cycles (3 GHz) |
|-------|--------------|--------------|-----------------------|
| Registers | a few hundred bytes | 0.3 ns | 1 |
| L1 cache | 64 KB | 1 ns | 3 |
| L3 cache | 32 MB | 10 ns | 30 |
| RAM | 16 GB | 100 ns | 300 |
| SSD | 1 TB | 100 µs | 300,000 |
| Hard disk | 4 TB | 10 ms | 30,000,000 |

Each level is bigger and slower than the one above. If a register read took 1 second, reading RAM would take 5 minutes and reading a hard disk about a year.

## Caches

A **cache** keeps copies of recently used data close to the CPU. When the data the CPU needs is in the cache it's a **hit**; when it isn't, it's a **miss**, and the CPU waits while the data comes from a slower level.

Caches work because programs are predictable:

- **Temporal locality**: data used now is likely to be used again soon (a loop counter).
- **Spatial locality**: data next to it is likely to be needed next (the next element of an array). That's why a cache loads a whole block of 64 bytes at a time.

The average time per access is:

> average = cache time + miss rate × memory time

With a 1 ns cache, 100 ns RAM and 95% hits: 1 + 0.05 × 100 = 6 ns, instead of 100 ns without a cache. Walking through an array in order gets almost all hits; jumping around randomly gets many misses and can be ten times slower.

## From source code to a running program

The CPU only runs machine code, and each processor family has its own. Java solves this in two steps:

1. **Compile**: `javac Main.java` checks your code and translates it into **bytecode** (`Main.class`), instructions for an imaginary machine, the same on every computer.
2. **Run**: `java Main` starts the **Java Virtual Machine (JVM)**, which loads the bytecode into RAM and runs it. Code that runs often is translated into real machine code for your processor while the program runs (**JIT**, just-in-time compilation).

That's why the same `.class` file runs on Windows, macOS and Linux: "write once, run anywhere". Languages like C are compiled straight to machine code for one kind of processor; Python is usually **interpreted** by a program that reads it line by line.

When you press **Run** in Sphinx, it does exactly this: compiles your `Main.java` with `javac`, then runs it with `java`, feeding it the test input.

## Summary

- Memory is a hierarchy: registers, caches, RAM, SSD and disk, each bigger and slower.
- Caches keep recent data near the CPU; hits are fast, misses wait for slower memory.
- Average access time = cache time + miss rate × memory time; reading data in order helps.
- `javac` compiles Java to bytecode; the JVM runs it and compiles hot code to machine code.
