# Tic-Tac-Toe Winner

Read a tic-tac-toe board and say how the game stands. `X` always plays first, then the players take turns. Empty squares are `.`.

| Board | Print |
|-------|-------|
| impossible in a real game (see below) | `Invalid board` |
| `X` has three in a line | `X wins` |
| `O` has three in a line | `O wins` |
| full, with no winner | `Draw` |
| otherwise | `Game in progress` |

A board is **invalid** when:

- the number of `X` is not equal to the number of `O` or one more, or
- both players have three in a line, or
- `X` won but doesn't have one more mark than `O` (the game should have stopped), or `O` won but the counts are not equal.

**Input**

Three lines of three characters: `X`, `O` or `.`.

**Output**

One of the five messages.

**Things to know**

- Store the board in a `char[][]`. `line.toCharArray()` turns a row into a `char[]`.
- A **helper method** `wins(board, player)` that checks the 3 rows, 3 columns and 2 diagonals avoids writing the same checks for X and O.
- Check the invalid cases **before** announcing a winner.
