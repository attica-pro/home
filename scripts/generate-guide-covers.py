#!/usr/bin/env python3
"""Draw an abstract SVG cover for every guide: public/images/articles/<guide-slug>.svg.

Each category has its own motif (roof layers, roller strokes, tiles, bricks, paving stones,
shutter slats, a patched crack), drawn in the brand palette: limestone ground, ink lines,
paper and olive fills, and one clay accent. The guide slug seeds the variation, so covers are
stable between runs and different between guides of the same category.

Usage: python3 scripts/generate-guide-covers.py
"""
import glob
import hashlib
import json
import math
import os
import random

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1600, 900
LIME, PAPER, MUTED, INK, STONE, OLIVE, CLAY = '#EDE6DA', '#F7F3EC', '#E2D9CA', '#2B2A26', '#615D54', '#5E6B3A', '#A45A3B'
LINE = f'stroke="{INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"'
THIN = f'stroke="{INK}" stroke-width="2.5" stroke-linecap="round"'


def pts(points):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in points)


def insulation(r):
    out = []
    top = r.uniform(400, 450)
    # The slab in section, from the bottom up: concrete, screed, insulation, membrane (clay).
    layers = [(OLIVE, 0.40), (PAPER, 0.24), (MUTED, 0.24), (CLAY, 0.12)]
    y = H + 10
    for fill, share in layers:
        h = (H + 10 - top) * share
        y -= h
        out.append(f'<rect x="-10" y="{y:.1f}" width="{W + 20}" height="{h:.1f}" fill="{fill}" {LINE}/>')
    # Parapets at both ends.
    for px in (60, W - 240):
        out.append(f'<rect x="{px}" y="{y - 170:.1f}" width="180" height="170" fill="{PAPER}" {LINE}/>')
    # A few heavy drops falling onto the roof.
    for _ in range(r.randint(5, 7)):
        dx, dy, s = r.uniform(320, W - 320), r.uniform(80, y - 110), r.uniform(0.7, 1.3)
        out.append(f'<path d="M{dx:.1f},{dy - 70 * s:.1f} C{dx + 40 * s:.1f},{dy - 10 * s:.1f} {dx + 42 * s:.1f},{dy + 30 * s:.1f} {dx:.1f},{dy + 32 * s:.1f} '
                   f'C{dx - 42 * s:.1f},{dy + 30 * s:.1f} {dx - 40 * s:.1f},{dy - 10 * s:.1f} {dx:.1f},{dy - 70 * s:.1f} Z" fill="{PAPER}" {LINE}/>')
    return out


def painting(r):
    out = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{LIME}"/>']
    angle = r.uniform(-14, -6)
    fills = [PAPER, MUTED, OLIVE, PAPER, MUTED]
    r.shuffle(fills)
    fills.insert(r.randrange(1, 4), CLAY)
    y = 40
    for fill in fills:
        h = r.uniform(95, 150)
        x0, x1 = r.uniform(-200, 120), r.uniform(1100, 1500)
        out.append(f'<rect x="{x0:.1f}" y="{y:.1f}" width="{x1 - x0:.1f}" height="{h:.1f}" rx="{h / 2:.1f}" fill="{fill}" {LINE} transform="rotate({angle:.1f} 800 450)"/>')
        y += h * 0.82
    # The roller at the end of the last stroke.
    rx, ry = r.uniform(1120, 1300), r.uniform(560, 680)
    out.append(f'<rect x="{rx:.1f}" y="{ry:.1f}" width="230" height="90" rx="14" fill="{PAPER}" {LINE}/>')
    out.append(f'<path d="M{rx + 230:.1f},{ry + 45:.1f} h60 v120 h-150 v130" fill="none" {LINE}/>')
    return out


