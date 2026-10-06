<p align="center">
  <img src="media/logo/banner.png" alt="Sphynx: a geometric sphinx sitting between code brackets" width="100%">
</p>

# Sphynx for VS Code

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/lleonardogr.sphynx?label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=lleonardogr.sphynx)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/lleonardogr.sphynx)](https://marketplace.visualstudio.com/items?itemName=lleonardogr.sphynx)
[![Open VSX](https://img.shields.io/open-vsx/v/lleonardogr/sphynx?label=Open%20VSX)](https://open-vsx.org/extension/lleonardogr/sphynx)
[![CI](https://github.com/lleonardogr/sphynx-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/lleonardogr/sphynx-vscode/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/lleonardogr/sphynx-vscode)](https://github.com/lleonardogr/sphynx-vscode/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> *Like the sphinx of the legend, Sphynx asks you questions, and you only pass if you answer them right.*

HackerRank / LeetCode-style coding challenges right inside VS Code, in **English or Portuguese**, running fully offline on the student's machine, with optional **AI hints** from a local model or your own API key. It starts with **Java**: from the basic syntax to data structures, object-oriented programming and the Stream API.

📘 **Guides:** [Creating your own challenges](docs/creating-challenges.md) · [Tests](docs/creating-challenges.md#tests-mixed-challenges) · [Quizzes](docs/quizzes.md) · [Exams](docs/exams.md) · [AI hints](docs/ai-hints.md)

Students pick a challenge from the **Sphynx** sidebar. The problem statement opens on the left and a `Main.java` file on the right. **Run** checks the sample tests, **Run with this input** and **Run in Terminal** let them try their own input, and **Submit** also runs the hidden tests and marks the challenge as solved.

**[Install from the VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=lleonardogr.sphynx)**, or search for **Sphynx** in the Extensions view. Using **Cursor**, VSCodium or Windsurf? It's on **[Open VSX](https://open-vsx.org/extension/lleonardogr/sphynx)** too.

![Solving FizzBuzz in Sphynx: write the code, run the sample tests, submit, and the challenge is marked as solved](media/screenshots/demo.gif)

## The learning path (100 challenges)

The sidebar lists numbered **units** in teaching order. Each unit runs from easy to harder challenges, ends with its quiz, and the last unit of a stage ends with a bigger **test** that mixes everything so far.

| Unit | Challenges | Quiz and tests |
|------|------------|----------------|
| 1 · Basics | Hello World · Greeting with Variables · Arithmetic Operators · Rectangle Area · Celsius to Fahrenheit · Time Converter (`/` and `%`) · Split the Bill (rounding cents) | Java Basics Quiz |
| 2 · Conditionals | Even or Odd · Largest of Three · Grade Calculator (`if`/`else if`) · Day of the Week (`switch` statement) · Weather Label (ternary `? :`) · Leap Year · Days in a Month (switch expression) · Triangle Classifier · Shipping Cost (chained rules) | Conditionals Quiz |
| 3 · Loops | Count to N (`for`) · Sum 1..N · Multiplication Table · Sum Until Zero (`do-while`) · Factorial · FizzBuzz · Sum of Digits (`while`) · Collatz Steps (`while`) · Number Pyramid (nested loops) · Guess the Number · Primes up to N | Loops Quiz · Test: Calculator Menu |
| 4 · Strings & Characters | Reverse a String · Count Vowels · Initials · Title Case · Palindrome · Password Checker · Anagrams · String Compression (`StringBuilder`) | Strings Quiz · Test: Hangman Referee |
| 5 · Methods | Max of Three · Temperature Table · Prime Numbers · Power · GCD and LCM · Overloaded `area()` · Perfect Numbers (helper methods) | Methods Quiz |
| 6 · Arrays | Array Sum · Largest and Smallest · Reverse an Array · Count Occurrences · Above Average (for-each) · Second Largest · Rotate an Array · Bubble Sort · Matrix Sums (2D) · Binary Search · Tic-Tac-Toe Winner (2D) | Arrays Quiz |
| 7 · Collections | To-Do List (`ArrayList`) · Unique Words (`HashSet`) · First Occurrences (`LinkedHashSet`) · Word Frequency (`HashMap`) · Phone Book (`TreeMap`) · Ticket Queue (`ArrayDeque`) · Weekly Hours (`EnumMap`) · Balanced Brackets (stack) · Most Common Words | Collections Quiz · Tests: Grade Book Menu · Inventory Menu |
| 8 · Object-Oriented Programming | Your First Class · Rectangle Class · Book with `toString()` · Points as Records · ID Generator (`static`) · Bank Account (encapsulation) · Coins (`enum`) · Shapes (inheritance) · Animals (interfaces) · Equal Points (`equals`/`hashCode`) · Payroll (polymorphism) | OOP Quiz · Test: Library System |
| 9 · Exceptions | Safe Division (`try`/`catch`) · Parse Numbers · Ask Until Valid · Insufficient Funds (custom exception) · Robust Calculator | Exceptions Quiz |
| 10 · Recursion | Recursive Factorial · Recursive Digit Sum · Fibonacci (memoization) · Recursive Palindrome · Tower of Hanoi | Recursion Quiz |
| 11 · Lambdas & Streams | Sort with a Comparator (lambdas) · Even Squares (`filter`/`map`) · Stream Statistics · Clean Up a Name List (`distinct`/`sorted`) · Pass or Fail (`partitioningBy`) · Group Words by Length (`groupingBy`) · Top 3 Scorers (comparators, `limit`) · Word Index (`flatMap`). Solved without loops. | Streams Quiz · Test: Student Report |
| Custom | Word Counter · Grade Report · Caesar Cipher: [example custom challenges](custom/) to copy when writing your own | |

Three exams close the stages, each with a quiz and three private coding questions: **Exam 1: Basics to Strings** (units 1–4, 60 minutes), **Exam 2: Building Blocks** (units 5–7, 75 minutes) and the **Final Exam** (the whole course, focused on units 8–11, 120 minutes).

## Screenshots

| | |
|---|---|
| ![The learning path in the sidebar, a solved challenge with all tests passing, and the code](media/screenshots/learning-path.png) | ![A quiz with "what does this code print?" questions](media/screenshots/quiz.png) |
| **Learning path**: 11 units from the basics to streams, with progress | **Quizzes**: multiple choice, true or false, short answer and code output |
| ![A closed exam in progress, with a countdown in the sidebar and status bar](media/screenshots/exam.png) | ![The same interface in Portuguese](media/screenshots/portuguese.png) |
| **Exams**: timed, graded, with restriction levels | **English or Portuguese**: challenges, quizzes, exams and the interface |

## Features

- **Problem panel** with the description, examples, requirements and hints that are revealed one at a time.
- **Run / Submit** buttons in the panel and in the editor title bar (`Cmd/Ctrl+Alt+R` runs, `Cmd/Ctrl+Alt+Enter` submits).
- **Try your own input**: type any input in the problem panel and click **Run with this input** to see what your program prints. If the input matches an example, the expected output and the first differing line are shown too. It doesn't check rules and doesn't count as an attempt.
- **Run in Terminal** compiles the program and runs it in an interactive terminal, so students can type input while it runs and see exactly what it prints.
- **Clear feedback**: compiler errors show as red squiggles and link to the line, each test shows Expected vs. Your output with the first differing line, and the panel reports runtime exceptions and time-limit (infinite loop) failures.
- **Hidden tests** catch edge cases like negative numbers, zero and overflow, without revealing their input.
- **Modern Java by default, classic on request**: starter code uses Java 25+ compact source files (`void main()`, `IO.println`). Set `sphynx.java.style` to `classic` for `public class Main` starter code. Either style is **always accepted**, because only the output is checked.
- **Syntax requirements**: a challenge can require constructs (for example "use a `switch`", "create `class Square extends Shape`" or "keep `balance` private") or forbid shortcuts (`Math.max`, `reverse()`, `Math.pow`).
- **AI hints (optional, off by default)**: an AI tutor gives one hint at a time about your current code, without writing the solution. It works with a **local model** (Ollama, LM Studio: free and private), **your own API key** (Anthropic Claude or any OpenAI-compatible API), or VS Code's language models (GitHub Copilot). API keys are stored in VS Code's encrypted secret storage. See [AI hints](docs/ai-hints.md).
- **Tests**: bigger challenges that **mix several units** in one program, listed at the end of the unit they close, such as a console app with a menu (`1. Add`, `2. List`, `0. Exit`). Each one shows the skills it combines, and is graded by feeding it whole sequences of menu choices.
- **Quizzes**: short question sets about Java (multiple choice, true or false, short answer, and "what does this code print?"), with instant feedback and explanations in practice. Exams can include them as graded questions, and the validator runs every code question to make sure its answer is right. See [Quizzes](docs/quizzes.md).
- **Exams**: timed, graded sets of questions with a countdown, limited submissions, partial credit and a results file to hand in. An exam can be **open** (hints, AI and the internet allowed) or **closed** (hints and AI off, copying and pasting blocked, time outside VS Code recorded or limited). Teachers re-grade the results files with **Verify Exam Results**. See [Exams](docs/exams.md).
- **Import**: one button in the sidebar imports the challenges, tests and exams a teacher shared, as a `.zip` or a folder. They're copied into the extension's library, solutions can be stripped for students, and **Remove Imported…** takes them out again. See [Sharing challenges with students](docs/creating-challenges.md#sharing-challenges-with-students).
- **Create your own challenges**: **Create New Challenge** sets up a ready-to-edit example, `challenge.json` gets autocomplete and validation, and **Validate Challenges** checks your tests and fills in the expected outputs. No Node.js needed. See [Creating your own challenges](docs/creating-challenges.md).
- **Progress tracking** shows ✓ in the tree, a count per unit, and an `x/100 solved` counter in the status bar.
- **Group by**: the filter button at the top of the sidebar groups challenges by **learning path** (units, the default), **difficulty** (Easy, Medium, Hard, then quizzes) or **progress** (not started, in progress, solved). The choice is remembered.

> **Upgrading from Tech Challenges?** Sphynx is the same extension with a new name. Install Sphynx and uninstall Tech Challenges. Your settings (`techChallenges.*` → `sphynx.*`) are copied over automatically, and your code in `tech-challenges/` keeps being used. Solved-challenge progress and saved AI keys start fresh.

## Getting started (students)

### 1. Install Java

Install a **JDK 25 or newer**, for example [Eclipse Temurin](https://adoptium.net/temurin/releases/). Then open a terminal and check it:

```bash
javac -version   # should print javac 25 or newer
```

If you can only use JDK 17–24, that works too: the extension offers to switch to classic Java.

Sphynx checks Java when it starts. If something is wrong, it warns you and shows **Java isn't ready** at the top of the sidebar. Run **Sphynx: Check Java Setup** at any time for a full report: which `javac` and `java` were found, their versions, whether modern and classic Java really compile and run, and how to fix each problem. If your JDK isn't on the PATH, **Sphynx: Choose JDK Folder…** points Sphynx at it. After installing Java, restart VS Code so it sees the new PATH.

### 2. Install the extension

1. Install **Sphynx** from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=lleonardogr.sphynx): open the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X`), search for **Sphynx**, and click **Install**.

   Or, in a terminal: `code --install-extension lleonardogr.sphynx`

   In **Cursor**, VSCodium or Windsurf, search for **Sphynx** the same way: it comes from [Open VSX](https://open-vsx.org/extension/lleonardogr/sphynx).

   No internet in the classroom? Download **`sphynx-x.y.z.vsix`** from the [latest release](https://github.com/lleonardogr/sphynx-vscode/releases/latest) and use **Install from VSIX…** in the Extensions view's **`...`** menu.
2. Open a folder for your work (**File → Open Folder…**). Your code is saved in `sphynx/<challenge>/Main.java` inside it.

### 3. Solve your first challenge

1. Click the **Sphynx** icon in the Activity Bar (left side) and choose **Hello, World!** The problem opens on the left and your `Main.java` on the right.
2. Read the description and examples, then write your code.
3. Check your work, in whichever way suits you:

   | Button | What it does |
   |--------|--------------|
   | **▶ Run** (`Cmd/Ctrl+Alt+R`) | Runs the sample tests and shows expected vs. your output. |
   | **Try your own input → Run with this input** | Runs your program once with any input you type, and shows what it prints. |
   | **⌨ Run in Terminal** | Runs your program in a terminal, so you can type the input while it runs. |
   | **✔ Submit** (`Cmd/Ctrl+Alt+Enter`) | Runs all tests, including hidden edge cases. Pass them all to solve the challenge ✓. |

4. Stuck? Click **Show a hint**, or **✨ Ask AI for a hint** if your teacher or you set up [AI hints](docs/ai-hints.md).
5. Made a mess? **Reset code** brings back the starter code.
6. Want to start over? The ↺ button next to a challenge in the sidebar (**Reset Challenge**) brings back the starter code and clears its progress; next to a quiz it clears the best score. The ⨯ button at the top of the sidebar (**Reset All Challenges…**) resets everything, either progress and code or progress only. Exams are never reset.

Your program reads its input and prints the answer, exactly like HackerRank. Both styles work:

```java
// Modern Java (JDK 25+)
void main() {
    int n = Integer.parseInt(IO.readln());      // IO.readln() reads one line
    IO.println(n * 2);
}
```

```java
// Classic Java (JDK 17+)
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        System.out.println(n * 2);
    }
}
```

In modern Java, `IO.readln()` reads a whole line. For several numbers on one line, split it (`IO.readln().split(" ")`) or use `new Scanner(System.in)`, which compact source files can use without an import.

The file is always `Main.java`. In classic Java, the public class must be named `Main`. Other classes (OOP challenges) go in the same file, without `public`.

### Settings

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `sphynx.language` | `en` | Language of Sphynx: `en` (English) or `pt-br` (Português do Brasil). Challenges, quizzes, exams, panels and messages switch at once; the program's output stays the same in both. |
| `sphynx.java.style` | `modern` | Starter code style for new challenges: `modern` (JDK 25+) or `classic` (JDK 17+). Use **Reset Code to Starter** to switch a challenge you already opened. |
| `sphynx.java.home` | (empty) | The JDK folder, if `javac` is not on your PATH. |
| `sphynx.codeFolder` | (empty) | Where solutions are saved. |
| `sphynx.extraChallengePaths` | `[]` | Extra challenge folders provided by your teacher. |
| `sphynx.ai.provider` | `off` | AI hints provider: `ollama`, `lmstudio`, `anthropic`, `openai-compatible` or `vscode`. Run **Set Up AI Hints** for a guided setup. |

## For teachers

Click the 💼 button at the top of the Sphynx sidebar (**Switch to Teacher View**) to open the **teacher view**. It lists **My Exams** (with their questions; click one to edit it, or press ▶ **Try Exam (Preview)** to take the exam yourself with the real timer and rules, in a practice attempt you can restart that never counts as a real one), **My Challenges & Quizzes** (what you created or imported; click one to try it), and the **Tools**: create, import, **export a pack** for your class (a `.zip` they import with one click, without the solutions), validate, and open your class's results as a **dashboard** (scores per question, time away, warnings, verification, CSV export). The 🎓 button switches back to the **student view**, where you can practise the learning path like your students.

### Share the extension with your class

Point students to the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=lleonardogr.sphynx) (or the `.vsix` in the [latest release](https://github.com/lleonardogr/sphynx-vscode/releases/latest) for offline classrooms) and the [Getting started](#getting-started-students) steps above. Reference solutions (`Solution*.java`) are **never** included in the `.vsix`, but they are visible in this public repository.

To build the `.vsix` yourself:

```bash
npm install
npm run validate   # compiles the extension and checks every challenge against its reference solutions
npm run package    # creates sphynx-<version>.vsix
```

For a classroom without internet access, AI hints can use a model running on each computer, or on a school server. See [AI hints → For teachers](docs/ai-hints.md#for-teachers).

### Create your own challenges

Everything you need is in **[docs/creating-challenges.md](docs/creating-challenges.md)**: a 5-minute quick start, the file format, writing tests, the rules cookbook, validating, and sharing challenges with your class without rebuilding the extension.

In short: run **Sphynx: Create New Challenge…**, edit the generated files, then run **Sphynx: Validate Challenges in a Folder…** to check everything and fill in the expected outputs. Challenges without a `topic` appear in the **Custom** group. The [`custom/`](custom/) folder has three examples you can copy.

### Give an exam

Write an `exam.json` (title, duration, open or closed, submissions per question, and questions with points), share it with your class, and re-grade the results files they hand in. Questions can be any challenge, including the bigger mixed ones from the **Tests** group. A sample exam ships with the extension. See **[docs/exams.md](docs/exams.md)**.

## Roadmap

- [x] A complete Java learning path: 11 units, from the basics to OOP, exceptions, recursion and streams, with quizzes, tests and exams
- [x] AI hints tailored to the student's code (local model or your own API key)
- [x] English and Portuguese
- [x] Publish to the VS Code Marketplace
- [ ] A class dashboard for teachers that reads many exam results at once
- [ ] An algorithms and data structures unit
- [ ] AI help for writing new challenges
- [ ] Support more languages (Python, JavaScript, C, …) through a pluggable runner per language

## Development

```bash
git clone https://github.com/lleonardogr/sphynx-vscode.git
cd sphynx-vscode
npm install        # dependencies + the commit-message hook
npm run compile    # type-check and build to out/
```

Open the folder in VS Code and press **F5** to launch a window with the extension loaded. Then `npm run validate` checks every challenge, `npm test` runs the unit and integration tests, and `npm run package` builds the `.vsix`.

- `main` is protected. Work on a branch, open a pull request, and wait for CI (Linux, macOS and Windows; JDK 17 and 25) before merging.
- Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org): `feat(panel): …`, `fix(terminal): …`, `docs: …`.
- Releases are created by tagging `main` **after** merging: `git tag vX.Y.Z && git push origin vX.Y.Z`.

All the details (workflow, commit types, releasing) are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing

Contributions are welcome, especially new challenges! Start with [Creating your own challenges](docs/creating-challenges.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
