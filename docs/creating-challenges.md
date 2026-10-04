# Creating your own challenges

This guide is for anyone who wants to write challenges for Tech Challenges: teachers preparing a class, students practising, or contributors to this repository. You don't need to know TypeScript or build the extension. A JDK and VS Code are enough.

- [Quick start: your first challenge in 5 minutes](#quick-start-your-first-challenge-in-5-minutes)
- [How a challenge works](#how-a-challenge-works)
- [The files](#the-files)
- [Writing tests](#writing-tests)
- [Rules: requiring or forbidding code](#rules-requiring-or-forbidding-code)
- [Validating](#validating)
- [Sharing challenges with students](#sharing-challenges-with-students)
- [Contributing to the built-in set](#contributing-to-the-built-in-set)
- [Checklist](#checklist)
- [FAQ and troubleshooting](#faq-and-troubleshooting)

---

## Quick start: your first challenge in 5 minutes

You need VS Code with the Tech Challenges extension and a **JDK 25+** (`javac -version`).

1. **Create it.** Open the Command Palette (`Ctrl/Cmd+Shift+P`) and run **Tech Challenges: Create New Challenge…**, or click the **+** button at the top of the Tech Challenges sidebar. Then choose:
   - **Folder**: where your challenges live, such as `my-challenges` in your workspace. You can choose an existing folder or a new one.
   - **Title**: for example *Sum of Even Numbers*.
   - **Topic** and **difficulty**.

   This creates a complete, working example challenge and adds the folder to your settings, so the challenge appears in the sidebar right away.

2. **Write the problem** in `description.md`: what the program must do, the input format and the output format.
3. **Write the reference solutions** in `Solution.java` (modern Java) and `Solution.classic.java` (classic Java).
4. **Write the starter code** in `Starter.java` and `Starter.classic.java`: what the student sees first.
5. **Write test inputs** in `challenge.json`. Leave every `"output"` empty.
6. **Generate the expected outputs.** Run **Tech Challenges: Validate Challenges in a Folder…** and choose **Validate and fill in expected outputs**. Your `Solution.java` runs on each input, and its output is saved into `challenge.json`.
7. **Check the generated outputs**, then try the challenge yourself from the sidebar, the way a student would.

That's it. The rest of this guide explains each part in detail.

---

## How a challenge works

A challenge is a program that reads **standard input** and writes **standard output**, just like HackerRank.

1. The student writes `Main.java`.
2. **Run** compiles it and feeds each **visible** test's `input` to the program, then compares what it prints with the test's `output`.
3. **Submit** does the same with **all** tests, including hidden ones. If every test passes, the challenge is marked as solved.
4. **Rules** (optional) are checked before the tests. For example, "must use a `switch`".

Only the **output** matters, so students may use modern Java (`void main()`, `IO.println`) or classic Java (`public class Main`, `System.out.println`).

---

## The files

Each challenge is a folder. The folder name is the challenge's **id**: lowercase letters, numbers and dashes, unique across all your challenges.

```
my-challenges/
└── sum-of-evens/
    ├── challenge.json          metadata, hints, rules, tests      (required)
    ├── description.md          the problem statement              (required)
    ├── Starter.java            modern starter code (Java 25+)     (required)
    ├── Starter.classic.java    classic starter code               (recommended)
    ├── Solution.java           modern reference solution          (required for validation)
    └── Solution.classic.java   classic reference solution         (recommended)
```

Students never see `Solution*.java`. They are only used to check your tests and are excluded from the packaged extension. If you share a challenge folder directly with students, remove the solutions first (see [Sharing](#sharing-challenges-with-students)).

### `challenge.json`

VS Code gives you **autocomplete, hover documentation and error checking** for this file, thanks to the bundled JSON schema.

```json
{
  "title": "Sum of Even Numbers",
  "topic": "Loops",
  "difficulty": "Easy",
  "order": 7,
  "hints": [
    "How can you tell if a number is even? Think about the remainder.",
    "Use an accumulator: start a sum at 0 and add to it inside the loop."
  ],
  "mustContain": [
    { "pattern": "\\b(for|while)\\b", "message": "Use a loop (for or while)." }
  ],
  "mustNotContain": [],
  "timeLimitMs": 5000,
  "aiHints": true,
  "tests": [
    { "input": "5\n1 2 3 4 5\n", "output": "6\n" },
    { "input": "3\n2 4 6\n", "output": "12\n" },
    { "input": "1\n7\n", "output": "0\n", "hidden": true },
    { "input": "4\n-2 -3 0 8\n", "output": "6\n", "hidden": true }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | yes | Name shown in the sidebar and panel. |
| `topic` | no | Sidebar group. `Variables`, `Conditionals`, `Loops`, `Data Structures`, `Strings`, `Methods`, `OOP` and `Streams` are shown first, in that order. Any other name (for example `Recursion`) works too and is listed after them. **Leave it out** to put the challenge in the **Custom** group, which is always listed last. See the examples in [`custom/`](../custom). |
| `difficulty` | no | `Easy` (default), `Medium` or `Hard`. |
| `order` | no | Position inside the topic; lower comes first. |
| `hints` | no | Hints revealed one at a time when the student clicks **Show a hint**. Order them from gentle to specific. |
| `mustContain` | no | [Rules](#rules-requiring-or-forbidding-code) that must match the code. |
| `mustNotContain` | no | Rules that must **not** match the code. |
| `timeLimitMs` | no | Time limit per test (default 5000 ms, which includes the ~0.3 s Java startup). |
| `aiHints` | no | Set to `false` to disable AI hints for this challenge, for example in an exam. Default: `true`. |
| `tests` | yes | At least one test. See [Writing tests](#writing-tests). |
| `id` | no | Defaults to the folder name. Leave it out. |

### `description.md`

This is what students read. It's Markdown, rendered in the problem panel. Start with `# Title` (the panel shows the title separately, so this heading is hidden there), then use this structure:

```markdown
# Sum of Even Numbers

Read a list of numbers and print the sum of the **even** ones.

**Input**

- Line 1: an integer `n` (1 ≤ n ≤ 100)
- Line 2: `n` integers separated by spaces

**Output**

The sum of the even numbers (0 if there are none).

**Things to know**

- `n % 2 == 0` is true when `n` is even.
```

Tips:

- **Be precise about the output format**: spacing, capitalization, punctuation and the number of decimal places. "Print `Total: 12`" is better than "print the total".
- State the **limits** (for example 1 ≤ n ≤ 100), so students know which edge cases matter and which types are big enough (`int` or `long`).
- You don't need to list examples. The panel shows every visible test as an example automatically.
- Tables, code blocks and images (with `https://` URLs) work.

### Starter code

The starter is what the student sees when they open the challenge. It must **compile** but **not solve** the problem. Good starters read the input for the student in early challenges, so they can focus on the new concept, and leave more to do in later ones.

`Starter.java` is a modern Java 25+ compact source file (the default style):

```java
void main() {
    Scanner scanner = new Scanner(System.in);   // no import needed in compact source files
    int n = scanner.nextInt();

    // TODO: read the n numbers and print the sum of the even ones
}
```

`Starter.classic.java` is the same starter as a classic class. Students who set `techChallenges.java.style` to `classic` get this one:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();

        // TODO: read the n numbers and print the sum of the even ones
    }
}
```

In classic files, the public class must be called `Main`. Extra classes (for OOP challenges) go in the same file without `public`.

If you leave out `Starter.classic.java`, classic-style students get the modern starter.

### Reference solutions

`Solution.java` and `Solution.classic.java` are complete, correct solutions in each style. The validator runs **every** `Solution*.java` against **every** test. That catches mistakes in your expected outputs, and proves the challenge works in both styles. You can add more variants, for example `Solution.recursive.java`. Any file name without `.classic` needs JDK 25+.

---

## Writing tests

Each test has an `input` (exactly what the program reads), an `output` (exactly what it should print), and optionally `"hidden": true`.

```json
{ "input": "5\n1 2 3 4 5\n", "output": "6\n" }
```

- **Visible tests** appear as examples in the panel and run on **Run**. Include **2–3** clear ones.
- **Hidden tests** run only on **Submit**, and their input is never shown to the student or sent to AI hints. Use **3–6** of them for edge cases:
  - zero, negative numbers, one element, all elements equal;
  - the smallest and largest allowed values;
  - values that overflow an `int` (to teach `long`);
  - cases that break common mistakes, such as `n % 2 == 1` for negative odd numbers, or starting a maximum at `0` when every number is negative.

**Comparison rules:** trailing spaces at the end of lines and blank lines at the end of the output are ignored. Everything else must match exactly, including case and spaces inside a line.

**Decimals:** programs always run with a US locale, so `printf("%.2f")` prints `3.14` (never `3,14`) on every machine. Always say in the description how many decimal places to print.

**Generating outputs:** don't type expected outputs by hand. Leave them as `""` and run **Validate Challenges → Validate and fill in expected outputs**, or `node scripts/validate-challenges.js --generate path/to/folder` in this repository. Then **review them**: the outputs are only as correct as your solution.

**JSON escaping:** a new line in a JSON string is `\n`, a quote is `\"`, and a backslash is `\\`.

---

## Rules: requiring or forbidding code

Rules check the **source code** before the tests run, so a challenge can teach specific syntax. Each rule has a JavaScript regular expression `pattern` and a `message` shown to the student. Comments are removed before checking, so a rule can't be satisfied by writing the keyword in a comment.

The rule messages are also listed under **Requirements** in the panel, so students know them in advance.

In JSON, every backslash in a pattern must be doubled: the regex `\bfor\b` becomes `"\\bfor\\b"`.

### Cookbook

| Goal | Rule |
|------|------|
| Use a loop | `mustContain`: `"\\b(for\|while)\\b"` |
| Use a `while` loop | `mustContain`: `"\\bwhile\\b"` |
| Use `if` | `mustContain`: `"\\bif\\b"` |
| Use a `switch` | `mustContain`: `"\\bswitch\\b"` |
| Use an array | `mustContain`: `"\\[\\s*\\]"` |
| Declare an `int` variable | `mustContain`: `"\\bint\\s+\\w+\\s*="` |
| Use `double` | `mustContain`: `"\\bdouble\\b"` |
| Keep a method signature | `mustContain`: `"\\bboolean\\s+isPrime\\s*\\(\\s*int\\s+\\w+\\s*\\)"` |
| Create a class | `mustContain`: `"\\bclass\\s+Person\\b"` |
| Use inheritance | `mustContain`: `"\\bclass\\s+Square\\s+extends\\s+Shape\\b"` |
| Implement an interface | `mustContain`: `"\\bimplements\\s+Animal\\b"` |
| Print something (either style) | `mustContain`: `"(System\\.out\|\\bIO)\\s*\\.\\s*print"` |
| No `Math.max` / `Math.min` | `mustNotContain`: `"Math\\s*\\.\\s*(max\|min)"` |
| No built-in sorting | `mustNotContain`: `"Arrays\\s*\\.\\s*sort\|Collections"` |
| No `reverse()` | `mustNotContain`: `"\\.reverse\\s*\\("` |
| No `Math.pow` | `mustNotContain`: `"Math\\s*\\.\\s*pow\\b"` |

### Make rules work in both Java styles

Students can write modern or classic Java, so a rule must not depend on one style.

| ❌ Don't require | ✅ Instead |
|------------------|-----------|
| `static boolean isPrime` | `boolean isPrime` (methods in compact source files don't need `static`) |
| `System.out.println` | `(System\.out\|\bIO)\s*\.\s*print` |
| `public class Main` | nothing. Only the output matters. |
| `import java.util.Scanner` | nothing. Compact source files import it automatically. |

**OOP and `private`:** in a compact source file, all classes are nested inside one implicit class, so `main` can still read another class's `private` fields. If a challenge is about encapsulation, add a rule that forbids reading the field directly, such as `"\\baccount\\s*\\.\\s*balance\\b"`. See the built-in `bank-account` challenge.

Validation also checks that your own solutions follow your rules, so a broken regex shows up immediately.

---

## Validating

Always validate before sharing. Validation checks that:

- every `Starter*.java` compiles;
- every `Solution*.java` follows the rules and passes every test;
- `challenge.json` is readable and has the required fields.

**In VS Code (no Node.js needed):** run **Tech Challenges: Validate Challenges in a Folder…**. Results appear in the **Tech Challenges** output panel. A typical problem looks like this:

```
✗ sum-of-evens
  Solution.classic.java: test 3 expected "0\n" but printed "7\n"
```

**In this repository:**

```bash
npm run validate                                          # all built-in challenges
node scripts/validate-challenges.js path/to/my-challenges # another folder
node scripts/validate-challenges.js --generate path/...   # also fill in expected outputs
```

On a JDK older than 25, only `*.classic.java` files are checked, and the validator tells you which ones it skipped.

---

## Sharing challenges with students

You don't have to rebuild the extension to hand out challenges.

1. Put your challenge folders in one parent folder, for example `java-week-3/`.
2. **Remove the `Solution*.java` files** from the copy you share. If the folder is a git repository, keep the solutions in a separate private branch or repository.
3. Share the folder with your class: a zip file, a shared drive, or a git repository they clone.
4. Students add the folder to their settings, then click the refresh button in the Tech Challenges sidebar:

   ```json
   "techChallenges.extraChallengePaths": ["/path/to/java-week-3"]
   ```

If a shared challenge has the same id as a built-in one, the shared one replaces it. You can use that to adapt a built-in challenge for your class.

Students' progress is stored per challenge id, so keep ids stable after sharing.

---

## Contributing to the built-in set

Challenges in this repository's `challenges/` folder ship with the extension. To add one:

1. Fork the repository and run `npm install`.
2. Create the challenge in `challenges/<id>/`. **Create New Challenge** offers this folder when you have the repository open.
3. Run `npm run validate`. CI also validates on Linux, macOS and Windows, with JDK 17 and JDK 25.
4. Add a line to `CHANGELOG.md` and open a pull request. See [CONTRIBUTING.md](../CONTRIBUTING.md).

Not sure if your idea fits? Open a **Challenge proposal** issue first.

---

## Checklist

- [ ] The description states the input format, the output format and the limits.
- [ ] Output formatting (spaces, case, decimals) is unambiguous.
- [ ] 2–3 visible tests and 3–6 hidden edge-case tests.
- [ ] Starters compile but don't solve the problem.
- [ ] Both `Solution.java` and `Solution.classic.java` exist and pass.
- [ ] Rules work in both Java styles.
- [ ] Hints go from gentle to specific, without giving away the answer.
- [ ] Validation passes, and you've reviewed the generated outputs.
- [ ] You've solved it yourself from the sidebar, the way a student would.

---

## FAQ and troubleshooting

**My challenge doesn't appear in the sidebar.**
Check that the folder is listed in `techChallenges.extraChallengePaths` and that each challenge has its own sub-folder containing `challenge.json`. Click the refresh button in the sidebar. Problems loading a challenge are listed in the **Tech Challenges** output panel.

**"No Solution.java" during validation.**
Validation needs at least one reference solution to check the tests. Add `Solution.java` (or `Solution.classic.java`).

**The modern solution was skipped.**
Your JDK is older than 25. Install JDK 25+ to validate modern files.

**A test fails only on Windows or only on one computer.**
Avoid output that depends on the machine, such as dates, random numbers or the order of a `HashMap`. Decimal separators are already handled for you.

**Can a challenge read from a file or use command-line arguments?**
No. Challenges use standard input and output only, which keeps them portable and safe.

**Can I write challenges for other languages?**
Not yet. Java is the first language, and support for others is on the roadmap.

**Can AI help me write challenges?**
Yes, as a draft. Ask your favourite assistant for a description, edge-case test inputs and both solutions in this format. Then **always validate**, and review the generated outputs yourself.
