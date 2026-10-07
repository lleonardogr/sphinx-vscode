"""Helpers for writing Sphinx content from Python: challenges, quizzes and reading guides, in English
and Portuguese. Used by people and AI assistants following docs/content-guide.md.

A unit script imports these helpers, describes each item once, and writes the folders:

    from sphinx_content import challenge, classic, quiz, num, choice, out, tf, short, reading_guide

Then fill in the expected outputs and validate (see README.md in this folder):

    python3 scripts/content/sphinx_content.py generate subjects/cs/challenges/my-challenge
    python3 scripts/content/sphinx_content.py check subjects/cs/lessons/my-guide subjects/cs/quizzes/my-quiz
"""
import json
import os
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


def challenge(folder, *, title, title_pt, topic, difficulty, order, hints, hints_pt, tests, desc, desc_pt,
              starter, starter_classic, solution, solution_classic, must=(), mustnot=(), comments=(),
              requires=None, skills=None, unit=None, ai_hints=True):
    """Writes a challenge folder.

    tests: (input, hidden) pairs; outputs are filled in later with `generate`.
    must / mustnot: (pattern, English message, Portuguese message) rules.
    comments: (English, Portuguese) pairs replaced in the starters to make Starter.pt-br.java.
    """
    d = os.path.join(REPO, folder)
    os.makedirs(d, exist_ok=True)
    assert len(hints) == len(hints_pt), f'{folder}: hints and hints_pt must have the same length'
    meta = {'title': title, 'topic': topic}
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
    meta['tests'] = [{'input': i, 'output': '', **({'hidden': True} if h else {})} for i, h in tests]
    _write_json(f'{d}/challenge.json', meta)
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


def quiz(folder, *, title, title_pt, topic, desc, desc_pt, questions, requires=None):
    d = os.path.join(REPO, folder)
    os.makedirs(d, exist_ok=True)
    data = {'title': title, 'topic': topic}
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
                        print(f'  {os.path.basename(f)} {t["input"][:40]!r} -> {t["output"][:120]!r}')
        return result.returncode


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('generate', 'check'):
        print('usage: sphinx_content.py generate|check <folder> [<folder> ...]   (folders relative to the repository)')
        sys.exit(2)
    sys.exit(_validate(sys.argv[2:], sys.argv[1] == 'generate'))
