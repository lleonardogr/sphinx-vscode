"""Helpers for writing Sphinx content from Python: challenges, quizzes and reading guides, in English
and Portuguese. Used by people and AI assistants following docs/content-guide.md.

A unit script imports these helpers, describes each item once, and writes the folders:

    from sphinx_content import challenge, bonus_goal, classic, big, ints, chars, quiz, num, choice, out, tf, short, reading_guide
    from sphinx_content import lesson_notebook, nb_note, nb_code   # a reading guide as a notebook

Then fill in the expected outputs and validate (see README.md in this folder):

    python3 scripts/content/sphinx_content.py generate subjects/cs/challenges/my-challenge
    python3 scripts/content/sphinx_content.py check subjects/cs/lessons/my-guide subjects/cs/quizzes/my-quiz
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))


def _write_json(path, data):
    with open(path, 'w', encoding='utf8') as f:
        f.write(json.dumps(data, indent=2, ensure_ascii=False) + '\n')


def _write_text(path, text):
    with open(path, 'w', encoding='utf8') as f:
        f.write(text.strip('\n') + '\n')


# ------------------------------------------------------------------------------------ challenges

def classic(methods, body, imports='import java.util.*;'):
    """A classic `public class Main` program: static `methods` above main, and `body` inside main (with a Scanner)."""
    ind = lambda s, n: '\n'.join((' ' * n + l) if l.strip() else '' for l in s.strip('\n').split('\n'))
    m = f'\n{ind(methods, 4)}\n' if methods.strip() else ''
    return f'''{imports}

public class Main {{
{m}
    public static void main(String[] args) {{
        Scanner scanner = new Scanner(System.in);
{ind(body, 8)}
    }}
}}'''


def ints(count, lo, hi, rows=1, sorted=False, distinct=False):
    """A line (or `rows` lines) of `count` random whole numbers from lo to hi, for big(...). lo and hi can be lists
    with one range per column, such as ints(2, [0, 1], [10**9, 60], rows=1000) for a start and a short length."""
    line = {'ints': count, 'min': lo, 'max': hi}
    if rows != 1:
        line['rows'] = rows
    if sorted:
        line['sorted'] = True
    if distinct:
        line['distinct'] = True
    return line


def chars(count, alphabet, rows=1):
    """A line (or `rows` lines) of `count` random characters from `alphabet`, for big(...)."""
    return {'chars': count, 'alphabet': alphabet, **({'rows': rows} if rows != 1 else {})}


def parents(n, max_gap=None):
    """A random tree of n nodes for big(...): one line with the parent of nodes 2..n, each smaller than its node.
    max_gap=1 makes a chain (the deepest tree); leave it out for a bushy tree."""
    return {'parents': n, **({'maxGap': max_gap} if max_gap else {})}


def big(seed, *lines):
    """A hidden test whose input is generated (see "generate" in docs/creating-challenges.md): lines are text,
    ints(...) or chars(...). Use it in tests=[...] in place of an (input, hidden) pair, and in bonus tests."""
    return {'generate': {'seed': seed, 'lines': [l if isinstance(l, (str, dict)) else str(l) for l in lines]}}


def _test(t, hidden_default=False):
    """A test for challenge.json from an (input, hidden) pair, an input string, or big(...)."""
    if isinstance(t, dict):
        return {**t, 'output': '', 'hidden': True}
    if isinstance(t, str):
        return {'input': t, 'output': '', **({'hidden': True} if hidden_default else {})}
    i, h = t
    return {'input': i, 'output': '', **({'hidden': True} if h else {})}


def bonus_goal(id, *, title, title_pt, desc, desc_pt, solution, hint=None, hint_pt=None, must=(), mustnot=(),
               tests=(), time_limit=None, solution_classic=None):
    """An optional, harder goal for challenge(bonus=[...]): rules and/or extra tests (inputs; outputs come from
    `generate`), and its own reference solution, written to Solution.bonus.<id>.java (and .classic.java)."""
    goal = {'id': id, 'title': title, 'description': desc}
    if hint:
        goal['hint'] = hint
    if must:
        goal['mustContain'] = [{'pattern': p, 'message': en} for p, en, _ in must]
    if mustnot:
        goal['mustNotContain'] = [{'pattern': p, 'message': en} for p, en, _ in mustnot]
    if tests:
        goal['tests'] = [{k: v for k, v in _test(t).items() if k != 'hidden'} for t in tests]
    if time_limit:
        goal['timeLimitMs'] = time_limit
    pt = {'title': title_pt, 'description': desc_pt}
    if hint_pt:
        pt['hint'] = hint_pt
    if must:
        pt['mustContain'] = [m for _, _, m in must]
    if mustnot:
        pt['mustNotContain'] = [m for _, _, m in mustnot]
    return {'goal': goal, 'pt': pt, 'solution': solution, 'solution_classic': solution_classic}


def _write_meta(folder, *, title, title_pt, topic, difficulty, order, hints, hints_pt, tests, must, mustnot,
                requires, skills, unit, ai_hints, bonus, time_limit=None):
    """Writes challenge.json for challenge() and c_challenge(), and returns the folder."""
    d = os.path.join(REPO, folder)
    os.makedirs(d, exist_ok=True)
    assert len(hints) == len(hints_pt), f'{folder}: hints and hints_pt must have the same length'
    meta = {'title': title}
    if topic:            # exam questions have no unit
        meta['topic'] = topic
    if skills:
        meta['skills'] = skills
    if unit:
        meta['unit'] = unit
    if requires:
        meta['requires'] = requires
    meta.update({'difficulty': difficulty, 'order': order, 'hints': hints})
    t = {'title': title_pt, 'hints': hints_pt}
    if must:
        t['mustContain'] = [pt for _, _, pt in must]
    if mustnot:
        t['mustNotContain'] = [pt for _, _, pt in mustnot]
    meta['translations'] = {'pt-br': t}
    if must:
        meta['mustContain'] = [{'pattern': p, 'message': en} for p, en, _ in must]
    if mustnot:
        meta['mustNotContain'] = [{'pattern': p, 'message': en} for p, en, _ in mustnot]
    if not ai_hints:
        meta['aiHints'] = False
    if time_limit:
        meta['timeLimitMs'] = time_limit
    meta['tests'] = [_test(t) for t in tests]
    if bonus:
        meta['bonus'] = [b['goal'] for b in bonus]
        t['bonus'] = [b['pt'] for b in bonus]
    _write_json(f'{d}/challenge.json', meta)
    return d


def challenge(folder, *, title, title_pt, topic, difficulty, order, hints, hints_pt, tests, desc, desc_pt,
              starter, starter_classic, solution, solution_classic, must=(), mustnot=(), comments=(),
              requires=None, skills=None, unit=None, ai_hints=True, bonus=()):
    """Writes a challenge folder.

    tests: (input, hidden) pairs, or big(...) for a generated hidden input; outputs are filled in later with `generate`.
    must / mustnot: (pattern, English message, Portuguese message) rules.
    comments: (English, Portuguese) pairs replaced in the starters to make Starter.pt-br.java.
    """
    d = _write_meta(folder, title=title, title_pt=title_pt, topic=topic, difficulty=difficulty, order=order, hints=hints,
                    hints_pt=hints_pt, tests=tests, must=must, mustnot=mustnot, requires=requires, skills=skills,
                    unit=unit, ai_hints=ai_hints, bonus=bonus)
    for b in bonus:
        _write_text(f"{d}/Solution.bonus.{b['goal']['id']}.java", b['solution'])
        if b['solution_classic']:
            _write_text(f"{d}/Solution.bonus.{b['goal']['id']}.classic.java", b['solution_classic'])
    _write_text(f'{d}/description.md', desc)
    _write_text(f'{d}/description.pt-br.md', desc_pt)
    _write_text(f'{d}/Starter.java', starter)
    _write_text(f'{d}/Starter.classic.java', starter_classic)
    _write_text(f'{d}/Solution.java', solution)
    _write_text(f'{d}/Solution.classic.java', solution_classic)
    for name, text in (('Starter.pt-br.java', starter), ('Starter.classic.pt-br.java', starter_classic)):
        translated = text
        for en, pt in comments:
            assert en in starter + starter_classic, f'{folder}: comment not found in the starters: {en}'
            translated = translated.replace(en, pt)
        if translated != text:
            _write_text(f'{d}/{name}', translated)
    return d


def c_challenge(folder, *, title, title_pt, topic, difficulty, order, hints, hints_pt, tests, desc, desc_pt,
                starter, solution, solution_alt, must=(), mustnot=(), comments=(), requires=None, skills=None,
                unit=None, ai_hints=True, bonus=(), time_limit=None):
    """Writes a C challenge folder: Starter.c (and Starter.pt-br.c), Solution.c and a second solution written
    differently, Solution.alt.c. The other arguments are as for challenge(); bonus goals' solutions go to
    Solution.bonus.<id>.c."""
    d = _write_meta(folder, title=title, title_pt=title_pt, topic=topic, difficulty=difficulty, order=order, hints=hints,
                    hints_pt=hints_pt, tests=tests, must=must, mustnot=mustnot, requires=requires, skills=skills,
                    unit=unit, ai_hints=ai_hints, bonus=bonus, time_limit=time_limit)
    for b in bonus:
        _write_text(f"{d}/Solution.bonus.{b['goal']['id']}.c", b['solution'])
    _write_text(f'{d}/description.md', desc)
    _write_text(f'{d}/description.pt-br.md', desc_pt)
    _write_text(f'{d}/Starter.c', starter)
    _write_text(f'{d}/Solution.c', solution)
    _write_text(f'{d}/Solution.alt.c', solution_alt)
    translated = starter
    for en, pt in comments:
        assert en in starter, f'{folder}: comment not found in the starter: {en}'
        translated = translated.replace(en, pt)
    if translated != starter:
        _write_text(f'{d}/Starter.pt-br.c', translated)
    return d


# ------------------------------------------------------------------------------------ quizzes
# Each helper returns (question, Portuguese translation); pass a list of them to quiz().

def num(prompt, answer, expl, prompt_pt, expl_pt, base=10, tolerance=0, code=None):
    """A number typed by the student (base 2, 8, 10 or 16), compared by value."""
    q = {'type': 'number', 'prompt': prompt}
    if code:
        q['code'] = code
    q['answer'] = answer
    if base != 10:
        q['base'] = base
    if tolerance:
        q['tolerance'] = tolerance
    q['explanation'] = expl
    return q, {'prompt': prompt_pt, 'explanation': expl_pt}


def choice(prompt, options, answer, expl, prompt_pt, options_pt, expl_pt, code=None):
    """Multiple choice; `answer` is the index of the right option (or a list for several)."""
    q = {'type': 'choice', 'prompt': prompt}
    if code:
        q['code'] = code
    q.update(options=options, answer=answer, explanation=expl)
    return q, {'prompt': prompt_pt, 'options': options_pt, 'explanation': expl_pt}


def out(code, answer, expl, expl_pt, options=None):
    """"What does this code print?" Leave answer '' to have the validator fill it in."""
    q = {'type': 'output', 'code': code}
    if options:
        q['options'] = options
    q['answer'] = answer
    q['explanation'] = expl
    return q, {'explanation': expl_pt}


def tf(prompt, answer, expl, prompt_pt, expl_pt, code=None):
    q = {'type': 'truefalse', 'prompt': prompt}
    if code:
        q['code'] = code
    q.update(answer=answer, explanation=expl)
    return q, {'prompt': prompt_pt, 'explanation': expl_pt}


def short(prompt, answers, expl, prompt_pt, expl_pt, case_sensitive=False, answers_pt=None):
    q = {'type': 'short', 'prompt': prompt, 'answer': answers}
    if case_sensitive:
        q['caseSensitive'] = True
    q['explanation'] = expl
    p = {'prompt': prompt_pt, 'explanation': expl_pt}
    if answers_pt:
        p['answer'] = answers_pt
    return q, p


def quiz(folder, *, title, title_pt, topic, desc, desc_pt, questions, requires=None, language=None):
    """topic None for an exam's quiz; language 'c' runs its "what does this print?" snippets as C (a quiz in a
    C unit is C already)."""
    d = os.path.join(REPO, folder)
    os.makedirs(d, exist_ok=True)
    data = {'title': title}
    if topic:
        data['topic'] = topic
    if language:
        data['language'] = language
    if requires:
        data['requires'] = requires
    data.update({'description': desc, 'questions': [q for q, _ in questions],
                 'translations': {'pt-br': {'title': title_pt, 'description': desc_pt, 'questions': [p for _, p in questions]}}})
    _write_json(f'{d}/quiz.json', data)
    return d


# ------------------------------------------------------------------------------------ reading guides

def reading(title, source, url, type, minutes, look_for, look_for_pt, lang='en'):
    """One curated reading. Check it by hand first: free, accurate, for beginners, and the link opens."""
    assert url.startswith('https://'), url
    assert type in ('article', 'video', 'interactive'), type
    return ({'title': title, 'source': source, 'url': url, 'type': type, 'minutes': minutes, 'lang': lang, 'lookFor': look_for},
            {'lookFor': look_for_pt})


def reading_guide(folder, *, title, title_pt, topic, order, objectives, objectives_pt, readings, md, md_pt, files=None, requires=None):
    """Writes a reading guide: lesson.json, lesson.md and lesson.pt-br.md (with a <!-- readings --> line
    where the cards go), plus extra files such as diagram.svg and diagram.pt-br.svg."""
    assert 3 <= len(objectives) <= 5 and len(objectives) == len(objectives_pt), 'a unit has 3 to 5 objectives, in both languages'
    assert 1 <= len(readings) <= 3, 'a guide has 1 to 3 readings'
    d = os.path.join(REPO, folder)
    os.makedirs(d, exist_ok=True)
    meta = {'title': title, 'topic': topic, 'order': order}
    if requires:
        meta['requires'] = requires
    meta.update({'objectives': objectives, 'readings': [r for r, _ in readings],
                 'translations': {'pt-br': {'title': title_pt, 'objectives': objectives_pt, 'readings': [p for _, p in readings]}}})
    _write_json(f'{d}/lesson.json', meta)
    _write_text(f'{d}/lesson.md', md)
    _write_text(f'{d}/lesson.pt-br.md', md_pt)
    for name, text in (files or {}).items():
        with open(f'{d}/{name}', 'w', encoding='utf8') as f:
            f.write(text)
    summary = md.split('<!-- readings -->')[0]
    print(f'{folder}: "In short" has {len(summary.split())} words (aim for 150 to 250)')
    return d


def quick_guide(folder, *, title, title_pt, topic, order, objectives, objectives_pt, readings, md, md_pt, requires=None):
    """Writes a quick guide, the reading guide of a programming subject: 2 or 3 objectives, 1 reading (plus
    an optional video), and a lesson.md with a short "In short", one code example and a "Watch out" line."""
    assert 2 <= len(objectives) <= 3 and len(objectives) == len(objectives_pt), 'a quick guide has 2 or 3 objectives, in both languages'
    assert 1 <= len(readings) <= 2, 'a quick guide has 1 reading, plus an optional video'
    d = os.path.join(REPO, folder)
    os.makedirs(d, exist_ok=True)
    meta = {'title': title, 'topic': topic, 'order': order}
    if requires:
        meta['requires'] = requires
    meta.update({'objectives': objectives, 'readings': [r for r, _ in readings],
                 'translations': {'pt-br': {'title': title_pt, 'objectives': objectives_pt, 'readings': [p for _, p in readings]}}})
    _write_json(f'{d}/lesson.json', meta)
    _write_text(f'{d}/lesson.md', md)
    _write_text(f'{d}/lesson.pt-br.md', md_pt)
    summary = md.split('<!-- readings -->')[0]
    prose = re.sub(r'```.*?```', '', summary, flags=re.S)
    print(f'{folder}: "In short" has {len(prose.split())} words of text (aim for 60 to 120) and {len(summary.split())} with the code (the validator warns above 180)')
    return d


# ------------------------------------------------------------------------------------ notebook lessons

def nb_note(en, pt):
    """A Markdown cell for lesson_notebook(), in both languages."""
    return ('markdown', en, pt)


def nb_code(en, pt=None):
    """A code cell for lesson_notebook(), in the subject's language (Java, or C for a C subject): statements (run
    inside void main(), or int main(void) in C) or a whole program. Start it with "// shared" to define methods or
    functions the cells below can use. pt defaults to en (translate the comments)."""
    return ('code', en, pt if pt is not None else en)


def nb_exercise(title, title_pt, task, task_pt, starter, solution, starter_pt=None, solution_pt=None):
    """A short exercise for lesson_notebook(): a task, a code cell to complete that ends with check(...) calls
    (minimal tests that print ✓ or ✗), and the answer in a collapsed block. The validator runs the answer, which
    must print only ✓. pt versions default to the English code (translate the comments)."""
    return ('exercise', (title, task, starter, solution), (title_pt, task_pt, starter_pt or starter, solution_pt or solution))


def nb_try(en, pt):
    """A "Try it" prompt for lesson_notebook(): what to change in the cell above, and what to predict first."""
    return ('markdown', f'🧪 **Try it:** {en}', f'🧪 **Experimente:** {pt}')


def nb_step(title, title_pt, *items):
    """One section of a notebook's step-by-step part (lesson_notebook(steps=[...])): a numbered heading and its
    items (nb_note, nb_code, nb_try, nb_slides, nb_exercise...), one idea per step, in teaching order."""
    return (title, title_pt, items)


def nb_slides(name, frames, title, title_pt, aria, aria_pt):
    """A step-by-step storyboard for lesson_notebook(): frames(t) returns the panels (see sphinx_slides.py), with
    t(en, pt) picking each language's text. Writes <name>.svg and <name>.pt-br.svg next to the lesson."""
    return ('slides', (name, frames, title, aria), (name, frames, title_pt, aria_pt))


