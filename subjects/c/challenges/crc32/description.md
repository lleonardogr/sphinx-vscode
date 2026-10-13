# CRC-32

When a ZIP file, a PNG image or an Ethernet frame arrives, the receiver recomputes a **CRC-32**, a 32-bit check value, and compares it with the one sent. A single changed bit gives a completely different CRC. It is computed with nothing but shifts and XOR, one bit at a time:

```
crc = 0xFFFFFFFF
for each byte:
    crc = crc XOR byte
    repeat 8 times:
        if the lowest bit of crc is 1:  crc = (crc >> 1) XOR 0xEDB88320
        otherwise:                      crc = crc >> 1
result = crc XOR 0xFFFFFFFF
```

This is the CRC-32 of ZIP, PNG and Ethernet; its usual check value is the CRC of `123456789`:

```
123456789   →   cbf43926 length=9
hello       →   3610a686 length=5
```

**Input**

Lines of ASCII text until the end of the input, each up to 1000 characters (maybe empty). The last line may have no newline.

**Output**

For each line, its CRC-32 as 8 lowercase hexadecimal digits (`%08x`), then ` length=` and the number of bytes. The newline is not part of the line.

**Things to know**

- Use `uint32_t` from `<stdint.h>`: an unsigned type, so `>>` shifts zeros in.
- `crc & 1u` is the lowest bit.
- An empty line has CRC `00000000`.
