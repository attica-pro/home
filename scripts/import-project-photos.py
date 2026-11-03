#!/usr/bin/env python3
"""Copy each project's photos from the local Facebook download into public/images/projects/<slug>/.

Every content/projects/<slug>/project.json has a "photos" map of image file name -> Facebook photo
number (the NNNN prefix of the files in fb-photos/, which is gitignored and only exists locally).
For each photo this uses fb-photos/full/NNNN_*.jpg when it has been downloaded, and falls back to the
small square thumbnail in fb-photos/thumbs/ otherwise. Re-run it after more full-size photos arrive.

A value can also be a string: a path relative to fb-photos/ for photos that did not come from Facebook
(e.g. "whatsappphotos/job-a/a3.jpg", photos Mohamed sent over WhatsApp).

Requires Pillow. Usage: python3 scripts/import-project-photos.py [slug ...]
(with slugs, only those projects are imported and no folders are removed)
"""
import glob
import json
import os
import shutil
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_EDGE = 1600


def find(kind, number):
    matches = glob.glob(os.path.join(ROOT, 'fb-photos', kind, f'{number:04d}_*'))
    return matches[0] if matches else None


only = set(sys.argv[1:])
thumbs_used = []
for project_json in sorted(glob.glob(os.path.join(ROOT, 'content/projects/*/project.json'))):
    slug = os.path.basename(os.path.dirname(project_json))
    if only and slug not in only:
        continue
    photos = json.load(open(project_json))['photos']
    out_dir = os.path.join(ROOT, 'public/images/projects', slug)
    os.makedirs(out_dir, exist_ok=True)
    for name, number in photos.items():
        if isinstance(number, str):
            src = os.path.join(ROOT, 'fb-photos', number)
            src = src if os.path.exists(src) else None
        else:
            src = find('full', number) or find('thumbs', number)
        if not src:
            raise SystemExit(f'{slug}: no download for photo {number} ({name})')
        if '/thumbs/' in src:
            thumbs_used.append(f'{slug}/{name} ({number})')
        im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
        im.thumbnail((MAX_EDGE, MAX_EDGE))
        # Saving without the original EXIF drops location and camera metadata.
        im.save(os.path.join(out_dir, name), 'JPEG', quality=80, optimize=True, progressive=True)
    print(f'{slug}: {len(photos)} photos')

# Drop image folders of projects that were deleted or merged away.
slugs = {os.path.basename(os.path.dirname(p)) for p in glob.glob(os.path.join(ROOT, 'content/projects/*/project.json'))}
for out_dir in [] if only else glob.glob(os.path.join(ROOT, 'public/images/projects/*/')):
    if os.path.basename(out_dir.rstrip('/')) not in slugs:
        shutil.rmtree(out_dir)
        print(f'removed {out_dir}')

if thumbs_used:
    print(f'\n{len(thumbs_used)} still using thumbnails (re-run once the full-size photos are downloaded):')
    print('\n'.join('  ' + t for t in thumbs_used))
