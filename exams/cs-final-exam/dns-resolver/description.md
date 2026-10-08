# DNS Resolver

Before your browser connects to a website, it asks **DNS** for the site's IP address. DNS servers keep **records**:

- an **A** record gives a name's IPv4 address. A busy site can have several, one per server, to share the load;
- a **CNAME** record says a name is an **alias**: to find its address, look up another name instead.

Resolving a name means following CNAMEs until you reach A records. With these records:

```
example.com A 93.184.216.34
www.example.com CNAME example.com
shop.example.com CNAME www.example.com
```

`shop.example.com` resolves through two aliases: `shop.example.com -> www.example.com -> example.com -> 93.184.216.34`.

Names **ignore upper and lower case**, so `WWW.Example.com` is the same name as `www.example.com`. Two things can go wrong:

- a name has no record at all: the answer is `NXDOMAIN` ("no such domain");
- the CNAMEs go round in a circle, such as `a -> b -> a`. Real resolvers stop and report an error.

Read the records and resolve each query.

**Input**

The number of records `r` (1 to 50), then `r` lines like `name A address` or `name CNAME other-name`. A name has either one CNAME or one or more A records, never both. Then the number of queries `q` (1 to 20) and `q` lines, each a name.

**Output**

One line per query: the names visited, in lower case, joined by ` -> `, then

- the A record addresses, in the order they were given, separated by `, `: `cdn.net -> 151.101.1.1, 151.101.65.1`;
- or `NXDOMAIN` when the last name has no record: `mail.example.com -> NXDOMAIN`;
- or, when a CNAME leads to a name already visited in this query, that name and then `LOOP`: `a.test -> b.test -> a.test -> LOOP`.

**Things to know**

- `name.toLowerCase()` makes names easy to compare.
- A `HashMap<String, String>` for CNAMEs and a `HashMap<String, List<String>>` for addresses are handy, but arrays work too.
