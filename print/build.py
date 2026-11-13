#!/usr/bin/env python3
"""Builds the AtticaPro print pieces (card, A4 poster, A8 sticker, brochure) as PDFs via headless Chromium.
Usage: python3 print/build.py   (needs the `qrcode` package and chromium)"""
import base64, json, pathlib, shutil, subprocess, qrcode

ROOT = pathlib.Path(__file__).resolve().parent
IMG = ROOT.parent / 'public/images/illustrations'
OUT = ROOT / 'out'; OUT.mkdir(exist_ok=True)
msg = json.load(open(ROOT.parent / 'messages/el.json'))['services']['items']
INK, PAPER, BG, INDIGO, COPPER = '#1C1E2B', '#FAF8F2', '#EEEBE3', '#2E3A6E', '#985623'
PHONE, LAND, MAIL, WEB, ADDR = '693 334 7282', '210 254 5395', 'info@atticapro.gr', 'atticapro.gr', 'Λ. Συγγρού 196, Καλλιθέα'
TRADES = 'Μονώσεις · Χρώματα · Ανακαινίσεις'

def qr(url, color=INK):
    q = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M); q.add_data(url); q.make(fit=True)
    m = q.get_matrix(); n = len(m)
    path = ''.join(f'M{x} {y}h1v1h-1z' for y, r in enumerate(m) for x, v in enumerate(r) if v)
    return f'<svg style="width:100%;display:block" viewBox="0 0 {n} {n}" shape-rendering="crispEdges"><path d="{path}" fill="{color}"/></svg>'

def img(slug):
    return 'data:image/png;base64,' + base64.b64encode((IMG / f'{slug}.png').read_bytes()).decode()

def mark(size='10mm', bg=INDIGO, drop=PAPER, layer='#C9966E'):
    return f'''<svg style="width:{size};height:{size}" viewBox="0 0 48 48"><rect width="48" height="48" rx="9" fill="{bg}"/>
<path d="M24 6c0 0-7.4 8.8-7.4 13.6a7.4 7.4 0 0 0 14.8 0C31.4 14.8 24 6 24 6z" fill="{drop}"/>
<rect x="8" y="30" width="32" height="4" rx="1.2" fill="{layer}"/><rect x="8" y="35" width="32" height="6" rx="1.4" fill="{drop}"/></svg>'''

CSS = f'''*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:Roboto,'Roboto Flex',sans-serif;color:{INK};background:{BG};-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.d{{font-family:Roboto,sans-serif;font-weight:900;letter-spacing:-.01em}}
.eb{{color:{COPPER};text-transform:uppercase;letter-spacing:.14em;font-weight:700}}
.page{{position:relative;overflow:hidden;page-break-after:always}} .page:last-child{{page-break-after:auto}}
.row{{display:flex;align-items:center}}'''

def doc(w, h, pages, extra=''):
    return f'<!doctype html><html lang=el><meta charset=utf-8><style>@page{{size:{w}mm {h}mm;margin:0}}{CSS}{extra}</style>' + pages

def lockup(s, color=INK, sub=True, mk=None):
    return f'''<div class=row style="gap:{s*.28}mm">{mk or mark(f'{s}mm')}<div><div class=d style="font-size:{s*.62}mm;line-height:1;color:{color}">AtticaPro</div>
{f'<div style="font-size:{s*.26}mm;margin-top:{s*.12}mm;color:{color};opacity:.8">{TRADES}</div>' if sub else ''}</div></div>'''

# ---- Business card, 85x55 trim + 3mm bleed ----
card = doc(91, 61, f'''
<div class=page style="width:91mm;height:61mm;padding:3mm;background:{BG}">
 <div style="padding:5mm 6mm;height:55mm;display:flex;flex-direction:column;justify-content:space-between">
  {lockup(10)}
  <div style="font-size:2.9mm;line-height:1.55">
   <div><b>Τηλ./WhatsApp/Viber</b> &nbsp;{PHONE}</div><div><b>Σταθερό</b> &nbsp;{LAND}</div>
   <div><b>Email</b> &nbsp;{MAIL}</div><div style="color:{COPPER};font-weight:700">{WEB}</div>
   <div style="opacity:.75">{ADDR}</div></div></div></div>
<div class=page style="width:91mm;height:61mm;padding:3mm;background:{INDIGO};color:{PAPER}">
 <div style="height:55mm;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:2.5mm">
  {mark('17mm', PAPER, INDIGO, '#C9966E')}
  <div class=d style="font-size:8mm;line-height:1">AtticaPro</div>
  <div style="font-size:2.8mm;letter-spacing:.12em;text-transform:uppercase;opacity:.85">{TRADES}</div>
  <div style="font-size:3.6mm;margin-top:1mm;font-weight:700">Δουλειά που στέκει.</div>
  <div style="font-size:2.5mm;opacity:.8">18 χρόνια εμπειρίας · Δωρεάν εκτίμηση · Αττική</div></div></div>''')