def _indent(code, n=4):
    return '\n'.join((' ' * n + l) if l.strip() else '' for l in code.strip('\n').split('\n'))


def _literal(text):
    """A check's label as a Java or C string literal, with quotes and backslashes escaped."""
    return '"' + text.replace('\\', '\\\\').replace('"', '\\"') + '"'


def java_exercise(title, title_pt, task, task_pt, signature, default, todo, todo_pt, body, checks, before=''):
    """nb_exercise() for a Java method: `signature` and the answer's `body`; the starter returns `default` after a
    TODO. checks: (label, label_pt, call, expected) tuples, run in main() with check(). `before` holds extra
    declarations (records, classes) placed above the method."""
    def program(lang, inside):
        lines = '\n'.join(f'    check({_literal(lp if lang == "pt" else le)}, {call}, {exp});' for le, lp, call, exp in checks)
        top = f'{before.strip()}\n\n' if before.strip() else ''
        return f'{top}{signature} {{\n{_indent(inside)}\n}}\n\nvoid main() {{\n{lines}\n}}'
    starter = lambda lang, todo_text: program(lang, f'// TODO: {todo_text}' + (f'\nreturn {default};' if default is not None else ''))
    return nb_exercise(title, title_pt, task, task_pt, starter('en', todo), program('en', body),
                       starter('pt', todo_pt), program('pt', body))


