from __future__ import annotations

import os
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"), override=True)

app = FastAPI(title="Memory Book + Hindi API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Optional Claude API ---
api_key = os.getenv("ANTHROPIC_API_KEY")
client = None
if api_key and api_key != "your-api-key-here":
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
    except Exception:
        client = None


def ask_claude(prompt: str) -> str | None:
    if not client:
        return None
    try:
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}],
        )
        return message.content[0].text
    except Exception:
        return None


# --- Hinglish Fallback Data (Romanized Hindi) ---

ACTIONS = [
    "udd kar girta hai", "se takra jaata hai", "ke upar naachne lagta hai",
    "ko kha jaata hai", "mein badal jaata hai", "par sawaari karne lagta hai",
    "ko juggle karne lagta hai", "ke upar chadh jaata hai", "se pyaar kar baithta hai",
    "se kushti karne lagta hai", "se bounce ho jaata hai", "ko nigal leta hai",
    "par parachute se girta hai", "ko karate chop maarta hai", "par surfing karne lagta hai",
    "mein aag lag jaati hai aur", "ko dauda-dauda kar pakadta hai",
    "sikud kar chhup jaata hai", "laakhon mein multiply ho jaata hai",
]

ADJECTIVES = [
    "bahut bada (giant)", "nanha sa (tiny)", "chillaata hua",
    "chamakta hua (glowing)", "baalon wala (furry)", "invisible",
    "naachta hua", "phatne wala (exploding)", "indradhanushi (rainbow)",
    "ulta (upside-down)", "gaata hua", "100 feet lamba", "bachche jitna chhota",
]

PEGS = {
    1: "Taaj (Crown)", 2: "Naag (Snake)", 3: "Mor (Peacock)", 4: "Rath (Chariot)",
    5: "Laddu (Sweet)", 6: "Chhaata (Umbrella)", 7: "Kamal (Lotus)",
    8: "Phool (Flower)", 9: "Pankha (Fan)", 10: "Tota (Parrot)",
}

PHONETIC_MAP = {
    "0": "S/Z", "1": "T/D", "2": "N", "3": "M",
    "4": "R", "5": "L", "6": "Chh/Sh/Ch", "7": "K/G",
    "8": "Ph/V", "9": "P/B",
}

PHONETIC_WORDS = {
    "0": ["Saagar", "Zameen", "Saanp"],
    "1": ["Taala", "Diya", "Teer"],
    "2": ["Nadi", "Naav", "Naariyal"],
    "3": ["Moti", "Maala", "Machhli"],
    "4": ["Rassi", "Raja", "Roti"],
    "5": ["Laddu", "Lota", "Lalten"],
    "6": ["Chhaata", "Sher", "Chammach"],
    "7": ["Kamal", "Gaay", "Kela"],
    "8": ["Phool", "Veena", "Phal"],
    "9": ["Patang", "Billi", "Pankha"],
    "00": ["Seesa", "ZooZoo"],
    "01": ["Seeta", "Saadi"],
    "10": ["Tota", "Daasa"],
    "11": ["Taata", "Daada"],
    "12": ["Tona", "Deena"],
    "13": ["Tamaasha", "Dam"],
    "14": ["Taar", "Door"],
    "15": ["Til", "Daal"],
    "21": ["Naad", "Nat"],
    "22": ["Naana", "Naani"],
    "23": ["Naam", "Neem"],
    "31": ["Mitr", "Maat"],
    "32": ["Man", "Maina"],
    "41": ["Raat", "Roti"],
    "42": ["Raani", "Run"],
    "51": ["Laat", "Laddu"],
    "52": ["Leen", "Laan"],
    "61": ["Shaad", "Chhat"],
    "71": ["Kutta", "Gend"],
    "72": ["Kaan", "Gun"],
    "81": ["Phoot", "Vat"],
    "84": ["Phaar", "Var"],
    "91": ["Bat", "Pad"],
    "92": ["Ban", "Paan"],
}

