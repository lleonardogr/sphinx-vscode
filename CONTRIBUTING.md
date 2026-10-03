# Contributing

Thanks for helping improve Tech Challenges! You can contribute in two main ways: new challenges and code changes.

## Setup

Requirements: Node.js 20+, a JDK 25+ (so the modern solutions are validated too), and VS Code.

```bash
npm install        # also enables the commit-message hook (.githooks/commit-msg)
npm run compile
```

Open the folder in VS Code and press **F5** to launch an Extension Development Host with the extension loaded.

## Workflow

`main` is protected: every change goes through a pull request, and CI must pass before merging.

1. Create a branch from an up-to-date `main`, named after the change: `feat/custom-input`, `fix/terminal-backspace`, `docs/ai-guide`.
2. Commit using [Conventional Commits](#commit-messages).
3. Push and open a pull request against `main`. Give it a Conventional Commits title, because the PR is **squash-merged** and its title becomes the commit on `main`.
4. CI checks:
   - **Validate** on Linux, macOS and Windows (JDK 25) and on Linux (JDK 17);
   - **Package** (the `.vsix` builds);
   - **Conventional commits** (the PR title and commit messages).
5. If GitHub says the branch is out of date, click **Update branch**, wait for CI, then **Squash and merge**.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org):

```
<type>(<optional scope>)<optional !>: <subject>

<optional body>

<optional footers, e.g. BREAKING CHANGE: …>
```

| Type | Use it for |
|------|-----------|
| `feat` | A new feature for users (a new challenge counts: `feat(challenges): add sum-of-evens`) |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A performance improvement |
| `test` | Adding or fixing tests |
| `build` | Build system or dependencies (`package.json`, esbuild) |
| `ci` | GitHub Actions workflows |
| `chore` | Maintenance, such as releases (`chore(release): v0.2.0`) |
| `revert` | Reverting an earlier commit |

- Write the subject in the imperative and in lowercase, without a final period: `fix(terminal): ignore arrow keys`, not `Fixed arrow keys.`
- Common scopes: `java`, `panel`, `terminal`, `ai`, `authoring`, `challenges`, `runner`, `docs`, `release`.
- Mark breaking changes with `!` after the type and a `BREAKING CHANGE:` footer explaining what users must change.

The `commit-msg` hook checks your messages locally (enabled by `npm install`), and the **Conventional commits** CI check checks the PR title and every commit.

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
- Write hints that teach, not hints that give the answer away. Order them from gentle to specific.

## Code changes

- Keep `src/runner.ts`, `src/validator.ts` and `src/ai/prompt.ts` free of `vscode` imports. The validator script and tests reuse them.
- Run `npm run validate` before opening a pull request.
- Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md).

## Releasing (maintainers)

Releases are published by pushing a version tag **on `main`, after the release changes are merged**. The tag builds whatever `main` contains at that moment.

1. Open a pull request named `chore(release): vX.Y.Z` that bumps `version` in `package.json` and moves the **Unreleased** notes in `CHANGELOG.md` into a new `X.Y.Z` section (with the date and the compare links at the bottom).
2. Merge it once CI passes.
3. Tag the merged `main` and push the tag:

   ```bash
   git checkout main
   git pull
   git log -1 --oneline          # should be the chore(release) commit
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

4. The **Release** workflow checks that the tag matches `package.json`, validates every challenge, builds `tech-challenges-X.Y.Z.vsix` and attaches it to a GitHub Release.
5. Open the release page and check that the attached file is `tech-challenges-X.Y.Z.vsix`.

If a release was published from the wrong commit, delete it together with its tag (`gh release delete vX.Y.Z --yes --cleanup-tag`), fix `main`, and tag again.
