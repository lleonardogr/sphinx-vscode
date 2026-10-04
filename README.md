<p align="center">
  <img src="media/logo/banner.png" alt="Tech Challenges: code brackets around a mountain path with a flag at the peak" width="100%">
</p>

# Tech Challenges for VS Code

[![CI](https://github.com/lleonardogr/tech-challenges-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/lleonardogr/tech-challenges-vscode/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/lleonardogr/tech-challenges-vscode)](https://github.com/lleonardogr/tech-challenges-vscode/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

HackerRank / LeetCode-style coding challenges right inside VS Code, running fully offline on the student's machine, with optional **AI hints** from a local model or your own API key. It starts with **Java**: from the basic syntax to data structures, object-oriented programming and the Stream API.

📘 **Guides:** [Creating your own challenges](docs/creating-challenges.md) · [Tests](docs/creating-challenges.md#tests-mixed-challenges) · [Exams](docs/exams.md) · [AI hints](docs/ai-hints.md)

Students pick a challenge from the **Tech Challenges** sidebar. The problem statement opens on the left and a `Main.java` file on the right. **Run** checks the sample tests, **Run with this input** and **Run in Terminal** let them try their own input, and **Submit** also runs the hidden tests and marks the challenge as solved.

## Topics included (52 challenges)

| Topic        | Challenges |
|--------------|------------|
| Variables    | Hello World · Greeting with Variables · Arithmetic Operators · Rectangle Area · Celsius to Fahrenheit |
| Conditionals | Even or Odd · Largest of Three · Grade Calculator (`if`/`else if`) · Leap Year · Day of the Week (`switch` statement) · Weather Label (ternary `? :`) · Days in a Month (switch expression) |
| Loops        | Count to N (`for`) · Sum 1..N · Multiplication Table · Factorial · FizzBuzz · Sum of Digits (`while`) · Collatz Steps (`while`) · Sum Until Zero (`do-while`) · Above Average (for-each) |
| Data Structures | Array Sum · Largest and Smallest · Reverse an Array · Count Occurrences · To-Do List (`ArrayList`) · Unique Words (`HashSet`) · Word Frequency (`HashMap`) · Weekly Hours (`EnumMap`) · Balanced Brackets (stack) |
| Strings      | Reverse a String · Count Vowels · Palindrome |
| Methods      | Prime Numbers · Power |
| OOP          | Your First Class · Rectangle Class · Book with `toString()` · Bank Account (encapsulation) · Shapes (inheritance) · Animals (interfaces) |
| Streams      | Even Squares (`filter`/`map`) · Stream Statistics · Clean Up a Name List (`distinct`/`sorted`) · Group Words by Length (`groupingBy`) · Top 3 Scorers (comparators, `limit`). Solved without loops. |
| Tests        | Calculator Menu · Grade Book Menu · Inventory Menu: bigger **menu-driven console apps** that mix variables, conditionals, loops, data structures, strings and methods in one program |
| Custom       | Word Counter · Grade Report · Caesar Cipher: [example custom challenges](custom/) to copy when writing your own |

## Features

- **Problem panel** with the description, examples, requirements and hints that are revealed one at a time.
- **Run / Submit** buttons in the panel and in the editor title bar (`Cmd/Ctrl+Alt+R` runs, `Cmd/Ctrl+Alt+Enter` submits).
- **Try your own input**: type any input in the problem panel and click **Run with this input** to see what your program prints. If the input matches an example, the expected output and the first differing line are shown too. It doesn't check rules and doesn't count as an attempt.
- **Run in Terminal** compiles the program and runs it in an interactive terminal, so students can type input while it runs and see exactly what it prints.
- **Clear feedback**: compiler errors show as red squiggles and link to the line, each test shows Expected vs. Your output with the first differing line, and the panel reports runtime exceptions and time-limit (infinite loop) failures.
- **Hidden tests** catch edge cases like negative numbers, zero and overflow, without revealing their input.
- **Modern Java by default, classic on request**: starter code uses Java 25+ compact source files (`void main()`, `IO.println`). Set `techChallenges.java.style` to `classic` for `public class Main` starter code. Either style is **always accepted**, because only the output is checked.
- **Syntax requirements**: a challenge can require constructs (for example "use a `switch`", "create `class Square extends Shape`" or "keep `balance` private") or forbid shortcuts (`Math.max`, `reverse()`, `Math.pow`).
- **AI hints (optional, off by default)**: an AI tutor gives one hint at a time about your current code, without writing the solution. It works with a **local model** (Ollama, LM Studio: free and private), **your own API key** (Anthropic Claude or any OpenAI-compatible API), or VS Code's language models (GitHub Copilot). API keys are stored in VS Code's encrypted secret storage. See [AI hints](docs/ai-hints.md).
- **Tests**: bigger challenges that **mix several topics** in one program, such as a console app with a menu (`1. Add`, `2. List`, `0. Exit`). Each one shows the skills it combines, and is graded by feeding it whole sequences of menu choices.
- **Exams**: timed, graded sets of questions with a countdown, limited submissions, partial credit and a results file to hand in. An exam can be **open** (hints, AI and the internet allowed) or **closed** (hints and AI off; pastes and time outside VS Code are recorded). Teachers re-grade the results files with **Verify Exam Results**. See [Exams](docs/exams.md).
- **Create your own challenges**: **Create New Challenge** sets up a ready-to-edit example, `challenge.json` gets autocomplete and validation, and **Validate Challenges** checks your tests and fills in the expected outputs. No Node.js needed. See [Creating your own challenges](docs/creating-challenges.md).
- **Progress tracking** shows ✓ in the tree, a count per topic, and an `x/52 solved` counter in the status bar.

## Getting started (students)

### 1. Install Java

Install a **JDK 25 or newer**, for example [Eclipse Temurin](https://adoptium.net/temurin/releases/). Then open a terminal and check it:

```bash
javac -version   # should print javac 25 or newer
```

If you can only use JDK 17–24, that works too: the extension offers to switch to classic Java.

### 2. Install the extension

1. Open the [latest release](https://github.com/lleonardogr/tech-challenges-vscode/releases/latest) and download **`tech-challenges-x.y.z.vsix`**.
2. In VS Code, open the **Extensions** view, click the **`...`** menu at the top, and choose **Install from VSIX…**. Then select the downloaded file.

   Or, in a terminal: `code --install-extension tech-challenges-x.y.z.vsix`
3. Open a folder for your work (**File → Open Folder…**). Your code is saved in `tech-challenges/<challenge>/Main.java` inside it.

### 3. Solve your first challenge

1. Click the **Tech Challenges** icon in the Activity Bar (left side) and choose **Hello, World!** The problem opens on the left and your `Main.java` on the right.
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
| `techChallenges.java.style` | `modern` | Starter code style for new challenges: `modern` (JDK 25+) or `classic` (JDK 17+). Use **Reset Code to Starter** to switch a challenge you already opened. |
| `techChallenges.java.home` | (empty) | The JDK folder, if `javac` is not on your PATH. |
| `techChallenges.codeFolder` | (empty) | Where solutions are saved. |
| `techChallenges.extraChallengePaths` | `[]` | Extra challenge folders provided by your teacher. |
| `techChallenges.ai.provider` | `off` | AI hints provider: `ollama`, `lmstudio`, `anthropic`, `openai-compatible` or `vscode`. Run **Set Up AI Hints** for a guided setup. |

## For teachers

### Share the extension with your class

Point students to the [latest release](https://github.com/lleonardogr/tech-challenges-vscode/releases/latest) and the [Getting started](#getting-started-students) steps above. Reference solutions (`Solution*.java`) are **never** included in the `.vsix`, but they are visible in this public repository.

To build the `.vsix` yourself:

```bash
npm install
npm run validate   # compiles the extension and checks every challenge against its reference solutions
npm run package    # creates tech-challenges-<version>.vsix
```

For a classroom without internet access, AI hints can use a model running on each computer, or on a school server. See [AI hints → For teachers](docs/ai-hints.md#for-teachers).

### Create your own challenges

Everything you need is in **[docs/creating-challenges.md](docs/creating-challenges.md)**: a 5-minute quick start, the file format, writing tests, the rules cookbook, validating, and sharing challenges with your class without rebuilding the extension.

In short: run **Tech Challenges: Create New Challenge…**, edit the generated files, then run **Tech Challenges: Validate Challenges in a Folder…** to check everything and fill in the expected outputs. Challenges without a `topic` appear in the **Custom** group. The [`custom/`](custom/) folder has three examples you can copy.

### Give an exam

Write an `exam.json` (title, duration, open or closed, submissions per question, and questions with points), share it with your class, and re-grade the results files they hand in. Questions can be any challenge, including the bigger mixed ones from the **Tests** group. A sample exam ships with the extension. See **[docs/exams.md](docs/exams.md)**.

## Roadmap

- [x] Object-oriented programming challenges
- [ ] Support more languages (Python, JavaScript, C, …) through a pluggable runner per language
- [ ] More topics (collections, recursion, exceptions, algorithms)
- [x] AI hints tailored to the student's code (local model or your own API key)
- [ ] AI help for writing new challenges
- [ ] Publish to the VS Code Marketplace

## Development

```bash
git clone https://github.com/lleonardogr/tech-challenges-vscode.git
cd tech-challenges-vscode
npm install        # dependencies + the commit-message hook
npm run compile    # type-check and build to out/
```

Open the folder in VS Code and press **F5** to launch a window with the extension loaded. Then `npm run validate` checks every challenge, and `npm run package` builds the `.vsix`.

- `main` is protected. Work on a branch, open a pull request, and wait for CI (Linux, macOS and Windows; JDK 17 and 25) before merging.
- Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org): `feat(panel): …`, `fix(terminal): …`, `docs: …`.
- Releases are created by tagging `main` **after** merging: `git tag vX.Y.Z && git push origin vX.Y.Z`.

All the details (workflow, commit types, releasing) are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Contributing

Contributions are welcome, especially new challenges! Start with [Creating your own challenges](docs/creating-challenges.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
