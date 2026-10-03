#!/usr/bin/env python3
"""Turn the ink drawings of each service into the transparent PNGs in public/images/illustrations/.

The drawings were made in Gemini from job photos (prompt in fb-photos/illustration-refs/PROMPT.md)
and live in the local, gitignored fb-photos/illustration-refs/ as <service>-<photo number>-ill.jpg.
For each one this script keeps only the ink (as alpha, coloured with the brand ink), hatches large
solid black areas so every drawing is line-only, crops so the figures come out at about the same
size, matches line weight across crops, and fades the edges out. Output is 600x800.

Requires numpy and opencv-python-headless. Usage: python3 scripts/prepare-illustrations.py
"""
import glob
import os

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'fb-photos', 'illustration-refs')
OUT = os.path.join(ROOT, 'public', 'images', 'illustrations')
INK_BGR = (0x2B, 0x1E, 0x1C)  # #1C1E2B
W, H = 600, 800

# Crop (x0, y0, x1, y1) in source pixels, all 3:4, chosen so the worker fills a similar share of the frame.
CROPS = {
    'insulation': (0, 80, 675, 980),
    'painting': (100, 300, 700, 1100),
    'renovations': (35, 50, 860, 1150),
    'demolition': (10, 120, 835, 1220),
    'paving': (0, 0, 896, 1195),
    'wood': (0, 0, 896, 1195),
    'repairs': (0, 0, 896, 1195),
}


def ink_alpha(gray):
    # The paper is not always pure white, so take its level from the image itself.
    white = np.percentile(gray, 90) - 6
    a = np.clip((white - gray) / (white - 35), 0, 1)
    a[a < 0.1] = 0
    return a ** 0.85


def hatch_solids(a):
    solid = (a > 0.8).astype(np.uint8)
    core = cv2.erode(solid, np.ones((11, 11), np.uint8))
    region = cv2.dilate(core, np.ones((11, 11), np.uint8)) & solid
    if not region.any():
        return a
    inner = cv2.erode(region, np.ones((5, 5), np.uint8))
    yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
    hatch = (((xx + yy) % 8) < 3).astype(np.float32)
    out = a.copy()
    out[inner > 0] = hatch[inner > 0] * 0.95
    return out


def vignette(h, w, margin=0.07):
    def ramp(t):
        t = np.clip(t / margin, 0, 1)
        return t * t * (3 - 2 * t)

    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    return ramp(x) * ramp(1 - x) * ramp(y) * ramp(1 - y)


os.makedirs(OUT, exist_ok=True)
for service, (x0, y0, x1, y1) in CROPS.items():
    matches = glob.glob(os.path.join(SRC, f'{service}-*-ill.jpg'))
    if not matches:
        print(f'missing drawing for {service}')
        continue
    gray = cv2.imread(matches[0], cv2.IMREAD_GRAYSCALE).astype(np.float32)
    a = hatch_solids(ink_alpha(gray))[y0:y1, x0:x1]

    # A tighter crop is scaled up more, which thickens its lines; thin them back to match the full-width ones.
    k = (W / (x1 - x0)) / (W / 896)
    if k > 1.15:
        r = int(round((k - 1) * 1.6)) + 1
        a = cv2.erode(a, np.ones((r, r), np.uint8))

    a = cv2.resize(a, (W, H), interpolation=cv2.INTER_AREA) * vignette(H, W)
    out = np.zeros((H, W, 4), np.uint8)
    out[..., :3] = INK_BGR
    out[..., 3] = np.clip(a * 255, 0, 255).astype(np.uint8)
    cv2.imwrite(os.path.join(OUT, f'{service}.png'), out, [cv2.IMWRITE_PNG_COMPRESSION, 9])
    print(f'{service}: {os.path.basename(matches[0])}')
