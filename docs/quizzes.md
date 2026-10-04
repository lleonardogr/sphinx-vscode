# Quizzes

A **quiz** is a set of short questions about Java: multiple choice, true or false, short answer, and "what does this code print?". Each unit of the learning path ends with its quiz, and teachers can add a quiz to an [exam](exams.md) as a graded question.

- [Taking a quiz (students)](#taking-a-quiz-students)
- [Writing a quiz (teachers)](#writing-a-quiz-teachers)
- [Question types](#question-types)
- [Checking a quiz](#checking-a-quiz)
- [Quizzes in exams](#quizzes-in-exams)

---

## Taking a quiz (students)

1. Click the quiz at the end of a unit in the Sphynx sidebar (marked **Quiz**). Quizzes that belong to no unit are in the **Custom** section.
2. Answer the questions. Click **Check** under a question to see right away whether it's correct, with the right answer and an explanation.
3. Click **Check all answers** at the end to get your score. Your best score is shown in the sidebar, and a quiz turns green when you get everything right.
4. **Start over** clears your answers so you can try again.

---

## Writing a quiz (teachers)

A quiz is a folder containing a `quiz.json`. VS Code gives you autocomplete and checking for this file.

```
my-quizzes/
└── strings-quiz/
    └── quiz.json
```

```json
{
  "title": "Strings Quiz",
  "topic": "Strings",
  "description": "Methods of the String class.",
  "questions": [
    {
      "type": "choice",
      "prompt": "Which method returns the number of characters in a String?",
      "options": ["size()", "length()", "count()", "chars()"],
      "answer": 1,
      "explanation": "`text.length()` returns the number of characters."
    },
    {
      "type": "output",
      "code": "String s = \"hello\";\nIO.println(s.toUpperCase().charAt(1));",
      "answer": "",
      "explanation": "`toUpperCase()` gives `HELLO`, and index 1 is the second character."
    },
    {
      "type": "truefalse",
      "prompt": "Strings in Java can be changed after they are created.",
      "answer": false,
      "explanation": "Strings are immutable. Methods like `toUpperCase()` return a new String."
    },
    {
      "type": "short",
      "prompt": "Which method compares the contents of two Strings?",
      "answer": ["equals", "equals()", ".equals()"]
    }
  ]
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `title` | required | Shown in the sidebar and at the top of the quiz. |
| `description` | | Shown above the questions (Markdown). |
| `topic` | | The unit the quiz belongs to, such as `Loops`; it's listed at the end of that unit. Leave it out (or use another name) to put it in the Custom section. |
| `questions` | required | The questions, in order. See below. |

Every question can also have:

| Field | Default | Description |
|-------|---------|-------------|
| `prompt` | | The question, in Markdown. Optional for `output` questions. |
| `code` | | Java code shown under the prompt. |
| `explanation` | | Shown after a practice check (Markdown). **Never shown during an exam.** |
| `points` | `1` | Points for the question. Each question is all or nothing. |

To share quizzes, put them next to your challenges and use [Import](creating-challenges.md#sharing-challenges-with-students) or `sphynx.extraChallengePaths`, exactly like challenges. The built-in examples are in [`quizzes/`](../quizzes).

---

## Question types

| `type` | The student… | `answer` |
|--------|--------------|----------|
| `choice` | picks from `options` | The index of the right option (`0` = first). Use a list, such as `[0, 2]`, when several options are right: the student must pick exactly those. |
| `truefalse` | picks True or False | `true` or `false` |
| `short` | types a word or value | An accepted answer, or a list of them. Extra spaces and letter case are ignored, unless you set `"caseSensitive": true`. |
| `output` | reads `code` and types what it prints | The exact output. Leave it `""` and let the validator fill it in (see below). Add `options` to let the student pick instead of typing; `answer` is then the index of the right option. |

For `output` questions, the code can be a **snippet**, which is run inside `void main() { … }`, or a **whole program**, in modern or classic style. When the student types the output, spaces at the start and at the end are ignored, and spaces inside the lines must match.

---

## Checking a quiz

Run **Sphynx: Validate Challenges in a Folder…** on the folder that contains your quizzes. It checks that every quiz loads, and it **compiles and runs every `output` question**:

- If the `answer` doesn't match what the code really prints, it says so: `question 3: the answer is "3.5" but the code prints "3"`.
- With **Validate and fill in expected outputs**, empty answers (`""`) are filled in from the real output, so you never have to work them out by hand.

Snippets need JDK 25+, because they are wrapped in a modern `void main()`. With an older JDK, only whole classic programs are checked.

---

## Quizzes in exams

Add a quiz to an exam's `questions`, like a challenge. Use either the id of a quiz the extension knows (for example `java-basics-quiz`), or a **private quiz**: a folder with a `quiz.json` inside the exam folder.

```json
{
  "title": "Week 3 Exam",
  "durationMinutes": 45,
  "questions": [
    { "id": "warm-up-quiz", "points": 10 },
    { "id": "fizzbuzz", "points": 30 }
  ]
}
```

During the exam:

- The student's answers are **saved as they go**. If the time runs out, the saved answers are submitted automatically.
- A quiz is **submitted once**, whatever the exam's `maxSubmissions` is. The student sees their score, but not which answers were right, and explanations are hidden.
- The score is `points × quiz points earned ÷ quiz total`. For example, 3 of 4 correct on a quiz worth 10 points gives 7.5.
- The results file stores the student's answers, and **Verify Students' Exam Results** re-grades them, flagging edited files.

The sample exam in [`exams/sample-exam`](../exams/sample-exam) starts with a private warm-up quiz.

> The answers are in `quiz.json`, so a determined student could read them, just as with the expected outputs in `challenge.json`. See [Limits you should know about](exams.md#limits-you-should-know-about).
