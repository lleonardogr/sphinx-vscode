# Content guide (RFC 0001): how Sphinx units are designed

**Status:** draft, October 2026. **Applies to:** every subject and unit, built-in or written by a teacher, and to AI assistants that write content for Sphinx.

This guide is the standard for *what* goes into a unit and *how good* it has to be. For the file formats (`challenge.json`, `quiz.json`, `lesson.json`) see [Creating your own challenges](creating-challenges.md) and [Quizzes](quizzes.md).

- [Principles](#principles)
- [The unit template](#the-unit-template)
- [Learning objectives](#learning-objectives)
- [Reading guides](#reading-guides)
- [Quick guides for programming subjects](#quick-guides-for-programming-subjects)
- [Challenges](#challenges)
- [Quizzes](#quizzes)
- [The rubric](#the-rubric)
- [Workflow](#workflow)
- [Lessons learned](#lessons-learned)
- [Appendix: unit spec template](#appendix-unit-spec-template)

---

## Principles

1. **Curate, don't rewrite.** The web already has excellent free explanations, with diagrams, animations and videos. Sphinx doesn't compete with them: it picks the best ones, says what to look for, and keeps a short summary in the app.
2. **The exercises are the product.** What Sphinx adds is practice that makes a student *use* an idea: challenges graded by tests, and quizzes that catch misunderstandings. Every item must earn its place.
3. **One objective per item.** Each challenge and question practises one learning objective of its unit (a Hard challenge may combine several).
4. **Works offline.** Classrooms may have no internet. The summary and every exercise work offline; the readings are the extra.
5. **Both languages for what Sphinx writes.** Summaries, exercises, hints and explanations exist in English and Portuguese. Readings can be in English only: browsers and YouTube translate and subtitle them.
6. **Honest difficulty.** Easy, Medium and Hard mean the same thing in every unit (see [the ladder](#the-ladder)).

## The unit template

| Part | How many | Purpose |
|------|----------|---------|
| Learning objectives | 3 to 5 | What a student can do after the unit. Written in the unit spec and shown in the reading guide. |
| Reading guide | 1 (2 for big units) | A short summary, 1 to 3 curated readings, and "check yourself" questions. In a programming subject, a lighter [quick guide](#quick-guides-for-programming-subjects). |
| Quiz | 8 to 10 questions | Checks understanding and catches misconceptions. |
| Challenges | 4 | One per step of the ladder: Easy, Easy or Medium, Medium, Hard. |
| Test (optional) | 0 or 1 | A bigger program mixing several units, at the end of a stage. |
| Prerequisites | per item | The units of other subjects an item needs, such as Java Loops. |

Every objective is practised by **at least one quiz question and at least one challenge**.

## Learning objectives

Write objectives as things a student **does**, with a verb that can be checked:

| Good | Too vague |
|------|-----------|
| Convert a number between binary, decimal and hexadecimal | Understand number systems |
| Predict the result of a Java `int` calculation that overflows | Know about overflow |
| Explain why `0.1 + 0.2 != 0.3` in a `double` | Learn floating point |
| Find the network address of an IPv4 address with a prefix | Subnets |

Useful verbs: convert, predict, trace, compute, compare, choose, explain why, detect, simulate, build.

## Reading guides

A reading guide replaces the long text lesson. It has three parts, shown in this order in the lesson panel.

### 1. In short (in the app, both languages)

- **150 to 250 words**: the key idea, the vocabulary the exercises use, and the one fact students most often get wrong.
- **One diagram** when the idea is visual (place values, a packet, a truth table). SVG next to the lesson file, readable in light and dark themes.
- No history, no long examples: the readings do that.

### 2. Readings (curated, can be English only)

**1 to 3** per guide: one main reading, plus optional alternatives (a video for those who prefer watching, an interactive page to play with). For each one, record:

| Field | Example |
|-------|---------|
| Title and source | "What is DNS?", Cloudflare Learning Center |
| Type | article, video or interactive |
| Minutes | 8 |
| Language | en |
| What to look for | "Follow one request from the browser to the authoritative server; notice where answers are cached." |

**How to choose a source:**

- **Free**, without login or paywall. Ads are acceptable if they don't hide the content.
- **Accurate** and written for **beginners**, matching the unit's objectives, not much more.
- From a **credible author or organisation**, with a URL that is likely to last.
- Prefer pages with **diagrams, animations or interactive examples**: they explain what text in the app can't.
- Check every link by hand before adding it: open it, read it, confirm it covers the objectives.

**Candidate sources** (check each page individually; quality varies even inside one site):

| Source | Good for |
|--------|----------|
| makingsoftware.com | illustrated explanations of how hardware and software work (check which chapters are free) |
| GeeksforGeeks | specific algorithms and data structures (choose page by page) |
| Cloudflare Learning Center | networks: DNS, IP, TCP/UDP, HTTP |
| Khan Academy (Computing) | number systems, algorithms (Cormen and Balkcom's course) |
| CS50 (Harvard) notes and lectures | computers, memory, algorithms |
| Crash Course Computer Science, Computerphile (YouTube) | short videos on almost every unit |
| VisuAlgo | interactive sorting and searching |
| floating-point-gui.de | floating point |
| Joel Spolsky, "The Absolute Minimum… Unicode" | text and encodings |

### 3. Check yourself (both languages)

**2 or 3 questions** that the reading should let the student answer, such as "Why does the same 1 TB disk show 931 GB on Windows?". They point to the quiz, where the answers are checked.

### Format

A reading guide is a lesson folder: `lesson.json` lists the objectives and readings, and `lesson.md` holds the "In short" summary, a `<!-- readings -->` line where the reading cards appear, and the "Check yourself" questions. `lesson.pt-br.md` is the Portuguese version, and a diagram can have a Portuguese copy (`cycle.pt-br.svg`). See [`subjects/cs/lessons/how-a-computer-works`](../subjects/cs/lessons/how-a-computer-works) for a complete example.

```json
{
  "title": "IP Addresses and Subnets",
  "topic": "Networks",
  "order": 1,
  "objectives": ["Find the network address of an IPv4 address with a prefix", "…"],
  "readings": [
    {
      "title": "What is an IP address?",
      "source": "Cloudflare Learning Center",
      "url": "https://…",
      "type": "article",
      "minutes": 6,
      "lang": "en",
      "lookFor": "How the prefix splits an address into network and host parts."
    }
  ],
  "translations": { "pt-br": { "title": "Endereços IP e sub-redes", "readings": [{ "lookFor": "…" }] } }
}
```

Readings open in the browser. The validator checks the fields and the Portuguese `lookFor` notes, and warns when the summary is outside 100–350 words or the objectives aren't 3 to 5. `node scripts/check-links.js` checks that every reading still opens. The **Reading links** workflow runs it every Monday and on pull requests that change a lesson's readings. A link that is gone (404 or 410) fails the check. Every problem goes into one issue, **Reading links need attention**, which is updated each week and closes itself once every link opens:

- **Broken:** the page is gone, its site no longer exists, or it was already failing the week before.
- **Failing for now:** server errors (5xx) and timeouts, after a second try a minute later. A link that still fails the next week moves to Broken.
- **Could not be verified:** the site refused the checker (401, 403 or 429). Prefer sources that allow checks.

## Quick guides for programming subjects

In a theory subject such as CS Fundamentals, the reading carries the idea, so the guide does too. In a programming subject such as Java, students learn by writing code, and the unit's challenges do the teaching. Its guide is a **quick guide**: just enough to start the first challenge, and a link for whoever wants more.

| | Reading guide (theory) | Quick guide (programming) |
|---|---|---|
| Objectives | 3 to 5 | 2 or 3 |
| In short | 150 to 250 words and a diagram | 60 to 120 words around **one short code example** (about 10 lines) |
| Watch out | the common mistake, inside the summary | one **Watch out** line: the mistake students make first |
| Readings | 1 to 3 | **1**, plus at most one extra: a video, or a page on the unit's newest syntax |
| Check yourself | 2 or 3 questions | none: the unit's first challenge is the check |

- **The code example compiles** and uses the style of the starters (`void main()`, `IO.println`, `IO.readln()`). Don't give away a challenge: show the syntax on a different problem.
- **No prompts when reading input.** `IO.readln("Name: ")` prints the prompt, and the tests would see it.
- **Tutorials use the older style.** Most pages write `public static void main` and `System.out.println`. Say in the "look for" note that `IO.println` and `void main()` do the same.
- **Sources:** short beginner pages with runnable examples, such as Programiz, and dev.java (Oracle's official tutorial) for newer syntax. Skip pages that wander into advanced topics, or point to the part to read. W3Schools blocks the weekly link check, so don't use it.

The validator knows a quick guide by its subject's `"kind": "programming"`, and warns when the summary is outside 40–180 words (code included), the objectives aren't 2 or 3, or there are more than 2 readings. `quick_guide()` in [scripts/content](../scripts/content/README.md) writes one. See [`subjects/java/lessons/variables-and-arithmetic`](../subjects/java/lessons/variables-and-arithmetic) for an example.

## Challenges

### The ladder

| Level | What it asks | Typical solution |
|-------|--------------|------------------|
| **Easy** | Apply one idea directly. | 10–25 lines, one loop or decision |
| **Easy/Medium** | Apply the idea with a twist: the reverse direction, an edge case that matters. | 15–30 lines |
| **Medium** | Combine two ideas of the unit, or one idea with careful input handling. | 25–45 lines, a helper method |
| **Hard** | Simulate or build a small real thing: a CPU, an encoder, a subnet calculator. | 40–80 lines, several methods |

### Concept first

**The concept test:** could a student solve it *without understanding the unit's idea*, just by copying a formula from the description? Then it is a **quiz question**, not a challenge. "Compute the time from this formula" is a quiz question; "simulate a cache and count the hits" is a challenge.

Prefer challenges that make the idea visible: a **trace** (print each step), a **simulation** (run the machine), a **detector** (decide whether something is valid), or a **converter** done by hand.

### Real-world hook

Start the description with where the idea shows up: file permissions, web colors, IP addresses, download times, emoji. A student should see why it matters before the first line of code.

### Description

Follow the structure in [Creating your own challenges](creating-challenges.md): the hook, the task, one worked example, **Input**, **Output**, **Things to know** (2 to 4 bullets). Say exactly what to print, including spaces and decimals.

### Tests

- At least **2 visible** and **5 hidden** tests.
- Hidden tests target **edge cases and misconceptions**: zero, one, the largest and smallest values, boundaries (127/128, 255/256), invalid input, and the mistake a student is most likely to make.
- **Input is ASCII only.** The runner doesn't fix the input encoding, so accented letters or emoji in stdin can arrive differently on Windows. Represent them another way (`U+00E9`).
- **No empty expected outputs.** Every test prints something.
- Numbers print in English format; the runner fixes the locale, so `%.2f` gives `1.50` everywhere.

### Rules

- **Forbid the library shortcut** that would do the exercise (`Integer.toBinaryString`, `parseInt(s, 2)`, `getBytes`, `Arrays.sort`, `Math.addExact`, `java.net`), with a message that says why.
- **Require the construct** being practised when it matters (a loop, a bitwise operator, a method).
- Rules must accept both reference solutions and any reasonable approach.

### Hints, prerequisites and solutions

- **3 hints**, from a nudge to almost the answer, never the code itself.
- **Prerequisites** list the Java units the *simplest* correct solution needs.
- **Two reference solutions**, modern and classic, written **differently** (another loop shape, another method split). Two approaches catch tests and rules that are too tight.

### No overlap

Two challenges in a subject must not practise the same skill in the same way. A mirror pair (encode and decode) is fine when both directions teach something; two loops that both just double a number are not.

## Quizzes

- **8 to 10 questions.**
- **Cognitive mix:** at most **30% recall** (facts and definitions); at least **50% apply or predict** (calculate, convert, "what does this code print?", "which is true for this case?"); at least **one "why"** question.
- **Distractors are real mistakes:** 2ⁿ instead of 2ⁿ − 1, KB instead of KiB, bits instead of bytes, `>>` confused with `>>>`. A wrong option nobody would pick is wasted.
- **Explanations teach** the reasoning in one or two sentences, not just the answer.
- **Vary the form:** don't ask the same kind of question five times (five "what does this print" in a row teach less than five different situations).
- Avoid trivia that doesn't help a student think, unless it is a fact they will use often.

## The rubric

Used for reviews and by AI assistants to check their own work. Score each criterion **1** (missing), **2** (acceptable) or **3** (strong).

**Challenges**

| Criterion | 3 means |
|-----------|---------|
| Concept | Solving it requires the unit's idea; it passes the [concept test](#concept-first). |
| Fit | The level matches the ladder and the prerequisites are right. |
| Tests | Hidden tests cover edges and the likely mistakes. |
| Guidance | Description, Things to know and hints lead to the idea without giving it away. |
| Hook | A real use of the idea is clear from the start. |
| Distinct | No other challenge practises the same skill the same way. |

**Verdict:** *Concept* 1 → **replace** (often with a quiz question). Any other 1 → **revise**. Otherwise **keep**.

**Quizzes:** recall share, distractor quality, explanation quality, coverage of every objective. **Reading guides:** summary length and focus, source quality, check-yourself questions.

## Workflow

The same steps for a teacher, a contributor or an AI assistant. The helpers in [`scripts/content`](../scripts/content/README.md) write the files and fill in the outputs, and AI assistants such as Claude Code can follow the [`sphinx-unit` skill](../.claude/skills/sphinx-unit/SKILL.md), which walks through these steps:

1. **Spec.** Write the unit spec ([template below](#appendix-unit-spec-template)): objectives, readings, and for each exercise its objective, level and idea. **A person approves the spec before any file is written.**
2. **Write the files.** Lessons, quiz and challenges, both languages, both solutions.
3. **Generate outputs.** Run the validator with `--generate`, then **read every generated output** and check it by hand against the description.
4. **Validate.** `npm run validate` (strict, with Portuguese) must pass with no warnings.
5. **Self-review.** Score every item with the rubric and put the scores in the pull request.
6. **Tests.** Update the counts and the subject's sidebar test in `src/test/integration/extension.test.ts`.
7. **Pull request.** One unit per pull request, titled with Conventional Commits, such as `feat(content): add CS Fundamentals unit 9, Databases`.

## Lessons learned

Mistakes already made once, so they aren't made again:

- **Formula challenges.** "CPU Time" and "Media Size" only plugged numbers into a formula given in the description. They belong in quizzes.
- **Look-alike challenges.** "How Many Values?" (doubling) and "Bits Needed" (halving) practised the same loop.
- **Recall-heavy quizzes.** Units with 7 recall questions out of 10 tested memory, not understanding.
- **Long text lessons.** 600 words of text with tables, and no diagrams, explain less than one good article with pictures.
- **Regenerating clears outputs.** A generator that rewrites a whole unit resets every challenge's expected outputs. Always regenerate and fill in every folder the generator writes.
- **Non-ASCII input** and **empty expected outputs** break on some systems; see [Tests](#tests).

## Appendix: unit spec template

```markdown
# Unit N · <name> (<subject>)

## Objectives
1. <verb> …
2. …

## Reading guide
- In short: <the key idea in two sentences; the diagram, if any>
- Readings:
  - <title>, <source>, <type>, <minutes> min. Look for: <…>
- Check yourself: <2–3 questions>

## Quiz (8–10)
| # | Objective | Form | Question idea | Misconception targeted |

## Challenges
| Level | Title | Objective | Idea | Why it is a challenge, not a quiz question | Hook |

## Prerequisites
<Java units each item needs>
```
