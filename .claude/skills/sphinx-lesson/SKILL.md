---
name: sphinx-lesson
description: Write or rework one Sphinx lesson (a reading guide for a theory subject or a quick guide for a programming subject), for the built-in content or a teacher's own folder. Use when asked to add, improve, translate or review a lesson, reading guide, quick guide, lesson diagram or a lesson's readings. For a whole unit (lesson, quiz and challenges), use sphinx-unit.
---

# Writing a Sphinx lesson

A lesson opens a unit. It doesn't try to teach everything: it gives the key idea, the vocabulary the exercises use and the mistake students make first, then sends them to a few curated readings. The standard is the content guide's [Reading guides](../../../docs/content-guide.md#reading-guides) and [Quick guides](../../../docs/content-guide.md#quick-guides-for-programming-subjects) sections. The file format is in [Lessons](../../../docs/creating-challenges.md#lessons). Read both first.

## 1. Pick the kind

The subject's `"kind"` in `subject.json` decides it, and the validator checks against it:

| | Reading guide (`theory`: CS Fundamentals, Data Structures & Algorithms) | Quick guide (`programming`: Java, C) |
|---|---|---|
| Objectives | 3–5 | 2–3 |
| "In short" | 150–250 words, with one diagram | 60–120 words of text around one ~10-line code example; the validator warns above 180 words with the code |
| Watch out | the common mistake, inside the summary | one **Watch out** line |
| Readings | 1–3 | 1, plus at most one extra (a video, or a page on newer syntax) |
| Check yourself | 2–3 questions | none |
| Helper | `reading_guide(...)` | `quick_guide(...)` |

Examples to copy: [`subjects/cs/lessons/how-a-computer-works`](../../../subjects/cs/lessons/how-a-computer-works) (reading guide) and [`subjects/java/lessons/variables-and-arithmetic`](../../../subjects/java/lessons/variables-and-arithmetic) (quick guide).

## 2. Write the objectives

Things a student **does**, with a verb you could check: convert, predict, trace, compute, choose, explain why, build. "Find the network address of an IPv4 address with a prefix", not "Understand subnets". Each objective must be practised later by at least one quiz question and one challenge of the unit.

If the lesson is new, show the objectives and the candidate readings to the person and wait for an approval before writing files, as in sphinx-unit.

## 3. Choose and check the readings

- **Source order** (see [reading-source rules](../../../docs/content-guide.md#2-readings-curated-can-be-english-only)):
  1. official docs (dev.java, docs.oracle.com, MDN);
  2. non-profit and university education (freeCodeCamp, CS50, VisuAlgo, the USACO Guide, Crash Course);
  3. well-known free independent resources;
  4. commercial course sites (Programiz, W3Schools) only when nothing else covers it.

  GeeksforGeeks is accepted page by page.
- **Open and read every page yourself.** Confirm it covers the objectives, has no login or paywall, and is right. Then run `node scripts/check-links.js <the lesson's folder>`: a site can answer `curl` and still block the checker (Cloudflare's Learning Center, Khan Academy and W3Schools do).
- **Prefer pages that show what text can't:** animations, interactive pages, diagrams. VisuAlgo has modules for sorting, lists, stacks and queues, hash tables and BSTs.
- **Write a "look for" note per reading, in both languages:** what to look at, which sections to skip, and any slip or outdated part ("written for JDK 8, before lambdas"). For example, the USACO Guide shows Python until you pick Java in its settings, so say so.
- **YouTube:** confirm the title and channel with `https://www.youtube.com/oembed?url=<video url>&format=json`.

Rejected before, and why:
- Oracle's Java Tutorials pages on comparators and Deque: written for JDK 8, and the Deque page has errors. dev.java has current versions.
- freeCodeCamp's trie article: its code has bugs.

## 4. Write the summary

- **Reading guide:** "In short" in 150–250 words, then a `<!-- readings -->` line where the reading cards go, then `## Check yourself` with 2–3 questions the quiz answers.
- **Quick guide:** the code example compiles and uses the starters' style (`void main()`, `IO.println`, `IO.readln()`, or C17 for C). Show the syntax on a different problem from any challenge. Don't use prompts in `IO.readln("…")`: the tests would see them.
- Say the one fact students most often get wrong. No history, no long examples: the readings do that.
- Don't repeat what an earlier unit or subject already taught (Big O basics are in CS Fundamentals' Algorithms unit). Build on it and set `requires` to that unit.
- **Both languages:** `lesson.md` and `lesson.pt-br.md`, the title, objectives and "look for" notes.

## 5. Draw the diagram (reading guides)

- **SVG**, readable in light and dark themes: mid-tone colors such as `#3b82f6`, `#f59e0b` and `#8a94a6`, no background, and every `<text>` with an explicit fill.
- Make a `.pt-br.svg` copy when the diagram has words, and give both an `aria-label` in their language.
- Show the unit's idea with the exercises' own example where possible (the BST from BST Builder, the array from Log Window).
- **Render both and look at them:** `qlmanage -t -s 1000 -o <folder> file.svg` on macOS, then open the PNG. Check for:
  - labels cut off at the edge: widen the `viewBox`;
  - lines showing through see-through shapes: end each line at the shape's border;
  - text overlapping.

## 6. Write the files and validate

Use the helpers in [scripts/content](../../../scripts/content/README.md), from a script outside the repository. `reading_guide(..., files={'diagram.svg': ..., 'diagram.pt-br.svg': ...})` prints the summary's word count, and `quick_guide` prints the text and code counts.

```bash
node out/cli.js validate <lesson folder> --strict --lang=pt-br
node scripts/check-links.js <lesson folder>
```

For a new built-in lesson, also update `api.lessons().length` and the subject's sidebar test in `src/test/integration/extension.test.ts`, the README table for the subject, and `CHANGELOG.md` under Unreleased.

## Mistakes already made once

- Long text lessons (600 words, tables, no diagram) explain less than one good article with pictures. Curate, don't rewrite.
- A summary over the word range: the validator warns at 100–350 words for reading guides and 40–180 for quick guides.
- A reading kept because it answered `curl` with 200, when the checker was blocked.
- Repeating a challenge's solution as the quick guide's code example.
