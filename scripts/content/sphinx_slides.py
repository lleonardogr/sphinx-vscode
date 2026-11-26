"""Step-by-step "slides" for notebook lessons: a storyboard of numbered panels, each with a small drawing and a
caption, written as one SVG per language. Readable in light and dark themes (mid-tone colors, no background).

    from sphinx_slides import Panel, stack_panel, memory_panel

    def frames(t):                      # t(en, pt) picks the language
        return [stack_panel(['A'], t('push A', 'push A')), ...]

Pass `frames` to nb_slides(...) in a lesson_notebook() insert; it writes <name>.svg and <name>.pt-br.svg.
"""
from html import escape

BLUE, AMBER, GRAY, GREEN, RED = '#3b82f6', '#f59e0b', '#8a94a6', '#10b981', '#ef4444'
W, H = 230, 236          # panel size
CAPTION_H = 46           # room under each drawing for the caption
FONT = "-apple-system, 'Segoe UI', Roboto, sans-serif"
MONO = "ui-monospace, Menlo, Consolas, monospace"


class Panel:
    """One slide: drawing primitives in panel coordinates (0..W, 0..H - CAPTION_H), plus a caption."""

    def __init__(self, caption):
        self.caption = caption
        self.parts = []

    def box(self, x, y, w, h, text='', color=BLUE, fill=True, dashed=False, mono=False, size=15, bold=True, text_color=None):
        dash = ' stroke-dasharray="4 3"' if dashed else ''
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="4" fill="{color if fill else "none"}" fill-opacity="0.15" stroke="{color}" stroke-width="1.5"{dash}/>')
        if text != '':
            self.text(x + w / 2, y + h / 2 + size * 0.36, text, text_color or color, size, bold=bold, mono=mono)
        return self

    def text(self, x, y, s, color=GRAY, size=13, anchor='middle', bold=False, mono=False):
        weight = ' font-weight="700"' if bold else ''
        family = MONO if mono else FONT
        self.parts.append(f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}" font-family="{family}"{weight}>{escape(str(s))}</text>')
        return self

    def arrow(self, x1, y1, x2, y2, color=GRAY, width=1.5):
        dx, dy = x2 - x1, y2 - y1
        length = max((dx * dx + dy * dy) ** 0.5, 1)
        ux, uy = dx / length, dy / length
        bx, by = x2 - ux * 8, y2 - uy * 8
        self.parts.append(f'<path d="M{x1:.1f} {y1:.1f} L{bx:.1f} {by:.1f}" stroke="{color}" stroke-width="{width}" fill="none"/>')
        self.parts.append(f'<path d="M{x2:.1f} {y2:.1f} L{bx - uy * 4.5:.1f} {by + ux * 4.5:.1f} L{bx + uy * 4.5:.1f} {by - ux * 4.5:.1f} Z" fill="{color}"/>')
        return self

    def line(self, x1, y1, x2, y2, color=GRAY, width=1.5, dashed=False):
        dash = ' stroke-dasharray="4 3"' if dashed else ''
        self.parts.append(f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{color}" stroke-width="{width}" fill="none"{dash}/>')
        return self

    def circle(self, x, y, r, text='', color=BLUE, size=14):
        self.parts.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{color}" fill-opacity="0.15" stroke="{color}" stroke-width="1.5"/>')
        if text != '':
            self.text(x, y + size * 0.36, text, color, size, bold=True)
        return self


def _wrap(s, width_px, size=12.5):
    """Splits a caption into lines that fit the panel (an estimate of character widths)."""
    per_line = max(10, int(width_px / (size * 0.55)))
    lines, line = [], ''
    for word in s.split():
        if line and len(line) + 1 + len(word) > per_line:
            lines.append(line)
            line = word
        else:
            line = f'{line} {word}'.strip()
    if line:
        lines.append(line)
    return lines[:3]


def storyboard(panels, aria, per_row=4):
    """The SVG for a list of panels: numbered, left to right, wrapping after per_row. Panels grow taller together
    when a caption needs more than two lines."""
    gap = 14
    cols = min(per_row, len(panels))
    rows = (len(panels) + cols - 1) // cols
    captions = [_wrap(p.caption, W - 20) for p in panels]
    extra = max(0, max(len(c) for c in captions) - 2) * 15
    ph = H + extra
    total_w = cols * W + (cols - 1) * gap
    total_h = rows * ph + (rows - 1) * gap
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {total_h}" role="img" aria-label="{escape(aria)}">']
    for i, p in enumerate(panels):
        ox, oy = (i % cols) * (W + gap), (i // cols) * (ph + gap)
        out.append(f'<g transform="translate({ox} {oy})">')
        out.append(f'<rect x="0.75" y="0.75" width="{W - 1.5}" height="{ph - 1.5}" rx="8" fill="none" stroke="{GRAY}" stroke-opacity="0.45" stroke-width="1.5"/>')
        out.append(f'<circle cx="18" cy="18" r="11" fill="{BLUE}"/>')
        out.append(f'<text x="18" y="22.5" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle" font-family="{FONT}">{i + 1}</text>')
        out.extend(p.parts)
        for j, line in enumerate(captions[i]):
            out.append(f'<text x="{W / 2}" y="{H - CAPTION_H + 16 + j * 15}" fill="{GRAY}" font-size="12.5" text-anchor="middle" font-family="{FONT}">{escape(line)}</text>')
        out.append('</g>')
    out.append('</svg>')
    return '\n'.join(out) + '\n'


# ------------------------------------------------------------------------------------ ready-made drawings

def stack_panel(items, caption, top_label='top', highlight=None, leaving=None, entering=None, width=70):
    """A vertical stack, bottom item first in `items`. `leaving` is drawn above the stack with an arrow out,
    `entering` above it with an arrow in; `highlight` marks the top in amber."""
    p = Panel(caption)
    cx, bw, bh = W / 2 - 10, width, 26
    base = H - CAPTION_H - 10
    p.line(cx - bw / 2 - 8, base - len(items) * bh - 30, cx - bw / 2 - 8, base, GRAY)
    p.line(cx + bw / 2 + 8, base - len(items) * bh - 30, cx + bw / 2 + 8, base, GRAY)
    p.line(cx - bw / 2 - 8, base, cx + bw / 2 + 8, base, GRAY)
    for k, item in enumerate(items):
        y = base - (k + 1) * bh - 2
        color = AMBER if (highlight is not None and k == len(items) - 1) else BLUE
        p.box(cx - bw / 2, y, bw, bh - 3, item, color, size=15 if len(str(item)) < 8 else 11, mono=len(str(item)) >= 8)
    if items:
        p.text(cx + bw / 2 + 14, base - len(items) * bh + 10, f'← {top_label}', AMBER if highlight else GRAY, 12, anchor='start')
    top_y = base - len(items) * bh - 4
    if leaving is not None:
        lw = max(44, min(bw, 12 + 7 * len(str(leaving))))
        p.box(W - lw - 8, 32, lw, bh - 3, leaving, GREEN, size=15 if len(str(leaving)) < 8 else 11, mono=len(str(leaving)) >= 8)
        p.arrow(cx, top_y, W - lw / 2 - 8, 32 + bh, GREEN)
    if entering is not None:
        ew = max(44, min(bw, 12 + 7 * len(str(entering))))
        p.box(8, 32, ew, bh - 3, entering, AMBER, size=15 if len(str(entering)) < 8 else 11, mono=len(str(entering)) >= 8)
        p.arrow(8 + ew / 2, 32 + bh, cx, top_y, AMBER)
    return p


def queue_panel(items, caption, front_label='front', back_label='back', leaving=None, entering=None):
    """A horizontal queue, front on the left."""
    p = Panel(caption)
    bw, bh = 38, 30
    y = 90
    x0 = (W - max(len(items), 1) * bw) / 2
    for k, item in enumerate(items):
        p.box(x0 + k * bw + 1, y, bw - 3, bh, item, BLUE)
    if items:
        p.text(x0 + bw / 2, y + bh + 18, front_label, GRAY, 11)
        p.text(x0 + (len(items) - 0.5) * bw, y + bh + 18, back_label, GRAY, 11)
    if leaving is not None:
        p.box(8, 42, bw - 3, bh, leaving, GREEN)
        p.arrow(x0, y + 4, 8 + bw - 3, 42 + bh, GREEN)
    if entering is not None:
        p.box(W - bw - 6, 42, bw - 3, bh, entering, AMBER)
        p.arrow(W - bw / 2 - 6, 42 + bh, x0 + len(items) * bw - 4, y + 4, AMBER)
    return p


def array_panel(values, caption, highlight=(), pointers=None, label=None, colors=None, cell=34, below=None, dashed=()):
    """A row of array cells with indexes; `pointers` maps a name to an index (drawn as an arrow from above)."""
    p = Panel(caption)
    n = len(values)
    cell = min(cell, (W - 14) / max(n, 1))
    x0 = (W - n * cell) / 2
    y = 92
    for i, v in enumerate(values):
        color = (colors or {}).get(i, RED if i in dashed else (AMBER if i in highlight else BLUE))
        p.box(x0 + i * cell + 1, y, cell - 3, 30, v, color, size=14 if len(str(v)) < 4 else 11, dashed=i in dashed)
        p.text(x0 + i * cell + cell / 2, y + 46, (below or {}).get(i, i) if isinstance(below, dict) else (below[i] if below else i), GRAY, 10)
    if label:
        p.text(W / 2, 66 if not pointers else 40, label, GRAY, 11)
    for k, (name, idx) in enumerate((pointers or {}).items()):
        x = x0 + idx * cell + cell / 2
        p.text(x, 54 - (k % 2) * 0, name, AMBER, 12, bold=True)
        p.arrow(x, 58, x, y - 3, AMBER)
    return p


def memory_panel(stack_vars, heap_objects, caption, stack_label='stack', heap_label='heap', new=(), code=None):
    """Variables in the stack (name, value) or (name, '→', heap_id), and objects in the heap (id, text).
    Names in `new` are drawn in amber (just created). `code`, if given, is the line being run, shown on top."""
    p = Panel(caption)
    top = 36
    if code:
        size = min(10.5, (W - 44) / (0.62 * len(code)))     # fit between the step number and the right edge
        p.text((34 + W - 6) / 2, 22, code, AMBER, round(size, 1), mono=True, bold=True)
        top = 50
    p.text(56, top, stack_label, GRAY, 11, bold=True)
    p.text(166, top, heap_label, GRAY, 11, bold=True)
    bottom = H - CAPTION_H - 6
    p.line(113, top - 8, 113, bottom, GRAY, 1, dashed=True)
    rows = max(len(stack_vars), len(heap_objects), 1)
    step = min(30, (bottom - top - 8) / rows)
    bh = min(24, step - 4)
    heap_pos = {}
    for k, (hid, txt) in enumerate(heap_objects):
        y = top + 8 + k * step
        color = AMBER if hid in new else GREEN
        p.box(124, y, 98, bh, txt, color, size=11, mono=True)
        heap_pos[hid] = y + bh / 2
    for k, var in enumerate(stack_vars):
        y = top + 8 + k * step
        name = var[0]
        color = AMBER if name in new else BLUE
        p.text(10, y + bh / 2 + 4, name, color, 11, anchor='start', mono=True, bold=True)
        if len(var) == 3 and var[1] == '→':
            p.box(58, y, 40, bh, '', color)
            p.circle(78, y + bh / 2, 3, '', color)
            if var[2] in heap_pos:
                p.arrow(81, y + bh / 2, 123, heap_pos[var[2]], color)
        else:
            p.box(58, y, 48, bh, var[1], color, size=12, mono=True)
    return p


def list_panel(values, caption, head_label='head', highlight=(), freed=()):
    """A singly linked list: nodes with an arrow to the next one, ending in NULL."""
    p = Panel(caption)
    n = len(values)
    nw, gap = 34, 14
    x0 = max(6, (W - (n * (nw + gap) + 30)) / 2)
    y = 96
    if n:
        p.text(x0 + nw / 2, y - 22, head_label, AMBER, 11, bold=True)
        p.arrow(x0 + nw / 2, y - 16, x0 + nw / 2, y - 2, AMBER)
    for i, v in enumerate(values):
        x = x0 + i * (nw + gap)
        color = RED if i in freed else (AMBER if i in highlight else BLUE)
        p.box(x, y, nw, 28, v, color, size=13, dashed=i in freed)
        p.arrow(x + nw, y + 14, x + nw + gap, y + 14, GRAY)
    p.text(x0 + n * (nw + gap) + 14, y + 19, 'NULL', GRAY, 10, mono=True)
    return p


def tree_panel(nodes, edges, caption, highlight=(), dim=()):
    """A small tree: nodes maps a key to (x, y) in the panel; edges are (parent, child) pairs."""
    p = Panel(caption)
    for a, b in edges:
        (x1, y1), (x2, y2) = nodes[a], nodes[b]
        d = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
        ux, uy = (x2 - x1) / d * 14, (y2 - y1) / d * 14
        p.line(x1 + ux, y1 + uy, x2 - ux, y2 - uy, GRAY)
    for key, (x, y) in nodes.items():
        color = AMBER if key in highlight else (GRAY if key in dim else BLUE)
        p.circle(x, y, 14, key, color, 12)
    return p


def bits_panel(bits, caption, highlight=(), label=None, below=None):
    """A row of bits (a string such as '10110010'), most significant first; `below` labels each position."""
    p = Panel(caption)
    n = len(bits)
    cell = min(24, (W - 16) / n)
    x0 = (W - n * cell) / 2
    y = 84
    for i, b in enumerate(bits):
        color = AMBER if i in highlight else BLUE
        p.box(x0 + i * cell + 1, y, cell - 2, 28, b, color, size=13, mono=True)
        if below:
            p.text(x0 + i * cell + cell / 2, y + 42, below[i], GRAY, 9)
    if label:
        p.text(W / 2, 62, label, GRAY, 12, mono=True)
    return p


def text_panel(lines, caption, colors=None, size=13, mono=True):
    """A few lines of text or code, top-left aligned."""
    p = Panel(caption)
    for i, line in enumerate(lines):
        p.text(16, 50 + i * (size + 7), line, (colors or {}).get(i, BLUE), size, anchor='start', mono=mono, bold=False)
    return p
