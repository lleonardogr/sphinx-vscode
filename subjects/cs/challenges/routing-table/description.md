# Routing Table

A router doesn't know the whole path to every address. It has a **routing table**: a list of networks and, for each one, where to send packets next. Networks often overlap, so the router uses the most specific match, the **longest prefix**:

| Network | Next hop |
|---------|----------|
| `0.0.0.0/0` | Internet |
| `10.0.0.0/8` | Office |
| `10.1.0.0/16` | Lab |
| `10.1.2.0/24` | Servers |

`10.1.2.3` matches the /0, /8, /16 and /24 routes: the longest prefix wins, so it goes to **Servers**. `10.1.9.9` goes to **Lab**, `10.200.0.1` to **Office**, and `8.8.8.8` only matches `0.0.0.0/0`, the **default route**, so it goes to the **Internet**.

Read a routing table and decide where each address goes.

**Input**

The number of routes `r` (1 ≤ r ≤ 50), then one route per line: a network address, `/`, a prefix from 0 to 32, a space and the next hop's name. Then the number of addresses `n` (1 ≤ n ≤ 50) and one IPv4 address per line.

**Output**

For each address, a line `address -> next hop`, or `address -> no route` if no route matches.

**Things to know**

- A route `network/p` matches an address when their first `p` bits are equal. With both as 32-bit numbers in a `long`, compare `address >> (32 - p)` with `network >> (32 - p)`.
- `/0` matches every address and `/32` only one.
- Turning an address into a number is the same as in the subnet calculator: `value = value * 256 + part`.
