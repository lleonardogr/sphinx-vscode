# Custom challenge examples

These challenges show what a **custom challenge** looks like: one written by a teacher or student instead of being part of the main course. Their `challenge.json` files have **no `topic`**, so they appear in the **Custom** folder at the bottom of the Tech Challenges sidebar.

| Challenge | Shows |
|-----------|-------|
| [`word-counter`](word-counter) | A simple text challenge, with edge cases (extra spaces, an empty line) in hidden tests |
| [`grade-report`](grade-report) | Several output lines, two decimal places, and a `mustContain` rule that requires a loop |
| [`caesar-cipher`](caesar-cipher) | Character arithmetic, and `"aiHints": false` to turn off AI hints (for example in an exam) |

Each folder has the usual files: `challenge.json`, `description.md`, modern and classic starters, and modern and classic reference solutions. The solutions aren't shipped in the extension.

## Make your own

1. Copy one of these folders and rename it. The folder name is the challenge id, so it must be unique.
2. Edit `description.md`, the starters and the solutions, then change the test inputs in `challenge.json` (leave each `"output"` as `""`).
3. Run **Tech Challenges: Validate Challenges in a Folder…** → **Validate and fill in expected outputs**.

Or run **Tech Challenges: Create New Challenge…**, which writes a new challenge for you. Choose **Custom (no topic)** to put it in this group.

Add `"topic": "…"` to `challenge.json` if you'd rather have the challenge appear in a named group.

The full guide: [docs/creating-challenges.md](../docs/creating-challenges.md).
