# PROMPTS.md

## Prompt Variations Tested (Clothing)

### Variation 1 — Minimal

**Example Input:**
- Product: Cotton T‑Shirt  
- Category: Clothing  
- Price: ₹499  
- Notes: Soft fabric, casual wear, breathable  
- Tone: Friendly  

**Sample Output (Gemini):**
"Here's a product description: A soft cotton T‑shirt perfect for casual wear, keeping you comfortable and cool."

**Issues Observed:**
- Inconsistent length (sometimes one line, sometimes long).  
- Adds preamble (“Here’s a product description”).  
- Invented details like “made in Italy” when not provided.

---

### Variation 2 — Structured, No Constraints

**Example Input:**
- Product: Linen Kurta  
- Category: Clothing  
- Price: ₹1,200  
- Notes: Lightweight, festive wear, easy to style  
- Tone: Persuasive  

**Sample Output (Gemini):**
"Celebrate in comfort with this lightweight linen kurta, perfect for festive occasions. Priced at ₹1,200, it’s easy to style and effortlessly elegant."

**Issues Observed:**
- Better structure, but sometimes outputs bullet points or bold text.  
- Still invents details like “hand‑embroidered” without notes.  

---

### Variation 3 — Final (Implemented)

**Example Input:**
- Product: Handwoven Shawl  
- Category: Clothing  
- Price: ₹2,000  
- Notes: Warm, elegant, versatile  
- Tone: Friendly → “warm, conversational, like a shopkeeper who knows the product well”  

**Sample Output (Gemini):**
"This handwoven shawl brings warmth and elegance to your wardrobe. Its versatile design makes it perfect for layering during chilly evenings or adding a touch of sophistication to festive outfits."

**Why This One Won:**
- Clear word-count band avoids too short/too long outputs.  
- Explicit ban on invented facts prevents liability issues.  
- “Output ONLY description” rule removes need for backend cleanup.  
- Tone expansion (`toneGuide`) yields more consistent style.

---

## System Prompt / Role Used
- Role framing: *“You write short product descriptions for small and rural businesses selling online.”*  
- Tone expansion: single-word tone mapped to fuller guidance (e.g., `friendly` → “warm, conversational, like a shopkeeper who knows the product well”).  
- Guardrails: no markdown, no invented facts, no preamble.
