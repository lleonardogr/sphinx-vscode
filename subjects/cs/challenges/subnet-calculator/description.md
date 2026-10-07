# Subnet Calculator

A network is a **block** of consecutive IP addresses. It is written as an address and a **prefix**, like `192.168.1.130/26`: the first 26 bits are the **network part**, shared by every address in the block, and the remaining 32 − 26 = 6 bits number the devices inside it. So the block has 2⁶ = 64 addresses.

- The **network address** is the first one in the block (all device bits 0): `192.168.1.128`.
- The **broadcast address** is the last one (all device bits 1): `192.168.1.191`.
- The addresses in between are for devices: `192.168.1.129` to `192.168.1.190`, **62** hosts.

Read an address with a prefix and describe its network.

**Input**

An IPv4 address, `/` and a prefix from 8 to 30.

**Output**

Five lines:

```
Network: <network address>
Broadcast: <broadcast address>
First host: <network + 1>
Last host: <broadcast - 1>
Hosts: <number of host addresses>
```

**Things to know**

- Work with the address as one number in a `long`: `a × 256³ + b × 256² + c × 256 + d`.
- The block has `2^(32 − prefix)` addresses, and the network address is the address rounded down to a multiple of that.
- Write a method that turns a number back into the dotted form; `java.net` classes aren't allowed here.