ROOM_SPOTS = {
    "Mera Ghar (My Home)": [
        "Main darwaaza", "Baramda", "Baithak (living room)", "Rasoi (kitchen)",
        "Fridge", "Pooja ka kamra", "Bedroom", "Almaari",
        "Khidki", "Chhat (terrace)"
    ],
    "Mandir (Temple)": [
        "Mandir ka gate", "Jooton ki jagah", "Ghanta (bell)", "Mukhya moorti",
        "Prasaad counter", "Parikrama ka raasta", "Tulsi ka paudha", "Daan peti",
        "Baithne ki jagah", "Mandir ki seedhiyaan"
    ],
    "Bazaar (Market)": [
        "Bazaar ka entrance", "Sabzi wala", "Mithaai ki dukaan", "Kapde ki dukaan",
        "Chai ka thela", "Phal wala", "Kiraana store", "Naai ki dukaan",
        "ATM", "Parking"
    ],
    "School": [
        "School ka gate", "Assembly ground", "Apni class", "Blackboard",
        "Principal ka office", "Library", "Canteen", "Playground",
        "Science lab", "School ki chhat"
    ],
    "Railway Station": [
        "Ticket counter", "Platform 1", "Waiting room", "Chai wala",
        "Pul (overbridge)", "Bench", "Bookstall", "Paani ka nal",
        "Seedhiyaan", "Exit gate"
    ],
    "Park": [
        "Park ka gate", "Bench", "Phawwaara (fountain)", "Bada ped",
        "Jhoola (swing)", "Talaab", "Jogging track", "Phoolon ki kyaari",
        "Chabootra", "Park ka exit"
    ],
}


# --- Fallback Generators (Romanized Hinglish) ---

def fallback_link_story(items):
    lines = ["**Aapke items:**"]
    for i, item in enumerate(items, 1):
        lines.append(f"{i}. {item}")
    lines.append("\n**Aapki Memory Story:**\n")
    story_parts = []
    for i in range(len(items) - 1):
        adj = random.choice(ADJECTIVES)
        action = random.choice(ACTIONS)
        if i == 0:
            story_parts.append(f"Socho ek {adj} **{items[i]}** achanak **{items[i+1]}** {action}!")
        else:
            story_parts.append(f"Phir wo **{items[i]}** {adj} **{items[i+1]}** {action}!")
    lines.append(" ".join(story_parts))
    lines.append("\n**Tip:** Is scene ko apne dimaag mein 2-3 baar replay karo. Jitna zyada ajeeb aur vivid imagine karoge, utna achha yaad rahega!")
    return "\n".join(lines)


def fallback_peg_associations(items):
    lines = []
    for i, item in enumerate(items):
        num = i + 1
        if num > 10:
            break
        peg = PEGS[num]
        adj = random.choice(ADJECTIVES)
        action = random.choice(ACTIONS)
        peg_word = peg.split("(")[0].strip()
        lines.append(f"**Item #{num}: {item}** — Peg: {peg}\nImage: Ek {adj} **{peg_word}** {action} ek **{item}**. Ise jitna ho sake utna vivid imagine karo!\n")
    return "\n".join(lines)


def fallback_phonetic_words(number):
    lines = [f"**Number: {number}**\n", "**Consonant breakdown:**"]
    sounds = [f"{digit} = {PHONETIC_MAP.get(digit, '?')}" for digit in number]
    lines.append(", ".join(sounds))
    lines.append("\n**Possible words:**\n")
    words_found = []
    i = 0
    while i < len(number):
        pair = number[i:i+2] if i + 1 < len(number) else None
        if pair and pair in PHONETIC_WORDS:
            words_found.append((pair, random.choice(PHONETIC_WORDS[pair])))
            i += 2
        elif number[i] in PHONETIC_WORDS:
            words_found.append((number[i], random.choice(PHONETIC_WORDS[number[i]])))
            i += 1
        else:
            i += 1
    if words_found:
        phrase = " + ".join(w[1] for w in words_found)
        lines.append(f"1. **{phrase}**")
        for digits, word in words_found:
            lines.append(f"   - {digits} → {word}")
    lines.append(f"\n2. **Alag-alag pegs:** " + " - ".join(random.choice(PHONETIC_WORDS.get(d, ["?"])) for d in number))
    adj = random.choice(ADJECTIVES)
    action = random.choice(ACTIONS)
    if words_found:
        lines.append(f"\n**Best mental image:** Socho ek {adj} **{words_found[0][1]}** jo sab kuch {action}!")
    return "\n".join(lines)