def c_exercise(title, title_pt, task, task_pt, signature, default, todo, todo_pt, body, checks, before=''):
    """nb_exercise() for a C function, like java_exercise(). checks: (label, label_pt, call, expected) tuples;
    an expected value in double quotes is compared with check_str, anything else with check_int. A check can also
    be a plain line of C (setup such as a variable or a call), written as is."""
    def program(lang, inside):
        out = []
        for c in checks:
            if isinstance(c, str):
                out.append(f'    {c}')
                continue
            le, lp, call, exp = c
            fn = 'check_str' if exp.startswith('"') else 'check_int'
            out.append(f'    {fn}({_literal(lp if lang == "pt" else le)}, {call}, {exp});')
        top = f'{before.strip()}\n\n' if before.strip() else ''
        return f'{top}{signature} {{\n{_indent(inside)}\n}}\n\nint main(void) {{\n' + '\n'.join(out) + '\n    return 0;\n}'
    starter = lambda lang, todo_text: program(lang, f'// TODO: {todo_text}' + (f'\nreturn {default};' if default is not None else ''))
    return nb_exercise(title, title_pt, task, task_pt, starter('en', todo), program('en', body),
                       starter('pt', todo_pt), program('pt', body))


_NB_CHECK = {
    'java': {
        'en': """// shared: check(...) prints ✓ or ✗; the exercises below use it
void check(String what, Object actual, Object expected) {
    if (Objects.equals(actual, expected)) {
        IO.println("✓ " + what);
    } else {
        IO.println("✗ " + what + ": expected " + expected + ", got " + actual);
    }
}""",
        'pt-br': """// shared: check(...) imprime ✓ ou ✗; os exercícios abaixo usam
void check(String what, Object actual, Object expected) {
    if (Objects.equals(actual, expected)) {
        IO.println("✓ " + what);
    } else {
        IO.println("✗ " + what + ": esperado " + expected + ", veio " + actual);
    }
}""",
    },
    'c': {
        'en': """// shared: check_int and check_str print ✓ or ✗; the exercises below use them
void check_int(const char *what, long actual, long expected) {
    if (actual == expected) {
        printf("✓ %s\\n", what);
    } else {
        printf("✗ %s: expected %ld, got %ld\\n", what, expected, actual);
    }
}

void check_str(const char *what, const char *actual, const char *expected) {
    if (actual == NULL) {
        actual = "(NULL)";
    }
    if (strcmp(actual, expected) == 0) {
        printf("✓ %s\\n", what);
    } else {
        printf("✗ %s: expected \\"%s\\", got \\"%s\\"\\n", what, expected, actual);
    }
}""",
        'pt-br': """// shared: check_int e check_str imprimem ✓ ou ✗; os exercícios abaixo usam
void check_int(const char *what, long actual, long expected) {
    if (actual == expected) {
        printf("✓ %s\\n", what);
    } else {
        printf("✗ %s: esperado %ld, veio %ld\\n", what, expected, actual);
    }
}

void check_str(const char *what, const char *actual, const char *expected) {
    if (actual == NULL) {
        actual = "(NULL)";
    }
    if (strcmp(actual, expected) == 0) {
        printf("✓ %s\\n", what);
    } else {
        printf("✗ %s: esperado \\"%s\\", veio \\"%s\\"\\n", what, expected, actual);
    }
}""",
    },
}
_NB_CHECK_NOTE = {
    'en': '**Exercises** in this notebook end with `check(...)` lines: minimal tests that print ✓ when your code is right. Run the next cell once first, so they can use `check`.',
    'pt-br': 'Os **exercícios** deste notebook terminam com linhas `check(...)`: testes mínimos que imprimem ✓ quando o seu código está certo. Rode a próxima célula uma vez antes, para eles poderem usar o `check`.',
}
_NB_EXERCISE = {'en': '✏️ Exercise', 'pt-br': '✏️ Exercício'}
_NB_ANSWER = {'en': 'Show an answer', 'pt-br': 'Ver uma resposta'}
_NB_PRACTICE = {
    'en': """## Practice

The notebook covered the basics. Now apply them in the unit's challenges, in the Sphinx sidebar, where Submit runs every test, hidden ones included:""",
    'pt-br': """## Pratique

O notebook cobriu o básico. Agora aplique nos desafios da unidade, na barra lateral do Sphinx, onde o Submit roda todos os testes, inclusive os ocultos:""",
}

