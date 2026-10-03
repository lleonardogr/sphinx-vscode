# Contributing

Thanks for helping improve Tech Challenges! You can contribute in two main ways: new challenges and code changes.

## Setup

Requirements: Node.js 20+, a JDK 25+ (so the modern solutions are validated too), and VS Code.

```bash
npm install
npm run compile
```

Open the folder in VS Code and press **F5** to launch an Extension Development Host with the extension loaded.

## Adding a challenge

The full guide is **[docs/creating-challenges.md](docs/creating-challenges.md)**. The short version for this repository:

1. Create `challenges/<challenge-id>/`, using a short kebab-case id such as `sum-of-evens`.
2. Add the following files:
   - `challenge.json`: title, topic, difficulty, order, hints, rules and tests. [The guide](docs/creating-challenges.md#challengejson) documents every field.
   - `description.md`: the problem statement, starting with `# Title`. Describe the **Input** and **Output** formats precisely.
   - `Starter.java`: modern starter code, a Java 25+ compact source file (`void main()`, `IO.println`) that compiles but does not solve the problem.
   - `Starter.classic.java`: the same starter as a classic `public class Main`.
   - `Solution.java` and `Solution.classic.java`: reference solutions in both styles.
3. Add tests with `"output": ""`, and mark the edge cases `"hidden": true`. Then generate the expected outputs:

   ```bash
   npm run compile
   node scripts/validate-challenges.js --generate
   ```

4. Review the generated outputs in `challenge.json`, then run `npm run validate`. It must report every challenge as OK.

### Challenge guidelines

- Aim at one concept per challenge, and say which construct to use when that is the point of the exercise. Enforce it with `mustContain` / `mustNotContain`.
- Include at least two visible examples and a few hidden tests for edge cases (zero, negatives, boundaries, overflow).
- Keep the output format unambiguous. When decimals are involved, specify how many places to print.
- Students may use modern (Java 25+) or classic syntax. Don't write rules that only match one style, such as requiring `static`, `public class` or `System.out`.
- In OOP challenges, remember that in a compact source file every class is nested in the implicit class, so `private` members are still visible to `main`. Use a `mustNotContain` rule if a challenge depends on encapsulation (see `bank-account`).
- In OOP challenges, remember that in a compact source file every class is nested in the implicit class, so `private` members are still visible to `main`. Use a `mustNotContain` rule if a challenge depends on encapsulation (see `bank-account`).
- Write hints that teach, not hints that give the answer away. Order them from gentle to specific.

## Code changes

- Keep `src/runner.ts` free of `vscode` imports. The validator script reuses it.
- Run `npm run validate` before opening a pull request. CI runs it on Linux, macOS and Windows.
- Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md).

## Releasing (maintainers)

1. Bump `version` in `package.json` and move the **Unreleased** notes into a new version section in `CHANGELOG.md`.
2. Commit, then tag and push:

   ```bash
   git tag v0.2.0
   git push origin main --tags
   ```

3. The Release workflow builds the `.vsix` and attaches it to a GitHub Release.