# ---- A4 poster ----
svc = ['insulation', 'painting', 'renovations', 'demolition', 'paving', 'wood', 'repairs']
grid = ''.join(f'<div style="text-align:center"><img src="{img(s)}" style="height:25mm;width:100%;object-fit:contain"><div class=d style="font-size:4.4mm;margin-top:1.5mm">{'Τσιμεντοστρώσεις' if s=='paving' else msg[s]['name']}</div></div>' for s in svc[:6])
a4 = doc(210, 297, f'''
<div class=page style="width:210mm;height:297mm;padding:14mm 16mm;display:flex;flex-direction:column">
 {lockup(17)}
 <div style="margin-top:12mm"><div class=eb style="font-size:4mm">Μονώσεις · Χρώματα · Ανακαινίσεις στην Αττική</div>
 <div class=d style="font-size:23mm;line-height:.95;margin-top:4mm">Δουλειά<br>που στέκει.</div>
 <div style="font-size:5.2mm;line-height:1.45;margin-top:7mm;max-width:150mm">Από την ταράτσα ως την αυλή: μία ομάδα για όλη τη δουλειά, με 18 χρόνια εμπειρίας.</div></div>
 <div style="margin-top:10mm;border-top:.5mm solid {INK};padding:7mm 0 0;display:grid;grid-template-columns:repeat(3,1fr);gap:7mm 6mm">{grid}</div>
 <div style="margin-top:auto;background:{INDIGO};color:{PAPER};border-radius:2mm;padding:9mm 11mm;display:flex;justify-content:space-between;align-items:center">
  <div><div style="font-size:4.5mm;opacity:.85">Δωρεάν εκτίμηση · Καλέστε μας</div>
   <div class=d style="font-size:15mm;line-height:1.1;margin-top:2mm">{PHONE}</div>
   <div style="font-size:4.4mm;margin-top:3mm;line-height:1.5">WhatsApp / Viber · Σταθερό {LAND}<br>{MAIL} · <b>{WEB}</b><br><span style="opacity:.8">{ADDR}</span></div></div>
  <div style="background:{PAPER};padding:3mm;border-radius:1.5mm;width:36mm;text-align:center">{qr('https://'+WEB)}<div style="font-size:3mm;color:{INK};margin-top:1.5mm;font-weight:700">{WEB}</div></div></div>
</div>''')

# ---- A8 sticker / mini flyer, 52x74 + 3mm bleed ----
a8 = doc(58, 80, f'''
<div class=page style="width:58mm;height:80mm;padding:3mm;background:{INDIGO};color:{PAPER}">
 <div style="height:74mm;display:flex;flex-direction:column;align-items:center;text-align:center;padding:4mm 3mm;justify-content:space-between">
  <div>{mark('11mm', PAPER, INDIGO)}<div class=d style="font-size:6.5mm;margin-top:1.5mm">AtticaPro</div>
   <div style="font-size:2.3mm;letter-spacing:.1em;text-transform:uppercase;opacity:.85;margin-top:1mm">{TRADES}</div></div>
  <div class=d style="font-size:6mm;line-height:1.05">Δουλειά<br>που στέκει.</div>
  <div style="display:flex;align-items:center;gap:2.5mm;text-align:left"><div style="background:{PAPER};padding:1.2mm;width:17mm;border-radius:1mm">{qr('https://'+WEB)}</div>
   <div style="font-size:2.6mm;line-height:1.45"><div style="opacity:.8">Δωρεάν εκτίμηση</div><div class=d style="font-size:3.9mm;line-height:1.2">{PHONE}</div><div>{WEB}</div></div></div></div></div>''')

# ---- Brochure: tri-fold on A4 landscape (outside + inside) ----
PROJ = ROOT.parent / 'public/images/projects'
def ph(slug, f, h='45mm', pos='center'):
    return f'<img src="data:image/jpeg;base64,{base64.b64encode((PROJ/slug/f).read_bytes()).decode()}" style="width:100%;height:{h};object-fit:cover;object-position:{pos};display:block">'
def cap(t): return f'<div style="font-size:2.8mm;opacity:.75;margin:1mm 0 3.5mm">{t}</div>'
def ba(slug, h='34mm', n=1):
    return f'<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5mm">{ph(slug,f"before-{n}.jpg",h)}{ph(slug,f"after-{n}.jpg",h)}</div><div style="display:grid;grid-template-columns:1fr 1fr;font-size:2.6mm;letter-spacing:.12em;text-transform:uppercase;color:{COPPER};font-weight:700;margin-top:1mm"><span>Πριν</span><span>Μετά</span></div>'
