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


# --- Hinglish Fallback Data ---

ACTIONS = [
    "उड़ कर गिरता है", "से टकरा जाता है", "के ऊपर नाचने लगता है",
    "को खा जाता है", "में बदल जाता है", "पर सवारी करने लगता है",
    "को juggle करने लगता है", "के ऊपर चढ़ जाता है", "से प्यार कर बैठता है",
    "से कुश्ती करने लगता है", "से bounce हो जाता है", "को निगल लेता है",
    "पर parachute से गिरता है", "को karate chop मारता है", "पर surfing करने लगता है",
    "में आग लग जाती है और", "को दौड़ा-दौड़ा कर पकड़ता है",
    "सिकुड़ कर छुप जाता है", "लाखों में multiply हो जाता है",
]

ADJECTIVES = [
    "बहुत बड़ा (giant)", "नन्हा सा (tiny)", "चिल्लाता हुआ",
    "चमकता हुआ (glowing)", "बालों वाला (furry)", "invisible",
    "नाचता हुआ", "फटने वाला (exploding)", "इंद्रधनुषी (rainbow)",
    "उल्टा (upside-down)", "गाता हुआ", "100 फीट लंबा", "बच्चे जितना छोटा",
]

PEGS = {
    1: "ताज (Taj)", 2: "नाग (Naag)", 3: "मोर (Mor)", 4: "रथ (Rath)",
    5: "लड्डू (Laddu)", 6: "छाता (Chhaata)", 7: "कमल (Kamal)",
    8: "फूल (Phool)", 9: "पंखा (Pankha)", 10: "तोता (Tota)",
}

PHONETIC_MAP = {
    "0": "स/ज़", "1": "त/द", "2": "न", "3": "म",
    "4": "र", "5": "ल", "6": "छ/श/च", "7": "क/ग",
    "8": "फ/व", "9": "प/ब",
}

PHONETIC_WORDS = {
    "0": ["सागर", "ज़मीन", "साँप"],
    "1": ["ताला", "दीया", "तीर"],
    "2": ["नदी", "नाव", "नारियल"],
    "3": ["मोती", "माला", "मछली"],
    "4": ["रस्सी", "राजा", "रोटी"],
    "5": ["लड्डू", "लोटा", "लालटेन"],
    "6": ["छाता", "शेर", "चम्मच"],
    "7": ["कमल", "गाय", "केला"],
    "8": ["फूल", "वीणा", "फल"],
    "9": ["पतंग", "बिल्ली", "पंखा"],
    "00": ["सीसा", "ज़ूज़ू"],
    "01": ["सीता", "साड़ी"],
    "10": ["तोता", "दासा"],
    "11": ["ताता", "दादा"],
    "12": ["तोना", "दीना"],
    "13": ["तमाशा", "दम"],
    "14": ["तार", "दूर"],
    "15": ["तिल", "दाल"],
    "21": ["नाद", "नट"],
    "22": ["नाना", "नानी"],
    "23": ["नाम", "नीम"],
    "31": ["मित्र", "मूत"],
    "32": ["मन", "मैना"],
    "41": ["रात", "रोटी"],
    "42": ["राणी", "रन"],
    "51": ["लाट", "लड्डू"],
    "52": ["लीन", "लान"],
    "61": ["शाद", "छत"],
    "71": ["कुत्ता", "गेंद"],
    "72": ["कान", "गन"],
    "81": ["फूट", "वट"],
    "84": ["फार", "वर"],
    "91": ["बैट", "पैड"],
    "92": ["बन", "पान"],
}

ROOM_SPOTS = {
    "मेरा घर (My Home)": [
        "मुख्य दरवाज़ा", "बरामदा", "बैठक (living room)", "रसोई (kitchen)",
        "फ्रिज", "पूजा का कमरा", "बेडरूम", "अलमारी",
        "खिड़की", "छत (terrace)"
    ],
    "मंदिर (Temple)": [
        "मंदिर का गेट", "जूतों की जगह", "घंटा", "मुख्य मूर्ति",
        "प्रसाद काउंटर", "परिक्रमा का रास्ता", "तुलसी का पौधा", "दान पेटी",
        "बैठने की जगह", "मंदिर की सीढ़ियाँ"
    ],
    "बाज़ार (Market)": [
        "बाज़ार का entrance", "सब्ज़ी वाला", "मिठाई की दुकान", "कपड़े की दुकान",
        "चाय का ठेला", "फल वाला", "किराना स्टोर", "नाई की दुकान",
        "ATM", "पार्किंग"
    ],
    "स्कूल (School)": [
        "स्कूल का गेट", "assembly ground", "अपनी class", "blackboard",
        "principal का office", "library", "canteen", "playground",
        "science lab", "स्कूल की छत"
    ],
    "रेलवे स्टेशन (Railway Station)": [
        "ticket counter", "platform 1", "waiting room", "चाय वाला",
        "पुल (overbridge)", "बेंच", "bookstall", "पानी का नल",
        "सीढ़ियाँ", "exit gate"
    ],
    "पार्क (Park)": [
        "पार्क का गेट", "बेंच", "फव्वारा (fountain)", "बड़ा पेड़",
        "झूला (swing)", "तालाब", "jogging track", "फूलों की क्यारी",
        "चबूतरा", "पार्क का exit"
    ],
}


