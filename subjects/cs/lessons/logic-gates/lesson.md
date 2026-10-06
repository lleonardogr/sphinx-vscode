## Why it matters

Every `if` you write depends on a condition that is either true or false. Inside the processor, the same idea is built from tiny circuits called **logic gates**, and everything a computer does, adding, comparing, choosing, is made by combining them. This logic is named **Boolean** after George Boole, who described it in 1854.

## True and false as bits

Boolean logic has only two values: **true** and **false**, or **1** and **0**. A gate takes one or two input bits and produces one output bit. Its **truth table** lists the output for every combination of inputs.

## The basic gates

| A | B | AND | OR | XOR | NAND | NOR |
|---|---|-----|----|-----|------|-----|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

- **AND** is 1 only when both inputs are 1.
- **OR** is 1 when at least one input is 1.
- **XOR** (exclusive or) is 1 when the inputs are different.
- **NOT** has one input and flips it: NOT 0 = 1, NOT 1 = 0.
- **NAND** and **NOR** are AND and OR followed by NOT.

NAND is special: every other gate can be built from NAND gates alone, so in principle a whole processor could be made of one kind of gate.

## Gates in Java

Java's boolean operators are the same gates:

| Gate | Java |
|------|------|
| AND | `a && b` |
| OR | `a \|\| b` |
| XOR | `a ^ b` |
| NOT | `!a` |

```java
boolean adult = age >= 18;
boolean hasTicket = true;
if (adult && hasTicket) { ... }   // AND
if (!adult || !hasTicket) { ... } // the opposite, by De Morgan
```

`&&` and `||` are **short-circuit** operators: if the left side already decides the answer, the right side isn't evaluated. That's why `s != null && s.length() > 0` is safe.

## De Morgan's laws

Two rules help you simplify conditions:

- NOT (A AND B) = (NOT A) OR (NOT B)
- NOT (A OR B) = (NOT A) AND (NOT B)

In Java: `!(a && b)` is the same as `!a || !b`. "Not (rainy and cold)" means "not rainy, or not cold".

## Adding with gates

Gates can do arithmetic. Adding two bits gives a sum bit and a carry bit:

| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

The sum column is exactly **XOR** and the carry column is exactly **AND**. Chain 32 of these adders (with the carries passed along) and you can add two `int`s: that is how the processor's adder works.

## Summary

- Boolean logic works with two values, true and false, which computers store as 1 and 0.
- AND, OR, XOR, NOT, NAND and NOR are the basic gates; a truth table lists their outputs.
- In Java: `&&`, `||`, `^` and `!`; `&&` and `||` skip the right side when they can.
- De Morgan: `!(a && b)` equals `!a || !b`. XOR and AND together add two bits.
