# Tests

A **test** is a timed, graded set of challenges. Teachers write tests, and students take them inside VS Code and hand in a results file that the teacher can re-grade.

- [How a test works (students)](#how-a-test-works-students)
- [Open and closed tests](#open-and-closed-tests)
- [Creating a test (teachers)](#creating-a-test-teachers)
- [Giving the test to your class](#giving-the-test-to-your-class)
- [Collecting and verifying results](#collecting-and-verifying-results)
- [Limits you should know about](#limits-you-should-know-about)

---

## How a test works (students)

1. Open the **Tests** group at the top of the Tech Challenges sidebar and click **Start test…** under a test.
2. Read the rules, confirm, and type your name. The countdown starts and is shown in the status bar.
3. Click a question to open it. Write your answer as usual.
   - **Run** (sample tests), **Try your own input** and **Run in Terminal** are unlimited.
   - **Submit** runs all tests, including hidden ones, and is **limited** (for example 3 times per question). Each submission asks for confirmation.
   - Each submission earns **partial credit**: points × (tests passed ÷ total tests). Your **best** submission counts.
4. Click **Finish Test** (the stop button next to the test) when you're done. When the time is up, the test finishes on its own.
5. When a test finishes, answers that changed since their last submission are **submitted automatically**, if submissions remain. Then the test is **locked**, and a results file is written to `tech-challenges/tests/<test>/results-<your-name>.json`.
6. Hand in that file: use **Save a Copy…** to put it wherever your teacher asks.

Closing VS Code doesn't stop the clock. If the time runs out while VS Code is closed, the test is finished and graded the next time you open it.

---

## Open and closed tests

Each test sets `"mode"`:

| | **Open** (`"mode": "open"`) | **Closed** (`"mode": "closed"`, the default) |
|---|---|---|
| Built-in hints | ✅ | ❌ hidden |
| AI hints | ✅ (if the student set them up) | ❌ off |
| Internet, other tools | allowed | not allowed (honor code) |
| Integrity warnings recorded | no | yes, see below |

In a **closed** test, the results file lists warnings with a timestamp:

- **paste**: a single edit inserted 80 or more characters into an answer, which means a paste or an accepted AI completion (for example from Copilot);
- **away**: VS Code lost focus for 15 seconds or more, and for how long;
- **copilot**: the GitHub Copilot extension was installed and enabled when the test started.

These are **signals for the teacher, not proof**. A student might paste their own code from another question, or switch windows to read the task on another screen. Use them to start a conversation.

---

## Creating a test (teachers)

A test is a folder containing a `test.json`. VS Code gives you autocomplete and checking for this file.

```
week-3-test/
├── test.json
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
  "title": "Week 3 Test",
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

- the name of a **folder inside the test folder**: a **private question**, written like any challenge (see [Creating your own challenges](creating-challenges.md)). Students can't practise it beforehand, because it only appears inside the test; or
- the id of **any challenge** the extension knows, such as `even-or-odd` (a built-in one) or one of your own challenges from `extraChallengePaths`.

Copy the built-in example from the repository's [`tests/sample-test`](../tests/sample-test) folder to get started. Then validate your test folder with **Tech Challenges: Validate Challenges in a Folder…**. It checks the private questions and reports unknown question ids.

---

## Giving the test to your class

1. Put your test folder inside a folder you share with the class, for example `java-tests/week-3-test/`.
2. **Remove the `Solution*.java` files** from the copy you share.
3. Students add the parent folder to their settings (or you pre-configure it):

   ```json
   "techChallenges.extraChallengePaths": ["/path/to/java-tests"]
   ```

4. The test appears under **Tests** in their sidebar. Tell them when to start. The clock starts when each student clicks **Start test…**.

A student can take each test **once**. Their progress is stored in VS Code on their computer.

---

## Collecting and verifying results

Students hand in `results-<name>.json`. The file contains:

- the student's name, when they started and finished, the time taken, and whether they finished or ran out of time;
- for each question: the points earned, tests passed, submissions used, and **the code of their best submission**;
- the integrity warnings (closed tests).

A results file is plain JSON, so a student could edit the score. Always **verify** it:

1. Make sure the test folder is available in your VS Code (the same `extraChallengePaths`).
2. Run **Tech Challenges: Verify Students' Test Results… (Teachers)**, also in the `...` menu of the sidebar, and select one or many results files.
3. The extension **re-runs each saved answer against all the tests** and recomputes the score. The output looks like this:

   ```
   results-ada-lovelace.json
   Ada Lovelace: Week 3 Test
     Score (re-graded): 46.67 / 100  ⚠ the results file claims 100
     Time taken: 25 min (finished by the student)
     - even-or-odd: 16.67 / 20 (5/6 tests)  ⚠ claimed 20
     - fizzbuzz: 30 / 30 (5/5 tests)
     - sum-of-evens: 0 / 50 (0/5 tests) [no submission]  ⚠ claimed 50
     Integrity warnings (1):
       • 2026-10-03 10:12:00 paste (fizzbuzz): Large insertion of 412 characters (15 lines) in one edit: a paste or an AI completion.
   ```

Use the **re-graded** score. A ⚠ means the file was changed after the test.

---

## Limits you should know about

Tech Challenges runs on the student's own computer, so a determined student can work around it. Tests suit practice, homework and supervised classroom quizzes. They aren't a secure exam system.

- **The internet and other apps can't be blocked.** Closed tests turn off the extension's own hints and AI, and record warning signs, but students can still use a browser or another device.
- **The clock uses the computer's time.** Changing the system clock affects it.
- **Students could reset their VS Code data** to retake a test. The results file includes the start time, so ask for it promptly, and consider supervising the class while the test runs.
- **Verification proves the score matches the code**, not who wrote the code.