def fallback_substitute_words(words):
    lines = []
    for word in words:
        syllables = []
        current = ""
        for ch in word.lower():
            current += ch
            if len(current) >= 3 and ch in "aeiou":
                syllables.append(current)
                current = ""
        if current:
            syllables.append(current)
        subs = [s.capitalize() for s in syllables]
        adj = random.choice(ADJECTIVES)
        action = random.choice(ACTIONS)
        lines.append(f"**{word}**\nSunne mein lagta hai: {'-'.join(subs)}\nSubstitute: {' + '.join(subs)}\nMental Image: Ek {adj} **{subs[0]}** {action} ek **{subs[-1] if len(subs) > 1 else subs[0]}**. Ise jitna ajeeb aur funny imagine kar sako, utna achha!\n")
    return "\n".join(lines)


def fallback_loci_walkthrough(place, items):
    spots = ROOM_SPOTS.get(place, [f"Jagah #{i+1}" for i in range(len(items))])
    lines = [f"**Aapka Memory Palace: {place}**\n", "**Walkthrough (Sair):**\n"]
    for i, item in enumerate(items):
        spot = spots[i % len(spots)]
        adj = random.choice(ADJECTIVES)
        action = random.choice(ACTIONS)
        lines.append(f"**Stop {i+1} — {spot}:** Tum {spot} par pahunchte ho aur dekhte ho ki ek {adj} **{item}** wahaan {action}! Ise ignore karna impossible hai.\n")
    lines.append("\n**Quick Recap (Jhatpat doharao):**")
    for i, item in enumerate(items):
        lines.append(f"- {spots[i % len(spots)]} → **{item}**")
    lines.append(f"\n**Tip:** Aankhein band karo aur apne {place} mein mentally walk karo. Har jagah par wo ajeeb image dekho. Jitna practice karoge, utna strong yaad rahega!")
    return "\n".join(lines)


# --- Request Models ---

class LinkStoryRequest(BaseModel):
    items: list[str]

class PegAssociateRequest(BaseModel):
    items: list[str]

class PhoneticWordsRequest(BaseModel):
    number: str

class SubstituteWordsRequest(BaseModel):
    words: list[str]

class LociWalkthroughRequest(BaseModel):
    place: str
    items: list[str]

class DefinitionMemorizeRequest(BaseModel):
    definition: str


# --- Romanized Hinglish System Instruction ---
HINGLISH_INSTRUCTION = """IMPORTANT: Respond in Romanized Hinglish — Hindi written in English/Roman script mixed with English words naturally, exactly like how Hindi speakers type on WhatsApp or chat. DO NOT use Devanagari script at all. Write everything in English letters only.

Examples of the tone and style:
- "Socho ki ek giant doodh ka carton udd kar billi par girta hai!"
- "Ab ye image apne dimaag mein fix karo"
- "Ise yaad rakhne ka sabse easy tarika ye hai ki..."
- "Pehle item ko dusre se link karo, phir dusre ko teesre se"
- "Kya scene hai! Bilkul pagal picture hai ye!"

NEVER use Devanagari (Hindi script). Always write Hindi words in English letters like: kaise, kya, achha, bahut, socho, dekho, wala, etc.

Keep the tone fun, friendly, and easy to understand for a Hindi speaker."""


# --- Endpoints ---

@app.get("/api/status")
def status():
    return {"ai_enabled": client is not None}


@app.post("/api/link-story")
def generate_link_story(req: LinkStoryRequest):
    if not req.items or len(req.items) < 2:
        raise HTTPException(400, "Kam se kam 2 items daalo")
    items_str = ", ".join(req.items)
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" by Harry Lorayne ki Link System technique sikhata hai.

User ye list yaad karna chahta hai (isi order mein): {items_str}

Ek SHORT, funny, bizarre, aur vivid story banao jo har item ko agle se connect kare. Har transition action-packed aur weird hona chahiye — jitna ajeeb utna achha yaad rahega!

Format:
1. Pehle items numbered list mein likho.
2. Phir story sunao, har item ko **bold** mein highlight karo.
3. End mein ek quick tip do ki mentally story kaise replay karein.

