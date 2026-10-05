# Hangman Referee

Write the referee for a game of **Hangman**. The program knows the secret word and checks the player's guesses one letter at a time. This test combines **conditionals**, **loops** and **Strings** in one program.

**What your program does**

1. Read the secret word (lowercase letters only). The player has **6 lives**. Print the word hidden, one `_` per letter, separated by spaces:

   ```
   Word: _ _ _ _
   ```

2. Then read guesses, one per line, until the player wins or loses. Uppercase letters count as lowercase (`J` is the same as `j`).

| Guess | Prints | Lives |
|-------|--------|-------|
| not a single letter (like `ab` or `1`) | `Invalid guess` | no change |
| a letter guessed before | `Already guessed: x` | no change |
| a new letter in the word | `Good guess!` then the `Word:` line | no change |
| a new letter not in the word | `Wrong! Lives left: n` then the `Word:` line | lose 1 |

3. The game ends as soon as:

   - every letter is revealed: print `You win! The word was java`
   - the lives reach `0`: print `You lose! The word was java`

   The input always contains enough guesses to finish the game. Ignore any lines after it ends.

**Example**

Input:

```
java
a
x
J
v
```

Output:

```
Word: _ _ _ _
Good guess!
Word: _ a _ a
Wrong! Lives left: 5
Word: _ a _ a
Good guess!
Word: j a _ a
Good guess!
Word: j a v a
You win! The word was java
```

**Things to know**

- `toLowerCase()` turns `J` into `j`; `length() == 1` and `Character.isLetter(c)` check that the guess is one letter.
- A String can hold the letters guessed so far, and `indexOf` (or `contains`) checks whether a letter is in it.
- A `StringBuilder` is handy for building the `Word:` line without a trailing space.
- Keep `lives` in a variable declared **before** the loop.
