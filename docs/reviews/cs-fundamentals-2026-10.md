# Review: CS Fundamentals, October 2026

> **Progress:** unit 1 (the pilot) is done: a reading guide, Stack Machine and Cache Simulator replace CPU Time and Average Memory Access Time, Instruction Decoder is Easy, and the quiz was rewritten. Unit 8 is done: a reading guide, Read an HTTP Request and Routing Table replace Packet Splitter and IP Address to Number, Subnet Calculator is Medium, and the quiz was rewritten. Unit 6 is done: a reading guide, Parity Bit and Ripple-Carry Adder replace Bit Checker and Truth Table, and the quiz has fewer "what does this print" questions. Unit 5 is done: a reading guide, Case Flipper and Run-Length Encoding replace Character Codes and Media Size, Hex Colors adds brightness and a readable text color, and the quiz covers compression. Unit 3 is done: a reading guide, How Many Bits? merges How Many Values? and Bits Needed, Read a BMP Header takes the freed slot, Download Time is Medium, and two recall questions became calculations. Unit 7 is done: a reading guide, and Fast Power replaces Count the Operations. Unit 4 is done: a reading guide (its challenges and quiz were kept). Unit 2 is done: a reading guide, a real-world opening for each challenge, and two quiz questions about misconceptions. **Every unit now follows the guide.**

A review of the whole CS Fundamentals subject (v1.4.0) against the [content guide](../content-guide.md): 16 lessons, 8 quizzes and 32 challenges. It proposes what to keep, revise and replace. **Nothing changes until the teacher approves the proposals.**