_NB_CONTENTS = {
    'en': '**In this notebook**, one idea at a time (run each cell before moving on):',
    'pt-br': '**Neste notebook**, uma ideia de cada vez (rode cada célula antes de seguir):',
}

_NB_INTRO = {
    'en': '*Run a cell with ▶ (or Shift+Enter): Sphinx compiles and runs it on your computer. Change the code and run it again: this notebook is your own copy.*',
    'pt-br': '*Rode uma célula com ▶ (ou Shift+Enter): o Sphinx compila e roda a célula no seu computador. Mude o código e rode de novo: este notebook é a sua cópia.*',
}
_NB_OBJECTIVES = {'en': '**After this unit you can:**', 'pt-br': '**Depois desta unidade você consegue:**'}
_NB_READINGS = {'en': '## Readings', 'pt-br': '## Leituras'}
_NB_LEVEL = {'en': {'Easy': 'Easy', 'Medium': 'Medium', 'Hard': 'Hard'}, 'pt-br': {'Easy': 'Fácil', 'Medium': 'Médio', 'Hard': 'Difícil'}}
_NB_TEST = {'en': 'Test', 'pt-br': 'Teste'}


def _nb_cell(kind, text, language='java'):
    lines = text.strip('\n').splitlines(keepends=True)
    if kind == 'markdown':
        return {'cell_type': 'markdown', 'metadata': {}, 'source': lines}
    return {'cell_type': 'code', 'execution_count': None, 'metadata': {'vscode': {'languageId': language}}, 'outputs': [], 'source': lines}


