# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-10-03

First release of **Tech Challenges**, starting with Java.

### Added

- Tech Challenges sidebar with 31 challenges across Variables, Conditionals, Loops, Arrays, Strings, Methods and OOP (classes, `toString`, encapsulation, inheritance, interfaces).
- Problem panel with the description, examples, requirements and hints revealed one at a time.
- Local compile-and-test runner (`javac`/`java`) with sample tests (Run) and hidden tests (Submit).
- **Run in Terminal**: run the program in an interactive terminal and type the input yourself.
- Modern Java 25+ starter code by default (compact source files, `IO.println`), with a `techChallenges.java.style` setting for classic `public class Main` starter code. Both styles are always accepted, because only the output is checked.
- A JDK version check that offers to switch to classic style on JDK < 25, and a friendly compile hint when modern syntax is used on an older JDK.
- Feedback for compile errors (shown as editor diagnostics), wrong answers (expected vs. actual output), runtime exceptions and time limits.
- Code requirement rules (`mustContain` / `mustNotContain`) for practising specific syntax.
- Progress tracking in the tree view and status bar.
- `extraChallengePaths` setting for loading teacher-provided challenges without rebuilding.
- `scripts/validate-challenges.js` to check every starter and reference solution (modern and classic) and to generate expected outputs.
- CI on Linux, macOS and Windows (JDK 25) plus JDK 17 (classic style), and a tag-triggered release workflow that publishes the `.vsix`.

[Unreleased]: https://github.com/lleonardogr/tech-challenges-vscode/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lleonardogr/tech-challenges-vscode/releases/tag/v0.1.0