def panel(w, inner, bg=BG, color=INK):
    return f'<div style="width:{w}mm;height:210mm;padding:11mm 9mm;background:{bg};color:{color};display:flex;flex-direction:column;flex-shrink:0">{inner}</div>'
def h2(t, c=INK): return f'<div class=d style="font-size:8.2mm;line-height:1.05;margin:1.5mm 0 3.5mm;color:{c}">{t}</div>'
def p(t, s=3.5): return f'<div style="font-size:{s}mm;line-height:1.5;margin-bottom:2.6mm">{t}</div>'
def ul(items): return ''.join(f'<div style="font-size:3.4mm;line-height:1.4;padding:1.4mm 0;border-top:.25mm solid {INK}"><b>{a}</b> {b}</div>' for a, b in items)
def eb(t): return f'<div class=eb style="font-size:3mm">{t}</div>'
def contact(color=PAPER):
    return f'''<div style="font-size:3.6mm;line-height:1.6"><div class=d style="font-size:8mm;line-height:1.1;margin:1mm 0 2mm">{PHONE}</div>
WhatsApp / Viber στο ίδιο νούμερο<br>Σταθερό {LAND}<br>{MAIL}<br><b>{WEB}</b><br><span style="opacity:.8">{ADDR}</span></div>'''

# Outside: [inner flap 94 | back 100 | cover 103]
flap = panel(94, f'''{eb('Πώς δουλεύουμε')}{h2('Από το πρώτο τηλέφωνο ως το τέλος')}
{p('Δεν χρειάζεται να ψάχνετε τεχνίτη για κάθε δουλειά. Μιλάτε μία φορά, εξηγείτε τι θέλετε και η ομάδα αναλαμβάνει.')}
''' + ''.join(f'<div style="display:grid;grid-template-columns:11mm 1fr;border-top:.4mm solid {INK};padding:3mm 0"><div class=d style="font-size:8mm;color:{COPPER};line-height:1">{n}</div><div><div class=d style="font-size:4.2mm">{t}</div><div style="font-size:3.3mm;line-height:1.45;margin-top:.8mm">{x}</div></div></div>' for n, t, x in [
 ('1', 'Επικοινωνία', 'Μας καλείτε ή μας στέλνετε φωτογραφίες του προβλήματος στο WhatsApp ή στο Viber.'),
 ('2', 'Δωρεάν εκτίμηση', 'Βλέπουμε τον χώρο από κοντά, σας εξηγούμε τι φταίει και τι χρειάζεται να γίνει.'),
 ('3', 'Η δουλειά', 'Ο Μοχάμεντ και η ομάδα τον προστατεύουν και κάνουν την εργασία βήμα βήμα. Για ηλεκτρολογικά και υδραυλικά συνεργαζόμαστε με έμπιστους επαγγελματίες.'),
 ('4', 'Παράδοση', 'Φεύγουμε αφήνοντας τον χώρο καθαρό και σας δείχνουμε το αποτέλεσμα.')]))
back = panel(100, f'''{eb('Επικοινωνία')}{h2('Δωρεάν εκτίμηση για τη δουλειά σας', PAPER)}
{p('Στείλτε μας μία φωτογραφία ή καλέστε μας. Θα συζητήσουμε τι χρειάζεται ο χώρος σας και θα κανονίσουμε να τον δούμε από κοντά.', 3.6)}
<div style="margin-top:5mm">{contact()}</div>
<div style="margin-top:auto;display:flex;gap:5mm;align-items:flex-end"><div style="background:{PAPER};padding:2.5mm;width:34mm;flex-shrink:0">{qr('https://'+WEB)}</div>
<div style="font-size:3.3mm;line-height:1.5">Σκανάρετε για να δείτε περισσότερες δουλειές, οδηγούς και απαντήσεις σε συχνές ερωτήσεις.</div></div>''', INDIGO, PAPER)
cover = panel(103, f'''{lockup(11)}
<div style="margin-top:10mm"><div class=eb style="font-size:2.9mm;letter-spacing:.07em;white-space:nowrap">Μονώσεις · Χρώματα · Ανακαινίσεις</div></div>
<div class=d style="font-size:15mm;line-height:.97;margin:3mm 0 5mm">Δουλειά που στέκει.</div>
{p('Μία ομάδα για όλη τη δουλειά του σπιτιού, σε όλη την Αττική, με 18 χρόνια εμπειρίας.', 4.2)}
<div style="margin:auto -9mm -11mm">{ph('city-view-roof-white-coating','after-1.jpg','82mm')}</div>''')
outside = f'<div class=page style="width:297mm;height:210mm;display:flex">{flap}{back}{cover}</div>'

