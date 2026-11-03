#!/usr/bin/env python3
"""Facebook page images: profile 720x720, cover 1640x624. Run after build.py helpers exist (imports nothing from it)."""
import base64, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent; OUT = ROOT / 'facebook'
PROJ = ROOT.parent / 'public/images/projects'
INK, PAPER, BG, INDIGO, COPPER = '#1C1E2B', '#FAF8F2', '#EEEBE3', '#2E3A6E', '#985623'
def ph(s, f): return 'data:image/jpeg;base64,' + base64.b64encode((PROJ / s / f).read_bytes()).decode()
MARK = lambda: f'''<svg viewBox="0 0 48 48" style="width:100%;height:100%"><rect width="48" height="48" fill="{INDIGO}"/>
<path d="M24 6c0 0-7.4 8.8-7.4 13.6a7.4 7.4 0 0 0 14.8 0C31.4 14.8 24 6 24 6z" fill="{PAPER}"/><rect x="8" y="30" width="32" height="4" rx="1.2" fill="#C9966E"/><rect x="8" y="35" width="32" height="6" rx="1.4" fill="{PAPER}"/></svg>'''
base = 'html,body{margin:0;overflow:hidden}body{font-family:Roboto,sans-serif;-webkit-print-color-adjust:exact}.d{font-weight:900;letter-spacing:-.01em}'
profile = f'<!doctype html><html lang=el><meta charset=utf-8><style>{base}body{{width:720px;height:720px}}</style>{MARK().replace("width:100%;height:100%","width:720px;height:720px")}'
# cover: photos on the outer sides (cropped on phones), text in the centre safe zone
cover = f'''<!doctype html><html lang=el><meta charset=utf-8><style>{base}body{{width:1640px;height:624px;background:{INDIGO};color:{PAPER};display:flex}}
.ph{{flex:1;background-size:cover;background-position:center}}.mid{{width:760px;flex-shrink:0;display:flex;flex-direction:column;justify-content:flex-start;align-items:center;text-align:center;padding:48px 30px 0}}</style>
<div class=ph style="background-image:url({ph('city-view-roof-white-coating','after-1.jpg')})"></div>
<div class=mid><div class=d style="font-size:100px;line-height:1">AtticaPro</div>
<div style="font-size:28px;letter-spacing:.14em;text-transform:uppercase;margin-top:14px;opacity:.9">Μονώσεις · Χρώματα · Ανακαινίσεις</div>
<div class=d style="font-size:44px;margin-top:22px;color:#C9966E">Δουλειά που στέκει.</div></div>
<div class=ph style="background-image:url({ph('kitchen-renovation-grey-island','step-07.jpg')})"></div>'''
for name, html, w, h in [('profile', profile, 720, 720), ('cover', cover, 1640, 624)]:
    f = OUT / f'{name}.html'; f.write_text(html, encoding='utf-8')
    subprocess.run(['chromium', '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', f'--screenshot={OUT / (name + ".png")}', f'--window-size={w},{h}', f'file://{f}'], check=True, capture_output=True)
    f.unlink(); print('ok', name)
