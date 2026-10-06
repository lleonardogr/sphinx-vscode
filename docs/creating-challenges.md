# Creating your own challenges

This guide is for anyone who wants to write challenges for Sphynx: teachers preparing a class, students practising, or contributors to this repository. You don't need to know TypeScript or build the extension. A JDK and VS Code are enough.

- [Quick start: your first challenge in 5 minutes](#quick-start-your-first-challenge-in-5-minutes)
- [How a challenge works](#how-a-challenge-works)
- [The files](#the-files)
- [Writing tests](#writing-tests)
- [Tests: mixed challenges](#tests-mixed-challenges)
- [Subjects, lessons and prerequisites](#subjects-lessons-and-prerequisites)
- [Translating content](#translating-content)
- [Rules: requiring or forbidding code](#rules-requiring-or-forbidding-code)
- [Validating](#validating)
- [Sharing challenges with students](#sharing-challenges-with-students)
- [Contributing to the built-in set](#contributing-to-the-built-in-set)
- [Checklist](#checklist)
- [FAQ and troubleshooting](#faq-and-troubleshooting)

---

## Quick start: your first challenge in 5 minutes

You need VS Code with the Sphynx extension and a **JDK 25+** (`javac -version`).

1. **Create it.** Open the Command Palette (`Ctrl/Cmd+Shift+P`) and run **Sphynx: Create New Challenge…**, or click the **+** button at the top of the Sphynx sidebar. Then choose:
   - **Folder**: where your challenges live, such as `my-challenges` in your workspace. You can choose an existing folder or a new one.
   - **Title**: for example *Sum of Even Numbers*.
   - **Topic** and **difficulty**.

   This creates a complete, working example challenge and adds the folder to your settings, so the challenge appears in the sidebar right away.

2. **Write the problem** in `description.md`: what the program must do, the input format and the output format.
3. **Write the reference solutions** in `Solution.java` (modern Java) and `Solution.classic.java` (classic Java).
4. **Write the starter code** in `Starter.java` and `Starter.classic.java`: what the student sees first.
5. **Write test inputs** in `challenge.json`. Leave every `"output"` empty.
6. **Generate the expected outputs.** Run **Sphynx: Validate Challenges in a Folder…** and choose **Validate and fill in expected outputs**. Your `Solution.java` runs on each input, and its output is saved into `challenge.json`.
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
| `topic` | no | The unit it belongs to. The Java units, in teaching order: `Basics`, `Conditionals`, `Loops`, `Strings`, `Methods`, `Arrays`, `Collections`, `OOP`, `Exceptions`, `Recursion` and `Streams`; the unit also decides the subject (see [Subjects](#subjects-lessons-and-prerequisites) for the CS Fundamentals units). Use `Tests` for a [mixed challenge](#tests-mixed-challenges). Any other name (for example `Recursion Extras`) gets its own group after the units. **Leave it out** to put the challenge in the **Custom** section at the bottom. See the examples in [`custom/`](../custom). |
| `skills` | no | Units the challenge combines, shown as badges in the panel and the sidebar tooltip. Meant for [mixed challenges](#tests-mixed-challenges). |
| `unit` | no | For `"topic": "Tests"` only: the unit the test closes. It's listed at the end of that unit, after its quiz. Without it, the test goes to the Custom section. |
| `requires` | no | Units the student should know first, such as `["Loops"]`. Shown with the student's progress; nothing is locked. See [Prerequisites](#prerequisites). |
| `subject` | no | For a challenge without a unit: the subject whose Custom section lists it, such as `"cs"`. Default: `java`. |
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
    int n = Integer.parseInt(IO.readln().trim());      // line 1: how many numbers
    String[] parts = IO.readln().trim().split(" ");    // line 2: the numbers

    // TODO: turn the parts into numbers and print the sum of the even ones
}
```

Modern starters read input with `IO.readln()`, which returns one line as a `String`. Use `Integer.parseInt` / `Double.parseDouble` for numbers, and `split(" ")` when a line holds several values. `Scanner` also works in compact source files, without an import, if you prefer it.

`Starter.classic.java` is the same starter as a classic class. Students who set `sphynx.java.style` to `classic` get this one:

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

## Tests: mixed challenges

A **test** is a normal challenge that is **bigger** and **mixes several topics** in one program. It checks whether a student can put the pieces together, not just use one construct. Console apps with a **menu** are a natural fit:

```
=== Grade Book ===
1. Add grade
2. List grades
3. Statistics
0. Exit
```

The built-in tests close a stage of the path: [Calculator Menu](../tests/calculator-menu) at the end of Loops, and [Grade Book Menu](../tests/grade-book-menu) and [Inventory Menu](../tests/inventory-menu) at the end of Collections. To write your own:

1. Set `"topic": "Tests"`, list the units it combines in `"skills"` (the panel shows them as badges), and name the unit it closes in `"unit"`, so it's listed at the end of that unit. Leave `"unit"` out to put it in the Custom section.

   ```json
   "topic": "Tests",
   "skills": ["Basics", "Conditionals", "Loops", "Collections", "Methods"],
   "unit": "Collections",
   ```

2. **Specify the menu exactly** in `description.md`. Say what each option reads and prints, in a table, and give one complete example of input and output. Print the menu **once** at the start, so the expected outputs stay readable.

3. **Grade it with scripted runs.** Each test's `input` is a whole session: a sequence of menu choices (and the values they read), always ending with the exit option. The output is everything the program prints during that session:

   ```json
   { "input": "1\n80\n1\n95\n3\n0\n", "output": "" }
   ```

   Then fill in the outputs with **Validate and fill in expected outputs**, as usual.

4. Use the hidden tests for what a menu app gets wrong: choosing an option before any data exists, invalid options, invalid values, exiting straight away, and long sessions that mix every option.

5. Add a few `mustContain` rules for the structures the test is about, such as a loop, a `List<Integer>` or a method `String letter(int grade)`. Don't make the rules too strict: there are many good ways to write a menu.

Tests can also be questions in an [exam](exams.md).

---

## Subjects, lessons and prerequisites

Sphynx teaches more than one **subject**. Each has its own units, learning path and progress counter, and students switch between them with **Switch Subject…** (📚) at the top of the sidebar, whose header shows the subject they're in. Two subjects ship with the extension:

| Subject | Id | Units (the keys for `topic`), in teaching order |
|---------|----|-------------------------------------------------|
| Java Programming | `java` | `Basics`, `Conditionals`, `Loops`, `Strings`, `Methods`, `Arrays`, `Collections`, `OOP`, `Exceptions`, `Recursion`, `Streams` |
| CS Fundamentals | `cs` | `Computers`, `NumberSystems`, `BitsBytes`, `NumberRepresentation`, `TextMedia`, `Logic`, `Algorithms`, `Networks` |

**The unit decides the subject.** A challenge with `"topic": "NumberSystems"` is listed in CS Fundamentals and one with `"topic": "Loops"` in Java Programming. Unit keys are unique across subjects, so nothing else is needed. Content without a unit goes to the **Custom** section of Java Programming, or of the subject named in `"subject"` (for example `"subject": "cs"`). An exam is listed under the subject most of its questions come from, unless its `exam.json` has a `"subject"`.

A unit appears as soon as it has content, and keeps its number: CS Fundamentals starts at **2 · Number Systems**.

Subjects are defined in `subjects/<id>/subject.json` and ship with the extension, with their content in `subjects/<id>/challenges`, `quizzes`, `lessons` and `tests`. To propose a new one (C, SQL, graph theory…), open an issue.

### Lessons

A **lesson** is a short page to read before the quiz and challenges of its unit: the idea, why it matters, and worked examples. Lessons come first in their unit and show a reading time. When the student clicks **Mark as read**, the lesson gets a ✓ in the sidebar. A button at the end opens the next item in the path.

A lesson is a folder:

```
place-value-and-binary/
├── lesson.json
├── lesson.md          ← the text, in Markdown
├── lesson.pt-br.md    ← the Portuguese text
└── place-values.svg   ← an image, used with a relative path: ![The byte 10110010](place-values.svg)
```

```json
{
  "title": "Place Value and Binary",
  "topic": "NumberSystems",
  "order": 1,
  "translations": { "pt-br": { "title": "Valor posicional e binário" } }
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | yes | Shown in the sidebar and at the top of the lesson. |
| `topic` | no | The unit it belongs to. |
| `order` | no | Position among the unit's lessons; lower comes first. |
| `minutes` | no | The reading time. By default it's worked out from the text, at about 180 words a minute. |
| `requires` | no | [Prerequisites](#prerequisites), as for challenges. |
| `subject` | no | For a lesson without a unit, as for challenges. |
| `translations` | no | Translated titles, such as `{ "pt-br": { "title": "…" } }`. The translated text goes in `lesson.pt-br.md`. |

Write for a beginner: short sections with `##` headings, a table or a diagram where it helps, and examples worked out step by step. Images must be inside the lesson's folder. The validator checks that the unit exists and warns when a lesson has fewer than 250 words or no `##` sections, or (with `--lang=pt-br`) no translation.

Share your lessons through a [live folder](#sharing-a-live-folder) for now: **Import** and **Export a Pack** don't carry lessons yet.

### Prerequisites

Challenges, quizzes and lessons can list the units a student should know first:

```json
"topic": "NumberSystems",
"requires": ["Loops"],
```

The sidebar shows *needs Loops* next to the item, and the panel shows **Needs: Java Programming · Loops · 7/12**, with the student's progress in that unit (green once every challenge in it is solved). Prerequisites are advice: nothing is locked. They can name a unit of any subject, which is how a CS Fundamentals challenge says which Java it needs. The validator rejects unit names that don't exist.

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

## Translating content

Sphynx speaks **English** (the default) and **Portuguese (Brazil)**: students choose with the `sphynx.language` setting. A challenge carries its translation next to the original, and anything not translated yet falls back to English.

```
fizzbuzz/
├── challenge.json          ← add a "translations" block
├── description.md
├── description.pt-br.md    ← the translated description
├── Starter.java
├── Starter.pt-br.java      ← optional: the starter with translated comments
├── Starter.classic.java
└── Starter.classic.pt-br.java  ← optional
```

```json
"translations": {
  "pt-br": {
    "title": "FizzBuzz",
    "hints": ["Combine um laço com uma cadeia de if / else if.", "…"],
    "mustContain": ["Use um laço (for ou while).", "Use um if / else."]
  }
}
```

- `hints` and the rule messages are translated **in the same order** as the originals.
- **Don't translate the program's output.** Tests and solutions are shared by both languages, so the program prints the same messages (for example `Even`, `Invalid option`) whatever language the student reads. The Portuguese description must still name the exact English output.
- Translate the comments in `Starter.pt-br.java`, not the code: names and output stay the same as in `Starter.java`.

Quizzes and exams have a `translations` block too. See [Quizzes → Translating a quiz](quizzes.md#translating-a-quiz).

To check that nothing is missing, run the validator with `--lang=pt-br`: `node scripts/validate-challenges.js --lang=pt-br path/to/folder`. It lists every challenge without a translated description, title, hint or rule message.

---

## Validating

Always validate before sharing. Validation checks that:

- every `Starter*.java` compiles;
- every `Solution*.java` follows the rules and passes every test;
- `challenge.json` is readable and has the required fields.

**In VS Code (no Node.js needed):** run **Sphynx: Validate Challenges in a Folder…**. Results appear in the **Sphynx** output panel. A typical problem looks like this:

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

### The easy way: Export a pack, then Import

1. In the **teacher view** (💼 at the top of the Sphynx sidebar), run **Export a Pack for Students…** (in **Tools**, or right-click an exam, challenge or quiz). Choose what goes in it, then **For students** (reference solutions are left out) or **For teachers** (solutions kept), and save the `.zip`. When an exam uses one of your own challenges by id, that challenge is added to the pack automatically, so the import works.

   You can also build the zip by hand: put your challenge, test, [quiz](quizzes.md) and exam folders in one parent folder, for example `java-week-3/`, and zip it. (Zipping a single challenge or exam folder works too.)
2. Send the zip to your class: email, your school's learning platform, a shared drive or a USB stick.
3. Students click the **Import** button (⤓) at the top of the Sphynx sidebar, or run **Sphynx: Import Challenges, Quizzes, Tests or Exams…**, and choose the zip or the folder.

The extension finds every folder with a `challenge.json`, `quiz.json` or `exam.json` inside, checks that each one loads, and **copies** them into its own library. They keep working after the zip is deleted. Importing the same package again offers to replace the older version, and progress is kept.

- If the package contains `Solution*.java` files, the import asks whether to **remove** them (students) or **keep** them (teachers, who need them to validate). You can still remove them from the zip before sharing, which is safer.
- An imported item with the same id as a built-in one is renamed (for example `fizzbuzz-imported`), so both stay available.
- **Sphynx: Remove Imported Challenges, Quizzes, Tests or Exams…** takes them out of the sidebar again. Students' own code files are kept.

### Sharing a live folder

Use this when you want students to get your changes without importing again, for example from a shared drive or a git repository they pull.

1. Put your challenge folders in one parent folder, for example `java-week-3/`.
2. **Remove the `Solution*.java` files** from the copy you share. If the folder is a git repository, keep the solutions in a separate private branch or repository.
3. Share the folder with your class: a shared drive, or a git repository they clone.
4. Students add the folder to their settings, then click the refresh button in the Sphynx sidebar:

   ```json
   "sphynx.extraChallengePaths": ["/path/to/java-week-3"]
   ```

With a live folder, a challenge with the same id as a built-in one replaces it. You can use that to adapt a built-in challenge for your class.

Students' progress is stored per challenge id, so keep ids stable after sharing.

---

## Contributing to the built-in set

Challenges in this repository's `challenges/` folder ship with the extension. To add one:

1. Fork the repository and run `npm install`.
2. Create the challenge in `challenges/<id>/` (CS Fundamentals: `subjects/cs/challenges/<id>/`), with the `topic` of its [unit](../README.md#the-learning-path-100-challenges) and an `order` that keeps the unit going from easy to hard. **Create New Challenge** offers this folder when you have the repository open.
3. Add the Portuguese translation (see [Translating content](#translating-content)): built-in content ships in both languages.
4. Run `npm run validate`. It is **strict** for the built-in content: besides compiling and running everything, it fails on the content standard in the checklist below (a "Things to know" section, at least 3 hidden tests and 2 hints, a description of 40 words or more) and on missing Portuguese translations. CI also validates on Linux, macOS and Windows, with JDK 17 and JDK 25.
5. Add a line to `CHANGELOG.md` and open a pull request. See [CONTRIBUTING.md](../CONTRIBUTING.md).

Not sure if your idea fits? Open a **Challenge proposal** issue first.

---

## Checklist

- [ ] The description states the input format, the output format and the limits, and ends with **Things to know**: 2 to 4 bullets on the Java features involved.
- [ ] It only uses concepts from its own unit or earlier units.
- [ ] Output formatting (spaces, case, decimals) is unambiguous.
- [ ] 2–3 visible tests and 3–6 hidden edge-case tests.
- [ ] Starters compile but don't solve the problem.
- [ ] Both `Solution.java` and `Solution.classic.java` exist and pass.
- [ ] Rules work in both Java styles.
- [ ] 2 to 4 hints that go from gentle to specific, without giving away the answer.
- [ ] Validation passes (in VS Code, check for ⚠ lines too), and you've reviewed the generated outputs.
- [ ] Built-in content: the Portuguese translation is complete (`description.pt-br.md`, the `translations` block, and `Starter.pt-br.java` when the starter has comments).
- [ ] You've solved it yourself from the sidebar, the way a student would.

---

## FAQ and troubleshooting

**My challenge doesn't appear in the sidebar.**
Check that the folder is listed in `sphynx.extraChallengePaths` and that each challenge has its own sub-folder containing `challenge.json`. Click the refresh button in the sidebar. Problems loading a challenge are listed in the **Sphynx** output panel.

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
