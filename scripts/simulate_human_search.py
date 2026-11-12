import asyncio
import json
import random
import urllib.request
import websockets

QUERIES = [
    # 1. Ελαιοχρωματισμοί & Βάψιμο
    "ελαιοχρωματισμοι τιμες με υλικα αθηνα",
    # 2. Ανακαινίσεις & Μπάνιο
    "ανακαινιση μπανιου κοστος τιμες",
    # 3. Μερεμέτια & Μικροεπισκευές
    "μαστορας για μερεμετια αθηνα",
    # 4. Γκρέμισμα & Καθαιρέσεις
    "γκρεμισμα τοιχου κοστος",
    # 5. Ξύλινα Κουφώματα & Πέργκολες
    "συντηρηση ξυλινων κουφωματων τιμες",
    # 6. Πλακοστρώσεις & Πεζοδρόμια
    "πλακοστρωσεις αυλης κοστος",
    # 7. Μονώσεις & Στεγανοποίηση
    "ποσο κοστιζει η μονωση ταρατσας ανα τετραγωνικο",
]

async def cdp_send(ws, method, params=None, msg_id=[1]):
    mid = msg_id[0]
    msg_id[0] += 1
    payload = {"id": mid, "method": method, "params": params or {}}
    await ws.send(json.dumps(payload))
    while True:
        res_raw = await ws.recv()
        res = json.loads(res_raw)
        if res.get("id") == mid:
            return res.get("result", {})

async def human_type(ws, text):
    """Types characters one by one with realistic human jitter."""
    for char in text:
        await cdp_send(ws, "Input.dispatchKeyEvent", {
            "type": "keyDown",
            "text": char,
            "unmodifiedText": char,
        })
        await cdp_send(ws, "Input.dispatchKeyEvent", {
            "type": "keyUp",
            "text": char,
            "unmodifiedText": char,
        })
        await asyncio.sleep(random.uniform(0.06, 0.16))

async def smooth_scroll(ws, total_pixels=1200, step=150):
    """Smooth human scroll down."""
    scrolled = 0
    while scrolled < total_pixels:
        await cdp_send(ws, "Runtime.evaluate", {
            "expression": f"window.scrollBy({{top: {step}, behavior: 'smooth'}})"
        })
        scrolled += step
        await asyncio.sleep(random.uniform(0.6, 1.2))

async def expand_paa(ws):
    """Finds and clicks People Also Ask question accordions."""
    expr = """
    (function() {
        // Find Google People Also Ask headers or accordions
        const accordions = Array.from(document.querySelectorAll('div[jsname="jE2WP"] div[role="button"], div[aria-expanded="false"], div[data-q]'));
        const clickable = accordions.filter(el => el.innerText && el.innerText.length > 10 && el.offsetHeight > 0);
        return clickable.length;
    })()
    """
    res = await cdp_send(ws, "Runtime.evaluate", {"expression": expr, "returnByValue": True})
    count = res.get("value", 0)
    print(f"  [PAA] Found {count} candidate question accordions.")

    # Click first 2 accordions with human pauses
    for i in range(min(2, count)):
        click_expr = f"""
        (function() {{
            const accordions = Array.from(document.querySelectorAll('div[jsname="jE2WP"] div[role="button"], div[aria-expanded="false"], div[data-q]'));
            const clickable = accordions.filter(el => el.innerText && el.innerText.length > 10 && el.offsetHeight > 0);
            if (clickable[{i}]) {{
                clickable[{i}].scrollIntoView({{behavior: 'smooth', block: 'center'}});
                clickable[{i}].click();
                return clickable[{i}].innerText.split('\\n')[0];
            }}
            return null;
        }})()
        """
        c_res = await cdp_send(ws, "Runtime.evaluate", {"expression": click_expr, "returnByValue": True})
        q_text = c_res.get("value")
        if q_text:
            print(f"  [PAA Clicked] {q_text}")
        await asyncio.sleep(random.uniform(2.0, 3.0))

async def main():
    print("=== Antigravity Human Browser Simulation ===")
    # 1. Connect to Chrome CDP
    resp = urllib.request.urlopen("http://127.0.0.1:9222/json")
    tabs = json.loads(resp.read().decode())
    target_tab = next((t for t in tabs if t.get("type") == "page"), tabs[0])
    ws_url = target_tab["webSocketDebuggerUrl"]
    print(f"Connected to Chrome visible tab: {target_tab.get('title')}")

    async with websockets.connect(ws_url, max_size=10_000_000) as ws:
        await cdp_send(ws, "Page.enable")
        await cdp_send(ws, "DOM.enable")
        await cdp_send(ws, "Runtime.enable")

        for query in QUERIES:
            print(f"\n>>> Searching: '{query}'")
            # Navigate to google.gr
            await cdp_send(ws, "Page.navigate", {"url": "https://www.google.gr?hl=el"})
            await asyncio.sleep(2.0)

            # Focus search box
            focus_expr = """
            (function() {
                const el = document.querySelector('textarea[name="q"], input[name="q"]');
                if (el) {
                    el.focus();
                    el.value = '';
                    return true;
                }
                return false;
            })()
            """
            await cdp_send(ws, "Runtime.evaluate", {"expression": focus_expr})
            await asyncio.sleep(0.5)

            # Type like human
            await human_type(ws, query)
            await asyncio.sleep(1.0)

            # Press Enter
            await cdp_send(ws, "Input.dispatchKeyEvent", {"type": "keyDown", "key": "Enter", "code": "Enter"})
            await cdp_send(ws, "Input.dispatchKeyEvent", {"type": "keyUp", "key": "Enter", "code": "Enter"})
            print("  [Loaded Search Results]")
            await asyncio.sleep(3.0)

            # Smooth human reading scroll
            print("  [Simulating Reading & Scroll]")
            await smooth_scroll(ws, total_pixels=800, step=160)

            # Click People Also Ask
            await expand_paa(ws)

            # Scroll to bottom related searches
            await smooth_scroll(ws, total_pixels=1000, step=200)
            await asyncio.sleep(2.5)

    print("\n=== Simulation Complete ===")

if __name__ == "__main__":
    asyncio.run(main())