def renovations(r):
    out = []
    size = r.choice([110, 125, 140])
    ox, oy = r.uniform(-60, 0), r.uniform(-60, 0)
    special = {(r.randrange(2, 9), r.randrange(1, 5)) for _ in range(5)}
    clay = (r.randrange(3, 10), r.randrange(1, 5))
    for i in range(int(W / size) + 2):
        for j in range(int(H / size) + 2):
            fill = CLAY if (i, j) == clay else OLIVE if (i, j) in special else PAPER if (i + j) % 2 else MUTED
            out.append(f'<rect x="{ox + i * size:.1f}" y="{oy + j * size:.1f}" width="{size}" height="{size}" fill="{fill}" {THIN}/>')
    # A shower arc and its spray.
    cx = r.uniform(950, 1250)
    out.append(f'<path d="M{cx - 260},{H + 10} V180 a120,120 0 0 1 240,0 v40" fill="none" stroke="{INK}" stroke-width="10" stroke-linecap="round"/>')
    for k in range(-3, 4):
        out.append(f'<line x1="{cx - 20 + k * 10}" y1="250" x2="{cx - 20 + k * 38}" y2="430" {THIN}/>')
    return out


def demolition(r):
    out = []
    bh, bw = 70, 170
    gap_c, gap_w = r.uniform(600, 1000), r.uniform(220, 340)
    clay_at = (r.randrange(0, 9), r.randrange(1, 9))
    for row in range(int(H / bh) + 1):
        off = 0 if row % 2 else -bw / 2
        for col in range(int(W / bw) + 2):
            x = off + col * bw
            # Leave a ragged hole in the wall.
            if abs(x + bw / 2 - gap_c) < gap_w * (0.6 + 0.4 * math.sin(row * 1.7 + r.random())) and 2 <= row <= 10:
                continue
            fill = CLAY if (row, col) == clay_at else OLIVE if r.random() < 0.12 else PAPER if r.random() < 0.6 else MUTED
            out.append(f'<rect x="{x:.1f}" y="{row * bh:.1f}" width="{bw}" height="{bh}" fill="{fill}" {THIN}/>')
    # Fallen fragments at the bottom of the hole.
    for _ in range(9):
        fx, fy, s = gap_c + r.uniform(-250, 250), H - r.uniform(40, 110), r.uniform(25, 55)
        poly = [(fx + s * math.cos(a) * r.uniform(0.6, 1.1), fy + s * math.sin(a) * r.uniform(0.5, 1)) for a in sorted(r.uniform(0, 6.28) for _ in range(5))]
        out.append(f'<polygon points="{pts(poly)}" fill="{r.choice([PAPER, MUTED, OLIVE])}" {THIN}/>')
    return out


def paving(r):
    out = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{PAPER}"/>']
    cols, rows = 9, 5
    cw, ch = W / cols, H / rows
    grid = [[(c * cw + r.uniform(-0.25, 0.25) * cw * (0 < c < cols), rr * ch + r.uniform(-0.25, 0.25) * ch * (0 < rr < rows)) for c in range(cols + 1)] for rr in range(rows + 1)]
    clay = (r.randrange(1, rows - 1), r.randrange(1, cols - 1))
    for rr in range(rows):
        for c in range(cols):
            quad = [grid[rr][c], grid[rr][c + 1], grid[rr + 1][c + 1], grid[rr + 1][c]]
            cx, cy = sum(p[0] for p in quad) / 4, sum(p[1] for p in quad) / 4
            # Shrink each stone toward its centre to leave a joint around it.
            stone = [(cx + (x - cx) * 0.86, cy + (y - cy) * 0.84) for x, y in quad]
            fill = CLAY if (rr, c) == clay else OLIVE if r.random() < 0.18 else MUTED if r.random() < 0.5 else LIME
            out.append(f'<polygon points="{pts(stone)}" fill="{fill}" {LINE}/>')
    return out