Concise aur entertaining rakho. Romanized Hinglish mein likho — NO Devanagari!"""
    result = ask_claude(prompt)
    return {"story": result or fallback_link_story(req.items)}


@app.post("/api/peg-associate")
def generate_peg_associations(req: PegAssociateRequest):
    if not req.items:
        raise HTTPException(400, "Kam se kam 1 item daalo")
    items_str = "\n".join(f"{i+1}. {item}" for i, item in enumerate(req.items))
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ki Peg System technique sikhata hai.

Hindi Peg List:
1=Taaj (Crown), 2=Naag (Snake), 3=Mor (Peacock), 4=Rath (Chariot), 5=Laddu (Sweet)
6=Chhaata (Umbrella), 7=Kamal (Lotus), 8=Phool (Flower), 9=Pankha (Fan), 10=Tota (Parrot)

User ye items yaad karna chahta hai position wise:
{items_str}

Har item ke liye ek bizarre, vivid, funny mental image banao jo PEG word ko item se connect kare. Image exaggerated, impossible, aur action-packed honi chahiye.

Format:
**Item #N: [item]** — Peg: [peg word]
Image: [vivid bizarre association Romanized Hinglish mein]

Har image 1-2 sentences mein. Wild aur memorable banao! NO Devanagari!"""
    result = ask_claude(prompt)
    return {"associations": result or fallback_peg_associations(req.items)}


@app.post("/api/phonetic-words")
def generate_phonetic_words(req: PhoneticWordsRequest):
    if not req.number or not req.number.isdigit():
        raise HTTPException(400, "Ek valid number daalo")
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ka Phonetic Alphabet (Hindi version) sikhata hai.

Hindi Phonetic Code (based on Hindi consonants):
0=S/Z  1=T/D  2=N  3=M  4=R  5=L  6=Chh/Sh/Ch  7=K/G  8=Ph/V  9=P/B

Vowels (A, Aa, I, Ee, U, Oo, E, Ai, O, Au) aur H, Y, W ki koi value nahi — ye fillers hain.

User ye number yaad karna chahta hai: {req.number}

1. Number ko uske consonant sounds mein todo.
2. 3 yaadgaar Hindi words (Romanized) ya short phrases banao jo is number ko encode karein.
3. Har word ke liye dikhao ki consonants kaise digits se map hote hain.
4. Sabse best word choose karo aur uska ek vivid mental image banao.

Creative bano aur words easy to picture banao! Romanized Hinglish mein likho — NO Devanagari!"""
    result = ask_claude(prompt)
    return {"words": result or fallback_phonetic_words(req.number)}


@app.post("/api/substitute-words")
def generate_substitute_words(req: SubstituteWordsRequest):
    if not req.words:
        raise HTTPException(400, "Kam se kam 1 word daalo")
    words_str = ", ".join(req.words)
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ki Substitute Word technique sikhata hai.

User ye abstract ya mushkil words yaad karna chahta hai: {words_str}

BAHUT IMPORTANT: Sirf word ka naam yaad karna kaafi nahi hai — uska ACTUAL MEANING bhi image mein encode karna hai! Substitute image aisi honi chahiye ki word ka pronunciation BHI yaad rahe aur uska real meaning BHI samajh aaye.

Har word ke liye:
1. Pehle word ka REAL MEANING samjhao (1 line mein simple Hinglish mein).
2. Word ko syllables mein todo jo kisi concrete, picture-worthy cheez jaisi awaaz karein.
3. Un sounds se ek substitute phrase banao.
4. Ab ek vivid, bizarre mental image banao jo DONO kaam kare:
   - Word ka pronunciation yaad rahe (substitute sounds se)
   - Word ka ACTUAL meaning bhi image mein dikhe (kya karta hai, kya hai)

Format:
**[Original Word]**
Matlab (Meaning): [real meaning simple Hinglish mein]
Sunne mein lagta hai: [phonetic breakdown]
Substitute: [concrete words]
Mental Image: [2-3 sentence vivid scene jo pronunciation + meaning DONO encode kare]
Kaise yaad rahega: [1 line explaining how the image captures both name + meaning]

Example approach:
- "Mitochondria" = powerhouse of cell. So image mein ENERGY/POWER dikhao + "Mighty-Konda-Ria" sounds.
- "Photosynthesis" = plants make food from sunlight. So image mein PLANTS + SUNLIGHT + FOOD dikhao + "Photo-Sin-Thesis" sounds.

Creative, funny, aur images jitni weird ho sakein utni weird banao! NO Devanagari!"""
    result = ask_claude(prompt)
    return {"substitutes": result or fallback_substitute_words(req.words)}


@app.post("/api/loci-walkthrough")
def generate_loci_walkthrough(req: LociWalkthroughRequest):
    if not req.items or not req.place:
        raise HTTPException(400, "Jagah aur items dono daalo")
    items_str = ", ".join(req.items)
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ki Loci Method (Memory Palace) technique sikhata hai.

