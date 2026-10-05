# Recursive Palindrome

A **palindrome** reads the same forwards and backwards. Ignoring case, spaces and punctuation, `A man, a plan, a canal: Panama!` is one.

The `main` method already cleans the text (lowercase, letters and digits only). Write `isPalindrome` **recursively**:

- a text with 0 or 1 characters is a palindrome
- if its first and last characters differ, it isn't
- otherwise, it is a palindrome when the part **between** them is

**Input**

One line of text with at least one letter or digit.

**Output**

`"Racecar" is a palindrome` or `"hello" is not a palindrome`, with the line as it was typed (without the spaces around it).

**Things to know**

- `text.substring(1, text.length() - 1)` drops the first and last characters, so every call works on a shorter text until it reaches the base case.
- Instead of creating substrings, you can also pass two indexes, `isPalindrome(text, left, right)`, and move them towards each other.
- Solve it without loops and without reversing the String.
