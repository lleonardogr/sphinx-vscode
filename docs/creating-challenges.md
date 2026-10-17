# Creating your own challenges

This guide is for anyone who wants to write challenges for Sphinx: teachers preparing a class, students practising, or contributors to this repository. You don't need to know TypeScript or build the extension. A JDK and VS Code are enough.

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

You need VS Code with the Sphinx extension and a **JDK 25+** (`javac -version`).

1. **Create it.** Open the Command Palette (`Ctrl/Cmd+Shift+P`) and run **Sphinx: Create New Challenge…**, or click the **+** button at the top of the Sphinx sidebar. Then choose:
   - **Folder**: where your challenges live, such as `my-challenges` in your workspace. You can choose an existing folder or a new one.
   - **Title**: for example *Sum of Even Numbers*.
   - **Topic** and **difficulty**.

   This creates a complete, working example challenge and adds the folder to your settings, so the challenge appears in the sidebar right away.

2. **Write the problem** in `description.md`: what the program must do, the input format and the output format.
3. **Write the reference solutions** in `Solution.java` (modern Java) and `Solution.classic.java` (classic Java).
4. **Write the starter code** in `Starter.java` and `Starter.classic.java`: what the student sees first.
5. **Write test inputs** in `challenge.json`. Leave every `"output"` empty.
6. **Generate the expected outputs.** Run **Sphinx: Validate Challenges in a Folder…** and choose **Validate and fill in expected outputs**. Your `Solution.java` runs on each input, and its output is saved into `challenge.json`.
7. **Check the generated outputs**, then try the challenge yourself from the sidebar, the way a student would.

That's it. The rest of this guide explains each part in detail.

---

## How a challenge works

