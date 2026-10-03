# Tech Challenges for VS Code

[![CI](https://github.com/lleonardogr/tech-challenges-vscode/actions/workflows/ci.yml/badge.svg)](https://github.com/lleonardogr/tech-challenges-vscode/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/lleonardogr/tech-challenges-vscode)](https://github.com/lleonardogr/tech-challenges-vscode/releases/latest)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

HackerRank / LeetCode-style coding challenges right inside VS Code, running fully offline on the student's machine. It starts with **Java**: from the basic syntax up to object-oriented programming.

Students pick a challenge from the **Tech Challenges** sidebar. The problem statement opens on the left and a `Main.java` file on the right. **Run** checks the sample tests, **Run in Terminal** lets them type their own input, and **Submit** also runs the hidden tests and marks the challenge as solved.

## Topics included (31 challenges)

| Topic        | Challenges |
|--------------|------------|
| Variables    | Hello World · Greeting with Variables · Arithmetic Operators · Rectangle Area · Celsius to Fahrenheit |
| Conditionals | Even or Odd · Largest of Three · Grade Calculator · Leap Year · Day of the Week (`switch`) |
| Loops        | Count to N · Sum 1..N · Multiplication Table · Factorial · FizzBuzz · Sum of Digits (`while`) |
| Arrays       | Array Sum · Largest and Smallest · Reverse an Array · Count Occurrences |
| Strings      | Reverse a String · Count Vowels · Palindrome |
| Methods      | Prime Numbers · Power |
| OOP          | Your First Class · Rectangle Class · Book with `toString()` · Bank Account (encapsulation) · Shapes (inheritance) · Animals (interfaces) |

## Features

- **Problem panel** with the description, examples, requirements and hints that are revealed one at a time.
- **Run / Submit** buttons in the panel and in the editor title bar (`Cmd/Ctrl+Alt+R` runs, `Cmd/Ctrl+Alt+Enter` submits).
- **Run in Terminal** compiles the program and runs it in an interactive terminal, so students can type input themselves and see exactly what it prints.
- **Clear feedback**: compiler errors show as red squiggles and link to the line, each test shows Expected vs. Your output with the first differing line, and the panel reports runtime exceptions and time-limit (infinite loop) failures.
- **Hidden tests** catch edge cases like negative numbers, zero and overflow, without revealing their input.
- **Modern Java by default, classic on request**: starter code uses Java 25+ compact source files (`void main()`, `IO.println`). Set `techChallenges.java.style` to `classic` for `public class Main` starter code. Either style is **always accepted**, because only the output is checked.
- **Syntax requirements**: a challenge can require constructs (for example "use a `switch`", "create `class Square extends Shape`" or "keep `balance` private") or forbid shortcuts (`Math.max`, `reverse()`, `Math.pow`).
- **Progress tracking** shows ✓ in the tree, a count per topic, and an `x/31 solved` counter in the status bar.

## For students

1. Install a **JDK 25 or newer**, for example [Eclipse Temurin](https://adoptium.net/temurin/releases/). Check it in a terminal with `javac -version`. If you only have JDK 17–24, the extension offers to switch to classic Java.
2. Download the latest `tech-challenges-x.y.z.vsix` from the [Releases page](https://github.com/lleonardogr/tech-challenges-vscode/releases/latest). Then install it: **Extensions view → `...` menu → Install from VSIX…** From a terminal you can also run `code --install-extension tech-challenges-0.1.0.vsix`.
3. (Recommended) Open a folder (**File → Open Folder…**). Your solutions are saved in `tech-challenges/<challenge>/Main.java` inside it.
4. Click the **Tech Challenges** icon in the Activity Bar and start with **Hello, World!**

Your program reads its input and prints the answer, exactly like HackerRank. Both styles work:

```java
// Modern Java (JDK 25+), the default starter code
void main() {
    Scanner scanner = new Scanner(System.in);   // no import needed in compact source files
    int n = scanner.nextInt();
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

The file is always `Main.java`. In classic Java, the public class must be named `Main`. Other classes (OOP challenges) go in the same file, without `public`.

**Settings**

| Setting | Default | Description |
| ------- | ------- | ----------- |
| `techChallenges.java.style` | `modern` | Starter code style for new challenges: `modern` (JDK 25+) or `classic` (JDK 17+). Use **Reset Code to Starter** to switch a challenge you already opened. |
| `techChallenges.java.home` | (empty) | The JDK folder, if `javac` is not on your PATH. |
| `techChallenges.codeFolder` | (empty) | Where solutions are saved. |
| `techChallenges.extraChallengePaths` | `[]` | Extra challenge folders provided by your teacher. |

## For teachers

### Build and share the extension

```bash
npm install
npm run validate   # compiles the extension and checks every challenge against its reference solutions
npm run package    # creates tech-challenges-0.1.0.vsix
```

Send the `.vsix` file to your students, or point them to the [Releases page](https://github.com/lleonardogr/tech-challenges-vscode/releases/latest). Pushing a `v*` tag publishes a release automatically. Reference solutions (`Solution*.java`) are **not** included in the package, but they are visible in this public repository.

To develop, open this folder in VS Code and press **F5** to launch a test window with the extension loaded.

### Add a challenge

Create a folder in `challenges/` (the folder name is the challenge id):

```
challenges/my-challenge/
  challenge.json         metadata, rules and tests
  description.md         problem statement (Markdown, starts with "# Title")
  Starter.java           modern starter code (Java 25+ compact source file)
  Starter.classic.java   classic starter code (public class Main)
  Solution.java          modern reference solution    (used by `npm run validate`,
  Solution.classic.java  classic reference solution    never shipped to students)
```

`npm run validate` compiles every starter and checks **every** `Solution*.java` against the same tests, which proves the challenge accepts both styles. Write rules that work for both: for example `boolean\s+isPrime` rather than `static\s+boolean\s+isPrime`, and `(System\.out|\bIO)\s*\.\s*print` rather than `System\.out\.print`. On a JDK older than 25, only the `*.classic.java` files are checked.

`challenge.json`:

```json
{
  "title": "Sum of Two Numbers",
  "topic": "Variables",
  "difficulty": "Easy",
  "order": 6,
  "hints": ["scanner.nextInt() reads an integer."],
  "mustContain": [{ "pattern": "\\bint\\b", "message": "Use int variables." }],
  "mustNotContain": [{ "pattern": "Math\\.", "message": "Don't use the Math class." }],
  "timeLimitMs": 5000,
  "tests": [
    { "input": "3 4\n", "output": "" },
    { "input": "-1 1\n", "output": "", "hidden": true }
  ]
}
```

- `topic` can be any name. The known topics (Variables, Conditionals, Loops, Arrays, Strings, Methods, OOP) are listed first, in that order.
- `pattern`s are regular expressions checked against the code with comments removed.
- Leave `output` empty and run `node scripts/validate-challenges.js --generate` to fill in each expected output from your reference solution. Then review the outputs.
- Output comparison ignores trailing spaces and trailing blank lines. Programs always run with a US locale, so decimals print as `3.14` on every machine.

### Hand out challenges without rebuilding

Put challenge folders anywhere, for example a shared drive or a git repo, and have students add that folder to the `techChallenges.extraChallengePaths` setting. If a challenge has the same id as a built-in one, it replaces the built-in one.

## Roadmap

- [x] Object-oriented programming challenges
- [ ] Support more languages (Python, JavaScript, C, …) through a pluggable runner per language
- [ ] More topics (collections, recursion, exceptions, algorithms)
- [ ] AI assistance: hints tailored to the student's code, explanations of errors, and help writing new challenges
- [ ] Publish to the VS Code Marketplace

## Contributing

Contributions are welcome, especially new challenges! See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