User ki chosen jagah: {req.place}
Items yaad karne hain (isi order mein): {items_str}

Ek vivid guided walkthrough banao memory palace ka:

1. Pehle, har item ke liye jagah mein ek specific spot/room decide karo.
2. Phir ek walkthrough narrative likho jahan user mentally "walk" kare aur har spot par item ko bizarre, exaggerated tarike se rakhha hua dekhe.
3. Har placement vivid, funny, aur impossible hona chahiye — environment ke saath weird tarike se interact karna chahiye.
4. End mein ek quick recap do — har spot aur uska item.

Second person mein likho ("Tum andar jaate ho aur dekhte ho ki..."). Engaging aur fun rakho! Romanized Hinglish mein — NO Devanagari!"""
    result = ask_claude(prompt)
    return {"walkthrough": result or fallback_loci_walkthrough(req.place, req.items)}


def fallback_definition_memorize(definition):
    return f"""**Aapki Definition:**
{definition}

**MOVIE Method ke 5 Steps:**

**M — Mark key points:** Definition ko 3-5 main points mein todo. Har sentence ka core idea identify karo.

**O — Object-ify:** Har technical term ko ek visual character/object banao (jaise Substitute Words technique mein).

**V — Visualize:** Un characters ki ek funny, bizarre interaction story banao (jaise Link System).

**I — Install:** Story ko apne ghar ke rooms mein rakho (jaise Loci Method).

**E — Encode:** Har image meaning bhi capture kare, sirf naam nahi — Action + Property + Difference dikhao!

**Tip:** Behtar response ke liye Claude AI enable karo — wo poori detailed character-based story banayega aapke liye!
"""


@app.post("/api/definition-memorize")
def memorize_definition(req: DefinitionMemorizeRequest):
    if not req.definition or len(req.definition.strip()) < 20:
        raise HTTPException(400, "Kam se kam ek proper definition daalo (20+ characters)")
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo paragraph-style technical definitions yaad karwane ki "MOVIE Method" sikhata hai. Ye method 5 steps ka hybrid approach hai jo Substitute Words + Link System + Loci Method combine karta hai.

User ye definition yaad karna chahta hai:
"{req.definition}"

Apply the MOVIE Method aur ek complete memory aid generate karo:

**Step 1: M — MARK Key Points**
Definition ko 3-5 main points mein todo. Har point ek line mein simple Hinglish mein.

**Step 2: O — OBJECT-IFY (Characters banao)**
Har technical concept ko ek visual character ya object mein convert karo. Table format mein dikhao:
| Concept | Character | Why this works |

Use Hindi/Indian-style relatable characters (Hubby, Maa, Muscle bhai, Bahar pada Liar, Triangle, etc.)

**Step 3: V — VISUALIZE (Story banao)**
Sab characters ko ek single funny scene mein interact karwao. Story mein 3-5 paragraphs ho. **MOST IMPORTANT:** Story sirf naam nahi, ACTUAL meaning bhi encode kare — properties, behaviors, comparisons, formulas, sab kuch.

**Step 4: I — INSTALL in Memory Palace (Loci Method)**
"Mera Ghar" ke rooms mein har key point rakho:
- Darwaaza, Baramda, Living Room, Rasoi, Bedroom, Chhat
Table format mein dikhao:
| Spot | Image | Encodes |

**Step 5: E — ENCODE Quick Recall Triggers**
Final summary table jo recall trigger words deta hai:
| Trigger | What you remember |

**Last Section: Comparison Triangle (agar definition mein comparison hai)**
Agar definition mein 2-3 cheezon ka comparison hai, ek visual triangle banao with characters showing differences. ASCII art ke liye TRIPLE BACKTICK code block use karo (```) taaki proper structure render ho.

IMPORTANT FORMATTING RULES:
- Use proper Markdown tables with pipes: | Col1 | Col2 |
- For ASCII art/trees, ALWAYS wrap them in ```code blocks``` (triple backticks) so spacing is preserved
- Use ## for headings, ** for bold
- Use --- for section separators
- Format poora structured rakho with bold headings, tables, code blocks, aur emojis

Romanized Hinglish mein — NO Devanagari! Make it engaging, fun, aur educational."""
    result = ask_claude(prompt)
    return {"memory_aid": result or fallback_definition_memorize(req.definition)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
