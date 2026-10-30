---
name: sphinx-exam
description: Design and write a Sphinx exam (exam.json, a private quiz and private coding questions), for a built-in subject or a teacher's own class, and check it before students take it. Use when asked to create, plan, review, translate or rebalance an exam or its questions, or to prepare an exam for a class.
---

# Writing a Sphinx exam

An exam is a timed, graded set of questions that students take inside VS Code and hand in as a results file the teacher can re-grade. How exams work, every `exam.json` field and the restriction levels are in [docs/exams.md](../../../docs/exams.md). Private questions are ordinary challenges ([docs/creating-challenges.md](../../../docs/creating-challenges.md)), and a private quiz follows [docs/quizzes.md](../../../docs/quizzes.md#quizzes-in-exams). Read those first. The built-in exams in [`exams/`](../../../exams) are finished examples.

## 1. Write the exam spec

Decide, and show the person before writing files:

- **Scope:** which units, and what it focuses on. The built-in pattern:
  - a midterm covers the first half of a subject in 60–90 minutes (*CS Exam 1: Data Representation*, units 1–5);
  - a final covers the whole subject, focused on its second half, in 120 minutes.
- **Structure:** the built-in exams use one private quiz plus three private coding questions:

  | Question | Points | Level |
  |---|---|---|
  | quiz, 8 questions | 20 | mixed |
  | coding 1 | 20 (25 in a final) | Easy |
  | coding 2 | 30 (25) | Medium |
  | coding 3 | 30 | Hard |

  Points total 100. Partial credit is points × tests passed ÷ tests, so every coding question needs enough tests (6–10) for the credit to mean something.
- **Each question:** its objective, the units it combines, why it isn't a copy of a practice challenge, and a real-world hook.
- **Settings:**
  - `durationMinutes`;
  - `mode` (`closed` for a graded exam);
  - `restrictions.level` (`standard` in every built-in exam; `strict` limits time outside VS Code);
  - `maxSubmissions` (3);
  - `retakeAfterHours` (6 by default; `false` for a graded exam taken once in class);
  - `subject` (the subject whose sidebar lists it).

Wait for a clear approval before writing files.

## 2. Write the private questions

- **Private means new.** Students can't practise a private question beforehand. Don't reuse a practice challenge's idea with new numbers: an exam question should combine units, the way a test does. Check the subject's challenges and tests for overlap.
- **Time budget:** a student should finish the Easy question in about 10 minutes and the Hard one in 30–40. Write your own solution against the clock as a check. If it takes you more than a third of the duration, cut it down.
- **Format:**
  - each question is a folder next to `exam.json`;
  - its `challenge.json` has **no `topic`**, since exam questions belong to no unit (pass `topic=None` to `challenge()` or `c_challenge()`);
  - it still has a `difficulty`, an `order` and hints.

  Hints are hidden in closed exams, but write them anyway for open ones.
- **The usual challenge standard applies:** a description with the hook, the task, an example, Input, Output and Things to know; at least 2 visible and 5 hidden tests; rules that forbid the library shortcut; two reference solutions written differently.
- **Efficiency:** an exam is no place for a surprise time limit. If a question needs a fast approach, say the input size in the description. Big inputs can use [generated tests](../../../docs/creating-challenges.md#big-inputs-generated-tests).
- **C exams:** C questions use `c_challenge()` (with `Solution.c` and `Solution.alt.c`). A C exam's quiz needs `quiz(..., topic=None, language='c')`, so its "what does this print?" snippets run as C.

## 3. Write the private quiz

- 8 questions, submitted once.
- The [quiz rules](../../../docs/content-guide.md#quizzes) apply: at most 30% recall, at least half apply or predict, at least one "why", and distractors that are real mistakes.
- Cover the units the coding questions don't.
- Mix the forms: choice, number, truefalse and output. Leave output answers `''` and let the validator fill them.
- Use no `topic`. The quiz folder sits inside the exam folder, and its id goes in `questions`.

## 4. Write exam.json

```json
{
  "title": "CS Exam 1: Data Representation",
  "description": "Units 1 to 5. A quiz and three coding questions.",
  "subject": "cs",
  "durationMinutes": 90,
  "mode": "closed",
  "maxSubmissions": 3,
  "restrictions": { "level": "standard" },
  "questions": [
    { "id": "cs-exam-1-quiz", "points": 20 },
    { "id": "fits-in-a-type", "points": 20 },
    { "id": "hex-dump", "points": 30 },
    { "id": "base64-encoder", "points": 30 }
  ],
  "translations": { "pt-br": { "title": "Prova 1 de Fundamentos da Computação", "description": "…" } }
}
```

Translate the title, description and every student-facing text of the quiz and questions into Portuguese.

## 5. Generate, validate and try it

```bash
python3 scripts/content/sphinx_content.py generate <exam folder>/<question folder> ...
node out/cli.js validate <exam folder> --generate   # fills the quiz's output answers
node out/cli.js validate <exam folder> --strict --lang=pt-br
```

- Read every generated output and check it against the description by hand.
- In VS Code, open the teacher view (💼) and use **Try Exam (Preview)**. The preview has the same timer and restrictions, and never counts as a real attempt. Take it yourself, or at least open every question, and time it.
- Check the results file's re-grade with **Verify Exam Results**.

## 6. Built-in exams: update tests and docs

- `src/test/integration/extension.test.ts`:
  - the `api.exams()` id list, and the per-subject exam lists;
  - `api.challenges().length` and `api.quizzes().length`: exam questions and quizzes count too;
  - the subject's sidebar test, if it lists the exams.
- The README section for the subject: exam names, units, durations and question titles.
- `CHANGELOG.md` under Unreleased.
- One commit per exam, following Conventional Commits, such as `feat(content): add CS Fundamentals exams`.

## Giving it to a class (teachers)

- Remove every `Solution*` file before sharing: **Export a Pack** strips them, or zip the folder after deleting them. **Import** offers to remove any it finds.
- Tell students when to start. The clock starts when each one clicks **Start exam…**.
- Collect `results-<name>.json` files and grade them from **Class Results…** in the teacher view, which re-grades every file (**Verify all**). Use the re-graded score. Integrity warnings are signals to talk about, not proof.
- Sphinx runs on the student's computer: supervise the room for important exams (see [Limits](../../../docs/exams.md#limits-you-should-know-about)).

## Mistakes to avoid

- A private question that is a practice challenge with new numbers: students who practised get it for free.
- A Hard question that takes longer than half the exam: everyone runs out of time and the scores say nothing.
- A coding question with 3 tests: partial credit jumps in thirds.
- A C exam quiz without `language: 'c'`: its output snippets run as Java and the validator fails.
- Forgetting the exam lists in the integration test when adding a built-in exam.
