# Exams

An **exam** is a timed, graded set of challenges. Teachers write exams, and students take them inside VS Code and hand in a results file that the teacher can re-grade.

- [How an exam works (students)](#how-an-exam-works-students)
- [Open and closed exams](#open-and-closed-exams)
- [Creating an exam (teachers)](#creating-an-exam-teachers)
- [Giving the exam to your class](#giving-the-exam-to-your-class)
- [Collecting and verifying results](#collecting-and-verifying-results)
- [Limits you should know about](#limits-you-should-know-about)

---

## How an exam works (students)

1. Open the **Exams** group at the top of the Sphynx sidebar and click **Start exam…** under an exam.
2. Read the rules, confirm, and type your name. The countdown starts and is shown in the status bar.
3. Click a question to open it. Write your answer as usual.
   - **Run** (sample tests), **Try your own input** and **Run in Terminal** are unlimited.
   - **Submit** runs all tests, including hidden ones, and is **limited** (for example 3 times per question). Each submission asks for confirmation.
   - Each submission earns **partial credit**: points × (tests passed ÷ total tests). Your **best** submission counts.
4. Click **Finish Exam** (the stop button next to the exam) when you're done. When the time is up, the exam finishes on its own.
5. When an exam finishes, answers that changed since their last submission are **submitted automatically**, if submissions remain. Then the exam is **locked**, and a results file is written to `sphynx/exams/<exam>/results-<your-name>.json`.
6. Hand in that file: use **Save a Copy…** to put it wherever your teacher asks.

Closing VS Code doesn't stop the clock. If the time runs out while VS Code is closed, the exam is finished and graded the next time you open it.

---

## Open and closed exams

Each exam sets `"mode"`:

| | **Open** (`"mode": "open"`) | **Closed** (`"mode": "closed"`, the default) |
|---|---|---|
| Built-in hints | ✅ | ❌ hidden |
| AI hints | ✅ (if the student set them up) | ❌ off |
| Internet, other tools | allowed | not allowed (honor code) |
| Integrity warnings recorded | no | yes, see below |

### Restrictions

The most common shortcut is copying the question into an AI chat in the browser and pasting the answer back. Each exam chooses how strict it is with a **level**:

| Level | Records pastes, time away and Copilot | Blocks copying | Blocks pastes | Limit on time outside VS Code |
|-------|:---:|:---:|:---:|:---:|
| `none` | – | – | – | – |
| `relaxed` | ✓ | – | – | – |
| `standard` | ✓ | ✓ | 50+ characters | – |
| `strict` | ✓ | ✓ | 30+ characters | 60 s in total |

Closed exams use `standard` unless you choose another level. Open exams use `none`.

- **Blocking copying** means the question can't be selected or copied, and **Copy** and **Cut** do nothing in the answer files. Attempts are recorded.
- **Blocking pastes** means a paste at or above the limit is **undone immediately** and recorded. Typing, autocomplete and snippets stay below the limit.
- **The time limit** counts the total time outside VS Code. Past it, the exam **finishes automatically** and the results say why.

Students see a warning every time they come back after 15 seconds or more away, with the time left when there is a limit. The start dialog lists the exam's level and rules, so nobody is surprised.

Pick a level, and change single rules next to it if you need to:

```json
"mode": "closed",
"restrictions": {
  "level": "strict",
  "maxAwaySeconds": 180
}
```

| Rule | Description |
|------|-------------|
| `level` | `none`, `relaxed`, `standard` or `strict`. |
| `blockCopy` | `true` or `false`. |
| `blockPaste` | `true` or `false`. |
| `pasteLimit` | The smallest paste that is blocked, in characters (10 or more). |
| `maxAwaySeconds` | Total seconds allowed outside VS Code; `0` means no limit. |
| `record` | Record warnings. It's always on when something is blocked or limited. |

The level is independent of `mode`: an open-book exam can still be `relaxed`, for example, to see who pasted large answers.

### Warnings in the results file

In a **closed** exam, the results file lists warnings with a timestamp:

- **paste**: a paste that was blocked, or (with `blockPaste` off) a single edit of 80 or more characters, which means a paste or an accepted AI completion;
- **copy**: an attempt to copy or cut code while copying was blocked;
- **away**: VS Code lost focus for 15 seconds or more, for how long, and the running total. The results also give the total time away;
- **copilot**: the GitHub Copilot extension was installed and enabled when the exam started.

These are **signals for the teacher, not proof**. A student might paste their own code from another question, or switch windows to read the task on another screen. Use them to start a conversation.

---

## Creating an exam (teachers)

An exam is a folder containing an `exam.json`. VS Code gives you autocomplete and checking for this file.

```
week-3-exam/
├── exam.json
└── sum-of-evens/            ← optional private question (a normal challenge folder)
    ├── challenge.json
    ├── description.md
    ├── Starter.java
    ├── Starter.classic.java
    ├── Solution.java
    └── Solution.classic.java
```

```json
{
  "title": "Week 3 Exam",
  "description": "Loops and arrays.",
  "durationMinutes": 45,
  "mode": "closed",
  "maxSubmissions": 3,
  "questions": [
    { "id": "even-or-odd", "points": 20 },
    { "id": "fizzbuzz", "points": 30 },
    { "id": "sum-of-evens", "points": 50 }
  ]
}
```

| Field | Default | Description |
|-------|---------|-------------|
| `title` | required | Shown in the sidebar and the results file. |
| `description` | | Shown in the tooltip. |
| `durationMinutes` | `60` | The time limit. |
| `mode` | `"closed"` | `"open"` or `"closed"` (see above). |
| `maxSubmissions` | `3` | Submissions per question. The best one counts. |
| `questions` | required | Each has an `id` and `points` (default `10`). |

A question `id` is either:

- the name of a **folder inside the exam folder**: a **private question**, written like any challenge (see [Creating your own challenges](creating-challenges.md)). Students can't practise it beforehand, because it only appears inside the exam; or
- the name of a **quiz folder inside the exam folder**: a private [quiz](quizzes.md#quizzes-in-exams), submitted once; or
- the id of **any challenge or quiz** the extension knows, such as `even-or-odd` (a built-in one), a bigger mixed test such as `calculator-menu`, or one of your own challenges from `extraChallengePaths`.

Copy the built-in example from the repository's [`exams/sample-exam`](../exams/sample-exam) folder to get started. Then validate your exam folder with **Sphynx: Validate Challenges in a Folder…**. It checks the private questions and reports unknown question ids.

---

## Trying an exam before giving it

In the **teacher view** (💼 at the top of the Sphynx sidebar), every exam under **My Exams** has a ▶ **Try Exam (Preview)** button. It starts a **preview attempt**: the same questions, timer and restrictions your students get, so you can check that everything works and how long it takes.

- The preview has its own answers and results (its id ends in `--preview`). It never counts as, or blocks, a real attempt, and **Verify Exam Results** rejects a preview's results file.
- It appears under the exam as **Your preview attempt**, with your score per question. Right-click it to **Finish** it, **Open Results**, or **Restart Preview** (clears its answers so you can try again).
- Previews are only listed in the teacher view, never in the student view.

## Giving the exam to your class

The simplest way is to **zip the exam folder** and send it. **Remove the `Solution*.java` files** first. Students click **Import** (⤓) at the top of the Sphynx sidebar and choose the zip. If they forget, the import offers to remove any solutions it finds. See [Sharing challenges with students](creating-challenges.md#sharing-challenges-with-students).

To share a live folder instead:

1. Put your exam folder inside a folder you share with the class, for example `java-exams/week-3-exam/`.
2. **Remove the `Solution*.java` files** from the copy you share.
3. Students add the parent folder to their settings (or you pre-configure it):

   ```json
   "sphynx.extraChallengePaths": ["/path/to/java-exams"]
   ```

4. Then the exam appears under **Exams** in their sidebar. Tell them when to start. The clock starts when each student clicks **Start exam…**.

A student can take each exam **once**. Their progress is stored in VS Code on their computer.

---

## Collecting and verifying results

Students hand in `results-<name>.json`. The file contains:

- the student's name, when they started and finished, the time taken, and whether they finished or ran out of time;
- for each question: the points earned, tests passed, submissions used, and **the code of their best submission**;
- the integrity warnings (closed exams).

A results file is plain JSON, so a student could edit the score. Always **verify** it:

1. Make sure the exam folder is available in your VS Code (the same `extraChallengePaths`).
2. Run **Sphynx: Verify Students' Exam Results… (Teachers)**, also in the `...` menu of the sidebar, and select one or many results files.
3. The extension **re-runs each saved answer against all the tests** and recomputes the score. The output looks like this:

   ```
   results-ada-lovelace.json
   Ada Lovelace: Week 3 Exam
     Score (re-graded): 46.67 / 100  ⚠ the results file claims 100
     Time taken: 25 min (finished by the student)
     - even-or-odd: 16.67 / 20 (5/6 tests)  ⚠ claimed 20
     - fizzbuzz: 30 / 30 (5/5 tests)
     - sum-of-evens: 0 / 50 (0/5 tests) [no submission]  ⚠ claimed 50
     Integrity warnings (1):
       • 2026-10-03 10:12:00 paste (fizzbuzz): Large insertion of 412 characters (15 lines) in one edit: a paste or an AI completion.
   ```

Use the **re-graded** score. A ⚠ means the file was changed after the exam.

---

## Limits you should know about

Sphynx runs on the student's own computer, so a determined student can work around it. Exams suit practice, homework and supervised classroom quizzes. They aren't a secure exam system.

- **The internet and other apps can't be blocked.** Closed exams turn off the extension's own hints and AI, block copying and pasting, and limit or record time outside VS Code, but a student can still read a question on another device and retype an answer. Supervise the room for important exams.
- **The clock uses the computer's time.** Changing the system clock affects it.
- **Students could reset their VS Code data** to retake an exam. The results file includes the start time, so ask for it promptly, and consider supervising the class while the exam runs.
- **Verification proves the score matches the code**, not who wrote the code.
