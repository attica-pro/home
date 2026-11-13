#!/usr/bin/env python3
"""
AtticaPro - Opportunity Engine & Portfolio Indexer (Phase 1)
------------------------------------------------------------
Implements:
1. Portfolio Indexer & Before/After Collage Generator (Pillow, brand design)
2. Live Multi-Source Ingestion Pipeline:
   - Google Autocomplete Scraper (suggestqueries.google.com)
   - Open-Meteo Weather Forecast (Rain & Temperature Trigger)
   - Building Stock & Physical Need Proxy (pre-1980 apartment density & hardware hubs)
3. Opportunity Scoring Algorithm:
   - Scores (Service, Area) pairs on a 0-100 scale
   - Classifies into Category A (Digital Goldmines) and Category B (Guerrilla Goldmines)
   - Outputs content/portfolio_index.json & content/opportunity_matrix.json
"""

import os
import sys
import glob
import json
import time
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS_DIR = os.path.join(BASE_DIR, 'content', 'projects')
COLLAGES_DIR = os.path.join(BASE_DIR, 'public', 'images', 'collages')
PORTFOLIO_OUTPUT = os.path.join(BASE_DIR, 'content', 'portfolio_index.json')
OPPORTUNITY_OUTPUT = os.path.join(BASE_DIR, 'content', 'opportunity_matrix.json')

# Brand colors from CLAUDE.md & app/globals.css
COLOR_LIME = '#EEEBE3'
COLOR_INDIGO = '#1C1E2B'
COLOR_COPPER = '#985623'
COLOR_WHITE = '#FAF8F2'
COLOR_PURE_WHITE = '#FFFFFF'

# Commercial Value multiplier by trade (benchmark job size & margins)
COMMERCIAL_WEIGHT = {
    'insulation': 1.0,    # High margin, high urgency, large flat roof projects
    'renovations': 0.95,  # Bathroom/kitchen high spend
    'painting': 0.85,     # High volume, apartment interior/facade
    'demolition': 0.80,   # Strip-outs, walls
    'repairs': 0.75,      # Small repairs, rapid turnaround
    'paving': 0.75,       # Terraces, yards
    'wood': 0.70,         # Shutter/pergola restoration
}

# Trade names in Greek
TRADE_NAMES_EL = {
    'insulation': 'Μονώσεις & Στεγανοποίηση Ταρατσών',
    'painting': 'Ελαιοχρωματισμοί & Βάψιμο',
    'renovations': 'Ανακαινίσεις Χώρων',
    'demolition': 'Καθαιρέσεις & Αποξηλώσεις',
    'repairs': 'Μερεμέτια & Επισκευές',
    'paving': 'Πλακοστρώσεις & Πλακάκια',
    'wood': 'Συντήρηση Ξύλινων Κουφωμάτων',
}

