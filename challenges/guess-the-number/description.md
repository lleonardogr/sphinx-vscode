# Guess the Number

A friend picked a secret number and you are guessing it. After each guess they say whether the secret is higher or lower. Write the referee.

Read the secret, then read guesses one by one:

- a guess below the secret prints `Too low`
- a guess above the secret prints `Too high`
- the right guess prints `Correct! You needed N guesses.` and the game ends

For the secret `42` and the guesses `50`, `25`, `42`:

```
Too high
Too low
Correct! You needed 3 guesses.
```

**Input**

- Line 1: the secret number (1 to 100)
- Then one guess per line. The last guess is always correct.

**Output**

One line per guess, as above. With one guess, the last line is still `Correct! You needed 1 guesses.`

**Things to know**

- A `while` loop repeats while its condition is true, which suits "keep going until the guess is right".
- Keep a counter and add `1` on every guess.
- `break` leaves a loop early, if you prefer a `while (true)` loop.
