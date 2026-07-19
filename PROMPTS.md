# PROMPTS.md

## Prompt Variations Tested

### Variation 1 — Minimal

**Example Input:**
- Product: Handmade Clay Mug  
- Category: Kitchenware  
- Price: ₹350  
- Notes: Durable, rustic look, keeps drinks warm  
- Tone: Friendly  

**Sample Output (Gemini):**
"Here's a product description: A rustic clay mug that keeps your drinks warm and adds charm to your kitchen."

**Issues Observed:**
- Inconsistent length (sometimes one line, sometimes long).  
- Adds preamble (“Here’s a product description”).  
- Invented details like “crafted in Rajasthan” when not provided.

---

### Variation 2 — Structured, No Constraints

**Example Input:**
- Product: Organic Honey Jar  
- Category: Food  
- Price: ₹250  
- Notes: Pure, golden, harvested locally  
- Tone: Persuasive  

**Sample Output (Gemini):**
"Enjoy the rich taste of pure, golden organic honey harvested locally. At just ₹250, this jar brings natural sweetness to your table."

**Issues Observed:**
- Better structure, but sometimes outputs bullet points or bold text.  
- Still invents details like “100% certified organic” without notes.  

---

### Variation 3 — Final (Implemented)

**Example Input:**
- Product: Bamboo Basket  
- Category: Home Decor  
- Price: ₹500  
- Notes: Handwoven, lightweight, eco-friendly  
- Tone: Friendly → “warm, conversational, like a shopkeeper who knows the product well”  

**Sample Output (Gemini):**
"This handwoven bamboo basket is lightweight, eco-friendly, and perfect for adding a natural touch to your home. Its simple design makes it both practical and charming, ideal for everyday use or as a rustic decor piece."

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