**Scores** follow [the rubric](../content-guide.md#the-rubric): **C**oncept, **F**it, **T**ests, **G**uidance, **H**ook, **D**istinct, each 1–3. *Concept* 1 → replace; any other 1 → revise.

## Summary

| | Keep | Revise | Replace |
|---|------|--------|---------|
| Challenges (32) | 19 | 2 | 11 |
| Quizzes (8) | 2 | 6 (2 heavily) | 0 |
| Lessons (16) | 0 | 16 → 8 reading guides | 0 |

**What works.** Every challenge has 7–12 tests (5–10 hidden), two reference solutions and three hints; validation is strict and bilingual. The strongest challenges simulate or build something: Tiny CPU, Base Converter, UTF-8 Encoder, 8-bit Register, Subnet Calculator, Pair Sum.

**What doesn't.**

1. **Formula challenges** (CPU Time, Average Access Time, Media Size, Packet Splitter): the description gives the formula, so they practise Java input and output more than the idea. They fail the concept test and become quiz questions.
2. **Look-alikes** (How Many Values? and Bits Needed; Hex Colors repeats unit 2's hex conversion; IP Address to Number repeats base conversion).
3. **Recall-heavy quizzes:** Computers and Networks ask 7 recall questions out of 10. Logic asks "what does this print?" 7 times.
4. **Lessons are long text:** 490–780 words each, only 2 diagrams in 16 lessons. They will become reading guides.
5. **Not yet measured:** difficulty and prerequisites were set by design, not by watching a class. The pilot should check them with real students.

## Proposed changes, by unit

### 1 · How Computers Work: the weakest unit

**Objectives:** name what CPU, RAM and storage do; trace the fetch–decode–execute cycle; explain why caches make programs faster; describe how `javac` and the JVM run a program.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| CPU Time | Easy | 1 | 2 | 2 | 2 | 2 | 3 | **Replace** → quiz question |
| Average Memory Access Time | Easy | 1 | 2 | 2 | 2 | 2 | 3 | **Replace** → quiz question |
| Instruction Decoder | Medium | 3 | 2 | 2 | 3 | 2 | 3 | Keep, as **Easy** |
| Tiny CPU | Hard | 3 | 3 | 3 | 3 | 3 | 3 | Keep |

**New challenges:**

- **Stack Machine** (Easy/Medium): evaluate a program like `PUSH 3`, `PUSH 4`, `ADD`, `PRINT`. The JVM itself is a stack machine, which links straight to the bytecode lesson.
- **Cache Simulator** (Medium): a direct-mapped cache with N lines; read a sequence of addresses and print hit or miss for each, then the hit rate. Students *see* locality instead of reading a formula.

**Quiz:** revise heavily (7 of 10 are recall). Add:
- a 3-line Tiny CPU trace;
- "which loop is cache-friendly?" with two code snippets;
- the two formulas from the replaced challenges (CPU time, average access time) as calculations;
- a "why does the JVM need bytecode?" question.

### 2 · Number Systems

**Objectives:** convert between binary, decimal and hexadecimal; explain why hex is used for bytes; read binary, hex and octal literals in Java.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| Binary to Decimal | Easy | 3 | 3 | 3 | 3 | 2 | 3 | Keep |
| Decimal to Binary | Easy | 3 | 3 | 3 | 3 | 2 | 3 | Keep |
| Hex to Decimal | Medium | 3 | 3 | 3 | 3 | 2 | 2 | Keep |
| Base Converter | Hard | 3 | 3 | 3 | 3 | 2 | 3 | Keep |

Add a real-world hook to each description (memory addresses, colors, file dumps). **Quiz:** minor revision. Six of ten questions are conversions; swap two for misconception questions (why one hex digit is 4 bits; reading a long binary number in groups).

### 3 · Bits and Bytes

**Objectives:** compute how many values n bits hold and how many bits a number needs; convert between SI and binary units; tell bits from bytes in speeds; read multi-byte values in both byte orders.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| How Many Values? | Easy | 2 | 3 | 2 | 3 | 2 | 1 | **Merge** with Bits Needed |
| Bits Needed | Easy | 2 | 3 | 3 | 3 | 2 | 1 | **Merge** into "How Many Bits?" (both directions) |
| Storage Units | Medium | 3 | 3 | 3 | 3 | 3 | 3 | Keep |
| Download Time | Hard | 2 | 1 | 3 | 3 | 3 | 3 | **Revise**: it is Medium, not Hard |

**New challenge in the freed slot:** **Read a BMP Header** (Hard). Given the first bytes of an image file as hex, read the little-endian width, height and bits per pixel, and print the image size. This teaches byte order (endianness) with a real file format. **Quiz:** minor revision (4 recall questions).

### 4 · Representing Numbers: keep

**Objectives:** write and read 8-bit two's complement; predict overflow in Java; explain why `0.1 + 0.2 != 0.3`; choose a safe type for money.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| Two's Complement | Easy | 3 | 3 | 3 | 3 | 2 | 2 | Keep |
| Read a Signed Byte | Easy | 3 | 3 | 3 | 3 | 2 | 2 | Keep (a mirror pair that teaches both directions) |
| Overflow Detector | Medium | 3 | 3 | 3 | 3 | 3 | 3 | Keep |
| Binary Fractions | Hard | 3 | 3 | 3 | 3 | 3 | 3 | Keep |

**Quiz:** keep (3 recall, 3 predict-the-output).

### 5 · Text, Images and Sound

**Objectives:** use character codes in Java; explain Unicode and UTF-8 and encode a code point; describe pixels and colors as bytes; explain lossless compression.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| Character Codes | Easy | 2 | 3 | 2 | 3 | 2 | 3 | **Replace** with "Case Flipper" |
| Media Size | Easy | 1 | 3 | 2 | 3 | 3 | 3 | **Replace** → quiz question |
| Hex Colors | Medium | 2 | 3 | 3 | 3 | 3 | 1 | **Revise**: add a color idea |
| UTF-8 Encoder | Hard | 3 | 3 | 3 | 3 | 3 | 3 | Keep |

- **Case Flipper** (Easy): swap upper and lower case using only character codes (±32), without `toUpperCase`. It practises the code arithmetic that Character Codes only showed.
- **Run-Length Encoding** (Medium, replaces Media Size): compress `AAAABBBCC` to `4A3B2C` and back. Students build real lossless compression.
- **Hex Colors**: besides `rgb(…)`, compute the perceived brightness and say whether black or white text is readable on that color. This avoids repeating unit 2.

**Quiz:** minor revision (memorized codes such as 65 and 97 count as recall).

### 6 · Logic and Bitwise Operations

**Objectives:** evaluate gates and truth tables; apply De Morgan's laws; use masks to test, set, clear and flip bits; explain how gates add numbers.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| Truth Table | Easy | 1 | 3 | 2 | 3 | 1 | 3 | **Replace**: it can be solved by a lookup table (the classic solution does exactly that) |
| Bit Checker | Easy | 2 | 3 | 2 | 3 | 1 | 2 | **Replace** with "Parity Bit" |
| Permission Flags | Medium | 3 | 3 | 3 | 3 | 3 | 3 | Keep, as **Easy/Medium** |
| 8-bit Register | Hard | 3 | 3 | 3 | 3 | 2 | 3 | Keep |

- **Parity Bit** (Easy): count the 1 bits with `&` and `>>`, add an even-parity bit, and detect a one-bit error. This is how memory and serial links catch errors.
- **Ripple-Carry Adder** (Medium): add two 8-bit numbers one bit at a time using only XOR, AND and OR, and print the sum and the final carry. This is how the CPU adds.

**Quiz:** revise. It has 7 "what does this print?" questions on single operators; replace about four with situations (pick the mask that clears bit 3, simplify a condition with De Morgan, read a truth table).

### 7 · Algorithms and Complexity

**Objectives:** compare linear and binary search; trace a simple sort; estimate Big O from loops; explain why a better algorithm beats a faster computer.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| Count the Operations | Easy | 1 | 3 | 2 | 2 | 1 | 3 | **Replace**: students type loops they were given |
| Search Steps | Easy | 3 | 3 | 3 | 3 | 2 | 3 | Keep |
| Selection Sort Trace | Medium | 3 | 3 | 3 | 3 | 2 | 3 | Keep |
| Pair Sum: Slow and Fast | Hard | 3 | 3 | 3 | 3 | 2 | 3 | Keep |

**New challenge: Fast Power** (Medium). Compute aⁿ mod m by repeated squaring, and count the multiplications against the naive way: O(log n) against O(n). This is where cryptography gets its speed. **Quiz:** keep (2 recall). Count the Operations' idea is already covered by quiz questions 6 and 7.

### 8 · Networks and the Internet

**Objectives:** follow a request through DNS, TCP and HTTP; validate and convert IPv4 addresses; compute a subnet's network, broadcast and hosts; choose a route by longest prefix match.

| Challenge | Level | C | F | T | G | H | D | Verdict |
|-----------|-------|---|---|---|---|---|---|---------|
| Valid IPv4 Address | Easy | 2 | 3 | 3 | 3 | 3 | 3 | Keep |
| Packet Splitter | Easy | 1 | 3 | 2 | 3 | 2 | 3 | **Replace** → quiz question |
| IP Address to Number | Medium | 2 | 3 | 2 | 3 | 2 | 1 | **Replace** (it is a step of the subnet calculator) |
| Subnet Calculator | Hard | 3 | 3 | 3 | 3 | 3 | 3 | Keep, as **Medium** |

- **Read an HTTP Request** (Easy/Medium): parse a request line and headers and print the method, path and host. Malformed requests get an error. This is what every web server does first.
- **Routing Table** (Hard): given routes such as `10.0.0.0/8 → A` and `10.1.0.0/16 → B`, choose the next hop for each address by **longest prefix match**, exactly as a router does.

**Quiz:** revise heavily (7 recall). Add "are these two addresses on the same /24?", "which protocol for a video call, and why?", "put the steps of opening a page in order", and the packet-count calculation from Packet Splitter.

## Reading guides: one per unit

All 16 lessons become reading guides (an "In short" summary, 1–3 readings and check-yourself questions). Two lessons per unit can merge into **one guide per unit**, with two readings when a unit has two topics.

**A diagram for each summary:**

| Unit | Diagram |
|------|---------|
| 1 | the fetch–decode–execute loop |
| 2 | place values (exists) |
| 3 | bits doubling the patterns (exists) |
| 4 | the 8-bit two's complement circle |
| 5 | UTF-8 byte patterns |
| 6 | a half adder made of gates |
| 7 | growth curves of O(1) to O(n²) |
| 8 | a packet's header and payload, and an address split by its prefix |

**Candidate readings**, to be checked one by one in Phase 4:

| Unit | Candidates |
|------|------------|
| 1 | Crash Course Computer Science (CPU, RAM); CS50 notes on memory; makingsoftware.com |
| 2 | Khan Academy: binary and hexadecimal |
| 3 | Khan Academy or CS50: bits and bytes; an article on SI vs binary prefixes |
| 4 | floating-point-gui.de; Computerphile: floating point and two's complement |
| 5 | Joel Spolsky, "The Absolute Minimum… Unicode"; an article on how images and audio are stored |
| 6 | Crash Course: Boolean logic; nandgame.com (build a computer from NAND gates, interactive) |
| 7 | Khan Academy: Algorithms (Cormen and Balkcom); VisuAlgo (interactive sorting) |
| 8 | Cloudflare Learning Center: DNS, IP, TCP/UDP, HTTP; howdns.works |

## Suggested order

1. **Reading guides in the app** (Phase 3): the `readings` format, the lesson panel cards, validator checks and the weekly link check.
2. **Pilot: unit 1.** It needs every kind of change: a reading guide, two new challenges, a level change and a quiz rewrite. One PR, which the teacher tries with the class before going on.
3. **The other units, weakest first:** 8, 6, 5, 3, 7, then the light touches in 2 and 4. One PR per unit.
4. **The AI skill** (Phase 5), written from what the pilot taught us, and used to build the CS tests and exams.