def _unit_challenges(subject_dir, unit):
    """The challenges of a unit, then the test that closes it, in path order: from the subject's folder, and from the
    repository's top-level challenges/ and tests/ (Java Programming's content lives there)."""
    found = []
    for kind, base in [(k, os.path.join(d, k)) for d in (subject_dir, REPO) for k in ('challenges', 'tests')]:
        for name in sorted(os.listdir(base)) if os.path.isdir(base) else []:
            meta_path = os.path.join(base, name, 'challenge.json')
            if not os.path.exists(meta_path):
                continue
            meta = json.load(open(meta_path, encoding='utf8'))
            if meta.get('topic') == unit or (meta.get('topic') == 'Tests' and meta.get('unit') == unit):
                found.append((kind == 'tests', meta.get('order', 0), name, meta, os.path.join(base, name)))
    found = list({f[2]: f for f in found}.values())
    return [(name, meta, folder, is_test) for is_test, _, name, meta, folder in sorted(found)]


def lesson_notebook(folder, insert=None, practice=True, steps=None):
    """Writes lesson.ipynb and lesson.pt-br.ipynb next to a reading guide, built from the lesson itself: the title,
    intro and objectives; the step-by-step sections in `steps` (nb_step), numbered, with a list of them under the
    objectives, before the recap; lesson.md's "In short" with the cells in insert[k] (nb_note/nb_code) placed after its
    paragraph k (paragraphs are split at blank lines, the "## In short" heading is 0); the readings with their
    "look for" notes; the text after the readings ("Check yourself"); and, when challenges is True, a cell with
    the unit's challenges as a "Practice" list (practice=False leaves it out). Exercises (nb_exercise) get a
    shared check() cell at the top."""
    d = os.path.normpath(os.path.join(REPO, folder))
    meta = json.load(open(os.path.join(d, 'lesson.json'), encoding='utf8'))
    pt_meta = meta.get('translations', {}).get('pt-br', {})
    subject_dir = os.path.dirname(os.path.dirname(d))
    subject = json.load(open(os.path.join(subject_dir, 'subject.json'), encoding='utf8'))
    language = 'c' if subject.get('language') == 'c' else 'java'
    ext = 'c' if language == 'c' else 'java'
    insert = insert or {}
    for lang, md_file, out_file in (('en', 'lesson.md', 'lesson.ipynb'), ('pt-br', 'lesson.pt-br.md', 'lesson.pt-br.ipynb')):
        pick = (lambda en, pt: pt) if lang == 'pt-br' else (lambda en, pt: en)
        text = open(os.path.join(d, md_file), encoding='utf8').read()
        before, _, after = text.partition('<!-- readings -->')
        paragraphs = [p.strip() for p in before.split('\n\n') if p.strip()]
        assert max(insert, default=0) < len(paragraphs), f'{folder}: insert points past the {len(paragraphs)} paragraphs of {md_file}'
        title = pt_meta.get('title', meta['title']) if lang == 'pt-br' else meta['title']
        objectives = pt_meta.get('objectives', meta['objectives']) if lang == 'pt-br' else meta['objectives']
        steps = steps or []
        step_titles = [pick(st[0], st[1]) for st in steps]
        contents = ''.join(f'{n}. {st}\n' for n, st in enumerate(step_titles, 1))
        cells = [_nb_cell('markdown', f"# {title}\n\n{_NB_INTRO[lang]}\n\n{_NB_OBJECTIVES[lang]}\n" + ''.join(f'- {o}\n' for o in objectives)
                          + (f"\n{_NB_CONTENTS[lang]}\n{contents}" if steps else ''))]
        all_items = [item for items in insert.values() for item in items] + [item for st in steps for item in st[2]]
        if any(kind == 'exercise' for kind, _, _ in all_items):
            cells.append(_nb_cell('markdown', _NB_CHECK_NOTE[lang]))
            cells.append(_nb_cell('code', _NB_CHECK[language][lang], language))

        def render(items):
            for kind, en, pt in items:
                if kind == 'slides':
                    slide_name, frames, slide_title, aria = pick(en, pt)
                    import sphinx_slides
                    t = (lambda a, b: b) if lang == 'pt-br' else (lambda a, b: a)
                    file = f"{slide_name}{'.pt-br' if lang == 'pt-br' else ''}.svg"
                    with open(os.path.join(d, file), 'w', encoding='utf8') as f:
                        f.write(sphinx_slides.storyboard(frames(t), aria))
                    cells.append(_nb_cell('markdown', f'#### 🎞️ {slide_title}\n\n![{aria}]({file})'))
                elif kind == 'exercise':
                    ex_title, task, starter_code, solution = pick(en, pt)
                    cells.append(_nb_cell('markdown', f'### {_NB_EXERCISE[lang]}: {ex_title}\n\n{task}'))
                    cell = _nb_cell('code', starter_code, language)
                    cell['metadata']['sphinx'] = {'solution': solution.strip('\n') + '\n'}
                    cells.append(cell)
                    cells.append(_nb_cell('markdown', f'<details>\n<summary>{_NB_ANSWER[lang]}</summary>\n\n```{language}\n{solution.strip()}\n```\n\n</details>'))
                else:
                    cells.append(_nb_cell(kind, pick(en, pt), language))

        for n, (st, (_, _, items)) in enumerate(zip(step_titles, steps), 1):
            cells.append(_nb_cell('markdown', f'## {n}. {st}'))
            render(items)
        chunk = []
        for i, p in enumerate(paragraphs):
            chunk.append(p)
            if i in insert:
                cells.append(_nb_cell('markdown', '\n\n'.join(chunk)))
                chunk = []
                render(insert[i])
        if chunk:
            cells.append(_nb_cell('markdown', '\n\n'.join(chunk)))
        readings = []
        for i, r in enumerate(meta.get('readings', [])):
            look = pt_meta.get('readings', [{}] * (i + 1))[i].get('lookFor', r['lookFor']) if lang == 'pt-br' else r['lookFor']
            readings.append(f"- [{r['title']}]({r['url']}) ({r['source']}, {r['minutes']} min): {look}")
        if readings:
            cells.append(_nb_cell('markdown', _NB_READINGS[lang] + '\n\n' + '\n'.join(readings)))
        if after.strip():
            cells.append(_nb_cell('markdown', after.strip()))
        if practice and meta.get('topic'):
            unit = _unit_challenges(subject_dir, meta['topic'])
            items = []
            for name, cmeta, cfolder, is_test in unit:
                ctitle = cmeta.get('translations', {}).get('pt-br', {}).get('title', cmeta['title']) if lang == 'pt-br' else cmeta['title']
                level = _NB_LEVEL[lang].get(cmeta.get('difficulty', 'Easy'), cmeta.get('difficulty', ''))
                items.append(f"- {_NB_TEST[lang] + ': ' if is_test else ''}**{ctitle}** · {level}")
            if items:
                cells.append(_nb_cell('markdown', _NB_PRACTICE[lang] + '\n\n' + '\n'.join(items)))
        nb = {'cells': cells, 'metadata': {'language_info': {'name': language}}, 'nbformat': 4, 'nbformat_minor': 5}
        with open(os.path.join(d, out_file), 'w', encoding='utf8') as f:
            f.write(json.dumps(nb, indent=1, ensure_ascii=False) + '\n')
    print(f'{folder}: lesson.ipynb and lesson.pt-br.ipynb written')
    return d