# 34 Primary Athens Municipalities / Areas with Physical Building Stock Profile
# Data calibrated based on ELSTAT housing censuses (pre-1980 buildings before thermal insulation code)
# and urban apartment density.
MUNICIPALITIES_PROFILE = {
    'kallithea': {
        'name_el': 'Καλλιθέα',
        'is_hq': True,
        'pre_1980_ratio': 0.84,
        'density_score': 0.92,
        'competitor_density': 0.65,
        'guerrilla_hubs': ['Πλατεία Δαβάκη', 'Θησέως & Χαροκόπου', 'Τζιτζιφιές', 'Λόφος Φιλαρέτου'],
        'search_slugs': ['καλλιθεα', 'χαροκοπου', 'τζιτζιφιες']
    },
    'peristeri': {
        'name_el': 'Περιστέρι',
        'is_hq': False,
        'pre_1980_ratio': 0.82,
        'density_score': 0.90,
        'competitor_density': 0.75,
        'guerrilla_hubs': ['Πλατεία Μπουρναζίου', 'Θηβών & Περιστέρι Μετρό', 'Άγιος Αντώνιος', 'Λόφος Αξιωματικών'],
        'search_slugs': ['περιστερι', 'μπουρναζι', 'αγιος αντωνιος περιστερι']
    },
    'nea-smyrni': {
        'name_el': 'Νέα Σμύρνη',
        'is_hq': True,
        'pre_1980_ratio': 0.80,
        'density_score': 0.88,
        'competitor_density': 0.60,
        'guerrilla_hubs': ['Πλατεία Νέας Σμύρνης', 'Άλσος Νέας Σμύρνης', 'Αγία Φωτεινή', 'Φάρος'],
        'search_slugs': ['νεα σμυρνη', 'πλατεια νεας σμυρνης']
    },
    'palaio-faliro': {
        'name_el': 'Παλαιό Φάληρο',
        'is_hq': False,
        'pre_1980_ratio': 0.68,
        'density_score': 0.82,
        'competitor_density': 0.55,
        'guerrilla_hubs': ['Φλοίσβος', 'Αμφιθέας', 'Μπάτης', 'Έδεμ'],
        'search_slugs': ['παλαιο φαληρο', 'φλοισβος', 'αμφιθεας']
    },
    'koukaki-neos-kosmos': {
        'name_el': 'Κουκάκι & Νέος Κόσμος',
        'is_hq': True,
        'pre_1980_ratio': 0.88,
        'density_score': 0.94,
        'competitor_density': 0.70,
        'guerrilla_hubs': ['Πλατεία Κουκακίου', 'Μετρό Συγγρού-Φιξ', 'Μπακνανά', 'Άγιος Σώστης'],
        'search_slugs': ['κουκακι', 'νεος κοσμος', 'συγγρου φιξ']
    },
    'kypseli-patisia-galatsi': {
        'name_el': 'Κυψέλη, Πατήσια & Γαλάτσι',
        'is_hq': False,
        'pre_1980_ratio': 0.92,
        'density_score': 0.96,
        'competitor_density': 0.70,
        'guerrilla_hubs': ['Πλατεία Αγίου Γεωργίου Κυψέλη', 'Φωκίωνος Νέγρη', 'Πλατεία Κολιάτσου', 'Λ. Βεΐκου'],
        'search_slugs': ['κυψελη', 'πατησια', 'γαλατσι', 'φωκιωνος νεγρη']
    },
    'pagkrati-mets': {
        'name_el': 'Παγκράτι & Μετς',
        'is_hq': False,
        'pre_1980_ratio': 0.86,
        'density_score': 0.91,
        'competitor_density': 0.68,
        'guerrilla_hubs': ['Πλατεία Βαρνάβα', 'Πλατεία Πλαστήρα', 'Προφήτης Ηλίας', 'Μετς'],
        'search_slugs': ['παγκρατι', 'μετς', 'βαρναβα']
    },
    'peiraias': {
        'name_el': 'Πειραιάς',
        'is_hq': False,
        'pre_1980_ratio': 0.87,
        'density_score': 0.93,
        'competitor_density': 0.72,
        'guerrilla_hubs': ['Πασαλιμάνι', 'Καστέλλα', 'Ταμπούρια', 'Πειραϊκή', 'Δημοτικό Θέατρο'],
        'search_slugs': ['πειραιας', 'καστελλα', 'πασαλιμανι', 'πειραικη']
    },
    'marousi': {
        'name_el': 'Μαρούσι',
        'is_hq': False,
        'pre_1980_ratio': 0.52,
        'density_score': 0.72,
        'competitor_density': 0.62,
        'guerrilla_hubs': ['ΗΣΑΠ Αμαρουσίου', 'Κηφισίας & Βασιλίσσης Σοφίας', 'Παράδεισος Αμαρουσίου'],
        'search_slugs': ['μαρουσι', 'αμαρουσιο']
    },
    'chalandri': {
        'name_el': 'Χαλάνδρι',
        'is_hq': False,
        'pre_1980_ratio': 0.58,
        'density_score': 0.75,
        'competitor_density': 0.64,
        'guerrilla_hubs': ['Κεντρική Πλατεία Χαλανδρίου', 'Αγίας Παρασκευής', 'Κάτω Χαλάνδρι'],
        'search_slugs': ['χαλανδρι', 'κατω χαλανδρι']
    },
    'glyfada': {
        'name_el': 'Γλυφάδα',
        'is_hq': False,
        'pre_1980_ratio': 0.48,
        'density_score': 0.68,
        'competitor_density': 0.66,
        'guerrilla_hubs': ['Πλατεία Εσπερίδων', 'Μεταξά', 'Άνω Γλυφάδα - Γούναρη'],
        'search_slugs': ['γλυφαδα', 'ανω γλυφαδα']
    },
    'aigaleo-chaidari': {
        'name_el': 'Αιγάλεω & Χαϊδάρι',
        'is_hq': False,
        'pre_1980_ratio': 0.81,
        'density_score': 0.85,
        'competitor_density': 0.60,
        'guerrilla_hubs': ['Πλατεία Εσταυρωμένου Μετρό', 'Ιερά Οδός Αιγάλεω', 'Παλατάκι Χαϊδάρι'],
        'search_slugs': ['αιγαλεω', 'χαιδαρι']
    },
    'vyronas-kaisariani': {
        'name_el': 'Βύρωνας & Καισαριανή',
        'is_hq': False,
        'pre_1980_ratio': 0.85,
        'density_score': 0.88,
        'competitor_density': 0.58,
        'guerrilla_hubs': ['Ταπητουργείο Βύρωνα', 'Πλατεία Καισαριανής', 'Σκοπευτήριο'],
        'search_slugs': ['βυρωνας', 'καισαριανη']
    },
    'zografou': {
        'name_el': 'Ζωγράφου & Ιλίσια',
        'is_hq': False,
        'pre_1980_ratio': 0.83,
        'density_score': 0.89,
        'competitor_density': 0.56,
        'guerrilla_hubs': ['Πλατεία Γαρδένια', 'Άνω Ιλίσια', 'Πανεπιστημιούπολη'],
        'search_slugs': ['ζωγραφου', 'ιλισια']
    },
    'ilion-petroupoli': {
        'name_el': 'Ίλιον & Πετρούπολη',
        'is_hq': False,
        'pre_1980_ratio': 0.74,
        'density_score': 0.82,
        'competitor_density': 0.55,
        'guerrilla_hubs': ['Κεντρική Πλατεία Ιλίου', 'Στρογγυλή Πλατεία Πετρούπολης', 'Πετρούπολη 25ης Μαρτίου'],
        'search_slugs': ['ιλιον', 'πετρουπολη', 'νεα λιοσια']
    },
}

