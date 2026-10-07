# Content tools

Helpers for writing units in Python instead of editing every JSON and Markdown file by hand. Each item is described once, in English and Portuguese, and the helpers write the files in the formats documented in [Creating your own challenges](../../docs/creating-challenges.md) and [Quizzes](../../docs/quizzes.md). What makes an item good is in the [content guide](../../docs/content-guide.md).

Needs Python 3 and Node.js (for the validator), plus a JDK 25 to run the solutions.

## Writing a unit

Put a script anywhere outside the repository (it is a working file, not content), and import the helpers:

```python
import sys
sys.path.insert(0, '/path/to/sphinx-vscode/scripts/content')
from sphinx_content import challenge, classic, quiz, num, choice, out, tf, short, reading, reading_guide

challenge('subjects/cs/challenges/fast-power',
    title='Fast Power', title_pt='Potência rápida', topic='Algorithms', difficulty='Medium', order=3, requires=['Loops'],
    hints=['…', '…', '…'], hints_pt=['…', '…', '…'],
    mustnot=[(r'Math\s*\.\s*pow|BigInteger|modPow', 'Write it yourself: …', 'Escreva você mesmo: …')],
    tests=[('2 10 1000\n', False), ('3 1000000000000000000 1000000007\n', False), ('5 0 7\n', True)],  # (input, hidden)
    desc='''# Fast Power …''', desc_pt='''# Potência rápida …''',
    starter='''void main() { … }''', starter_classic=classic('', '''long a = scanner.nextLong(); …''', 'import java.util.Scanner;'),
    solution='''void main() { … }''', solution_classic=classic('…static methods…', '''…main body…'''),
    comments=[('// TODO: compute …', '// TODO: calcule …')])

quiz('subjects/cs/quizzes/algorithms-quiz', title='Algorithms Quiz', title_pt='Quiz de algoritmos', topic='Algorithms',
    requires=['Loops'], desc='…', desc_pt='…', questions=[
        num('At most how many guesses …?', '7', 'Each guess halves …', 'No máximo quantos chutes …?', 'Cada chute divide …'),
        out('int c = 0;\nfor (int i = 1; i < 100; i *= 2) c++;\nIO.println(c);', '', 'i takes 1, 2, 4, …', 'i assume 1, 2, 4, …'),
    ])

reading_guide('subjects/cs/lessons/algorithms-and-complexity', title='Algorithms and Complexity', title_pt='…',
    topic='Algorithms', order=1, objectives=['…', '…', '…'], objectives_pt=['…', '…', '…'],
    readings=[reading('Intro to Algorithms', 'Crash Course Computer Science #13', 'https://www.youtube.com/watch?v=rL8X2mlNHPM',
                      'video', 12, 'How selection sort works …', 'Como a ordenação por seleção funciona …')],
    md='''## In short\n\n…\n\n![…](growth.svg)\n\n…\n\n<!-- readings -->\n\n## Check yourself\n\n1. …''',
    md_pt='''## Em resumo\n\n…''', files={'growth.svg': '<svg …>', 'growth.pt-br.svg': '<svg …>'})
```

Every built-in CS unit is an example of the finished files: see [`subjects/cs`](../../subjects/cs).

## Filling in outputs and validating

```bash
# Run the reference solutions and fill in every test's expected output, then print them to check by hand:
python3 scripts/content/sphinx_content.py generate subjects/cs/challenges/fast-power subjects/cs/challenges/pair-sum

# Validate lessons, quizzes and challenges strictly, with Portuguese:
python3 scripts/content/sphinx_content.py check subjects/cs/lessons/algorithms-and-complexity subjects/cs/quizzes/algorithms-quiz

# Check that every reading link still opens:
node scripts/check-links.js
```

**Pass every folder your script writes to `generate`.** Running a script rewrites all its challenges with empty outputs, so a folder left out of `generate` ships with empty expected outputs (the unit tests catch it, but it wastes a round).

Before a pull request, run the whole suite: `npm run validate`, `npm run test:unit` and `npm run test:integration`.
