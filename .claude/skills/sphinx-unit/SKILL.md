---
name: sphinx-unit
description: Create or rework a Sphinx learning unit (a reading guide or quick guide, a quiz and challenges) following the content guide. Use when asked to add or improve a unit, subject, lesson, reading guide, quiz, challenge or test in Sphinx's built-in content, or to review existing content against the rubric.
---

# Creating a Sphinx unit

The standard is [docs/content-guide.md](../../../docs/content-guide.md). Read it first: the unit template, reading guides, the challenge ladder and the concept test, the quiz rules and the rubric. File formats are in [docs/creating-challenges.md](../../../docs/creating-challenges.md) and [docs/quizzes.md](../../../docs/quizzes.md). Every unit in [subjects/cs](../../../subjects/cs) is a finished example.

## Workflow

Follow these steps in order. Don't skip the approval in step 2.

### 1. Write the unit spec

Use the template at the end of the content guide:

- **3–5 objectives** written as things a student does (convert, predict, trace, explain why).
- **The reading guide:** the key idea, the diagram, and 1–3 candidate readings.
- **The quiz:** 8–10 questions. At most 30% recall, at least 50% apply or predict, at least one "why". Each wrong option is a real mistake.
- **4 challenges**, one per step of the ladder (Easy, Easy or Medium, Medium, Hard). For each, say why it is a challenge and not a quiz question (the concept test), and give its real-world hook.
- **Prerequisites:** the units of other subjects each item needs, such as Java `Loops`.

When reworking, score the existing items with the rubric first and propose keep, revise or replace.

### 2. Get the spec approved

Show the spec to the person and wait for a clear approval before writing any file.

### 3. Choose and check the readings

- Free, without login or paywall. Accurate, for beginners, and covering the objectives.
- Prefer pages with diagrams, animations or interactive parts. English is fine.
- **Check every link yourself:**
  - Open the page and confirm what it covers.
  - YouTube videos: `https://www.youtube.com/oembed?url=<video url>&format=json` confirms the title and channel.
- **Avoid sites that block automated requests** ("Just a moment…", "Client Challenge", HTTP 403/429), such as Cloudflare's Learning Center, Khan Academy or W3Schools. Test with `node scripts/check-links.js`: a site can answer curl and still block it. They can't be verified, and the weekly link check would warn about them every week.
- Write a **"look for"** note for each reading in both languages. Mention it if the reading is outdated or has a slip (for example "the article is from 2003: UTF-8 now uses at most 4 bytes").

### 4. Write the files

**In a programming subject** (Java), write a [quick guide](../../../docs/content-guide.md#quick-guides-for-programming-subjects) with `quick_guide` instead of a reading guide: 2–3 objectives, a short "In short" around one code example in the starters' style, one "Watch out" line, and 1 reading plus at most one extra. No diagram and no "Check yourself".

Use the helpers in [scripts/content](../../../scripts/content/README.md), from a script outside the repository: `challenge`, `quiz` with `num`/`choice`/`out`/`tf`/`short`, and `reading_guide` with `reading`.

- **The reading guide:**
  - an "In short" summary of 150–250 words with one diagram;
  - a `<!-- readings -->` line where the reading cards go;
  - 2–3 "Check yourself" questions.
- **Diagrams:** SVG, readable in light and dark themes. Use mid-tone colors such as `#3b82f6`, `#f59e0b` and `#8a94a6`, with no background. Make a `.pt-br.svg` copy when it has words. Render it to check (`qlmanage -t` on macOS) and look at it.
- **Challenges:**
  - **Descriptions:** start with the hook, then the task, a worked example, **Input**, **Output** and **Things to know** (2–4 bullets).
  - **Tests:** at least 2 visible and 5 hidden. Hidden tests target edges and misconceptions.
  - **Hints:** 3, from a nudge to almost the answer.
  - **Solutions:** two reference solutions, modern and classic, written **differently**.
  - **Rules:** forbid the library shortcut that would do the exercise. Rules must accept both solutions; don't require a loop when recursion is just as valid.
- **Quiz:** numbers with `num` (set `base`, and `tolerance` for decimals); predictions with `out`, with the answer left `''`, so the validator fills it in. Prompts can contain Markdown tables.
- **Both languages for everything Sphinx writes:** titles, descriptions, hints, rule messages, starter comments, questions, explanations, objectives, summaries and "look for" notes.

### 5. Generate the outputs and check them by hand

```bash
python3 scripts/content/sphinx_content.py generate <every challenge folder the script wrote>
```

Read every printed output and check it against the description: calculate a few by hand, or cross-check with another tool, such as Python's `pow(a, n, m)`. Then validate the lessons and quizzes:

```bash
python3 scripts/content/sphinx_content.py check <lesson and quiz folders>
node scripts/check-links.js
```

### 6. Update the tests and docs

- `src/test/integration/extension.test.ts`:
  - the counts (`api.challenges()`, `api.quizzes()`, `api.lessons()`);
  - the subject's sidebar test, meaning the item lists and any index that points into them.
- Docs:
  - the README table for the subject;
  - `CHANGELOG.md` under Unreleased;
  - the progress note in the subject's review, if there is one.

### 7. Run everything, then open the pull request

```bash
npm run validate          # strict, with Portuguese: must pass with no warnings
npm run test:unit
npm run test:integration
```

- **Commits:** one per unit, following Conventional Commits, such as `feat(content): add CS Fundamentals unit 9, Databases`.
- **The pull request:**
  - list the readings and how each was checked;
  - give the rubric verdicts;
  - include the test results.

## Mistakes already made once

- **Formula challenges:** if the description gives the formula and the student only plugs numbers in, it is a quiz question.
- **Look-alike challenges:** two challenges practising the same loop. Merge them and use the free slot for a new idea.
- **Regenerating clears outputs:** running a unit script rewrites every challenge it defines with empty outputs. Always `generate` every one of them.
- **Non-ASCII input:** the runner doesn't fix the input encoding. Represent accents and emoji another way, such as `U+00E9`.
- **Empty expected outputs:** every test must print something.
- **Numbers that overflow:** check the largest test input fits in the types used. 10¹² squared doesn't fit in a `long`.
- **Running checks while editing:** don't change content files while a validation run is reading them. The results get mixed.