def wood(r):
    out = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{LIME}"/>']
    n = r.choice([3, 4])
    pw, gap = 300, 40
    x0 = (W - n * pw - (n - 1) * gap) / 2
    clay_panel = r.randrange(n)
    for k in range(n):
        x = x0 + k * (pw + gap)
        out.append(f'<rect x="{x:.1f}" y="70" width="{pw}" height="{H - 140}" fill="{OLIVE if k % 2 else PAPER}" {LINE}/>')
        # Louvres in the top half, a raised panel below.
        for s in range(9):
            y = 110 + s * 38
            out.append(f'<line x1="{x + 30:.1f}" y1="{y}" x2="{x + pw - 30:.1f}" y2="{y + 14}" {LINE}/>')
        out.append(f'<rect x="{x + 40:.1f}" y="500" width="{pw - 80}" height="{H - 640}" fill="none" {THIN}/>')
        if k == clay_panel:
            out.append(f'<rect x="{x - 14:.1f}" y="200" width="22" height="70" fill="{CLAY}" {THIN}/>')
            out.append(f'<rect x="{x - 14:.1f}" y="620" width="22" height="70" fill="{CLAY}" {THIN}/>')
    return out


def repairs(r):
    """A cracked wall, a fresh patch of plaster over the middle of the crack, and the putty knife that laid it."""
    out = [f'<rect x="0" y="0" width="{W}" height="{H}" fill="{MUTED}"/>']
    # The crack runs across the wall; the patch hides its middle.
    x, y = -20, r.uniform(260, 380)
    crack = [(x, y)]
    while x < W + 20:
        x += r.uniform(80, 150)
        y += r.uniform(-50, 70)
        crack.append((x, min(max(y, 160), H - 220)))
    out.append(f'<polyline points="{pts(crack)}" fill="none" stroke="{INK}" stroke-width="10" stroke-linejoin="bevel"/>')
    px, pw = r.uniform(520, 640), r.uniform(420, 520)
    mid = [p for p in crack if px <= p[0] <= px + pw] or [crack[len(crack) // 2]]
    py = sum(p[1] for p in mid) / len(mid)
    out.append(f'<rect x="{px:.1f}" y="{py - 150:.1f}" width="{pw:.1f}" height="300" rx="40" fill="{PAPER}" {LINE}/>')
    # Trowel marks in the fresh plaster.
    for k in range(3):
        yy = py - 80 + k * 70
        out.append(f'<path d="M{px + 50:.1f},{yy:.1f} q{pw / 4:.1f},-24 {pw / 2:.1f},0 t{pw / 2 - 100:.1f},0" fill="none" {THIN}/>')
    # The putty knife: a flat blade with an olive handle and a clay ferrule, resting on the patch edge.
    kx, ky, angle = px + pw - 40, py + 60, r.uniform(-35, -20)
    out.append(f'<g transform="translate({kx:.1f} {ky:.1f}) rotate({angle:.1f})">'
               f'<path d="M0,-70 L230,-48 L230,48 L0,70 Z" fill="{PAPER}" {LINE}/>'
               f'<rect x="230" y="-34" width="46" height="68" rx="6" fill="{CLAY}" {LINE}/>'
               f'<rect x="276" y="-28" width="230" height="56" rx="24" fill="{OLIVE}" {LINE}/>'
               f'</g>')
    return out


MOTIFS = dict(insulation=insulation, painting=painting, renovations=renovations, demolition=demolition, paving=paving, wood=wood, repairs=repairs)

for path in sorted(glob.glob(os.path.join(ROOT, 'content/guides/*/guide.json'))):
    slug = os.path.basename(os.path.dirname(path))
    guide = json.load(open(path))
    r = random.Random(int(hashlib.md5(slug.encode()).hexdigest(), 16))
    shapes = MOTIFS[guide['category']](r)
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">'
           f'<rect width="{W}" height="{H}" fill="{LIME}"/>' + ''.join(shapes) +
           f'<rect x="2" y="2" width="{W - 4}" height="{H - 4}" fill="none" stroke="{INK}" stroke-width="4"/></svg>\n')
    out = os.path.join(ROOT, guide['coverImage'].lstrip('/'))
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w').write(svg)
    print(f'{slug}: {guide["category"]} -> {guide["coverImage"]}')
