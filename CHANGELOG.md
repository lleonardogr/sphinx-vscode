# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- One challenge per language construct, each enforced by a rule:
  - **Conditionals:** Weather Label (ternary `? :`, no `if`) and Days in a Month (switch expression with `case ... ->`).
  - **Loops:** Collatz Steps (`while`, with a hidden test whose values overflow an `int`), Sum Until Zero (`do-while`) and Above Average (for-each).
- The new modern starters read input with `IO.readln()`.

## [0.2.1] - 2026-10-03

### Changed

- New logo: code brackets around a mountain path with a flag at the peak. It's used for the extension icon (Extensions view and Marketplace), the Activity Bar icon, the problem panel tab and the README banner.

## [0.2.0] - 2026-10-03

### Added

- **Data Structures** topic: the Arrays topic is renamed and gains five challenges on `ArrayList` (To-Do List), `HashSet` (Unique Words), `HashMap` (Word Frequency), `EnumMap` (Weekly Study Hours) and a stack with `ArrayDeque` (Balanced Brackets).
- **Streams** topic: five Stream API challenges solved without loops: Even Squares (`filter`/`map`/`joining`), Stream Statistics (`summaryStatistics`, with a hidden `int` overflow test), Clean Up a Name List (`map`/`distinct`/`sorted`), Group Words by Length (`groupingBy`) and Top 3 Scorers (records, comparators, `limit`).

### Changed

- The "Arrays" topic is now "Data Structures". Progress is kept, because it's stored by challenge id.

## [0.1.0] - 2026-10-03

First release of **Tech Challenges**, starting with Java.

### Added

- **Custom** group: a challenge whose `challenge.json` has no `topic` appears in a Custom folder at the bottom of the sidebar. `topic` is now optional, and **Create New Challenge** offers "Custom (no topic)".
- Three example custom challenges in `custom/` (Word Counter, Grade Report, Caesar Cipher), shipped with the extension and validated in CI.
- Extension icon for the Extensions view and the Marketplace (the sidebar keeps the coffee-cup icon).
- Tech Challenges sidebar with 31 challenges across Variables, Conditionals, Loops, Arrays, Strings, Methods and OOP (classes, `toString`, encapsulation, inheritance, interfaces).
- Problem panel with the description, examples, requirements and hints revealed one at a time.
- Local compile-and-test runner (`javac`/`java`) with sample tests (Run) and hidden tests (Submit).
- **Run in Terminal**: run the program in an interactive terminal and type the input yourself.
- **Try your own input**: a custom-input box in the problem panel runs the program once with any input and shows its output, and compares it with the expected output when the input matches an example. Rules aren't checked and it doesn't count as an attempt. The input is remembered per challenge.
- Modern Java 25+ starter code by default (compact source files, `IO.println`), with a `techChallenges.java.style` setting for classic `public class Main` starter code. Both styles are always accepted, because only the output is checked.
- A JDK version check that offers to switch to classic style on JDK < 25, and a friendly compile hint when modern syntax is used on an older JDK.
- Feedback for compile errors (shown as editor diagnostics), wrong answers (expected vs. actual output), runtime exceptions and time limits.
- Code requirement rules (`mustContain` / `mustNotContain`) for practising specific syntax.
- Progress tracking in the tree view and status bar.
- `extraChallengePaths` setting for loading teacher-provided challenges without rebuilding.
- **AI hints** (optional, off by default): one hint at a time about the student's current code, without writing the solution. Providers: Ollama and LM Studio (local), Anthropic Claude and OpenAI-compatible APIs (your own key, stored in VS Code's secret storage), and VS Code language models. Hidden test inputs are never sent. Teachers can disable AI hints per challenge with `"aiHints": false`.
- **Challenge authoring tools**: a **Create New Challenge** command, a **Validate Challenges in a Folder** command (no Node.js needed, can fill in expected outputs), and a JSON schema with autocomplete for `challenge.json`.
- Guides: [Creating your own challenges](docs/creating-challenges.md) and [AI hints](docs/ai-hints.md).
- `scripts/validate-challenges.js` to check every starter and reference solution (modern and classic) and to generate expected outputs.
- CI on Linux, macOS and Windows (JDK 25) plus JDK 17 (classic style), and a tag-triggered release workflow that publishes the `.vsix`.
- Contribution workflow: [Conventional Commits](https://www.conventionalcommits.org), enforced by a `commit-msg` hook (enabled by `npm install`) and a **Conventional commits** CI check on pull requests; squash merges into a protected `main`.

[Unreleased]: https://github.com/lleonardogr/tech-challenges-vscode/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/lleonardogr/tech-challenges-vscode/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/lleonardogr/tech-challenges-vscode/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/lleonardogr/tech-challenges-vscode/releases/tag/v0.1.0
