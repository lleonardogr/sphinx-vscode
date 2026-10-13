# Word Wrap

Text editors, terminals and e-mail programs fit text to a width by moving words to the next line. The simple rule, used almost everywhere, is **greedy**: put as many words on a line as fit, then start a new one.

Read a width and a text, and print the text wrapped to that width:

```
width 10:   aaa bbb ccc ddd   →   aaa bbb
                                  ccc ddd
```

`aaa bbb ccc` would need 11 characters.

**Input**

- Line 1: the width (10 to 80)
- Then the text, over any number of lines, until the end of the input. Words are separated by spaces and newlines, and no word is longer than the width.

**Output**

The words in order, one space between words on a line, each line as long as possible without passing the width.

**Things to know**

- Line breaks and extra spaces in the input don't matter: only the words do.
- `scanf("%127s", word)` reads the next word, skipping spaces and newlines, and returns 1, or `EOF` at the end. The width stops it from writing past the end of `char word[128]`.
- A word fits on the current line when `line length + 1 + word length ≤ width`.
