# Read an HTTP Request

When you open a page, your browser sends the server a few lines of text, an **HTTP request**:

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Sphinx

```

The first line is the **request line**: the **method** (what to do), the **path** (which page) and the **version**. Then come **headers**, one per line, as `Name: value`, and an **empty line** ends the request. Reading these lines is the first thing every web server does.

Read a request and print what it asks for.

**Input**

A request line, then header lines, then an empty line.

**Output**

Four lines: `Method: `, `Path: `, `Host: ` and `Headers: ` with the number of header lines. Print `400 Bad Request` instead if:

- the request line doesn't have exactly 3 parts separated by single spaces;
- the method isn't one of `GET`, `POST`, `PUT`, `DELETE` or `HEAD`;
- a header line has no colon;
- there is no `Host` header (header names ignore case, so `host:` counts).

**Things to know**

- `line.split(" ")` splits the request line; check that you get exactly 3 parts.
- Split a header at its **first** colon, `line.indexOf(':')`: values can contain colons, as in `api.example.com:8080`. Trim the spaces around the name and the value.
- Read the request yourself: `java.net` classes aren't allowed here.