# Inside: 3 x 99. The service photos are the ones the drawings were made from (fb-photos/illustration-refs).
REFS = ROOT.parent / 'fb-photos/illustration-refs'
def pr(name, h, pos='center 30%'):
    return f'<img src="data:image/jpeg;base64,{base64.b64encode((REFS/(name+".jpg")).read_bytes()).decode()}" style="width:100%;height:{h};object-fit:cover;object-position:{pos};display:block">'
def tile(name, label, h='38mm', pos='center 30%'):
    return f'<div>{pr(name,h,pos)}<div class=d style="font-size:3.6mm;margin-top:1.2mm">{label}</div></div>'
i1 = panel(99, f'''{eb('Ταράτσες, μπαλκόνια, υγρασία')}{h2('Στεγανώσεις που προστατεύουν το σπίτι')}
{p('Η υγρασία και η ζέστη μπαίνουν από την ταράτσα, τα μπαλκόνια και τους εξωτερικούς τοίχους. Για αυτό ξεκινάμε πάντα από το πού μπαίνει το νερό και μετά διαλέγουμε τη λύση.')}
{ba('city-view-roof-white-coating','34mm')}{cap('Ταράτσα από σκούρα σε λευκή, με στεγανωτική προστασία.')}
{p('Κάνουμε στεγανώσεις σε ταράτσες, μπαλκόνια και τοίχους: λευκά στεγανωτικά, στεγάνωση γύρω από σιφώνια και θερμοπρόσοψη.')}
{pr('insulation-0041','52mm','center 35%')}{cap('Στεγάνωση ταράτσας.')}''')
i2 = panel(99, f'''{eb('Ο χώρος μέσα στο σπίτι')}{h2('Βαφές και ανακαινίσεις')}
{p('Ξεφλουδισμένοι τοίχοι, μούχλα, λεκέδες, παλιά χρώματα: καθαρίζουμε, επισκευάζουμε τα σοβατίσματα και βάφουμε, με προστασία στα έπιπλα και στα πατώματα.')}
{ba('damp-walls-collapsed-ceiling','38mm',2)}{cap('Πεσμένο ταβάνι και υγρασία: επισκευή και βαφή.')}
{p('Αναλαμβάνουμε και ολική ανακαίνιση μπάνιου και κουζίνας, από την καθαίρεση και τα πλακάκια ως τα είδη υγιεινής και τα ντουλάπια.')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:2mm">{pr('painting-0313','52mm','center 55%')}{pr('renovations-0254','52mm','center 30%')}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:2mm;font-size:3mm;opacity:.75;margin-top:1mm"><span>Βαφή τοίχου.</span><span>Ανακαίνιση μπάνιου.</span></div>''', '#FAF8F2')
i3 = panel(99, f'''{eb('Και όλα τα υπόλοιπα')}{h2('Μικρές και μεγάλες δουλειές')}
{p('Ό,τι χρειάζεται ένα σπίτι ή ένας επαγγελματικός χώρος, από την καθαίρεση ως το τελευταίο μερεμέτι.')}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:3mm 2.5mm">
{tile('demolition-0229','Καθαιρέσεις','40mm')}{tile('paving-0006','Τσιμεντοστρώσεις','40mm','center 45%')}
{tile('wood-0469','Ξύλινα','40mm','center 35%')}{tile('repairs-0230','Μερεμέτια','40mm')}</div>
<div style="height:3mm"></div>{p('Καθαιρέσεις τοίχων, τσιμεντοστρώσεις, πεζοδρόμια και πλακοστρώσεις, αποκατάσταση ξύλινων παντζουριών, πορτών και πέργκολων, και μικρές επισκευές όπως ρωγμές, σοβάδες και αρμοί.', 3.3)}
<div style="margin-top:auto;background:{INDIGO};color:{PAPER};padding:4mm 5mm"><div style="font-size:3.2mm;opacity:.85">Έχετε μια δουλειά στο μυαλό σας;</div><div class=d style="font-size:6.2mm;margin-top:1mm">{PHONE}</div></div>''')
inside = f'<div class=page style="width:297mm;height:210mm;display:flex">{i1}{i2}{i3}</div>'
bro = doc(297, 210, outside + inside)

for name, html in {'business-card': card, 'poster-a4': a4, 'sticker-a8': a8, 'brochure-trifold': bro}.items():
    f = OUT / f'{name}.html'; f.write_text(html, encoding='utf-8')
    subprocess.run(['chromium', '--headless', '--no-sandbox', '--disable-gpu', '--no-pdf-header-footer', f'--print-to-pdf={OUT / (name + ".pdf")}', f'file://{f}'], check=True, capture_output=True)
    subprocess.run(['chromium', '--headless', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', f'--screenshot={OUT / (name + ".png")}', '--window-size=1200,1250', f'file://{f}'], capture_output=True)
    print('ok', name)
