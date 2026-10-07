# Permission Flags

On Linux and macOS every file has permissions for its **owner**, its **group** and **everyone else**. Each of the three has three flags: **r**ead, **w**rite and e**x**ecute. They are written as 9 letters, like `rwxr-xr--`, or as 3 octal digits, like `754`.

Each digit is 3 bits, one per flag: read is worth **4**, write **2** and execute **1**. So 7 = 4 + 2 + 1 = `rwx`, 5 = 4 + 1 = `r-x` and 4 = `r--`.

Read permissions in one form and print them in the other.

**Input**

Either 3 digits (from `0` to `7` each), or 9 characters where positions 1, 4 and 7 are `r` or `-`, positions 2, 5 and 8 are `w` or `-`, and positions 3, 6 and 9 are `x` or `-`.

**Output**

The same permissions in the other form, or `Invalid` if the input doesn't follow these rules.

**Things to know**

- A flag is a single bit, and `digit & 4` tests the read bit: it is not 0 when the flag is set.
- `|` turns bits on: `digit = digit | 2` sets the write flag.
- `"rwx".charAt(i % 3)` gives the letter expected at position `i`.
