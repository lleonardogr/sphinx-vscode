## Why it matters

Your laptop, your phone and the server of every website each have an IP address. Network settings, firewall rules and cloud dashboards are full of notations like `192.168.1.10/24`. This lesson shows what those numbers mean and how a computer knows whether another address is on its own network.

## An IPv4 address is a 32-bit number

An IPv4 address has 4 bytes, written as 4 numbers from 0 to 255 separated by dots. The dots are only for people: to the computer, `192.168.1.1` is one 32-bit number:

| Part | 192 | 168 | 1 | 1 |
|------|-----|-----|---|---|
| Bits | `11000000` | `10101000` | `00000001` | `00000001` |

As a single number it is 192 × 256³ + 168 × 256² + 1 × 256 + 1 = 3,232,235,777. 32 bits allow about 4.3 billion addresses, fewer than the devices in the world today, which is why IPv6 was created.

## Network part and host part

An address has two parts: the **network** it belongs to and the **host** (device) inside that network. The **prefix**, written after a slash, says how many bits belong to the network:

`192.168.1.130/24` means the first 24 bits (`192.168.1`) are the network and the last 8 bits number the hosts.

The same thing can be written as a **subnet mask**: 24 ones followed by 8 zeros, which is `255.255.255.0`. AND-ing an address with its mask gives the network address.

## Network, broadcast and hosts

With a prefix of p bits, the block has 2³²⁻ᵖ addresses. Two of them are reserved:

- the **network address**: all host bits 0, the first address of the block;
- the **broadcast address**: all host bits 1, the last one, which means "everyone on this network".

| Prefix | Mask | Addresses | Hosts |
|--------|------|-----------|-------|
| /24 | 255.255.255.0 | 256 | 254 |
| /26 | 255.255.255.192 | 64 | 62 |
| /16 | 255.255.0.0 | 65,536 | 65,534 |
| /8 | 255.0.0.0 | 16,777,216 | 16,777,214 |

For `192.168.1.130/26`: the block size is 64, and 130 rounded down to a multiple of 64 is 128. So the network is `192.168.1.128`, the broadcast is `192.168.1.191`, and hosts go from `.129` to `.190`.

## Same network or not?

When your computer sends a packet, it checks whether the destination is on its own network: does it have the same network part? If yes, the packet goes straight to that device. If not, it goes to the **router** (the "default gateway"), which forwards it toward the internet.

## Private addresses and NAT

Some blocks are reserved for private networks and never appear on the public internet:

- `10.0.0.0/8`
- `172.16.0.0/12`
- `192.168.0.0/16`

That's why so many home networks use `192.168.0.x` or `192.168.1.x`. Your router has one public address and translates between it and the private addresses of your devices. This is **NAT** (network address translation).

## IPv6

IPv6 addresses have **128 bits**, written as 8 groups of hex digits: `2001:0db8:0000:0000:0000:ff00:0042:8329`, shortened to `2001:db8::ff00:42:8329`. That is about 3.4 × 10³⁸ addresses, enough to give every device its own, without NAT.

## Summary

- An IPv4 address is one 32-bit number written as 4 bytes.
- The prefix (`/24`) or mask (`255.255.255.0`) splits it into a network part and a host part.
- A /p block has 2³²⁻ᵖ addresses: the first is the network, the last the broadcast, the rest are hosts.
- 10.x, 172.16–31.x and 192.168.x are private; IPv6 uses 128-bit addresses.