# --- Fallback Generators (Hinglish) ---

def fallback_link_story(items):
    lines = ["**आपके items:**"]
    for i, item in enumerate(items, 1):
        lines.append(f"{i}. {item}")
    lines.append("\n**आपकी Memory Story:**\n")
    story_parts = []
    for i in range(len(items) - 1):
        adj = random.choice(ADJECTIVES)
        action = random.choice(ACTIONS)
        if i == 0:
            story_parts.append(f"सोचो एक {adj} **{items[i]}** अचानक **{items[i+1]}** {action}!")
        else:
            story_parts.append(f"फिर वो **{items[i]}** {adj} **{items[i+1]}** {action}!")
    lines.append(" ".join(story_parts))
    lines.append("\n**Tip:** इस scene को अपने दिमाग में 2-3 बार replay करो। जितना ज़्यादा अजीब और vivid imagine करोगे, उतना अच्छा याद रहेगा!")
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
        lines.append(f"**Item #{num}: {item}** — Peg: {peg}\nImage: एक {adj} **{peg.split('(')[0].strip()}** {action} एक **{item}**। इसे जितना हो सके उतना vivid imagine करो!\n")
    return "\n".join(lines)


def fallback_phonetic_words(number):
    lines = [f"**Number: {number}**\n", "**व्यंजन (Consonant) breakdown:**"]
    sounds = [f"{digit} = {PHONETIC_MAP.get(digit, '?')}" for digit in number]
    lines.append(", ".join(sounds))
    lines.append("\n**संभावित शब्द (Possible words):**\n")
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
    lines.append(f"\n2. **अलग-अलग pegs:** " + " - ".join(random.choice(PHONETIC_WORDS.get(d, ["?"])) for d in number))
    adj = random.choice(ADJECTIVES)
    action = random.choice(ACTIONS)
    if words_found:
        lines.append(f"\n**Best mental image:** सोचो एक {adj} **{words_found[0][1]}** जो सब कुछ {action}!")
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
        lines.append(f"**{word}**\nसुनने में लगता है: {'-'.join(subs)}\nSubstitute: {' + '.join(subs)}\nMental Image: एक {adj} **{subs[0]}** {action} एक **{subs[-1] if len(subs) > 1 else subs[0]}**। इसे जितना अजीब और funny imagine कर सको, उतना अच्छा!\n")
    return "\n".join(lines)


def fallback_loci_walkthrough(place, items):
    spots = ROOM_SPOTS.get(place, [f"जगह #{i+1}" for i in range(len(items))])
    lines = [f"**आपका Memory Palace: {place}**\n", "**Walkthrough (सैर):**\n"]
    for i, item in enumerate(items):
        spot = spots[i % len(spots)]
        adj = random.choice(ADJECTIVES)
        action = random.choice(ACTIONS)
        lines.append(f"**Stop {i+1} — {spot}:** तुम {spot} पर पहुँचते हो और देखते हो कि एक {adj} **{item}** वहाँ {action}! इसे ignore करना impossible है।\n")
    lines.append("\n**Quick Recap (झटपट दोहराओ):**")
    for i, item in enumerate(items):
        lines.append(f"- {spots[i % len(spots)]} → **{item}**")
    lines.append(f"\n**Tip:** आँखें बंद करो और अपने {place} में mentally walk करो। हर जगह पर वो अजीब image देखो। जितना practice करोगे, उतना strong याद रहेगा!")
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


# --- Hinglish System Instruction ---
HINGLISH_INSTRUCTION = """IMPORTANT: Respond in Hinglish — conversational Hindi mixed with English words naturally, just like how a Hindi-speaking person actually talks in daily life. Use Devanagari script for Hindi words. Examples of the tone:
- "सोचो कि एक giant दूध का carton उड़ कर बिल्ली पर गिरता है!"
- "अब ये image अपने दिमाग में fix करो"
- "इसे याद रखने का सबसे easy तरीका ये है कि..."
- "पहले item को दूसरे से link करो, फिर दूसरे को तीसरे से"

Keep the tone fun, friendly, and easy to understand for a Hindi speaker who is not strong in English."""


# --- Endpoints ---

@app.get("/api/status")
def status():
    return {"ai_enabled": client is not None}


