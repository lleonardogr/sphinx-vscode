## Why it matters

When you open a web page, data crosses cities and oceans in a fraction of a second, through equipment owned by dozens of companies that never coordinated with you. It works because every device follows the same rules, called **protocols**. Knowing the main ones helps you understand error messages, slow connections and what a program does when it "talks to a server".

## Packets

The internet never sends a file in one piece. It cuts the data into **packets** of at most about 1500 bytes. Each packet has:

- a **header**: where it comes from, where it goes, and its position in the sequence;
- a **payload**: a piece of the data.

Packets travel independently, can take different routes and can even arrive out of order. The receiver puts them back together. If one is lost, only that packet has to be sent again, not the whole file.

## IP addresses and routers

Every device on a network has an **IP address**, such as `142.250.79.46`. The **Internet Protocol (IP)** gets each packet from the sender's address to the receiver's address.

On the way, packets pass through **routers**. A router doesn't know the whole path: it only knows which neighbor is closer to the destination, and forwards the packet there. After 10 to 20 such hops, the packet arrives. If a route breaks, the routers find another one.

## TCP and UDP

IP alone doesn't promise that packets arrive, or arrive in order. Two protocols on top of it give different guarantees:

| | TCP | UDP |
|---|-----|-----|
| Delivery | guaranteed: lost packets are sent again | not guaranteed |
| Order | data arrives in order | packets may arrive in any order |
| Speed | a bit slower (it waits for confirmations) | faster |
| Used for | web pages, email, downloads | video calls, games, live streams |

For a file, every byte must arrive. For a video call, a late packet is useless anyway, so speed matters more than perfection.

## Ports

One computer runs many programs that use the network at once. A **port number** says which program a packet is for. Some well-known ports: **80** for HTTP, **443** for HTTPS, **25** for email between servers. An address plus a port, like `142.250.79.46:443`, identifies one service.

## DNS: names to addresses

People remember `www.google.com`, not `142.250.79.46`. The **Domain Name System (DNS)** is the internet's phone book: before connecting, your computer asks a DNS server for the address of the name. If DNS fails, websites seem "down" even though the network works.

## Putting it together: opening a web page

1. Your browser asks DNS for the address of `example.com`.
2. It opens a TCP connection to that address on port 443.
3. It sends an HTTPS request: "give me the page `/`".
4. The server's answer is split into packets, routed hop by hop and reassembled by TCP in the right order.
5. The browser draws the page, and repeats the steps for every image and script it needs.

## Summary

- Data travels in packets with a header and a payload, and is reassembled at the destination.
- IP addresses identify devices; routers forward packets hop by hop.
- TCP guarantees delivery and order; UDP is faster without those guarantees.
- Ports identify programs (443 for HTTPS); DNS turns names into IP addresses.
