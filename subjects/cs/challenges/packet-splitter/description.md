# Packet Splitter

The internet doesn't send a file or a message in one piece. It splits the data into **packets**, each with a **header** (addresses and other information) and a **payload** (a piece of the data). A typical packet on a home network can be at most 1500 bytes, header included.

Read the size of a message, the largest packet size and the header size, and work out how the message is sent.

**Input**

One line with three whole numbers: the message size in bytes (1 to 10⁹), the largest packet size and the header size (both from 1 to 65,535).

**Output**

Three lines:

- `Packets: ` and the number of packets;
- `Last packet: N bytes`: the size of the last packet, header included;
- `Total sent: N bytes`: everything that was sent, headers included.

If the header doesn't leave room for any payload, print only `Header too big`.

**Things to know**

- Payload per packet = packet size − header. For 1500-byte packets with a 40-byte header, that's 1460 bytes.
- With whole numbers, `(a + b - 1) / b` divides and rounds up.
- Use `long` for the totals: a 1 GB message is split into hundreds of thousands of packets.