@app.post("/api/link-story")
def generate_link_story(req: LinkStoryRequest):
    if not req.items or len(req.items) < 2:
        raise HTTPException(400, "कम से कम 2 items डालो")
    items_str = ", ".join(req.items)
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" by Harry Lorayne ki Link System technique sikhata hai.

User ye list yaad karna chahta hai (isi order mein): {items_str}

Ek SHORT, funny, bizarre, aur vivid story banao jo har item ko agle se connect kare. Har transition action-packed aur weird hona chahiye — jitna ajeeb utna achha yaad rahega!

Format:
1. Pehle items numbered list mein likho.
2. Phir story sunao, har item ko **bold** mein highlight karo.
3. End mein ek quick tip do ki mentally story kaise replay karein.

Concise aur entertaining rakho. Hinglish mein likho!"""
    result = ask_claude(prompt)
    return {"story": result or fallback_link_story(req.items)}


@app.post("/api/peg-associate")
def generate_peg_associations(req: PegAssociateRequest):
    if not req.items:
        raise HTTPException(400, "कम से कम 1 item डालो")
    items_str = "\n".join(f"{i+1}. {item}" for i, item in enumerate(req.items))
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ki Peg System technique sikhata hai.

Hindi Peg List:
1=ताज (Taj), 2=नाग (Naag), 3=मोर (Mor), 4=रथ (Rath), 5=लड्डू (Laddu)
6=छाता (Chhaata), 7=कमल (Kamal), 8=फूल (Phool), 9=पंखा (Pankha), 10=तोता (Tota)

User ye items yaad karna chahta hai position wise:
{items_str}

Har item ke liye ek bizarre, vivid, funny mental image banao jo PEG word ko item se connect kare. Image exaggerated, impossible, aur action-packed honi chahiye.

Format:
**Item #N: [item]** — Peg: [peg word]
Image: [vivid bizarre association Hinglish mein]

Har image 1-2 sentences mein. Wild aur memorable banao!"""
    result = ask_claude(prompt)
    return {"associations": result or fallback_peg_associations(req.items)}


@app.post("/api/phonetic-words")
def generate_phonetic_words(req: PhoneticWordsRequest):
    if not req.number or not req.number.isdigit():
        raise HTTPException(400, "एक valid number डालो")
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ka Phonetic Alphabet (Hindi version) sikhata hai.

Hindi Phonetic Code:
0=स/ज़  1=त/द  2=न  3=म  4=र  5=ल  6=छ/श/च  7=क/ग  8=फ/व  9=प/ब

Vowels (अ,आ,इ,ई,उ,ऊ,ए,ऐ,ओ,औ) aur ह,य,व ki koi value nahi — ye fillers hain.

User ye number yaad karna chahta hai: {req.number}

1. Number ko uske consonant sounds mein todo (Hindi mein).
2. 3 yaadgaar Hindi/Hinglish words ya short phrases banao jo is number ko encode karein.
3. Har word ke liye dikhao ki consonants kaise digits se map hote hain.
4. Sabse best word choose karo aur uska ek vivid mental image banao.

Creative bano aur words easy to picture banao! Hinglish mein likho."""
    result = ask_claude(prompt)
    return {"words": result or fallback_phonetic_words(req.number)}


@app.post("/api/substitute-words")
def generate_substitute_words(req: SubstituteWordsRequest):
    if not req.words:
        raise HTTPException(400, "कम से कम 1 word डालो")
    words_str = ", ".join(req.words)
    prompt = f"""{HINGLISH_INSTRUCTION}

Tu ek memory coach hai jo "The Memory Book" ki Substitute Word technique sikhata hai.

User ye abstract ya mushkil words yaad karna chahta hai: {words_str}

Har word ke liye:
1. Word ko syllables mein todo jo kisi concrete, picture-worthy cheez jaisi awaaz karein (Hindi ya English dono use kar sakte ho).
2. Un sounds se ek substitute phrase banao.
3. Un substitute words ko combine karke ek vivid, bizarre mental image banao.

Format:
**[Original Word]**
Sunne mein lagta hai: [phonetic breakdown]
Substitute: [concrete words]
Mental Image: [1-2 sentence vivid scene Hinglish mein]

Creative, funny, aur images jitni weird ho sakein utni weird banao!"""
    result = ask_claude(prompt)
    return {"substitutes": result or fallback_substitute_words(req.words)}


@app.post("/api/loci-walkthrough")
def generate_loci_walkthrough(req: LociWalkthroughRequest):
    if not req.items or not req.place:
        raise HTTPException(400, "Jagah aur items dono daalein")
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

Second person mein likho ("Tum andar jaate ho aur dekhte ho ki..."). Engaging aur fun rakho! Hinglish mein likho."""
    result = ask_claude(prompt)
    return {"walkthrough": result or fallback_loci_walkthrough(req.place, req.items)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