A challenge is a program that reads **standard input** and writes **standard output**.

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
| `topic` | no | The unit it belongs to. The Java units, in teaching order: `Basics`, `Conditionals`, `Loops`, `Strings`, `Methods`, `Arrays`, `Collections`, `OOP`, `Exceptions`, `Recursion` and `Streams`; the unit also decides the subject (see [Subjects](#subjects-lessons-and-prerequisites) for the CS Fundamentals units). Use `Tests` for a [mixed challenge](#tests-mixed-challenges). Any other name (for example `Recursion Extras`) gets its own group after the units. **Leave it out** to put the challenge in the **Others** section at the bottom. See the examples in [`custom/`](../custom). |
| `skills` | no | Units the challenge combines, shown as badges in the panel and the sidebar tooltip. Meant for [mixed challenges](#tests-mixed-challenges). |
| `unit` | no | For `"topic": "Tests"` only: the unit the test closes. It's listed at the end of that unit, after its quiz. Without it, the test goes to the Others section. |
| `requires` | no | Units the student should know first, such as `["Loops"]`. Shown with the student's progress, and locks the item when the teacher turns [locks](#prerequisite-locks) on. See [Prerequisites](#prerequisites). |
| `subject` | no | For a challenge without a unit: the subject whose Others section lists it, such as `"cs"`. Default: `java`. |
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

`Starter.classic.java` is the same starter as a classic class. Students who set `sphinx.java.style` to `classic` get this one:

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

### Big inputs: generated tests

To check that a solution is fast enough, a test needs a big input, such as 200,000 numbers, where a loop inside a loop takes minutes and a better approach a fraction of a second. Instead of storing that input, describe it with `"generate"`:

```json
{
  "generate": {
    "seed": 7,
    "lines": ["200000", { "ints": 200000, "min": 1, "max": 1000000000 }]
  },
  "output": ""
}
```

Sphinx builds the input just before the test runs, and the same recipe gives the same input on every computer. `lines` lists the input's lines:

| Line | What it writes |
|------|----------------|
| `"200000"` | the text as it is |
| `{ "ints": 5, "min": 1, "max": 9 }` | one line of 5 random whole numbers from 1 to 9, separated by spaces |
| `{ "ints": 2, "min": 0, "max": 100, "rows": 1000 }` | 1,000 such lines |
| `"sorted": true`, `"distinct": true` | each line in ascending order, or with no number repeated |
| `{ "chars": 30, "alphabet": ".....#", "rows": 30 }` | 30 lines of 30 characters; repeat a character to make it more common |

- **Generated tests are always hidden**, and results show only the start of their input. A test has either `"input"` or `"generate"`, not both.
- **Keep the expected output short**, such as a count, a sum or the best value: outputs over 256 KB are cut. Fill it in with **Validate and fill in expected outputs** as usual.
- **At most 2,000,000** numbers or characters per test. Change the `seed` for a different input.
- **Check the timing.** The right approach should take well under a second, and the slow one many times the time limit (5 seconds unless `timeLimitMs` says otherwise). `sphinx test <challenge> <file>` runs a slow solution against the tests to confirm it fails them.

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

1. Set `"topic": "Tests"`, list the units it combines in `"skills"` (the panel shows them as badges), and name the unit it closes in `"unit"`, so it's listed at the end of that unit. Leave `"unit"` out to put it in the Others section.

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

## C challenges

A challenge can be written in **C** instead of Java: put a `Starter.c` and a `Solution.c` in its folder instead of the `.java` files (or set `"language": "c"` in `challenge.json`). Everything else is the same: `challenge.json`, `description.md`, tests, hints and rules. Students write `main.c`, and the tests feed it input and compare what it prints.

```
sum-two/
├── challenge.json
├── description.md
├── Starter.c          ← the student's main.c starts from this
├── Starter.pt-br.c    ← optional: the starter with Portuguese comments
└── Solution.c         ← your reference solution, never shipped to students
```

**How it's compiled.** Sphinx compiles `main.c` as C17 with warnings on (`-std=c17 -Wall -Wextra -g`) and links the math library (`-lm`). When the compiler supports them, it adds **memory checks** (AddressSanitizer and UndefinedBehaviorSanitizer): going past the end of an array, using freed memory or a NULL pointer (and, with some compilers, a signed overflow) stops the program, and the student sees what happened and where, such as *Line 8: your program went past the end of memory from malloc (allocated at line 6)*. A test then fails even when the output is right. Memory leaks are not reported. Compiler warnings are shown with the results, because in C they often are the bug (`scanf("%d", x)` without `&`).

**Which compiler.** The `sphinx.c.compiler` setting, if set; then the portable compiler Sphinx downloaded; then `cc`, `clang` or `gcc` on the PATH. **Sphinx: Check C Setup** shows which one C challenges use and whether it has memory checks.

- **Windows:** when there is no compiler, Sphinx offers to download a portable one, [llvm-mingw](https://github.com/mstorsjo/llvm-mingw) (about 180 MB to download, 500 MB unpacked), with **Sphinx: Install Portable C Compiler…**. It comes from the official release, is checked against a pinned checksum, and is unpacked into Sphinx's own folder: no installation, no admin rights, and **Sphinx: Remove Portable C Compiler** deletes it. It is the portable compiler with memory checks on Windows. For a lab, IT can instead unzip llvm-mingw once in a shared folder and set `sphinx.c.compiler` to it.
- **macOS:** `xcode-select --install` installs clang, with memory checks.
- **Linux:** `build-essential` (Debian, Ubuntu) installs gcc, with memory checks.

With a compiler that can't add memory checks, such as MinGW gcc or a clang for Microsoft's runtime, C challenges still run, and the results say the checks are off.

**Rules** (`mustContain`, `mustNotContain`) work on C code too, for example to forbid `strlen` in a challenge about counting characters.

**More reference solutions.** Every `Solution*.c` is checked against every test, so a second solution written differently, such as `Solution.alt.c`, catches mistakes in the expected outputs. Reference solutions must compile **without warnings**: the validator reports any, since students would see them. Mark a deliberate `switch` fall-through with a `// fall through` comment, which GCC accepts.

**Quizzes:** a quiz in a C unit runs its "what does this code print?" questions as C (see [Quizzes](quizzes.md)). The two Java starter styles don't apply: C has one starter.

## Subjects, lessons and prerequisites

Sphinx teaches more than one **subject**. Each has its own units, learning path and progress counter, and students switch between them with **Switch Subject…** (📚) at the top of the sidebar, whose header shows the subject they're in. Two subjects ship with the extension:

| Subject | Id | Units (the keys for `topic`), in teaching order |
|---------|----|-------------------------------------------------|
| Java Programming | `java` | `Basics`, `Conditionals`, `Loops`, `Strings`, `Methods`, `Arrays`, `Collections`, `OOP`, `Exceptions`, `Recursion`, `Streams` |
| CS Fundamentals | `cs` | `Computers`, `NumberSystems`, `BitsBytes`, `NumberRepresentation`, `TextMedia`, `Logic`, `Algorithms`, `Networks` |

**The unit decides the subject.** A challenge with `"topic": "NumberSystems"` is listed in CS Fundamentals and one with `"topic": "Loops"` in Java Programming. Unit keys are unique across subjects, so nothing else is needed. Content without a unit goes to the **Others** section of Java Programming, or of the subject named in `"subject"` (for example `"subject": "cs"`). An exam is listed under the subject most of its questions come from, unless its `exam.json` has a `"subject"`.

A unit appears as soon as it has content, and keeps its number even when earlier units are empty.

The built-in subjects are defined in `subjects/<id>/subject.json` and ship with the extension, with their content in `subjects/<id>/challenges`, `quizzes`, `lessons` and `tests`.

### Your own subjects and units

Teachers can add **their own subjects**, and **units at the end of a built-in subject**, such as a "12 · Files" unit after Java's 11 units. The quick way is in the teacher view (💼), under **Tools**:

- **Create New Subject…**: a folder, a name, the kind (**programming** subjects open their units with quick guides, **theory** subjects with reading guides) and the first unit. The sidebar switches to the new subject.
- **Create New Unit…**: a subject and the unit's name. For your own subject, the unit is added to its `subject.json`. For a built-in subject, Sphinx creates a folder named after it (such as `my-challenges/java`) whose `subject.json` lists only the units you add.

After that, **Create New Lesson** and **Create New Challenge** offer the subject's own `lessons` and `challenges` folders, and list the new units.

A subject of your own is a folder like the built-in ones, inside one of your content folders (`sphinx.extraChallengePaths`), or the content folder itself:

```
my-challenges/
├── chemistry/                ← your own subject
│   ├── subject.json
│   ├── lessons/
│   ├── challenges/
│   └── quizzes/
└── java/                     ← units added to Java Programming
    ├── subject.json
    └── lessons/
```

```json
{
  "id": "chemistry",
  "title": "Chemistry",
  "kind": "theory",
  "units": [
    { "key": "Atoms", "title": "Atoms", "icon": "circle-outline" },
    { "key": "Bonds", "title": "Bonds" }
  ],
  "translations": { "pt-br": { "title": "Química", "units": { "Atoms": "Átomos", "Bonds": "Ligações" } } }
}
```

- `id`: when it matches an existing subject (`java`, `cs`, `c`), the units are added after that subject's own units; otherwise it is a new subject.
- `kind`: `programming` or `theory`. `order`: its position in **Switch Subject…** (built-in subjects use 1 to 3).
- `language`: `java` (the default) or `c`. **Create New Challenge** writes C templates (`Starter.c` and `Solution.c`) for the units of a C subject.
- Each unit has a `key`, unique across all subjects (content refers to it in `topic`), a `title`, and optionally a [codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html) name in `icon`.

**Deleting a subject or a unit:** the teacher view's **Subjects & Units** section lists every subject and its units. Right-click one of your own subjects, or a unit you created (in your subject or added to a built-in one), and choose **Delete**. A subject goes with everything in its folder; a unit goes with its lessons, challenges, quizzes and tests, and is removed from its `subject.json`. Folders go to the Trash (imported ones are removed from Sphinx's library). A subject's only unit can't be deleted on its own: delete the subject. Built-in subjects and units (Java Programming, CS Fundamentals, C Programming) can't be deleted.

**Sharing a subject:** **Export a Pack** lists your subjects (and the units you added to built-in ones) under **Your subjects**. Each one travels whole, with everything in its folder. Students import the pack as usual, and the subject appears in their **Switch Subject…**. **Validate Challenges in a Folder…** on your content folder checks your subjects too.

### Lessons

A **lesson** is a short page to read before the quiz and challenges of its unit. Built-in units use **reading guides**: a short summary, the unit's objectives and 1 to 3 curated readings from the web that open in the browser (see [Reading guides](content-guide.md#reading-guides) for the fields and how to choose sources). Lessons come first in their unit and show a reading time. When the student clicks **Mark as read**, the lesson gets a ✓ in the sidebar. A button at the end opens the next item in the path.

**The quick way: Create New Lesson.** In the teacher view (💼), run **Create New Lesson…** (in **Tools**, or **Sphinx: Create New Lesson…** from the Command Palette). Choose a folder, a title and the unit the lesson opens, then the kind:

- a **quick guide**, recommended for programming subjects such as Java: a one-minute summary around one code example, a "Watch out" line and one reading;
- a **reading guide**, recommended for theory subjects such as CS Fundamentals: a longer summary with a diagram, up to three readings and "Check yourself" questions.

Sphinx writes `lesson.json` and `lesson.md` with guidance in comments (students don't see them), opens both, and adds the folder to `sphinx.extraChallengePaths` so the lesson appears in its unit. Write the summary, the objectives and the readings, then press **Preview** to see it as students will. The validator reminds you while the example reading link (`example.com`) is still there.

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

Share your lessons like challenges: in a [pack](#the-easy-way-export-a-pack-then-import) or a [live folder](#sharing-a-live-folder). A lesson's whole folder travels with it, diagrams and translations included.

### Prerequisites

Challenges, quizzes and lessons can list the units a student should know first:

```json
"topic": "NumberSystems",
"requires": ["Loops"],
```

The sidebar shows *needs Loops* next to the item, and the panel shows **Needs: Java Programming · Loops · 7/12**, with the student's progress in that unit (green once every challenge in it is solved). By default prerequisites are advice: nothing is locked. They can name a unit of any subject, which is how a CS Fundamentals challenge says which Java it needs. The validator rejects unit names that don't exist.

#### Prerequisite locks

A teacher can make prerequisites binding. A locked challenge, test or quiz shows a 🔒 in the sidebar, with what it needs in the tooltip. Opening it says what to practise first and offers the next unsolved challenge of that unit. There are two rules:

- **`half`**: an item opens once half of the challenges of each unit it needs are solved (rounded up: 6 of Loops' 12).
- **`all`**: every challenge of each unit it needs must be solved.

Two ways to turn them on; the stricter one applies:

- **For a subject:** `"lockPrerequisites": "half"` (or `"all"`) in its `subject.json`. It travels in packs, so students get it when they import your subject. In a folder that adds units to a built-in subject, it applies to that whole subject.
- **For a class:** the `sphinx.lockPrerequisites` setting (`off`, `half` or `all`), for example in the `.vscode/settings.json` of the workspace your students open.

Lessons are never locked (reading helps), and neither are exams, the teacher view (for previews), or items a student already solved before the locks were turned on.

---

## Bonus goals

A challenge can offer up to 3 optional **bonus goals**, harder versions of the same task, such as solving it without loops, or fast enough for a huge input. When a submission passes all the tests, Submit also checks each goal and shows which were earned; earned goals become stars (★) in the panel, the sidebar and the unit's quick guide. They never change whether the challenge is solved, and exams don't use them.

```json
"bonus": [
  {
    "id": "no-loops",
    "title": "Without loops",
    "description": "Solve it with recursion: no for or while.",
    "hint": "The sum to N is N plus the sum to N − 1.",
    "mustNotContain": [{ "pattern": "\\b(for|while)\\b", "message": "Use recursion: no for or while." }]
  },
  {
    "id": "huge-n",
    "title": "Huge N",
    "description": "Answer for N up to 3 billion in under 2 seconds.",
    "timeLimitMs": 2000,
    "tests": [{ "input": "3000000000\n", "output": "" }]
  }
]
```

| Field | Required | Meaning |
|-------|----------|---------|
| `id` | yes | Lowercase with dashes. It names the reference solution, `Solution.bonus.<id>.java` (or `.classic.java`, or `.c`). |
| `title`, `description` | yes | What to achieve, shown in the panel. |
| `hint` | no | One hint, behind a click. |
| `mustContain`, `mustNotContain` | | [Rules](#rules-requiring-or-forbidding-code) the code must follow, for a different approach or a constraint. |
| `tests` | | Extra tests, never shown to students (as hidden tests), such as a huge input. |
| `timeLimitMs` | no | A time limit for those tests, for efficiency goals. |

A goal needs rules, tests or both. The validator checks that each `Solution.bonus.<id>.*` solves the challenge, follows the goal's rules and passes its tests, and **Validate and fill in expected outputs** fills in the goal's outputs from it. Translations go in `translations.<lang>.bonus`, in the same order: `title`, `description`, `hint` and the rule messages. See the [content guide](content-guide.md#bonus-goals) for when a bonus is worth adding.

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

Sphinx speaks **English** (the default) and **Portuguese (Brazil)**: students choose with the `sphinx.language` setting. A challenge carries its translation next to the original, and anything not translated yet falls back to English.

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

**In VS Code (no Node.js needed):** run **Sphinx: Validate Challenges in a Folder…**, or `sphinx validate <folder>` (add `--generate` to fill in expected outputs) in VS Code's terminal. Results appear in the **Sphinx** output panel, or in the terminal. A typical problem looks like this:

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

1. In the **teacher view** (💼 at the top of the Sphinx sidebar), run **Export a Pack for Students…** (in **Tools**, or right-click one of your exams, challenges, quizzes or lessons). Choose what goes in it from your own content (built-in content is already in every student's Sphinx), then **For students** (reference solutions are left out) or **For teachers** (solutions kept), and save the `.zip`. When an exam uses one of your own challenges by id, that challenge is added to the pack automatically, so the import works.

   You can also build the zip by hand: put your challenge, test, [quiz](quizzes.md), lesson and exam folders in one parent folder, for example `java-week-3/`, and zip it. (Zipping a single challenge or exam folder works too.)
2. Send the zip to your class: email, your school's learning platform, a shared drive or a USB stick.
3. Students click the **Import** button (⤓) at the top of the Sphinx sidebar, or run **Sphinx: Import Challenges, Quizzes, Lessons or Exams…**, and choose the zip or the folder.

The extension finds every folder with a `challenge.json`, `quiz.json`, `lesson.json` or `exam.json` inside, checks that each one loads, and **copies** them into its own library. They keep working after the zip is deleted. Importing the same package again offers to replace the older version, and progress is kept.

- If the package contains `Solution*.java` files, the import asks whether to **remove** them (students) or **keep** them (teachers, who need them to validate). You can still remove them from the zip before sharing, which is safer.
- An imported item with the same id as a built-in one is renamed (for example `fizzbuzz-imported`), so both stay available.
- **Sphinx: Remove Imported Challenges, Quizzes, Lessons or Exams…** takes them out of the sidebar again. Students' own code files are kept.

### Sharing a live folder

Use this when you want students to get your changes without importing again, for example from a shared drive or a git repository they pull.

1. Put your challenge folders in one parent folder, for example `java-week-3/`.
2. **Remove the `Solution*.java` files** from the copy you share. If the folder is a git repository, keep the solutions in a separate private branch or repository.
3. Share the folder with your class: a shared drive, or a git repository they clone.
4. Students add the folder to their settings, then click the refresh button in the Sphinx sidebar:

   ```json
   "sphinx.extraChallengePaths": ["/path/to/java-week-3"]
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
Check that the folder is listed in `sphinx.extraChallengePaths` and that each challenge has its own sub-folder containing `challenge.json`. Click the refresh button in the sidebar. Problems loading a challenge are listed in the **Sphinx** output panel.

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
