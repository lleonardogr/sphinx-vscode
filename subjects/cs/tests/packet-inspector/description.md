# Packet Inspector

**Wireshark** lets you see the packets a computer sends and receives, byte by byte, and decodes each one. Build a tiny version: decode one IPv4 packet that carries **UDP**.

You get the packet as hex bytes. It starts with the **IPv4 header**:

| Bytes | Field |
|---|---|
| 0 | high 4 bits: the **version** (4); low 4 bits: the **header length** in 4-byte words (5 means 20 bytes) |
| 2–3 | the **total length** of the packet in bytes, header included |
| 8 | the **TTL** (time to live) |
| 9 | the **protocol**: 1 is ICMP, 6 is TCP, 17 is UDP |
| 10–11 | the header **checksum** |
| 12–15 | the **source** address |
| 16–19 | the **destination** address |

The bytes not listed (1, 4–7) are other fields you can skip. A header longer than 20 bytes has options at the end; the next part starts at the header length. Numbers of two bytes are **big-endian**: the first byte is the high one, so `00 25` is 37.

**The checksum** catches corrupted headers. Add the header's bytes as 16-bit numbers (bytes 0–1, 2–3 and so on, the checksum included). Whenever the sum goes over `FFFF`, take the part above 16 bits off and add it back at the bottom: `sum = (sum & 0xFFFF) + (sum >> 16)`. The header is **valid** when the final sum is `FFFF`.

When the protocol is UDP, the **UDP header** follows: 8 bytes, of which bytes 0–1 are the **source port** and 2–3 the **destination port**. The **payload** (the data) comes after it and ends at the total length. Bytes after that are padding, not part of the packet.

Print:

```
Version: 4
Header length: 20 bytes
Total length: 37 bytes
TTL: 64
Protocol: UDP (17)
Source: 192.168.1.20
Destination: 10.0.0.5
Checksum: 0x52C1 (valid)
Ports: 51000 -> 514
Payload: Hi Sphinx
```

- The checksum is the value of bytes 10–11 as 4 upper-case hex digits, then `(valid)` or `(invalid)`.
- Protocols other than 1, 6 and 17 are `Unknown`, such as `Protocol: Unknown (99)`.
- Print `Ports` and `Payload` only for UDP. In the payload, bytes 32 to 126 are printed as their ASCII character and any other byte as `.`; an empty payload is `Payload: (empty)`.
- If the version isn't 4, print only `Not IPv4`.

**Input**

One line: the packet's bytes as 2-digit hex numbers (upper or lower case) separated by spaces. The example above is:

```
45 00 00 25 1c 46 40 00 40 11 52 c1 c0 a8 01 14 0a 00 00 05 c7 38 02 02 00 11 00 00 48 69 20 53 70 68 69 6e 78
```

**Output**

The lines above.

**Things to know**

- `Integer.parseInt("c0", 16)` reads a hex byte, and `"%04X".formatted(n)` prints 4 hex digits.
- `b >> 4` gives the high 4 bits of a byte, and `b & 0x0F` the low 4 bits.
- `(char) 72` is `'H'`.
