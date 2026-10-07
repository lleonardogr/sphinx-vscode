## Why it matters

Every program you write ends up as electrical signals inside a few chips. You don't need to design hardware to program, but knowing the main parts explains everyday questions: why a program is slow, why your work disappears when the power goes off, and what "3 GHz" or "8 cores" means on a laptop's box.

## The main parts

| Part | What it does | Example |
|------|--------------|---------|
| **CPU** (processor) | runs the instructions of programs | a 3 GHz, 8-core chip |
| **RAM** (main memory) | holds the programs and data in use right now | 16 GB |
| **Storage** | keeps files when the power is off | a 512 GB SSD |
| **Input/output** | talks to the outside world | keyboard, screen, network, USB |

They are connected on the **motherboard** by wires called **buses**, which carry addresses, data and control signals between them.

## RAM versus storage

**RAM** is fast but **volatile**: it loses everything when the power goes off. **Storage** (SSD or hard disk) is much slower but keeps its contents. That's why a program and its files live in storage, but are **loaded into RAM** to run, and why unsaved work is lost in a power cut.

## The CPU and the fetch–decode–execute cycle

The CPU only understands very simple **machine instructions**: load a number from memory, add two numbers, compare, jump to another instruction. A program is a long list of them, stored in RAM.

The CPU runs them with one loop, repeated billions of times per second:

1. **Fetch**: read the next instruction from memory. A register called the **program counter** holds its address.
2. **Decode**: work out what the instruction asks for and which data it needs.
3. **Execute**: do it, using the **ALU** (arithmetic logic unit) for calculations, and keep the result in a **register**, a tiny storage cell inside the CPU.

Then the program counter moves to the next instruction, unless the instruction was a **jump**, which is how `if` and loops are made at this level.

## The clock

The CPU works to the beat of a **clock**. Each tick is a **cycle**. A 3 GHz (gigahertz) clock ticks 3 billion times per second, so one cycle lasts a third of a nanosecond. A simple instruction takes a few cycles, so a program's time depends on:

> time = instructions × cycles per instruction ÷ clock rate

## Cores

Clock rates stopped growing around 2005, because faster clocks made chips too hot. Instead, processors got more **cores**: several CPUs on one chip, each running its own instructions. An 8-core processor can run 8 things at the same time, but only if the program is written to split its work; a simple program like yours uses one core.

## Summary

- A computer has a CPU that runs instructions, RAM for what's in use, storage that keeps files, and input/output devices.
- RAM is fast and volatile; storage is slower and permanent. Programs are loaded into RAM to run.
- The CPU repeats fetch–decode–execute, guided by the program counter.
- A clock of n GHz ticks n billion times per second; more cores let a computer do several things at once.
