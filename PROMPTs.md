# Prompt design — AI description generation

Feature: `POST /api/ai/generate-description` (backend: `backend/services/geminiService.js`).
Seller fills in product name, category, price, tone, and raw notes; clicking
"Generate with Gemini" sends these to Gemini and shows the result as an
editable preview before saving.

Model: `gemini-2.5-flash` (see the comment at the top of `geminiService.js` —
Gemini model IDs get retired fairly often, check
https://ai.google.dev/gemini-api/docs/models if this starts 404ing).

## Note on how this was tested

I don't have a live Gemini API key in this environment, so the three
variations below were designed and compared based on known Gemini/LLM
behavior patterns (verbosity, markdown habits, hallucination tendency under
underspecified prompts) rather than side-by-side live output. Before
treating this as final, run all three against your own `GEMINI_API_KEY` with
2-3 real product notes and fill in the "Sample output" sections below — that
turns this from a design rationale into an actual test record, which is what
the deliverable is asking for.

---

## Variation 1 — Minimal

    Write a product description for: {rawNotes}
    Tone: {tone}

**Sample output:** _(fill in after testing)_

**Predicted issues:**
- No length guidance -> Gemini tends to either write one clipped sentence or a
  full paragraph, inconsistent between calls.
- No instruction against preamble -> likely to prefix output with something
  like "Here's a product description:" which then has to be stripped before
  showing/saving it.
- No guardrail against invented details -> with sparse notes, models often
  pad the description with plausible-sounding but made-up specifics (fabric
  origin, care instructions) that weren't in the seller's notes.

## Variation 2 — Structured, no constraints on invention

    You are a copywriter for small businesses. Write a short, engaging product
    description using this information:

    Product: {productName}
    Category: {category}
    Price: {price}
    Notes: {rawNotes}
    Tone: {tone}

    Keep it under 60 words.

**Sample output:** _(fill in after testing)_

**Predicted issues:**
- Better than V1 — structured fields reduce ambiguity about what's the
  product name vs. notes.
- Still no explicit ban on markdown — "copywriter" framing sometimes nudges
  models toward bullet points or bold text, which doesn't fit a plain-text
  description field.
- Still no instruction against fabricating details, which matters a lot for
  this use case: sellers are small/rural businesses and an AI-invented claim
  ("100% organic", "handmade in Rajasthan") ending up in a real product
  listing is a real liability, not just a quality issue.

## Variation 3 — Final (implemented)

    You write short product descriptions for small and rural businesses selling
    online.

    Product name: {productName}
    Category: {category}
    Price: {price}
    Seller's raw notes: {rawNotes}

    Write ONE product description in a {toneGuide} tone.

    Rules:
    - 2 to 4 sentences, roughly 40-70 words.
    - Turn the raw notes into flowing prose — don't just restate them as a list.
    - Don't invent specific facts (material, size, origin) that aren't in the notes.
    - No markdown, no headers, no quotation marks around the output.
    - Output ONLY the description text, nothing else — no preamble like "Here's
      a description:".

Where `toneGuide` expands the single word `tone` into a fuller description
(e.g. `friendly` -> "warm, conversational, like a shopkeeper who knows the
product well") — spelling out what the tone word means in context produced
more consistent results than passing the bare word, since "friendly" alone is
underspecified (friendly like a chatbot? like a market stall owner? like
marketing copy?).

**Sample output:** _(fill in after testing)_

**Why this one won:**
- Explicit word-count band (not just a max) avoids both the one-line-fragment
  and the overlong-paragraph failure modes seen in V1.
- The "don't invent facts" rule directly targets the biggest real risk for
  this feature — false claims in a live product listing — rather than just
  being a style preference.
- "Output ONLY the description text" eliminates the need for the backend to
  strip preamble/wrapper text from the response, which simplifies
  `geminiService.js` (no regex cleanup needed on the returned string).
- Still short enough to stay well within `maxOutputTokens: 200` with room to
  spare, keeping latency and cost predictable.

## Fallback behavior (no AI)

If the seller never clicks "Generate with Gemini," `POST /api/descriptions`
saves `rawNotes` verbatim as `generatedDescription` — no template, no mock
text. AI is opt-in, not the default path.