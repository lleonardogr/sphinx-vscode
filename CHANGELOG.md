# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.7.1] - 2026-10-05

### Added

- **Check Java Setup**: a new command (also in the sidebar's `...` menu) that compiles and runs a tiny program the same way Run, Submit and Run in Terminal do. It reports the `javac` and `java` that were found, their versions, `sphynx.java.home` and `JAVA_HOME`, and whether modern (JDK 25+) and classic Java work, with the fix for each problem.
  - It detects a missing JDK, a JDK older than 17, a `java` from a different (older) installation than `javac`, and a JDK that can't run the modern starters.
- Sphynx **checks Java when it starts**: if code can't run, it warns once and shows **Java isn't ready** at the top of the sidebar until it's fixed.
- **Choose JDK Folder…** sets `sphynx.java.home` after checking the folder has `bin/javac` (on macOS, picking the `.jdk` bundle works too) and checks again. The "Java not found" error now offers **Check Java Setup** and **Choose JDK Folder…**.

### Fixed

- The progress text "Running sample tests…" and "Submitting…" was not translated into Portuguese.

## [0.7.0] - 2026-10-05

### Changed

- **The learning path**: the sidebar now lists numbered **units** in teaching order (1 · Basics, 2 · Conditionals, 3 · Loops, 4 · Strings & Characters, 5 · Methods, 6 · Arrays, 7 · Collections, 8 · Object-Oriented Programming, 11 · Lambdas & Streams), so every challenge only uses what earlier units taught.
  - Strings and Methods come before arrays and collections; Data Structures is split into **Arrays** and **Collections**; Above Average moves from Loops to Arrays; Sum Until Zero moves up in Loops.
  - Each unit lists its challenges, then its **quiz**, then the **tests** that close a stage (a new `"unit"` field in `challenge.json`). The separate Quizzes and Tests groups are gone.
  - Challenges, quizzes and tests that belong to no unit (from teachers or imports) are grouped in the **Custom** section at the bottom.
  - Progress is kept: it is stored by challenge id. The old topic name `Variables` still works in custom content.

### Improved

- Every built-in challenge now meets the content standard:
  - 30 descriptions gained a **Things to know** section explaining the Java features involved, including the common traps (integer division, negative remainders, `int` overflow in Factorial and Collatz Steps).
  - The 5 shortest descriptions were expanded, with examples.
  - 11 challenges gained hidden edge-case tests.
- `npm run validate` (and CI) is now strict for the built-in content.

### Added

- **All built-in content in Portuguese**: the 46 challenges, 3 tests, 3 custom examples, 3 quizzes and the sample exam have Portuguese titles, descriptions, hints, rule messages and quiz texts, and 104 starters have a Portuguese version with translated comments. `npm run validate` (and CI) now requires the Portuguese translation for built-in content.
- **Portuguese (Brazil)**: a new `sphynx.language` setting (`en`, the default, or `pt-br`) switches Sphynx's language at once, without restarting.
  - The whole interface is translated: sidebar, units, challenge and quiz panels, run and submit results, exams, import, AI hints setup, terminal and messages. Command titles and settings follow VS Code's display language (`package.nls.pt-br.json`).
  - Content can carry translations next to the original: `description.pt-br.md`, a `translations` block in `challenge.json`, `quiz.json` and `exam.json`, and optional `Starter.pt-br.java`. Anything not translated falls back to English.
  - The program's output stays the same in both languages, so tests, solutions and grading are shared, and exam results are comparable.
  - AI hints answer in the Sphynx language unless `sphynx.ai.responseLanguage` is set.
  - The validator's `--lang=pt-br` lists missing translations.
- **Next step** button in the success banner after a challenge is accepted: it opens the next challenge, quiz or test in the path.
- The validator reports **content-standard warnings** (no "Things to know" section, a very short description, fewer than 3 hidden tests or 2 hints), and `--strict` makes them fail the run.

## [0.6.0] - 2026-10-04

### Changed

- **Tech Challenges is now Sphynx**, with a new logo: a geometric sphinx between code brackets. Like the sphinx of the legend, it asks questions you have to answer right.
  - The extension id is now `class-plugin.sphynx`, so VS Code installs it as a new extension. Uninstall Tech Challenges after installing Sphynx.
  - Settings are now `sphynx.*` (for example `sphynx.java.style`). Existing `techChallenges.*` settings are copied over automatically on first start.
  - Commands are under **Sphynx:** in the Command Palette, the sidebar is called Sphynx, and the release file is `sphynx-X.Y.Z.vsix`.
  - Student code is saved in `sphynx/`. An existing `tech-challenges/` folder keeps being used, so no code is lost.
  - Exam results files use the format `sphynx-exam-results`, and **Verify** still accepts files from Tech Challenges.
  - Solved-challenge progress, exam state and saved AI keys belong to the old extension id, so they start fresh.
  - The repository moved to [lleonardogr/sphynx-vscode](https://github.com/lleonardogr/sphynx-vscode). Old links redirect.

### Added

- **Quizzes**: question sets defined by a `quiz.json` (with a JSON schema), with four question types: multiple choice (one or several right answers), true or false, short answer, and "what does this code print?" (typed, or picked from options).
  - A **Quizzes** group in the sidebar for practice: check one answer or all of them, see the right answer and an explanation, and keep your best score.
  - **In exams**: a quiz can be an exam question (a built-in id or a private quiz folder). Answers are saved as you go and auto-submitted when time runs out. A quiz is submitted once without feedback, scored as points × quiz points earned ÷ total, and re-graded by **Verify Students' Exam Results**.
  - The validator compiles and runs every "what does this code print?" question, flags answers that don't match the real output, and can fill in empty answers.
  - Two built-in quizzes (Java Basics, Loops and Conditionals), and a warm-up quiz in the sample exam.
  - **Import** also imports quizzes.
  - Guide: [Quizzes](docs/quizzes.md).

## [0.5.0] - 2026-10-04

### Added

- **Import Challenges, Tests or Exams…**: a new button (⤓) at the top of the sidebar imports what a teacher shared, as a `.zip` or a folder.
  - Every folder with a `challenge.json` or an `exam.json` is found, checked, and copied into the extension's library, which loads automatically. No settings change is needed, and imports keep working after the zip is deleted.
  - Packages that contain `Solution*.java` files ask whether to remove them (students) or keep them (teachers).
  - Re-importing offers to replace the older version. Items whose id matches a built-in one are renamed with `-imported`. Unsafe zip paths are refused.
  - **Remove Imported Challenges, Tests or Exams…** takes them out again.

## [0.4.0] - 2026-10-04

### Added

- **Exams**: timed, graded sets of challenges, defined by an `exam.json` (with a JSON schema for autocomplete).
  - An **Exams** group in the sidebar, a countdown in the status bar, and the student's name in the results.
  - **Limited submissions** per question with **partial credit** (points × tests passed ÷ total). The best submission counts, and Run stays unlimited.
  - **Open** or **closed** mode. Closed exams hide hints and AI hints, and record integrity warnings: large pastes or AI completions, time spent outside VS Code, and an enabled GitHub Copilot.
  - When time is up (even if VS Code was closed), changed answers are submitted automatically, the exam is locked, and a **results file** is written.
  - **Verify Students' Exam Results (Teachers)** re-runs each saved answer and recomputes the score, flagging edited files.
  - Private questions can live inside the exam folder. A sample exam ships in `exams/sample-exam`.
  - Guide: [Exams](docs/exams.md).
- **Tests**: a new group of bigger challenges that mix several topics in one program, graded with scripted runs of whole sessions.
  - Three menu-driven console apps: **Calculator Menu** (Easy: variables, conditionals, loops), **Grade Book Menu** (Medium: adds a `List` and methods) and **Inventory Menu** (Hard: adds a `TreeMap` and strings).
  - A new optional `"skills"` field in `challenge.json` lists the topics a challenge combines, shown as badges in the panel and the sidebar tooltip.
  - Guide: [Tests: mixed challenges](docs/creating-challenges.md#tests-mixed-challenges).

## [0.3.0] - 2026-10-03

### Added

- One challenge per language construct, each enforced by a rule:
  - **Conditionals:** Weather Label (ternary `? :`, no `if`) and Days in a Month (switch expression with `case ... ->`).
  - **Loops:** Collatz Steps (`while`, with a hidden test whose values overflow an `int`), Sum Until Zero (`do-while`) and Above Average (for-each).

### Changed

- **All modern starters now read input the modern way, with `IO.readln()`** (plus `Integer.parseInt` / `Double.parseDouble`, and `split(" ")` for several values on one line) instead of `Scanner`. Challenge notes and hints show the modern call first, with the classic `Scanner` call in brackets. Classic starters still use `Scanner`, and both styles are still accepted.
- **Create New Challenge** writes modern templates that use `IO.readln()`, and the guide's example starter does too.

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

[Unreleased]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.7.1...HEAD
[0.7.1]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/lleonardogr/sphynx-vscode/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/lleonardogr/sphynx-vscode/releases/tag/v0.1.0