# ------------------------------------------------------------------------------------ command line

def _validate(folders, generate):
    """Validates copies of `folders` (the validator scans folders, so a copy keeps unrelated content out).
    With generate, fills in the expected outputs and copies challenge.json back."""
    with tempfile.TemporaryDirectory() as tmp:
        for f in folders:
            shutil.copytree(os.path.join(REPO, f), os.path.join(tmp, os.path.basename(f.rstrip('/'))))
        cmd = ['node', os.path.join(REPO, 'scripts', 'validate-challenges.js'), '--strict', '--lang=pt-br']
        if generate:
            cmd.append('--generate')
        result = subprocess.run(cmd + [tmp], cwd=REPO, capture_output=True, text=True)
        print('\n'.join(l for l in (result.stdout + result.stderr).splitlines() if l.strip('.').strip()))
        if generate:
            for f in folders:
                src = os.path.join(tmp, os.path.basename(f.rstrip('/')), 'challenge.json')
                if os.path.exists(src):
                    shutil.copy(src, os.path.join(REPO, f, 'challenge.json'))
                    # Print every test so the outputs can be checked by hand.
                    for t in json.load(open(src, encoding='utf8'))['tests']:
                        shown = t['input'][:40] if 'input' in t else f"generated, seed {t['generate']['seed']}"
                        print(f'  {os.path.basename(f)} {shown!r} -> {t["output"][:120]!r}')
        return result.returncode


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('generate', 'check'):
        print('usage: sphinx_content.py generate|check <folder> [<folder> ...]   (folders relative to the repository)')
        sys.exit(2)
    sys.exit(_validate(sys.argv[2:], sys.argv[1] == 'generate'))
