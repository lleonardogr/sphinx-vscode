# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Support for modern Java 25+ syntax. Compact source files (`void main()` without a class), `IO.println` and `IO.readln` are accepted alongside the classic style, because only the output is checked.
- A friendly compile message explaining that modern syntax needs JDK 25+ when an older JDK is installed.
- `Solution.modern.java` reference solutions for all 25 challenges. The validator now checks every `Solution*.java`.
- CI validates on JDK 25 (both styles, on all operating systems) and JDK 17 (classic style).

### Changed

- Challenge rules for `hello-world`, `is-prime` and `power-method` now accept both styles (`IO.println`, methods without `static`).

## [0.1.0] - 2026-10-03

### Added

- Java Challenges sidebar with 25 beginner challenges across Variables, Conditionals, Loops, Arrays, Strings and Methods.
- Problem panel with the description, examples, requirements and hints revealed one at a time.
- Local compile-and-test runner (`javac`/`java`) with sample tests (Run) and hidden tests (Submit).
- Feedback for compile errors (shown as editor diagnostics), wrong answers (expected vs. actual output), runtime exceptions and time limits.
- Code requirement rules (`mustContain` / `mustNotContain`) for practising specific syntax.
- Progress tracking in the tree view and status bar.
- `extraChallengePaths` setting for loading teacher-provided challenges without rebuilding.
- `scripts/validate-challenges.js` to check challenges against reference solutions and generate expected outputs.

[Unreleased]: https://github.com/lleonardogr/tech-challenges-vscode/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/lleonardogr/tech-challenges-vscode/releases/tag/v0.1.0