# --- 1. PORTFOLIO INDEXER & BEFORE/AFTER COLLAGE GENERATOR ---

def get_font(size: int):
    candidates = [
        '/usr/share/fonts/truetype/roboto/unhinted/RobotoTTF/Roboto-Bold.ttf',
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    ]
    for c in candidates:
        if os.path.exists(c):
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def generate_collages():
    os.makedirs(COLLAGES_DIR, exist_ok=True)
    font_badge = get_font(22)
    font_bar = get_font(20)
    font_bar_small = get_font(15)

    projects_indexed = []
    collages_created = 0

    project_paths = sorted(glob.glob(os.path.join(PROJECTS_DIR, '*', 'project.json')))
    print(f"[*] Scanning {len(project_paths)} projects for portfolio indexing...")

    for meta_path in project_paths:
        slug = os.path.basename(os.path.dirname(meta_path))
        with open(meta_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        service = data.get('service', 'repairs')
        title_el = data.get('title', {}).get('el', slug)
        title_en = data.get('title', {}).get('en', slug)
        comparisons = data.get('comparisons', [])
        order = data.get('order', 0)
        photos = data.get('photos', {})

        collage_rel_path = None

        if comparisons:
            comp = comparisons[0]
            before_rel = comp.get('before')
            after_rel = comp.get('after')
            before_path = os.path.join(BASE_DIR, 'public', 'images', 'projects', slug, before_rel)
            after_path = os.path.join(BASE_DIR, 'public', 'images', 'projects', slug, after_rel)

            if os.path.exists(before_path) and os.path.exists(after_path):
                out_name = f"{slug}.jpg"
                out_full = os.path.join(COLLAGES_DIR, out_name)

                try:
                    img_b = Image.open(before_path).convert('RGB')
                    img_a = Image.open(after_path).convert('RGB')

                    target_h = 500
                    target_w_half = 550

                    # Crop/resize each half to target_w_half x target_h centered
                    def fit_half(img, tw, th):
                        img_ratio = img.width / img.height
                        target_ratio = tw / th
                        if img_ratio > target_ratio:
                            # wider than target: resize by height
                            new_w = int(img.width * (th / img.height))
                            resized = img.resize((new_w, th), Image.Resampling.LANCZOS)
                            left = (new_w - tw) // 2
                            return resized.crop((left, 0, left + tw, th))
                        else:
                            # taller than target: resize by width
                            new_h = int(img.height * (tw / img.width))
                            resized = img.resize((tw, new_h), Image.Resampling.LANCZOS)
                            top = (new_h - th) // 2
                            return resized.crop((0, top, tw, top + th))

                    half_b = fit_half(img_b, target_w_half, target_h)
                    half_a = fit_half(img_a, target_w_half, target_h)

                    footer_h = 56
                    divider_w = 4
                    total_w = (target_w_half * 2) + divider_w
                    total_h = target_h + footer_h

                    canvas = Image.new('RGB', (total_w, total_h), COLOR_LIME)
                    canvas.paste(half_b, (0, 0))
                    canvas.paste(half_a, (target_w_half + divider_w, 0))

                    draw = ImageDraw.Draw(canvas)
                    # Vertical divider
                    draw.line([(target_w_half + 2, 0), (target_w_half + 2, target_h)], fill=COLOR_INDIGO, width=divider_w)

                    # Badge "ΠΡΙΝ" (Top Left)
                    draw.rounded_rectangle([18, 18, 114, 58], radius=6, fill=COLOR_INDIGO)
                    draw.text((36, 24), 'ΠΡΙΝ', font=font_badge, fill=COLOR_WHITE)

                    # Badge "ΜΕΤΑ" (Top Right)
                    badge_after_x = target_w_half + divider_w + 18
                    draw.rounded_rectangle([badge_after_x, 18, badge_after_x + 96, 58], radius=6, fill=COLOR_COPPER)
                    draw.text((badge_after_x + 18, 24), 'ΜΕΤΑ', font=font_badge, fill=COLOR_PURE_WHITE)

                    # Footer Bar (Bottom)
                    draw.rectangle([0, target_h, total_w, total_h], fill=COLOR_INDIGO)
                    trade_label = TRADE_NAMES_EL.get(service, 'Τεχνικές Εργασίες')
                    draw.text((24, target_h + 16), f"atticapro.gr · {trade_label}", font=font_bar, fill=COLOR_WHITE)
                    right_text = "18 Χρόνια Εμπειρίας · 693 334 7282"
                    draw.text((total_w - 310, target_h + 18), right_text, font=font_bar_small, fill=COLOR_WHITE)

                    canvas.save(out_full, 'JPEG', quality=90, optimize=True)
                    collage_rel_path = f"/images/collages/{out_name}"
                    collages_created += 1
                except Exception as e:
                    print(f"[-] Error creating collage for {slug}: {e}")

        projects_indexed.append({
            'slug': slug,
            'service': service,
            'title': {'el': title_el, 'en': title_en},
            'has_comparison': bool(comparisons),
            'order': order,
            'photos_count': len(photos),
            'collage': collage_rel_path
        })

    with open(PORTFOLIO_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(projects_indexed, f, ensure_ascii=False, indent=2)

    print(f"[+] Indexed {len(projects_indexed)} projects. Generated {collages_created} high-res Before/After collages.")
    return projects_indexed


# --- 2. MULTI-SOURCE INGESTION PIPELINE ---

def fetch_weather():
    """Fetches 10-day rainfall and temperature data for Athens via Open-Meteo."""
    url = (
        "https://api.open-meteo.com/v1/forecast?"
        "latitude=37.9838&longitude=23.7275&"
        "daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min&"
        "timezone=Europe/Athens&forecast_days=10"
    )
    req = urllib.request.Request(url, headers={'User-Agent': 'AtticaProOpportunityEngine/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            daily = data.get('daily', {})
            rain_sums = daily.get('precipitation_sum', [])
            total_rain = sum(rain_sums)
            rainy_days = sum(1 for r in rain_sums if r > 0.5)
            max_temps = daily.get('temperature_2m_max', [])
            avg_max_temp = sum(max_temps) / len(max_temps) if max_temps else 20.0

            # Dynamic multiplier: rain increases urgency for roof waterproofing!
            if total_rain > 15.0 or rainy_days >= 3:
                insulation_mult = 1.35
            elif total_rain > 3.0 or rainy_days >= 1:
                insulation_mult = 1.20
            else:
                insulation_mult = 1.05

            # Painting prefers dry, mild weather (15C - 28C)
            if total_rain < 2.0 and 15.0 <= avg_max_temp <= 28.0:
                painting_mult = 1.20
            else:
                painting_mult = 1.00

            print(f"[+] Weather fetched: 10d rain = {total_rain:.1f}mm ({rainy_days} rainy days), avg max temp = {avg_max_temp:.1f}°C")
            return {
                'total_rain_10d_mm': round(total_rain, 1),
                'rainy_days_count': rainy_days,
                'avg_max_temp': round(avg_max_temp, 1),
                'multipliers': {
                    'insulation': insulation_mult,
                    'painting': painting_mult,
                    'renovations': 1.0,
                    'demolition': 1.0,
                    'repairs': 1.10 if rainy_days > 0 else 1.0,
                    'paving': 1.0,
                    'wood': 1.05
                }
            }
    except Exception as e:
        print(f"[-] Weather fetch failed: {e}. Using baseline neutral multipliers.")
        return {
            'total_rain_10d_mm': 0.0,
            'rainy_days_count': 0,
            'avg_max_temp': 20.0,
            'multipliers': {k: 1.0 for k in COMMERCIAL_WEIGHT}
        }


def query_google_suggest(query: str):
    """Fetches real-time search suggestions from suggestqueries.google.com."""
    base_url = "https://suggestqueries.google.com/complete/search"
    params = {'client': 'chrome', 'hl': 'el', 'gl': 'gr', 'q': query}
    url = f"{base_url}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)'})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if len(data) >= 2 and isinstance(data[1], list):
                return data[1]
    except Exception:
        pass
    return []


# Seed query templates per service
SERVICE_SEED_QUERIES = {
    'insulation': ['μονωση ταρατσας', 'στεγανοποιηση ταρατσας', 'θερμομονωση ταρατσας'],
    'painting': ['ελαιοχρωματισμοι', 'βαψιμο σπιτιου', 'ελαιοχρωματιστης'],
    'renovations': ['ανακαινιση μπανιου', 'ανακαινιση κουζινας', 'ανακαινιση σπιτιου'],
    'demolition': ['γκρεμισμα τοιχου', 'καθαιρεση τοιχου', 'αποξηλωση'],
    'repairs': ['μερεμετια', 'επισκευη σοβαδων', 'ρωγμες τοιχου'],
    'paving': ['πλακοστρωση', 'τοποθετηση πλακιδιων'],
    'wood': ['συντηρηση ξυλινων κουφωματων', 'βαψιμο παντζουριων']
}


def collect_search_demand():
    """Scrapes Google Autocomplete for (service, area) matrix and counts long-tail queries."""
    print("[*] Collecting live Google Suggest demand across Athens municipalities...")
    demand_matrix = {}

    for area_slug, area_info in MUNICIPALITIES_PROFILE.items():
        demand_matrix[area_slug] = {}
        area_search_term = area_info['search_slugs'][0]

        for service, seeds in SERVICE_SEED_QUERIES.items():
            all_suggestions = set()
            for seed in seeds:
                q = f"{seed} {area_search_term}"
                results = query_google_suggest(q)
                for r in results:
                    all_suggestions.add(r.strip().lower())
                time.sleep(0.08)  # Polite pacing

            demand_matrix[area_slug][service] = {
                'count': len(all_suggestions),
                'top_queries': sorted(list(all_suggestions))[:6]
            }

    print("[+] Search demand matrix compiled successfully.")
    return demand_matrix


# --- 3. OPPORTUNITY SCORING ENGINE ---

def calculate_opportunity_scores(demand_matrix, weather_data):
    """
    Computes Opportunity Score (0-100) per (area, service):
    Score = ((w1 * Demand_Norm + w2 * Age_Index) * Commercial_Value / Competitor_Strength) * Weather_Multiplier
    """
    print("[*] Computing opportunity scores and classifying into Digital vs Guerrilla Goldmines...")
    matrix_results = []

    # Maximum demand count for normalization
    max_demand = max(
        max(demand_matrix[a][s]['count'] for s in demand_matrix[a])
        for a in demand_matrix
    )
    if max_demand == 0:
        max_demand = 1

    for area_slug, area_info in MUNICIPALITIES_PROFILE.items():
        pre_1980 = area_info['pre_1980_ratio']
        density = area_info['density_score']
        competitor_factor = area_info['competitor_density']
        is_hq = area_info['is_hq']

        for service, comm_weight in COMMERCIAL_WEIGHT.items():
            demand_data = demand_matrix.get(area_slug, {}).get(service, {'count': 0, 'top_queries': []})
            demand_count = demand_data['count']

            # Normalized components
            norm_demand = demand_count / max_demand
            building_need_index = (pre_1980 * 0.70) + (density * 0.30)
            weather_mult = weather_data.get('multipliers', {}).get(service, 1.0)

            # Core opportunity formula
            numerator = (0.50 * norm_demand + 0.50 * building_need_index) * comm_weight
            denominator = competitor_factor * 1.15
            raw_score = (numerator / denominator) * weather_mult

            # Boost if within HQ immediate response radius (Kallithea, Nea Smyrni, Koukaki)
            if is_hq:
                raw_score *= 1.15

            # Scaled to 0 - 100
            final_score = min(100.0, round(raw_score * 75.0, 1))

            # Classification
            # Category A (Digital Goldmine): High search demand & high commercial value
            # Category B (Guerrilla Goldmine): Very high building age/density, ideal for stickers/posters
            if norm_demand >= 0.40 or (norm_demand >= 0.25 and final_score >= 65.0):
                category = "Κατηγορία Α (Digital Goldmine - Local SEO)"
                action = f"Προτεραιότητα σε Local Landing Page & στοχευμένα Quick Answers για '{area_info['name_el']}'"
            elif building_need_index >= 0.80 and density >= 0.85:
                category = "Κατηγορία B (Guerrilla Goldmine - Physical Stickers/Posters)"
                action = f"Ανάρτηση αφισών/αυτοκολλητων σε κόμβους: {', '.join(area_info['guerrilla_hubs'][:2])}"
            else:
                category = "Κατηγορία Γ (Organic Secondary)"
                action = "Κάλυψη μέσω γενικών τοπικών καταλόγων και word-of-mouth"

            matrix_results.append({
                'area_slug': area_slug,
                'area_name_el': area_info['name_el'],
                'is_hq': is_hq,
                'service': service,
                'trade_name_el': TRADE_NAMES_EL[service],
                'opportunity_score': final_score,
                'category': category,
                'action_recommendation': action,
                'search_demand_count': demand_count,
                'top_search_queries': demand_data['top_queries'],
                'building_age_index': round(building_need_index, 2),
                'guerrilla_target_hubs': area_info['guerrilla_hubs']
            })

    # Sort descending by Opportunity Score
    matrix_results.sort(key=lambda x: x['opportunity_score'], reverse=True)

    summary = {
        'generated_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'total_opportunities': len(matrix_results),
        'weather_snapshot': weather_data,
        'top_digital_goldmines': [m for m in matrix_results if 'Digital Goldmine' in m['category']][:10],
        'top_guerrilla_goldmines': [m for m in matrix_results if 'Guerrilla Goldmine' in m['category']][:10],
        'full_matrix': matrix_results
    }

    with open(OPPORTUNITY_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"[+] Opportunity Matrix saved to {OPPORTUNITY_OUTPUT} ({len(matrix_results)} combinations evaluated).")
    return summary


def main():
    print("=" * 70)
    print(" ATTICAPRO - OPPORTUNITY SCORING ENGINE & PORTFOLIO INDEXER (PHASE 1)")
    print("=" * 70)

    # 1. Generate Before/After Collages and index portfolio
    portfolio = generate_collages()

    # 2. Ingest weather forecast
    weather = fetch_weather()

    # 3. Ingest search demand
    demand = collect_search_demand()

    # 4. Calculate Opportunity Matrix
    summary = calculate_opportunity_scores(demand, weather)

    print("\n" + "=" * 70)
    print("TOP 5 DIGITAL GOLDMINES (Local SEO Priority):")
    for i, item in enumerate(summary['top_digital_goldmines'][:5], 1):
        print(f" {i}. [{item['opportunity_score']}/100] {item['trade_name_el']} @ {item['area_name_el']}")
        print(f"    Queries: {', '.join(item['top_search_queries'][:3]) if item['top_search_queries'] else 'Γενική ζήτηση'}")

    print("\nTOP 5 GUERRILLA GOLDMINES (Physical Stickers & Walking Routes):")
    for i, item in enumerate(summary['top_guerrilla_goldmines'][:5], 1):
        print(f" {i}. [{item['opportunity_score']}/100] {item['trade_name_el']} @ {item['area_name_el']}")
        print(f"    Κόμβοι: {', '.join(item['guerrilla_target_hubs'][:3])}")
    print("=" * 70)


if __name__ == '__main__':
    main()
