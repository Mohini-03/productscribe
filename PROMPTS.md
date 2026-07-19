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
- Tone: Festive  

**Sample Output (Gemini):**
"Celebrate in comfort with this lightweight linen kurta, perfect for festive occasions. Priced at ₹1,200, it’s easy to style and effortlessly elegant."

**Issues Observed:**
- Better structure, but sometimes outputs bullet points or bold text.  
- Still invents details like “hand‑embroidered” without notes.  

---

### Variation 3 — Final (Implemented)

---

## Tone Guide Expansion

- **Friendly** → “Warm, conversational, like a shopkeeper who knows the product well.”  
- **Professional** → “Clear, precise, and informative, like a catalog entry written for business buyers.”  
- **Festive** → “Joyful, celebratory, highlighting how the product adds charm to special occasions.”

---

## Clothing Examples

**Friendly Tone Input:**
- Product: Cotton Summer Dress  
- Category: Clothing  
- Price: ₹899  
- Notes: Lightweight, floral print, easy to wear  

**Sample Output (Gemini):**
"This lightweight cotton summer dress with a cheerful floral print is perfect for everyday comfort. Easy to wear and effortlessly stylish, it brings a touch of charm to your wardrobe."

---

**Professional Tone Input:**
- Product: Formal Blazer  
- Category: Clothing  
- Price: ₹2,499  
- Notes: Tailored fit, versatile, durable fabric  

**Sample Output (Gemini):**
"A tailored formal blazer designed with durable fabric for long-lasting wear. Its versatile style makes it suitable for both office meetings and formal events, offering a polished look at ₹2,499."

---

**Festive Tone Input:**
- Product: Silk Saree  
- Category: Clothing  
- Price: ₹3,999  
- Notes: Elegant drape, vibrant colors, perfect for celebrations  

**Sample Output (Gemini):**
"Celebrate in style with this elegant silk saree, featuring vibrant colors and a graceful drape. Perfect for weddings and festive gatherings, it adds sophistication and joy to every occasion."

---

## Why Variation 3 Won
- Clear word-count band avoids too short/too long outputs.  
- Explicit ban on invented facts prevents liability issues.  
- “Output ONLY description” rule removes need for backend cleanup.  
- Tone expansion (`toneGuide`) yields more consistent style.

---

## System Prompt / Role Used
- Role framing: *“You write short product descriptions for small and rural businesses selling clothing online.”*  
- Tone expansion: single-word tone mapped to fuller guidance (friendly, professional, festive).  
- Guardrails: no markdown, no invented facts, no preamble.
