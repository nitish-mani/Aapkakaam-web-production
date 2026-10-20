import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";
import serviceData from "../../data/serviceData";
import "./body.css";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";

import AppDownloadPrompt from "../appDownload/AppDownloadPrompt";
import { shouldShowAppDownload } from "../../data/appDownload";
// ============================================================
// CATEGORY META - Complete with all categories
// ============================================================
const CATEGORY_META = {
  "Construction & Work": {
    emoji: "🏗️",
    color: "#2563eb",
    soft: "#eff6ff",
    gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
    desc: "आपके आसपास उपलब्ध निर्माण और मजदूरी की भरोसेमंद सेवाएँ।",
    hi: "आपकी सभी निर्माण आवश्यकताओं के लिए पेशेवर सेवाएँ।",
  },
  "Home Repair & Maintenance": {
    emoji: "🔨",
    color: "#d97706",
    soft: "#fffbeb",
    gradient: "linear-gradient(135deg,#d97706,#fbbf24)",
    desc: "घर की मरम्मत और रखरखाव सेवाएँ।",
    hi: "घर के छोटे-बड़े सभी कामों के लिए विशेषज्ञ।",
  },
  "Appliance Repair": {
    emoji: "📺",
    color: "#7c3aed",
    soft: "#f5f3ff",
    gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    desc: "AC, फ्रिज, वॉशिंग मशीन और अन्य उपकरणों की मरम्मत।",
    hi: "सभी प्रकार के घरेलू उपकरणों की मरम्मत सेवाएँ।",
  },
  "Home Services": {
    emoji: "🏠",
    color: "#0891b2",
    soft: "#ecfeff",
    gradient: "linear-gradient(135deg,#0891b2,#22d3ee)",
    desc: "घर की सफाई, मरम्मत और रखरखाव सेवाएँ।",
    hi: "आपके घर को साफ-सुथरा और बेहतर बनाने के लिए सेवाएँ।",
  },
  "Office Services": {
    emoji: "🏢",
    color: "#0284c7",
    soft: "#f0f9ff",
    gradient: "linear-gradient(135deg,#0284c7,#38bdf8)",
    desc: "ऑफिस के लिए सफाई, सहायक और अन्य सेवाएँ।",
    hi: "आपके कार्यालय को व्यवस्थित और स्वच्छ रखने के लिए सेवाएँ।",
  },
  "Daily Needs": {
    emoji: "📋",
    color: "#059669",
    soft: "#ecfdf5",
    gradient: "linear-gradient(135deg,#059669,#34d399)",
    desc: "ड्राइवर, माली, सुरक्षा गार्ड और दैनिक जरूरतें।",
    hi: "आपकी रोजमर्रा की ज़रूरतों के लिए भरोसेमंद सेवाएँ।",
  },
  "Event & Function Services": {
    emoji: "🎊",
    color: "#7c3aed",
    soft: "#f5f3ff",
    gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    desc: "शादी, पार्टी और कार्यक्रम की पूरी व्यवस्था।",
    hi: "हर कार्यक्रम को खास बनाने के लिए संपूर्ण सेवाएँ।",
  },
  Transportation: {
    emoji: "🚗",
    color: "#0284c7",
    soft: "#f0f9ff",
    gradient: "linear-gradient(135deg,#0284c7,#38bdf8)",
    desc: "आने-जाने और सामान ढुलाई के लिए स्थानीय परिवहन।",
    hi: "हर आवश्यकता के लिए सुरक्षित और विश्वसनीय परिवहन।",
  },
  "Rural Services": {
    emoji: "🌾",
    color: "#a16207",
    soft: "#fefce8",
    gradient: "linear-gradient(135deg,#a16207,#eab308)",
    desc: "खेती, धान कुट्टी, आटा चक्की और ग्रामीण सेवाएँ।",
    hi: "ग्रामीण क्षेत्रों की विशेष जरूरतों के लिए सेवाएँ।",
  },
  "Education & Coaching": {
    emoji: "📚",
    color: "#d97706",
    soft: "#fffbeb",
    gradient: "linear-gradient(135deg,#d97706,#fbbf24)",
    desc: "पढ़ाई, कोचिंग और स्किल डेवलपमेंट के लिए शिक्षक।",
    hi: "आपकी शिक्षा और स्किल्स को बेहतर बनाने के लिए ट्रेनर।",
  },
};

// ============================================================
// CATEGORY HINDI - Complete with all categories
// ============================================================
const CATEGORY_HINDI = {
  "Construction & Work": "निर्माण कार्य",
  "Home Repair & Maintenance": "गृह मरम्मत और रखरखाव",
  "Appliance Repair": "उपकरण मरम्मत",
  "Home Services": "घरेलू सेवाएँ",
  "Office Services": "कार्यालय सेवा",
  "Daily Needs": "दैनिक आवश्यकता",
  "Event & Function Services": "कार्यक्रम सेवा",
  Transportation: "परिवहन सेवा",
  "Rural Services": "ग्रामीण सेवाएँ",
  "Education & Coaching": "शिक्षा सेवाएँ",
};

// ============================================================
// SERVICE EMOJI - Complete with all services
// ============================================================
const SERVICE_EMOJI = {
  // Construction & Work
  Labour: "👷",
  Mason: "🧱",
  Contractor: "👔",
  Architect: "📐",
  "Interior Designer": "🏠",
  "Excavation Worker": "⛰️",
  "Tiles Fitter": "🔲",
  "Marble Fitter": "💎",
  Shuttering: "🏗️",
  Welder: "🔥",
  Fabricator: "🔩",
  "Glass Fitter": "🪟",
  "Aluminium Fabricator": "🪟",
  "Door & Window Repair": "🚪",
  "POP Worker": "🎭",

  // Home Repair & Maintenance
  Electrician: "⚡",
  Plumber: "🔧",
  Painter: "🎨",
  Carpenter: "🪚",

  // Appliance Repair
  "AC Repair & Installation": "❄️",
  "Refrigerator Repair": "🧊",
  "Washing Machine Repair": "🧺",
  "RO Service & Repair": "💧",
  "Geyser Repair": "🔥",
  "Water Cooler Repair": "💦",
  "Chimney Repair & Cleaning": "🍳",
  "Fan Repair & Installation": "🌀",
  "Mixer / Grinder Repair": "⚙️",
  "TV Repair": "📺",
  "Induction Repair": "🔥",
  "Inverter Repair & Service": "🔋",
  "CCTV Installation & Service": "📹",
  "Mobile Repair": "📱",
  "Laptop & PC Repair": "💻",
  "Generator Repair & Service": "⚡",

  // Home Services
  Cook: "🍳",
  "House Maid": "🧹",
  "Pest Control": "🐜",
  "Deep Cleaning": "🧽",
  "Water Tank Cleaning": "💧",

  // Office Services
  "Office Boy & Pantry Help": "👔",
  "Office Deep Cleaning": "🧹",

  // Daily Needs
  Driver: "🚕",
  "Milk Man": "🥛",
  "Washer Man": "👕",
  Gardener: "🌱",
  "Security Guard": "🛡️",
  "Baby Sitter": "👶",
  "Old Age Caregiver": "🤝",

  // Event & Function Services
  Photography: "📸",
  Videography: "🎥",
  "DJ Service": "🎧",
  "Music Artist": "🎵",
  Decorator: "🎭",
  "Tent House Service": "⛺",
  "Catering Service": "🍲",
  "Mehandi Artist": "🤲",
  "Makeup Artist": "💋",
  Parlour: "💄",
  "Pandit Ji": "🕉️",
  Lights: "💡",
  "Kirtan Mandali": "🎵",
  Waiter: "🍽️",
  Chaat: "🌮",
  "Dulha Rath": "🐎",
  "Paan Wala": "🌿",
  "Marriage Hall": "💒",
  "Band Party": "🥁",
  Fireworks: "🎆",

  // Transportation
  "Four Wheeler": "🚙",
  Bus: "🚌",
  Auto: "🛺",
  "E-Rikshaw": "🛵",
  "Mini Truck": "🚚",

  // Rural Services
  Dhankutti: "🌾",
  "Aata Chakki": "🌾",
  "Latrine Tank Cleaner": "🧹",
  "Pual Cutter": "✂️",
  "Bhoonsa Pual Seller": "🌾",
  "Fruits Seller": "🍎",

  // Education & Coaching
  "Home Tutor": "📚",
  "Computer Trainer": "💻",
  "Music Teacher": "🎵",
  "Dance Teacher": "💃",
  "Art Teacher": "🎨",
  "Language Trainer": "🗣️",
};

const getEmoji = (title) => SERVICE_EMOJI[title] || "✨";

// ============================================================
// VOICE SEARCH ENGINE - COMPLETE CONTEXT
// ============================================================

// PART 1: TEXT NORMALIZATION & PREPROCESSING
const normalizeVoiceText = (value = "") => {
  if (!value) return "";
  return String(value)
    .toLowerCase()
    .normalize("NFC")
    .replace(/[.,!?;:'"(){}[\]<>/\\|@#$%^&*_+=~`\u0964\u0965]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const removeVoiceFillerWords = (value = "") => {
  const text = normalizeVoiceText(value);
  const fillerWords = new Set([
    "मुझे",
    "मेरे",
    "मेरी",
    "मेरा",
    "हमारे",
    "हमारा",
    "हमारी",
    "आप",
    "आपको",
    "आपने",
    "आपका",
    "आपकी",
    "आपके",
    "अपने",
    "अपना",
    "अपनी",
    "अपन",
    "घर",
    "घरमें",
    "घरके",
    "घरका",
    "घरकी",
    "में",
    "का",
    "की",
    "के",
    "को",
    "से",
    "पर",
    "तक",
    "मैं",
    "यह",
    "ये",
    "वो",
    "वह",
    "वोह",
    "वहाँ",
    "यहाँ",
    "एक",
    "दो",
    "तीन",
    "चार",
    "पाँच",
    "छह",
    "सात",
    "आठ",
    "चाहिए",
    "करना",
    "करवाना",
    "करवानी",
    "करवाने",
    "करवाई",
    "है",
    "हैं",
    "हो",
    "गया",
    "गई",
    "गए",
    "गयी",
    "गये",
    "रहा",
    "रही",
    "रहे",
    "रहें",
    "बहुत",
    "अभी",
    "कृपया",
    "जल्दी",
    "कोई",
    "कुछ",
    "थोड़ा",
    "थोड़ी",
    "थोड़े",
    "सकता",
    "सकती",
    "सकते",
    "लिए",
    "साथ",
    "बिना",
    "मतलब",
    "बस",
    "ही",
    "भी",
    "तो",
    "न",
    "ना",
    "नहीं",
    "हाँ",
    "mujhe",
    "mere",
    "meri",
    "mera",
    "hamare",
    "hamara",
    "hamari",
    "aap",
    "aapko",
    "aapne",
    "apne",
    "apna",
    "apni",
    "ghar",
    "gharme",
    "gharke",
    "mein",
    "me",
    "ka",
    "ki",
    "ke",
    "ko",
    "se",
    "par",
    "tak",
    "mai",
    "main",
    "ye",
    "yeh",
    "wo",
    "woh",
    "voh",
    "waha",
    "yaha",
    "ek",
    "do",
    "teen",
    "chaar",
    "paanch",
    "chhe",
    "saat",
    "aath",
    "chahiye",
    "karna",
    "karwana",
    "karwani",
    "karwane",
    "hai",
    "hain",
    "ho",
    "gaya",
    "gayi",
    "gaye",
    "gayee",
    "raha",
    "rahi",
    "rahe",
    "rahen",
    "bahut",
    "abhi",
    "kripya",
    "jaldi",
    "koi",
    "kuch",
    "thoda",
    "thodi",
    "thode",
    "sakta",
    "sakti",
    "sakte",
    "liye",
    "saath",
    "bina",
    "matlab",
    "bas",
    "hi",
    "bhi",
    "to",
    "na",
    "nahi",
    "nahin",
    "haan",
    "do",
    "kar",
    "karo",
    "kare",
    "karen",
    "karao",
    "ban",
    "bana",
    "banao",
    "banwao",
    "banwana",
    "nikal",
    "nikaal",
    "nikalo",
    "khol",
    "kholo",
    "kholna",
    "lagao",
    "lagana",
    "lagwao",
    "laga do",
    "lagwa do",
  ]);
  const words = text.split(" ");
  const result = [];
  for (const word of words) {
    if (!word) continue;
    if (fillerWords.has(word)) continue;
    if (word.length >= 2) result.push(word);
  }
  return result.join(" ");
};

// PART 2: FUZZY MATCHING
const levenshteinDistance = (a = "", b = "", maxDist = 3) => {
  if (!a) return b.length;
  if (!b) return a.length;
  const lenA = a.length;
  const lenB = b.length;
  if (Math.abs(lenA - lenB) > maxDist) return maxDist + 1;
  if (lenA === 0) return lenB;
  if (lenB === 0) return lenA;
  let prev = new Array(lenB + 1);
  let curr = new Array(lenB + 1);
  for (let j = 0; j <= lenB; j++) prev[j] = j;
  for (let i = 1; i <= lenA; i++) {
    curr[0] = i;
    for (let j = 1; j <= lenB; j++) {
      if (a[i - 1] === b[j - 1]) {
        curr[j] = prev[j - 1];
      } else {
        curr[j] = Math.min(prev[j - 1] + 1, curr[j - 1] + 1, prev[j] + 1);
      }
    }
    let minVal = Infinity;
    for (let j = 0; j <= lenB; j++) {
      if (curr[j] < minVal) minVal = curr[j];
    }
    if (minVal > maxDist) return minVal;
    [prev, curr] = [curr, prev];
  }
  return prev[lenB];
};

const fuzzyWordMatch = (a = "", b = "") => {
  a = normalizeVoiceText(a);
  b = normalizeVoiceText(b);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  if (a.length < 3 || b.length < 3) return false;
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  const threshold = maxLength <= 4 ? 1 : Math.floor(maxLength * 0.25);
  return distance <= threshold;
};

// PART 3: SERVICE CONTEXT DATABASE - COMPLETE
const VOICE_SERVICE_CONTEXT = {
  // ============================================================
  // CONSTRUCTION & WORK
  // ============================================================
  Labour: {
    aliases: [
      "labour",
      "labor",
      "mazdoor",
      "मज़दूर",
      "कामगार",
      "worker",
      "labourer",
      "daily worker",
      "रोज़गार",
      "mazdoor wala",
      "majdoor",
      "मजदूर",
      "helper",
      "सहायक",
      "assistant",
      "daily labour",
      "construction labour",
      "loading labour",
      "unloading labour",
      "general worker",
      "coolie",
      "पोर्टर",
      "mazdoor chahiye",
    ],
    problems: [
      "लोडिंग",
      "loading",
      "unloading",
      "अनलोडिंग",
      "lifting",
      "उठाना",
      "shifting",
      "शिफ्टिंग",
      "माल उठाना",
      "goods loading",
      "माल लादना",
      "construction labour",
      "बिल्डिंग काम",
      "building work",
      "घर काम",
      "house work",
      "general work",
      "सामान्य काम",
      "लोड लगाना",
      "अनलोड करना",
      "माल उतारना",
      "सामान शिफ्ट",
      "फर्नीचर शिफ्ट",
      "घर शिफ्टिंग",
      "ऑफिस शिफ्टिंग",
      "माल ढुलाई",
      "गोदाम काम",
      "warehouse work",
      "factory labour",
      "मिल मजदूर",
      "खेत काम",
      "farm labour",
      "harvesting work",
      "कटाई का काम",
      "बिजाई का काम",
      "रोपाई का काम",
      "सब्जी तोड़ना",
      "फल तोड़ना",
      "बागवानी काम",
      "gardening labour",
      "cleaning labour",
      "सफाई मजदूर",
      "road labour",
      "सड़क काम",
      "pipeline labour",
      "pipe fitting labour",
      "electrical labour",
      "बिजली मजदूर",
      "painting labour",
      "पेंटिंग मजदूर",
      "carpentry labour",
      "लकड़ी मजदूर",
      "steel labour",
      "स्टील मजदूर",
      "सीमेंट मजदूर",
      "cement labour",
      "brick labour",
      "ईंट मजदूर",
      "sand labour",
      "रेत मजदूर",
      "aggregate labour",
      "पत्थर मजदूर",
      "भारी काम",
    ],
  },
  Mason: {
    aliases: [
      "mason",
      "mistri",
      "राज",
      "राज मिस्त्री",
      "मिस्त्री",
      "masonry",
      "construction worker",
      "building worker",
      "सीमेंट मिस्त्री",
      "ईंट वाला",
      "building contractor",
      "construction labour",
      "civil worker",
      "सिविल मिस्त्री",
      "राजगीर",
      "mason near me",
      "building mason",
      "construction mason",
      "brick layer",
      "ईंट लगाने वाला",
      "cement wala",
      "plaster wala",
      "foundation wala",
    ],
    problems: [
      "wall",
      "दीवार",
      "ईंट",
      "brick",
      "सीमेंट",
      "cement",
      "foundation",
      "नींव",
      "construction",
      "building",
      "पिलर",
      "pillar",
      "slab",
      "स्लैब",
      "roof",
      "छत",
      "plaster",
      "पलस्तर",
      "plastering",
      "पलस्तरी",
      "पोर्शिंग",
      "flooring",
      "फर्श",
      "tile",
      "टाइल",
      "marble",
      "संगमरमर",
      "granite",
      "ग्रेनाइट",
      "extension",
      "विस्तार",
      "room add",
      "कमरा जोड़ना",
      "दीवार बनाना",
      "ईंट लगाना",
      "सीमेंट लगाना",
      "नींव डालना",
      "construction work",
      "building work",
      "pillar banwana",
      "slab dalwana",
      "roof dalwana",
      "plaster karwana",
      "flooring karwana",
      "tile lagwana",
      "marble lagwana",
      "granite lagwana",
      "extension karna",
      "room add karna",
      "wall repair",
      "crack wall",
      "दीवार की मरम्मत",
      "सीमेंट की मरम्मत",
      "foundation repair",
      "structure repair",
      "building repair",
      "renovation",
      "नवीनीकरण",
      "घर बनाना",
      "घर का निर्माण",
      "new building",
      "commercial building",
      "residential building",
      "floor tiling",
      "wall tiling",
      "bathroom tiling",
      "kitchen tiling",
      "terrace tiling",
      "balcony tiling",
      "गार्डन तिलिंग",
      "पार्किंग तिलिंग",
      "स्टेयरकेस तिलिंग",
      "लिफ्ट तिलिंग",
      "लॉबी तिलिंग",
    ],
  },
  Contractor: {
    aliases: [
      "contractor",
      "contractor wala",
      "construction contractor",
      "building contractor",
      "ठेकेदार",
      "कॉन्ट्रैक्टर",
      "निर्माण ठेकेदार",
      "builder",
      "construction manager",
    ],
    problems: [
      "घर बनवाना",
      "निर्माण",
      "renovation",
      "building",
      "निर्माण कार्य",
      "house construction",
      "commercial building",
      "contract work",
    ],
  },
  Architect: {
    aliases: [
      "architect",
      "architecture",
      "designer",
      "plan",
      "वास्तुकार",
      "आर्किटेक्ट",
      "मकान डिजाइन",
      "building designer",
      "construction planner",
    ],
    problems: [
      "घर का नक्शा",
      "house plan",
      "building design",
      "construction plan",
      "blueprint",
      "वास्तु",
      "map",
      "drawing",
    ],
  },
  "Interior Designer": {
    aliases: [
      "interior",
      "interior designer",
      "home design",
      "office design",
      "इंटीरियर",
      "घर डिजाइन",
      "दुकान डिजाइन",
      "interior decoration",
    ],
    problems: [
      "घर की सजावट",
      "office decoration",
      "interior decoration",
      "home interior",
      "shop interior",
      "modular kitchen",
      "wardrobe design",
    ],
  },
  "Excavation Worker": {
    aliases: [
      "excavation",
      "digging",
      "earthwork",
      "खुदाई",
      "खोदने वाला",
      "मिट्टी काम",
      "digger",
      "earth mover",
    ],
    problems: [
      "खुदाई करवाना",
      "नींव खोदना",
      "जमीन खोदना",
      "site preparation",
      "land leveling",
      "मिट्टी निकालना",
    ],
  },
  "Tiles Fitter": {
    aliases: [
      "tiles",
      "tile fitter",
      "tiles wala",
      "टाइल",
      "टाइल मिस्त्री",
      "tile installer",
      "floor tiler",
    ],
    problems: [
      "टाइल लगवाना",
      "floor tiles",
      "wall tiles",
      "bathroom tiles",
      "kitchen tiles",
      "tile repair",
    ],
  },
  "Marble Fitter": {
    aliases: ["marble", "marble fitter", "संगमरमर", "मार्बल", "marble wala", "stone fitter"],
    problems: ["मार्बल लगवाना", "marble floor", "marble stairs", "marble kitchen", "stone work"],
  },
  Shuttering: {
    aliases: ["shuttering", "formwork", "शटरिंग", "centering", "shuttering wala", "स्लैब शटरिंग"],
    problems: [
      "शटरिंग लगवाना",
      "roof shuttering",
      "slab shuttering",
      "column shuttering",
      "beam shuttering",
    ],
  },
  Welder: {
    aliases: ["welder", "welding", "वेल्डर", "वेल्डिंग", "welding wala", "metal worker"],
    problems: [
      "वेल्डिंग करवाना",
      "gate welding",
      "grill welding",
      "railing welding",
      "metal repair",
      "लोहे का काम",
    ],
  },
  Fabricator: {
    aliases: [
      "fabricator",
      "fabrication",
      "फैब्रिकेटर",
      "metal fabricator",
      "steel fabricator",
      "iron worker",
    ],
    problems: [
      "गेट बनवाना",
      "grill banwana",
      "shed banwana",
      "railing banwana",
      "metal structure",
      "steel work",
    ],
  },
  "Glass Fitter": {
    aliases: ["glass", "glass fitter", "ग्लास", "glass wala", "glass installer"],
    problems: [
      "कांच लगवाना",
      "glass window",
      "glass door",
      "glass partition",
      "glass shop",
      "glass repair",
    ],
  },
  "Aluminium Fabricator": {
    aliases: ["aluminium", "aluminum", "एल्युमिनियम", "aluminium wala", "door wala", "window wala"],
    problems: [
      "एल्युमिनियम दरवाजा",
      "window frame",
      "पार्टिशन",
      "aluminium door",
      "aluminium window",
      "sliding door",
    ],
  },
  "Door & Window Repair": {
    aliases: [
      "door repair",
      "window repair",
      "दरवाजा मरम्मत",
      "खिड़की मरम्मत",
      "door fitting",
      "window fitting",
    ],
    problems: [
      "दरवाजा खराब",
      "खिड़की खराब",
      "door fitting",
      "window fitting",
      "door lock",
      "window lock",
    ],
  },
  "POP Worker": {
    aliases: [
      "pop",
      "pop worker",
      "false ceiling",
      "पीओपी",
      "झूठी छत",
      "pop design",
      "plaster of paris",
    ],
    problems: ["पीओपी करवाना", "false ceiling design", "छत डिजाइन", "POP design", "ceiling work"],
  },

  // ============================================================
  // HOME REPAIR & MAINTENANCE
  // ============================================================
  Electrician: {
    aliases: [
      "electrician",
      "electric",
      "electrical",
      "electrician wala",
      "बिजली वाला",
      "बिजली मिस्त्री",
      "बिजली मिस्त्री चाहिए",
      "इलेक्ट्रीशियन",
      "इलेक्ट्रिशियन",
      "इलेक्ट्रिक",
      "इलेक्ट्रिकल",
      "इलेक्ट्रीकल",
      "बिजली",
      "बिजली का काम",
      "बिजली मास्टर",
      "electrical contractor",
      "wireman",
      "बिजली का ठेकेदार",
      "current wala",
      "करंट वाला",
      "electrical engineer",
      "electrician near me",
      "बिजली ठीक करने वाला",
      "इलेक्ट्रिशियन भाई",
      "wiring wala",
      "switch board wala",
      "light wala",
      "fan wala",
      "meter wala",
      "बिजली का मास्टर",
      "electrical work",
      "बिजली का ठेका",
      "बिजली की मरम्मत",
    ],
    problems: [
      "fan",
      "pankha",
      "पंखा",
      "पंखा खराब",
      "फैन",
      "switch",
      "स्विच",
      "socket",
      "सॉकेट",
      "wire",
      "wiring",
      "wireing",
      "वायर",
      "वायरिंग",
      "बल्ब",
      "bulb",
      "light",
      "लाइट",
      "बिजली नहीं",
      "बिजली चली",
      "करंट",
      "मीटर",
      "mcb",
      "short circuit",
      "शॉर्ट सर्किट",
      "power",
      "voltage",
      "वोल्टेज",
      "inverter connection",
      "inverter",
      "इन्वर्टर",
      "earthing",
      "अर्थिंग",
      "फ्यूज",
      "fuse",
      "distribution board",
      "db",
      "electric shock",
      "फ्लिकर",
      "flicker",
      "dim light",
      "geyser",
      "गीजर",
      "water heater",
      "वॉटर हीटर",
      "oven",
      "ओवन",
      "microwave",
      "माइक्रोवेव",
      "panel",
      "पैनल",
      "meter change",
      "मीटर बदलना",
      "बिजली का बिल",
      "high voltage",
      "low voltage",
      "power cut",
      "load shedding",
      "बिजली गुल",
      "मोटर",
      "motor",
      "pump",
      "पंप",
      "generator",
      "बिजली का पोल",
      "electric pole",
      "transformer",
      "ट्रांसफार्मर",
      "sub station",
      "सब स्टेशन",
      "पंखा चल नहीं रहा",
      "पंखा स्लो चल रहा",
      "फैन की स्पीड कम",
      "लाइट जल नहीं रही",
      "बल्ब फ्यूज हो गया",
      "स्विच टूट गया",
      "सॉकेट ख़राब हो गया",
      "वायरिंग खराब हो गई",
      "बिजली का तार टूट गया",
      "मीटर खराब हो गया",
      "MCB ट्रिप हो रहा है",
      "शॉर्ट सर्किट हो गया",
      "बिजली का झटका लगा",
      "वोल्टेज बहुत कम है",
      "वोल्टेज बहुत ज्यादा है",
      "इन्वर्टर कनेक्ट नहीं हो रहा",
      "अर्थिंग खराब है",
      "फ्यूज उड़ गया",
      "डीबी बोर्ड ख़राब",
      "रोशनी टिमटिमा रही",
      "गीजर गरम नहीं कर रहा",
      "ओवन ख़राब हो गया",
      "माइक्रोवेव चल नहीं रहा",
      "पैनल बोर्ड ख़राब",
      "मीटर बदलवाना है",
      "बिजली का बिल बहुत आ रहा",
      "मोटर खराब हो गई",
      "पंप चल नहीं रहा",
      "जनरेटर स्टार्ट नहीं हो रहा",
      "बिजली का पोल गिर गया",
      "ट्रांसफार्मर ख़राब हो गया",
      "सब स्टेशन में खराबी",
      "पंखे की वायरिंग करनी",
      "नई लाइट डलवानी",
      "नया स्विच लगवाना",
      "सॉकेट शिफ्ट करना",
      "पूरे घर की वायरिंग",
      "फैक्ट्री की वायरिंग",
      "दुकान की बिजली",
      "ऑफिस की वायरिंग",
      "स्कूल की बिजली",
      "हॉस्पिटल की वायरिंग",
      "बिजली का नया कनेक्शन",
      "बिजली का रिपेयर",
      "इन्वर्टर की वायरिंग",
      "सोलर पैनल कनेक्शन",
      "सोलर वायरिंग",
      "सीसीटीवी वायरिंग",
      "इंटरनेट वायरिंग",
      "टेलीफोन वायरिंग",
      "फायर अलार्म वायरिंग",
    ],
  },
  Plumber: {
    aliases: [
      "plumber",
      "plumbing",
      "plumber wala",
      "प्लंबर",
      "प्लम्बर",
      "नल वाला",
      "पानी वाला",
      "पाइप वाला",
      "पानी मिस्त्री",
      "plumbing contractor",
      "pipe fitter",
      "सैनिटरी",
      "sanitary",
      "प्लंबिंग",
      "plumbing wala",
      "water wala",
      "tap wala",
      "bathroom wala",
      "pipe wala",
      "fit wala",
      "plumber near me",
    ],
    problems: [
      "tap",
      "नल",
      "नल खराब",
      "नल टूट",
      "pipe",
      "पाइप",
      "पानी",
      "water",
      "water leakage",
      "water leak",
      "leakage",
      "leak",
      "लीकेज",
      "लीक",
      "पानी लीक",
      "टोंटी",
      "tank",
      "टंकी",
      "water tank",
      "bathroom pipe",
      "बाथरूम पाइप",
      "drain",
      "नाली",
      "सीवर",
      "sewer",
      "flush",
      "फ्लश",
      "toilet pipe",
      "टॉयलेट पाइप",
      "sink",
      "सिंक",
      "bathroom fitting",
      "बाथरूम फिटिंग",
      "faucet",
      "पानी का प्रेशर",
      "water pressure",
      "pipe fitting",
      "geyser installation",
      "गीजर लगाना",
      "water filter",
      "पानी फिल्टर",
      "ro",
      "solar water heater",
      "नल टपक रहा",
      "पानी लीक हो रहा",
      "पाइप फट गया",
      "टंकी खाली",
      "टंकी भर नहीं रही",
      "पानी नहीं आ रहा",
      "बाथरूम की फिटिंग",
      "सिंक बंद",
      "नाली बंद",
      "सीवर बंद",
      "टॉयलेट बंद",
      "फ्लश खराब",
      "गीजर लगवाना",
      "वॉटर फिल्टर",
      "आरओ लगवाना",
      "सोलर हीटर",
      "पानी हीटर",
      "टोंटी बदलना",
      "टोंटी लगाना",
      "पाइप बदलना",
      "पाइप लगाना",
      "नल बदलना",
      "नल लगाना",
      "पानी की पाइपलाइन",
      "बाथरूम रिनोवेशन",
      "किचन सिंक",
      "बाथरूम सिंक",
      "वॉश बेसिन",
      "कमोड",
      "शॉवर",
      "बाथटब",
      "जकूजी",
      "पूल पाइप",
      "गार्डन पाइप",
      "प्रेशर पंप",
      "पानी का प्रेशर बढ़ाना",
      "पानी का प्रेशर कम करना",
      "वॉटर मीटर",
      "पानी का बिल",
      "बोरवेल पाइप",
      "ट्यूबवेल पाइप",
      "ड्रेन पाइप",
      "रेडिएटर पाइप",
      "एसी पाइप",
      "गैस पाइप",
      "स्टीम पाइप",
    ],
  },
  Painter: {
    aliases: [
      "painter",
      "painting",
      "paint",
      "पेंटर",
      "पेंटर वाला",
      "पेंट वाला",
      "पेंटिंग",
      "पुताई वाला",
      "पुताई",
      "रंग वाला",
      "रंगाई",
      "whitewash",
      "व्हाइट वॉश",
      "distemper",
      "डिस्टेंपर",
      "wall painter",
      "painter near me",
      "home painter",
      "house painter",
      "पेंट मिस्त्री",
    ],
    problems: [
      "paint",
      "painting",
      "पेंट",
      "पेंटिंग",
      "रंग",
      "रंगाई",
      "पुताई",
      "दीवार रंगनी",
      "wall paint",
      "wall painting",
      "घर पेंट",
      "कमरा पेंट",
      "whitewash",
      "व्हाइट वॉश",
      "distemper",
      "plastic paint",
      "oil paint",
      "texture",
      "बनावट",
      "pop",
      "false ceiling",
      "झूठी छत",
      "exterior painting",
      "बाहरी पेंट",
      "interior painting",
      "अंदरूनी पेंट",
      "wood polish",
      "लकड़ी पॉलिश",
      "furniture paint",
      "फर्नीचर पेंट",
      "door paint",
      "दीवार पेंट",
      "छत पेंट",
      "फर्श पेंट",
      "मेटल पेंट",
      "आयरन पेंट",
      "गेट पेंट",
      "ग्रिल पेंट",
      "खिड़की पेंट",
      "शटर पेंट",
      "पीवीसी पेंट",
      "सिलिकॉन पेंट",
      "इमल्शन पेंट",
      "पुताई करनी",
      "टेक्सचरिंग",
      "पॉप करना",
      "फॉल्स सीलिंग",
      "वुड पॉलिश",
      "फर्नीचर पेंट",
      "नया पेंट",
      "पुराना पेंट हटाना",
      "पेंट रीपेयर",
      "दीवारों में दरार",
      "दीवार स्मूथ",
      "दीवार सैंडिंग",
      "प्राइमर",
      "फिनिश",
      "ग्लॉस",
      "मैट",
      "सेमी ग्लॉस",
      "टेक्स्चर्ड",
      "वॉलपेपर",
      "पेंट की दुकान",
      "पेंट का सैंपल",
      "कलर कोड",
      "इंटीरियर डिज़ाइन",
      "एक्सटीरियर डिज़ाइन",
    ],
  },
  Carpenter: {
    aliases: [
      "carpenter",
      "carpentry",
      "बढ़ई",
      "बढई",
      "बढ़ई वाला",
      "लकड़ी वाला",
      "wood worker",
      "wood work",
      "furniture maker",
      "फर्नीचर बनाने वाला",
      "carpentry work",
      "wood craftsman",
      "लकड़ी का काम",
      "carpenter near me",
      "wood wala",
      "furniture wala",
      "बढ़ई मिस्त्री",
    ],
    problems: [
      "wood",
      "लकड़ी",
      "फर्नीचर",
      "furniture",
      "दरवाजा",
      "दरवाज़ा",
      "door",
      "खिड़की",
      "window",
      "टेबल",
      "कुर्सी",
      "chair",
      "bed",
      "बेड",
      "अलमारी",
      "almirah",
      "wardrobe",
      "cabinet",
      "kitchen cabinet",
      "किचन कैबिनेट",
      "modular kitchen",
      "मॉड्यूलर किचन",
      "sofa",
      "सोफा",
      "dining table",
      "डाइनिंग टेबल",
      "bookshelf",
      "बुकशेल्फ",
      "wood polishing",
      "लकड़ी पॉलिश",
      "cabinet making",
      "frame",
      "फ्रेम",
      "wood repair",
      "लकड़ी मरम्मत",
      "दरवाजा खराब",
      "खिड़की खराब",
      "टेबल टूटी",
      "कुर्सी टूटी",
      "बेड टूटा",
      "अलमारी खराब",
      "किचन कैबिनेट",
      "वार्डरोब",
      "कैबिनेट",
      "फर्नीचर बनाना",
      "लकड़ी का फ्रेम",
      "मॉड्यूलर किचन",
      "सोफा बनाना",
      "डाइनिंग टेबल",
      "बुकशेल्फ",
      "लकड़ी पॉलिश",
      "फर्नीचर रिपेयर",
      "डोर फिटिंग",
      "विंडो फिटिंग",
      "कैबिनेट बनाना",
      "फ्रेम बनाना",
      "लकड़ी सैंडिंग",
      "लकड़ी कटिंग",
      "लकड़ी डिजाइन",
      "कार्विंग",
      "जॉइनरी",
      "परक्वेट फ्लोरिंग",
      "लैमिनेट फ्लोरिंग",
      "वुडन डेक",
      "पैनलिंग",
      "रूफ ट्रस",
      "लकड़ी का घर",
      "लकड़ी का शेड",
      "गज़ेबो",
      "परगोला",
      "लकड़ी का बरामदा",
    ],
  },

  // ============================================================
  // APPLIANCE REPAIR
  // ============================================================
  "AC Repair & Installation": {
    aliases: [
      "ac",
      "air conditioner",
      "ac mechanic",
      "ac repair",
      "एसी",
      "ए सी",
      "एसी वाला",
      "एसी मिस्त्री",
      "ac mechanic near me",
      "ac repair near me",
      "cooling service",
      "ac service",
      "ac technician",
      "cooler",
    ],
    problems: [
      "cooling",
      "ठंडा नहीं",
      "ठंडा नहीं कर रहा",
      "ठंडी हवा नहीं",
      "गर्म हवा",
      "ac बंद",
      "ac खराब",
      "gas",
      "गैस",
      "water leakage",
      "पानी टपक",
      "remote",
      "रिमोट",
      "noise",
      "आवाज",
      "शोर",
      "ac service",
      "ac cleaning",
      "ac filter cleaning",
      "compressor",
      "condenser",
      "evaporator",
      "thermostat",
      "fan motor",
      "belt",
      "coolant",
      "refrigerant",
      "electrical",
      "installation",
      "uninstallation",
      "reinstallation",
      "window ac",
      "split ac",
      "central ac",
      "cassette ac",
      "floor standing ac",
      "packaged ac",
      "ductable ac",
      "fresh air ac",
      "vrv ac",
      "vrf ac",
      "gas filling",
      "gas leak",
      "high pressure",
      "low pressure",
      "fuse",
      "capacitor",
      "pcb",
      "remote control",
      "display error",
      "error code",
      "auto mode",
      "cool mode",
      "dry mode",
      "fan mode",
      "heating mode",
      "smart ac",
      "inverter ac",
      "power failure",
      "voltage protection",
      "timer",
      "temperature",
      "humidity",
      "air quality",
    ],
  },
  "Refrigerator Repair": {
    aliases: [
      "fridge",
      "refrigerator",
      "फ्रिज",
      "फ्रिज मरम्मत",
      "refrigerator repair",
      "cooling",
      "fridge wala",
    ],
    problems: [
      "फ्रिज ठंडा नहीं",
      "फ्रिज खराब",
      "water",
      "noise",
      "gas",
      "compressor",
      "फ्रिज पानी",
      "cooling problem",
      "ice maker",
    ],
  },
  "Washing Machine Repair": {
    aliases: [
      "washing machine",
      "washing",
      "वॉशिंग मशीन",
      "washing machine wala",
      "washer",
      "laundry machine",
    ],
    problems: [
      "पानी नहीं",
      "spin नहीं",
      "washing machine खराब",
      "पानी भर नहीं",
      "ड्रेन नहीं",
      "machine not starting",
      "water leak",
      "noise",
      "agitator",
    ],
  },
  "RO Service & Repair": {
    aliases: ["ro", "ro service", "water purifier", "आरओ", "पानी फिल्टर", "ro wala"],
    problems: [
      "आरओ खराब",
      "filter change",
      "water purifier",
      "पानी नहीं",
      "ro leaking",
      "taste problem",
      "uv light",
    ],
  },
  "Geyser Repair": {
    aliases: ["geyser", "geyser repair", "water heater", "गीजर", "गीजर मरम्मत", "electric geyser"],
    problems: [
      "गीजर गरम नहीं",
      "geyser leak",
      "water heater",
      "गीजर खराब",
      "no hot water",
      "geyser trip",
    ],
  },
  "Water Cooler Repair": {
    aliases: ["water cooler", "cooler", "वॉटर कूलर", "कूलर", "cooler service", "air cooler"],
    problems: [
      "कूलर खराब",
      "water cooler",
      "ठंडा पानी",
      "cooler service",
      "pump not working",
      "cooler leak",
    ],
  },
  "Chimney Repair & Cleaning": {
    aliases: ["chimney", "kitchen chimney", "चिमनी", "किचन चिमनी", "exhaust fan", "smoke"],
    problems: [
      "चिमनी खराब",
      "chimney cleaning",
      "kitchen smoke",
      "chimney not working",
      "oil cleaning",
    ],
  },
  "Fan Repair & Installation": {
    aliases: ["fan", "ceiling fan", "पंखा", "फैन", "fan repair", "exhaust fan", "pedestal fan"],
    problems: [
      "पंखा खराब",
      "पंखा स्लो",
      "fan installation",
      "पंखा चल नहीं",
      "fan noise",
      "fan wobble",
    ],
  },
  "Mixer / Grinder Repair": {
    aliases: ["mixer", "grinder", "mixer grinder", "मिक्सर", "मिक्सर मरम्मत", "juicer", "blender"],
    problems: ["मिक्सर खराब", "grinder not working", "जूसर", "motor not working", "jar leak"],
  },
  "TV Repair": {
    aliases: ["tv", "television", "टीवी", "tv repair", "television repair", "led tv", "smart tv"],
    problems: [
      "टीवी चालू नहीं",
      "screen problem",
      "sound problem",
      "display",
      "tv not turning on",
      "remote not working",
    ],
  },
  "Induction Repair": {
    aliases: ["induction", "induction cooktop", "इंडक्शन", "इंडक्शन मरम्मत", "cooktop"],
    problems: [
      "इंडक्शन खराब",
      "कुकटॉप",
      "induction not working",
      "display error",
      "heating problem",
    ],
  },
  "Inverter Repair & Service": {
    aliases: [
      "inverter",
      "battery",
      "इन्वर्टर",
      "बैटरी",
      "inverter service",
      "ups",
      "power backup",
    ],
    problems: [
      "इन्वर्टर खराब",
      "backup नहीं",
      "battery dead",
      "चार्ज नहीं",
      "inverter beeping",
      "power failure",
    ],
  },
  "CCTV Installation & Service": {
    aliases: [
      "cctv",
      "camera",
      "security camera",
      "सीसीटीवी",
      "कैमरा लगवाना",
      "surveillance",
      "ip camera",
    ],
    problems: [
      "cctv लगवाना",
      "security camera",
      "surveillance",
      "camera service",
      "cctv not working",
      "recording",
    ],
  },
  "Mobile Repair": {
    aliases: [
      "mobile",
      "phone",
      "mobile repair",
      "मोबाइल",
      "फोन",
      "smartphone",
      "iphone",
      "android",
      "cell phone",
    ],
    problems: [
      "screen टूट",
      "चार्ज नहीं",
      "बैटरी खराब",
      "hang",
      "speaker",
      "mic",
      "camera",
      "touch not working",
      "water damage",
    ],
  },
  "Laptop & PC Repair": {
    aliases: ["laptop", "pc", "computer", "लैपटॉप", "कंप्यूटर", "desktop", "notebook", "macbook"],
    problems: [
      "लैपटॉप खराब",
      "pc repair",
      "computer repair",
      "keyboard",
      "screen",
      "slow",
      "virus",
      "data recovery",
    ],
  },
  "Generator Repair & Service": {
    aliases: ["generator", "gen set", "जनरेटर", "जेनरेटर", "power generator", "diesel generator"],
    problems: [
      "जनरेटर खराब",
      "generator service",
      "power backup",
      "diesel generator",
      "no power",
      "starter problem",
    ],
  },

  // ============================================================
  // HOME SERVICES
  // ============================================================
  Cook: {
    aliases: [
      "cook",
      "cooking",
      "रसोइया",
      "खाना बनाने वाला",
      "cook service",
      "home cook",
      "chef",
      "kitchen helper",
    ],
    problems: [
      "खाना बनाना",
      "घर का खाना",
      "cook needed",
      "रोटी",
      "दाल चावल",
      "सब्जी",
      "meal prep",
      "tiffin",
    ],
  },
  "House Maid": {
    aliases: [
      "maid",
      "house maid",
      "घरेलू सहायिका",
      "नौकरानी",
      "बाई",
      "कामवाली",
      "domestic help",
      "cleaning lady",
    ],
    problems: [
      "घर का काम",
      "सफाई",
      "बर्तन",
      "झाड़ू",
      "पोछा",
      "house cleaning",
      "daily work",
      "cooking",
      "washing",
    ],
  },
  "Pest Control": {
    aliases: ["pest control", "कीट", "termite", "दीमक", "pest", "insect", "rodent", "exterminator"],
    problems: [
      "कीड़े",
      "चींटी",
      "घर में कीड़े",
      "termite control",
      "मच्छर",
      "cockroach",
      "bed bug",
      "rat",
    ],
  },
  "Deep Cleaning": {
    aliases: [
      "deep cleaning",
      "cleaning",
      "सफाई",
      "घर सफाई",
      "cleaner",
      "housekeeping",
      "sanitization",
    ],
    problems: [
      "घर की सफाई",
      "deep clean",
      "साफ करवाना",
      "बाथरूम सफाई",
      "carpet cleaning",
      "sofa cleaning",
      "kitchen cleaning",
    ],
  },
  "Water Tank Cleaning": {
    aliases: [
      "tank cleaning",
      "water tank",
      "टंकी सफाई",
      "पानी की टंकी",
      "overhead tank",
      "underground tank",
    ],
    problems: [
      "टंकी साफ करवाना",
      "water tank clean",
      "septic tank",
      "tank cleaning service",
      "water storage",
    ],
  },

  // ============================================================
  // OFFICE SERVICES
  // ============================================================
  "Office Boy & Pantry Help": {
    aliases: [
      "office boy",
      "pantry help",
      "office staff",
      "ऑफिस बॉय",
      "ऑफिस सहायक",
      "office assistant",
      "tea boy",
    ],
    problems: [
      "ऑफिस का काम",
      "pantry service",
      "office cleaning",
      "चाय",
      "file work",
      "photocopy",
      "errand",
    ],
  },
  "Office Deep Cleaning": {
    aliases: [
      "office cleaning",
      "office deep cleaning",
      "ऑफिस सफाई",
      "office clean",
      "workplace cleaning",
    ],
    problems: [
      "ऑफिस की सफाई",
      "office cleaning",
      "workplace clean",
      "carpet clean",
      "desk cleaning",
      "washroom clean",
    ],
  },

  // ============================================================
  // DAILY NEEDS
  // ============================================================
  Driver: {
    aliases: [
      "driver",
      "driving",
      "ड्राइवर",
      "चालक",
      "car driver",
      "personal driver",
      "private driver",
      "driver service",
      "professional driver",
      "driver near me",
      "car driver needed",
      "वाहन चालक",
      "taxi driver",
      "auto driver",
      "truck driver",
    ],
    problems: [
      "गाड़ी चलाने",
      "car chalane",
      "driver चाहिए",
      "pickup drop",
      "daily driver",
      "office drop",
      "school drop",
      "travel",
      "wedding driver",
    ],
  },
  "Milk Man": {
    aliases: ["milk", "milk man", "दूध", "दूध वाला", "milk supplier", "dairy"],
    problems: ["दूध मंगवाना", "दूध डिलीवरी", "fresh milk", "गाय का दूध", "buffalo milk"],
  },
  "Washer Man": {
    aliases: ["washer man", "dhobi", "धोबी", "laundry", "washing", "ironing", "dry cleaner"],
    problems: [
      "कपड़े धोने",
      "प्रेस करवाना",
      "laundry service",
      "ironing",
      "dry cleaning",
      "washing and ironing",
    ],
  },
  Gardener: {
    aliases: [
      "gardener",
      "gardening",
      "माली",
      "बागवान",
      "lawn care",
      "landscaper",
      "plant care",
      "gardening service",
    ],
    problems: ["बागवानी", "पौधे", "lawn", "गार्डन", "plants care", "watering", "pruning", "mowing"],
  },
  "Security Guard": {
    aliases: [
      "security",
      "security guard",
      "guard",
      "सुरक्षा",
      "चौकीदार",
      "watchman",
      "gate keeper",
      "security service",
      "security man",
      "private guard",
      "armed guard",
      "unarmed guard",
    ],
    problems: [
      "सुरक्षा चाहिए",
      "guard चाहिए",
      "चौकीदार चाहिए",
      "night security",
      "building security",
      "office security",
      "gate security",
    ],
  },
  "Baby Sitter": {
    aliases: [
      "baby sitter",
      "babysitter",
      "nanny",
      "child care",
      "बेबी सिटर",
      "नानी",
      "आया",
      "childcare",
      "daycare",
      "creche",
      "baby care",
    ],
    problems: [
      "बच्चे की देखभाल",
      "child care",
      "baby sitting",
      "day care",
      "toddler care",
      "infant care",
      "newborn care",
    ],
  },
  "Old Age Caregiver": {
    aliases: [
      "caregiver",
      "elderly care",
      "बुजुर्ग",
      "old age care",
      "caretaker",
      "companion",
      "nursing",
    ],
    problems: [
      "बुजुर्ग की देखभाल",
      "elderly support",
      "daily help",
      "care giver",
      "old age home",
      "senior care",
    ],
  },

  // ============================================================
  // EVENT & FUNCTION SERVICES
  // ============================================================
  Photography: {
    aliases: [
      "photography",
      "photographer",
      "photo",
      "फोटोग्राफर",
      "फोटो",
      "camera",
      "shoot",
      "वेडिंग फोटो",
      "शादी की फोटो",
      "photo shoot",
      "candid photography",
      "event photography",
    ],
    problems: [
      "शादी फोटो",
      "फोटो खिंचवाना",
      "फोटोशूट",
      "pre wedding",
      "candid",
      "family photo",
      "wedding photo",
      "birthday photo",
      "function photo",
    ],
  },
  Videography: {
    aliases: [
      "videography",
      "video",
      "वीडियो",
      "वीडियोग्राफर",
      "video maker",
      "cinematographer",
      "video editor",
      "film maker",
    ],
    problems: [
      "वीडियो शूट",
      "शादी वीडियो",
      "event video",
      "video editing",
      "video coverage",
      "documentary",
    ],
  },
  "DJ Service": {
    aliases: [
      "dj",
      "डीजे",
      "music",
      "sound system",
      "party dj",
      "wedding dj",
      "professional dj",
      "disk jockey",
      "dj system",
    ],
    problems: [
      "शादी डीजे",
      "पार्टी डीजे",
      "music system",
      "DJ बजाना",
      "sound setup",
      "speaker",
      "amplifier",
      "disco light",
    ],
  },
  "Music Artist": {
    aliases: [
      "music artist",
      "singer",
      "musician",
      "गायक",
      "संगीत कलाकार",
      "वादक",
      "vocalist",
      "band",
      "performer",
    ],
    problems: [
      "गाना गाने वाला",
      "संगीत कार्यक्रम",
      "live performance",
      "singer for wedding",
      "musical show",
      "bhajan",
      "gazal",
    ],
  },
  Decorator: {
    aliases: [
      "decorator",
      "decoration",
      "सजावट",
      "डेकोरेटर",
      "decoration wala",
      "event decorator",
      "wedding decorator",
    ],
    problems: [
      "सजावट",
      "शादी सजावट",
      "party decoration",
      "वेडिंग डेकोरेशन",
      "flower decoration",
      "stage decoration",
    ],
  },
  "Tent House Service": {
    aliases: [
      "tent",
      "tent house",
      "शामियाना",
      "टेंट",
      "पंडाल",
      "tent wala",
      "canopy",
      "event tent",
    ],
    problems: [
      "शादी टेंट",
      "पार्टी टेंट",
      "event tent",
      "शामियाना",
      "पंडाल लगाना",
      "tent booking",
      "chair booking",
      "table booking",
    ],
  },
  "Catering Service": {
    aliases: [
      "catering",
      "caterer",
      "कैटरिंग",
      "खाना",
      "catering wala",
      "food service",
      "party catering",
      "event catering",
    ],
    problems: [
      "शादी खाना",
      "कैटरिंग चाहिए",
      "मेहमानों का खाना",
      "buffet",
      "menu",
      "food order",
      "wedding food",
    ],
  },
  "Mehandi Artist": {
    aliases: [
      "mehandi",
      "mehndi",
      "मेहंदी",
      "मेहंदी आर्टिस्ट",
      "henna",
      "henna artist",
      "bridal mehandi",
    ],
    problems: [
      "शादी मेहंदी",
      "मेहंदी लगाना",
      "हाथ मेहंदी",
      "bridal mehandi",
      "party mehandi",
      "function mehandi",
    ],
  },
  "Makeup Artist": {
    aliases: [
      "makeup",
      "makeup artist",
      "मेकअप",
      "मेकअप आर्टिस्ट",
      "beautician",
      "cosmetologist",
      "bridal makeup",
    ],
    problems: [
      "शादी मेकअप",
      "पार्लर",
      "ब्यूटी",
      "bride makeup",
      "airbrush",
      "party makeup",
      "hair and makeup",
    ],
  },
  Parlour: {
    aliases: ["parlour", "beauty parlour", "पार्लर", "ब्यूटी", "salon", "beauty salon", "spa"],
    problems: [
      "पार्लर बुकिंग",
      "ब्यूटी सर्विस",
      "hair",
      "facial",
      "waxing",
      "threading",
      "manicure",
      "pedicure",
    ],
  },
  "Pandit Ji": {
    aliases: [
      "pandit",
      "pandit ji",
      "पंडित",
      "पंडित जी",
      "purohit",
      "priest",
      "brahmin",
      "archaka",
    ],
    problems: [
      "पूजा",
      "गृह प्रवेश",
      "शादी",
      "havan",
      "yagya",
      "विवाह",
      "engagement",
      "mundan",
      "namkaran",
    ],
  },
  Lights: {
    aliases: [
      "lights",
      "lighting",
      "लाइट",
      "लाइटिंग",
      "decoration lights",
      "LED",
      "festoon",
      "fairy lights",
    ],
    problems: [
      "शादी लाइट",
      "सजावटी लाइट",
      "party lights",
      "fairy lights",
      "string lights",
      "LED lights",
    ],
  },
  "Kirtan Mandali": {
    aliases: [
      "kirtan",
      "bhajan",
      "कीर्तन",
      "कीर्तन मंडली",
      "भजन मंडली",
      "satsang",
      "religious music",
    ],
    problems: [
      "कीर्तन बुक",
      "भजन",
      "religious event",
      "satsang",
      "bhajan mandali",
      "devotional singing",
    ],
  },
  Waiter: {
    aliases: [
      "waiter",
      "वेटर",
      "serve",
      "server",
      "catering staff",
      "serving staff",
      "food server",
    ],
    problems: [
      "वेटर चाहिए",
      "मेहमानों की सेवा",
      "serve food",
      "serving",
      "catering staff",
      "event staff",
    ],
  },
  Chaat: {
    aliases: ["chaat", "चाट", "street food", "food stall", "paani puri", "gol gappe", "bhelpuri"],
    problems: [
      "शादी चाट",
      "चाट का स्टॉल",
      "गोल गप्पे",
      "भेल पूरी",
      "chaat counter",
      "food counter",
    ],
  },
  "Dulha Rath": {
    aliases: ["dulha rath", "barat", "रथ", "दूल्हा रथ", "wedding chariot", "groom carriage"],
    problems: [
      "बारात",
      "दूल्हा रथ बुक",
      "घोड़ी",
      "wedding vehicle",
      "groom entry",
      "barat vehicle",
    ],
  },
  "Paan Wala": {
    aliases: ["paan", "paan wala", "पान", "पान वाला", "betel leaf", "paan shop"],
    problems: ["शादी पान", "पान की व्यवस्था", "meetha paan", "paan counter", "paan service"],
  },
  "Marriage Hall": {
    aliases: [
      "marriage hall",
      "banquet hall",
      "मैरिज हॉल",
      "शादी का हॉल",
      "wedding venue",
      "function hall",
    ],
    problems: ["मैरिज हॉल बुक", "शादी का स्थान", "reception hall", "party hall", "venue booking"],
  },
  "Band Party": {
    aliases: ["band", "band party", "बैंड", "बैंड पार्टी", "music band", "brass band", "pipe band"],
    problems: [
      "शादी बैंड",
      "बारात बैंड",
      "music band",
      "brass band",
      "procession",
      "band for wedding",
    ],
  },
  Fireworks: {
    aliases: [
      "fireworks",
      "firecracker",
      "पटाखे",
      "आतिशबाजी",
      "fire show",
      "pyrotechnics",
      "celebration fire",
    ],
    problems: [
      "शादी पटाखे",
      "आतिशबाजी बुक",
      "fireworks display",
      "celebration",
      "cracker",
      "fire show",
    ],
  },

  // ============================================================
  // TRANSPORTATION
  // ============================================================
  "Four Wheeler": {
    aliases: [
      "car",
      "four wheeler",
      "चार पहिया",
      "गाड़ी",
      "car rental",
      "car hire",
      "sedan",
      "suv",
      "hatchback",
    ],
    problems: [
      "कार चाहिए",
      "गाड़ी बुक",
      "travel",
      "rental car",
      "family car",
      "car on rent",
      "daily rental",
    ],
  },
  Bus: {
    aliases: [
      "bus",
      "बस",
      "group travel",
      "ग्रुप बस",
      "bus rental",
      "minibus",
      "coach",
      "tempo traveller",
    ],
    problems: ["शादी बस", "स्कूल बस", "बस बुकिंग", "group tour", "temple tour", "picnic bus"],
  },
  Auto: {
    aliases: [
      "auto",
      "auto rickshaw",
      "rickshaw",
      "ऑटो",
      "रिक्शा",
      "auto wala",
      "three wheeler",
      "tuk tuk",
      "city auto",
    ],
    problems: [
      "auto चाहिए",
      "ऑटो चाहिए",
      "local travel",
      "city travel",
      "auto ride",
      "daily commute",
    ],
  },
  "E-Rikshaw": {
    aliases: [
      "e-rikshaw",
      "erikshaw",
      "ई-रिक्शा",
      "बैटरी रिक्शा",
      "electric rickshaw",
      "battery rickshaw",
    ],
    problems: ["रिक्शा", "short distance", "local travel", "ई-रिक्शा चाहिए", "electric auto"],
  },
  "Mini Truck": {
    aliases: [
      "mini truck",
      "small truck",
      "छोटा ट्रक",
      "मिनी ट्रक",
      "goods carrier",
      "transport",
      "chhota hathi",
      "pickup van",
    ],
    problems: [
      "माल ढुलाई",
      "goods transport",
      "सामान ढोना",
      "shifting",
      "house shifting",
      "material transport",
      "loading unloading",
    ],
  },

  // ============================================================
  // RURAL SERVICES
  // ============================================================
  Dhankutti: {
    aliases: [
      "dhankutti",
      "rice mill",
      "धान कुट्टी",
      "चावल",
      "paddy",
      "rice processing",
      "grain mill",
    ],
    problems: [
      "धान कुटवाना",
      "rice processing",
      "चावल पिसाई",
      "grain",
      "paddy processing",
      "rice husking",
    ],
  },
  "Aata Chakki": {
    aliases: ["flour mill", "aata chakki", "आटा चक्की", "grain mill", "atta chakki", "wheat flour"],
    problems: ["गेहूं पिसाई", "आटा पीसना", "flour mill", "chakki", "grinding", "wheat grinding"],
  },
  "Latrine Tank Cleaner": {
    aliases: [
      "tank cleaner",
      "septic cleaner",
      "शौचालय",
      "टैंक सफाई",
      "toilet cleaner",
      "septic tank",
      "drain cleaner",
    ],
    problems: ["सेप्टिक टैंक सफाई", "toilet clean", "नाली", "septic tank cleaning", "drainage"],
  },
  "Pual Cutter": {
    aliases: [
      "pual cutter",
      "straw cutter",
      "पुआल कटर",
      "चारा",
      "fodder",
      "straw cutting",
      "animal feed",
    ],
    problems: ["पुआल काटना", "animal feed", "straw cutting", "चारा", "fodder cutting"],
  },
  "Bhoonsa Pual Seller": {
    aliases: ["bhoonsa", "pual seller", "भूसा", "animal feed", "fodder seller", "straw seller"],
    problems: ["भूसा खरीदना", "animal feed supplier", "चारा विक्रेता", "fodder purchase"],
  },
  "Fruits Seller": {
    aliases: [
      "fruits",
      "fruit seller",
      "फल",
      "फल विक्रेता",
      "fresh fruits",
      "fruit vendor",
      "fruit shop",
    ],
    problems: ["ताजे फल", "फल खरीदना", "fresh fruits delivery", "fruit supply", "seasonal fruits"],
  },

  // ============================================================
  // EDUCATION & COACHING
  // ============================================================
  "Home Tutor": {
    aliases: [
      "tutor",
      "home tutor",
      "teacher",
      "tuition",
      "coaching",
      "ट्यूटर",
      "होम ट्यूटर",
      "टीचर",
      "शिक्षक",
      "पढ़ाई",
      "पढ़ाने वाला",
      "ट्यूशन",
      "कोचिंग",
      "गुरुजी",
      "मास्टर जी",
      "private tutor",
      "home tuition",
    ],
    problems: [
      "बच्चे को पढ़ाना",
      "बच्चों को पढ़ाना",
      "घर पर पढ़ाना",
      "घर पर ट्यूशन",
      "home tuition",
      "maths",
      "मैथ",
      "गणित",
      "english",
      "अंग्रेजी",
      "हिंदी",
      "science",
      "विज्ञान",
      "school",
      "स्कूल",
      "exam",
      "परीक्षा",
      "physics",
      "chemistry",
      "biology",
      "class 10",
      "class 12",
      "board exam",
    ],
  },
  "Computer Trainer": {
    aliases: [
      "computer",
      "computer trainer",
      "कंप्यूटर",
      "coding",
      "programming",
      "software trainer",
      "it trainer",
      "tech trainer",
      "computer teacher",
      "it coach",
    ],
    problems: [
      "computer class",
      "कंप्यूटर क्लास",
      "coding class",
      "programming",
      "java",
      "python",
      "web development",
      "graphic design",
      "photoshop",
      "ms office",
      "excel",
      "powerpoint",
      "typing",
      "basic computer",
    ],
  },
  "Music Teacher": {
    aliases: [
      "music teacher",
      "music trainer",
      "संगीत शिक्षक",
      "संगीत गुरु",
      "music wala",
      "गाना सिखाने वाला",
      "vocal teacher",
      "instrument teacher",
      "music coach",
      "संगीत कोच",
      "गायन शिक्षक",
      "वादन शिक्षक",
    ],
    problems: [
      "संगीत सीखना",
      "music learning",
      "गाना सीखना",
      "singing learning",
      "vocal training",
      "instrument learning",
      "गायन सीखना",
      "vocal lessons",
      "संगीत क्लास",
      "music class",
    ],
  },
  "Dance Teacher": {
    aliases: [
      "dance teacher",
      "dance trainer",
      "नृत्य शिक्षक",
      "डांस टीचर",
      "नाच सिखाने वाला",
      "dance wala",
      "choreographer",
      "कोरियोग्राफर",
      "dance coach",
      "डांस कोच",
      "नृत्य गुरु",
    ],
    problems: [
      "डांस सीखना",
      "dance learning",
      "नृत्य सीखना",
      "नाच सीखना",
      "choreography",
      "कोरियोग्राफी",
      "dance choreography",
      "step learning",
      "डांस क्लास",
      "dance class",
    ],
  },
  "Art Teacher": {
    aliases: [
      "art teacher",
      "art trainer",
      "कला शिक्षक",
      "आर्ट टीचर",
      "drawing teacher",
      "पेंटिंग शिक्षक",
      "चित्रकला शिक्षक",
      "art wala",
      "कला सिखाने वाला",
      "drawing wala",
      "painting wala",
    ],
    problems: [
      "आर्ट सीखना",
      "art learning",
      "drawing learning",
      "ड्राइंग सीखना",
      "painting learning",
      "पेंटिंग सीखना",
      "sketching learning",
      "art class",
      "आर्ट क्लास",
      "drawing class",
    ],
  },
  "Language Trainer": {
    aliases: [
      "language trainer",
      "language teacher",
      "भाषा शिक्षक",
      "language coach",
      "भाषा प्रशिक्षक",
      "language wala",
      "english teacher",
      "अंग्रेजी शिक्षक",
      "hindi teacher",
      "हिंदी शिक्षक",
      "spoken english teacher",
    ],
    problems: [
      "भाषा सीखना",
      "language learning",
      "english learning",
      "अंग्रेजी सीखना",
      "spoken english",
      "बोली जाने वाली अंग्रेजी",
      "english speaking",
      "अंग्रेजी बोलना",
      "english writing",
      "अंग्रेजी लिखना",
      "english reading",
      "अंग्रेजी पढ़ना",
    ],
  },
};

// PART 4: STRONG PHRASE PATTERNS - COMPLETE
const STRONG_PHRASE_PATTERNS = {
  // Construction & Work
  Labour: [
    ["मजदूर", "चाहिए"],
    ["loading", "unloading"],
    ["माल", "उठाना"],
  ],
  Mason: [
    ["दीवार", "बनाना"],
    ["ईंट", "लगाना"],
    ["घर", "बनवाना"],
  ],
  Contractor: [
    ["घर", "बनवाना"],
    ["contractor", "चाहिए"],
    ["building", "construction"],
  ],
  Architect: [
    ["घर", "नक्शा"],
    ["architect", "चाहिए"],
    ["house", "plan"],
  ],
  "Interior Designer": [
    ["घर", "सजावट"],
    ["interior", "डिजाइन"],
    ["किचन", "मॉड्यूलर"],
  ],
  "Tiles Fitter": [
    ["टाइल", "लगवाना"],
    ["floor", "tiles"],
    ["बाथरूम", "टाइल"],
  ],
  "Marble Fitter": [
    ["मार्बल", "लगवाना"],
    ["marble", "floor"],
    ["संगमरमर", "काम"],
  ],
  Shuttering: [
    ["शटरिंग", "लगवाना"],
    ["slab", "shuttering"],
    ["छत", "शटरिंग"],
  ],
  Welder: [
    ["वेल्डिंग", "करवाना"],
    ["gate", "welding"],
    ["लोहा", "काम"],
  ],
  Fabricator: [
    ["गेट", "बनवाना"],
    ["fabrication", "काम"],
    ["लोहा", "बनाना"],
  ],
  "Glass Fitter": [
    ["कांच", "लगवाना"],
    ["glass", "window"],
    ["glass", "door"],
  ],
  "POP Worker": [
    ["POP", "करवाना"],
    ["false", "ceiling"],
    ["छत", "डिजाइन"],
  ],
  "Door & Window Repair": [
    ["दरवाजा", "मरम्मत"],
    ["खिड़की", "मरम्मत"],
    ["door", "repair"],
  ],

  // Home Repair & Maintenance
  Electrician: [
    ["पंखा", "खराब"],
    ["बिजली", "नहीं"],
    ["switch", "खराब"],
    ["wiring", "करनी"],
    ["बिजली", "चली"],
  ],
  Plumber: [
    ["नल", "टपक"],
    ["पानी", "लीक"],
    ["pipe", "leak"],
    ["flush", "खराब"],
    ["नाली", "बंद"],
  ],
  Painter: [
    ["घर", "पेंट"],
    ["दीवार", "पेंट"],
    ["पेंट", "करवाना"],
    ["व्हाइट", "वॉश"],
  ],
  Carpenter: [
    ["दरवाजा", "खराब"],
    ["लकड़ी", "काम"],
    ["फर्नीचर", "बनाना"],
    ["अलमारी", "बनाना"],
  ],

  // Appliance Repair
  "AC Repair & Installation": [
    ["ac", "ठंडा"],
    ["ac", "खराब"],
    ["ठंडा", "नहीं"],
    ["cooling", "नहीं"],
    ["ac", "गैस"],
  ],
  "Refrigerator Repair": [
    ["फ्रिज", "ठंडा"],
    ["फ्रिज", "खराब"],
    ["cooling", "problem"],
  ],
  "Washing Machine Repair": [
    ["वॉशिंग", "खराब"],
    ["washing", "machine"],
    ["पानी", "नहीं"],
  ],
  "RO Service & Repair": [
    ["आरओ", "खराब"],
    ["RO", "सर्विस"],
    ["filter", "change"],
  ],
  "Geyser Repair": [
    ["गीजर", "गरम"],
    ["geyser", "खराब"],
    ["hot", "water"],
  ],
  "Mobile Repair": [
    ["मोबाइल", "स्क्रीन"],
    ["phone", "टूट"],
    ["चार्ज", "नहीं"],
    ["बैटरी", "खराब"],
  ],
  "TV Repair": [
    ["टीवी", "खराब"],
    ["TV", "चालू"],
    ["screen", "problem"],
  ],
  "Inverter Repair & Service": [
    ["इन्वर्टर", "खराब"],
    ["backup", "नहीं"],
    ["battery", "dead"],
  ],

  // Home Services
  Cook: [
    ["खाना", "बनाना"],
    ["रसोइया", "चाहिए"],
    ["cook", "needed"],
  ],
  "House Maid": [
    ["कामवाली", "चाहिए"],
    ["बाई", "चाहिए"],
    ["घर", "काम"],
  ],
  "Pest Control": [
    ["कीड़े", "मारना"],
    ["दीमक", "खत्म"],
    ["pest", "control"],
  ],
  "Deep Cleaning": [
    ["घर", "सफाई"],
    ["deep", "cleaning"],
    ["साफ", "करवाना"],
  ],
  "Water Tank Cleaning": [
    ["टंकी", "सफाई"],
    ["tank", "clean"],
    ["पानी", "टंकी"],
  ],

  // Office Services
  "Office Boy & Pantry Help": [
    ["ऑफिस", "बॉय"],
    ["pantry", "help"],
    ["office", "staff"],
  ],
  "Office Deep Cleaning": [
    ["ऑफिस", "सफाई"],
    ["office", "cleaning"],
    ["office", "deep"],
  ],

  // Daily Needs
  Driver: [
    ["ड्राइवर", "चाहिए"],
    ["driver", "needed"],
    ["car", "driver"],
  ],
  Gardener: [
    ["माली", "चाहिए"],
    ["बागवानी", "करवाना"],
    ["lawn", "care"],
  ],
  "Security Guard": [
    ["सुरक्षा", "चाहिए"],
    ["guard", "चाहिए"],
    ["चौकीदार", "चाहिए"],
  ],
  "Baby Sitter": [
    ["बच्चे", "देखभाल"],
    ["baby", "sitter"],
    ["nanny", "needed"],
  ],
  "Old Age Caregiver": [
    ["बुजुर्ग", "देखभाल"],
    ["caregiver", "needed"],
    ["old", "age"],
  ],

  // Event & Function Services
  Photography: [
    ["फोटो", "खिंचवाना"],
    ["शादी", "फोटो"],
    ["wedding", "photo"],
  ],
  Videography: [
    ["वीडियो", "शूट"],
    ["event", "video"],
    ["शादी", "वीडियो"],
  ],
  "DJ Service": [
    ["शादी", "डीजे"],
    ["party", "DJ"],
    ["music", "system"],
  ],
  "Music Artist": [
    ["गाना", "गाने"],
    ["music", "artist"],
    ["singer", "needed"],
  ],
  Decorator: [
    ["शादी", "सजावट"],
    ["party", "decoration"],
    ["सजावट", "करवाना"],
  ],
  "Tent House Service": [
    ["शादी", "टेंट"],
    ["पंडाल", "लगाना"],
    ["tent", "booking"],
  ],
  "Catering Service": [
    ["शादी", "खाना"],
    ["कैटरिंग", "चाहिए"],
    ["catering", "service"],
  ],
  "Mehandi Artist": [
    ["मेहंदी", "लगाना"],
    ["शादी", "मेहंदी"],
    ["henna", "artist"],
  ],
  "Makeup Artist": [
    ["शादी", "मेकअप"],
    ["makeup", "artist"],
    ["parlour", "बुकिंग"],
  ],
  "Pandit Ji": [
    ["पूजा", "करवाना"],
    ["पंडित", "चाहिए"],
    ["गृह", "प्रवेश"],
  ],
  Waiter: [
    ["वेटर", "चाहिए"],
    ["server", "needed"],
    ["catering", "staff"],
  ],
  Chaat: [
    ["शादी", "चाट"],
    ["चाट", "स्टॉल"],
    ["food", "stall"],
  ],
  "Band Party": [
    ["शादी", "बैंड"],
    ["बारात", "बैंड"],
    ["music", "band"],
  ],

  // Transportation
  "Four Wheeler": [
    ["कार", "चाहिए"],
    ["car", "rental"],
    ["गाड़ी", "बुक"],
  ],
  Bus: [
    ["बस", "बुक"],
    ["group", "travel"],
    ["शादी", "बस"],
  ],
  Auto: [
    ["ऑटो", "चाहिए"],
    ["auto", "ride"],
    ["local", "travel"],
  ],
  "E-Rikshaw": [
    ["ई-रिक्शा", "चाहिए"],
    ["rickshaw", "needed"],
    ["local", "travel"],
  ],
  "Mini Truck": [
    ["माल", "ढुलाई"],
    ["mini", "truck"],
    ["goods", "transport"],
  ],

  // Rural Services
  Dhankutti: [
    ["धान", "कुटवाना"],
    ["rice", "mill"],
    ["धान", "कुट्टी"],
  ],
  "Aata Chakki": [
    ["आटा", "पीसना"],
    ["flour", "mill"],
    ["गेहूं", "पिसाई"],
  ],
  "Fruits Seller": [
    ["फल", "खरीदना"],
    ["fresh", "fruits"],
    ["fruit", "seller"],
  ],
};

// ============================================================
// VOICE SEARCH ENGINE FUNCTIONS
// ============================================================

const getServiceSearchText = (service) => {
  if (!service) return "";
  return normalizeVoiceText(
    [
      service?.title || "",
      service?.hindi || "",
      service?.description || "",
      service?.descriptionHindi || "",
      service?.jobType || "",
      service?.category || "",
      service?.subCategory || "",
    ]
      .filter(Boolean)
      .join(" "),
  );
};

const scoreVoiceService = (spokenText, service) => {
  const originalText = normalizeVoiceText(spokenText);
  const cleanText = removeVoiceFillerWords(originalText);

  if (!cleanText || cleanText.length < 1) {
    return { service, score: 0, matched: [] };
  }

  const title = normalizeVoiceText(service?.title || "");
  const hindi = normalizeVoiceText(service?.hindi || "");
  const jobType = normalizeVoiceText(service?.jobType || "");
  const fullServiceText = getServiceSearchText(service);

  const context = VOICE_SERVICE_CONTEXT[service?.title] || {};
  const aliases = (context.aliases || []).map(normalizeVoiceText);
  const problems = (context.problems || []).map(normalizeVoiceText);

  let score = 0;
  const matched = [];

  // 1. Exact matches
  if (originalText === title) {
    score += 100;
    matched.push("exact-title");
  }
  if (originalText === hindi) {
    score += 100;
    matched.push("exact-hindi");
  }
  if (originalText === jobType) {
    score += 95;
    matched.push("exact-jobtype");
  }

  // 2. Direct title inclusion
  if (title && originalText.includes(title)) {
    score += title.length >= 4 ? 70 : 50;
    matched.push("title-inclusion");
  }
  if (hindi && originalText.includes(hindi)) {
    score += hindi.length >= 4 ? 75 : 55;
    matched.push("hindi-inclusion");
  }

  // 3. Service aliases
  for (const alias of aliases) {
    if (!alias) continue;
    if (originalText.includes(alias)) {
      score += alias.length >= 6 ? 55 : 35;
      matched.push(`alias:${alias}`);
    }
  }

  // 4. Problem/context matching
  for (const problem of problems) {
    if (!problem) continue;
    if (originalText.includes(problem)) {
      score += problem.length >= 6 ? 32 : 20;
      matched.push(`problem:${problem}`);
    }
  }

  // 5. Word-level matching
  const words = cleanText.split(" ").filter((w) => w.length >= 2);
  const titleWords = new Set(title.split(" ").filter((w) => w.length >= 2));
  const hindiWords = new Set(hindi.split(" ").filter((w) => w.length >= 2));
  const fullWords = new Set(fullServiceText.split(" ").filter((w) => w.length >= 2));

  for (const word of words) {
    if (titleWords.has(word)) {
      score += 15;
      matched.push(`title-word:${word}`);
    }
    if (hindiWords.has(word)) {
      score += 14;
      matched.push(`hindi-word:${word}`);
    }
    if (fullWords.has(word)) {
      score += 4;
    }
  }

  // 6. Fuzzy matching for speech errors
  const spokenWords = cleanText.split(" ").filter((w) => w.length >= 4);
  const serviceWords = fullServiceText.split(" ").filter((w) => w.length >= 4);

  for (const spokenWord of spokenWords) {
    for (const serviceWord of serviceWords) {
      if (fuzzyWordMatch(spokenWord, serviceWord)) {
        score += 8;
        matched.push(`fuzzy:${spokenWord}`);
      }
    }
  }

  // 7. Strong phrase/context patterns
  const patterns = STRONG_PHRASE_PATTERNS[service?.title] || [];
  for (const pattern of patterns) {
    const allMatched = pattern.every((word) => originalText.includes(normalizeVoiceText(word)));
    if (allMatched) {
      score += 45;
      matched.push(`strong-pattern:${pattern.join("+")}`);
    }
  }

  // 8. Category-based hint
  const categoryText = normalizeVoiceText(service?.category || "");
  if (categoryText && originalText.includes(categoryText)) {
    score += 10;
    matched.push("category-hint");
  }

  return { service, score, matched };
};

let serviceSearchCache = null;
let allServicesGlobal = [];

const buildServiceSearchCache = (services) => {
  if (serviceSearchCache) return serviceSearchCache;
  serviceSearchCache = services.map((service) => ({
    service,
    searchText: getServiceSearchText(service),
    title: normalizeVoiceText(service?.title || ""),
    hindi: normalizeVoiceText(service?.hindi || ""),
    jobType: normalizeVoiceText(service?.jobType || ""),
    context: VOICE_SERVICE_CONTEXT[service?.title] || {},
    patterns: STRONG_PHRASE_PATTERNS[service?.title] || [],
  }));
  return serviceSearchCache;
};

const initVoiceSearch = (services) => {
  allServicesGlobal = services || [];
  serviceSearchCache = null;
  buildServiceSearchCache(allServicesGlobal);
};

const findBestLocalService = (spokenText = "") => {
  const text = normalizeVoiceText(spokenText);
  if (!text || !allServicesGlobal.length) return null;

  const cache = buildServiceSearchCache(allServicesGlobal);
  const scored = cache
    .map((item) => scoreVoiceService(text, item.service))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return null;

  const best = scored[0];
  const second = scored[1];

  if (best.score >= 70) return best.service.title;
  if (best.score >= 40 && (!second || best.score - second.score >= 10)) {
    return best.service.title;
  }

  const wordCount = text.split(" ").filter((w) => w.length >= 2).length;
  if (wordCount <= 2 && best.score < 50) return null;

  return best.score >= 30 ? best.service.title : null;
};

const getAIServiceResults = (spokenText = "", detectedService = "") => {
  const text = normalizeVoiceText(spokenText);
  if (!text || !allServicesGlobal.length) return [];

  const cache = buildServiceSearchCache(allServicesGlobal);
  const detectedNormalized = normalizeVoiceText(detectedService);

  const scored = cache
    .map((item) => {
      const result = scoreVoiceService(text, item.service);
      if (detectedNormalized) {
        if (
          item.title === detectedNormalized ||
          item.hindi === detectedNormalized ||
          item.title.includes(detectedNormalized) ||
          item.hindi.includes(detectedNormalized)
        ) {
          result.score += 120;
        }
      }
      return result;
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const threshold = text.split(" ").filter((w) => w.length >= 2).length <= 2 ? 15 : 8;
  const results = scored.filter((item) => item.score >= threshold);
  return results.slice(0, 8).map((item) => item.service);
};

const generateVoiceReply = (spokenText, detectedService, results) => {
  const text = normalizeVoiceText(spokenText);
  const hasUrgency =
    text.includes("urgent") ||
    text.includes("emergency") ||
    text.includes("जल्दी") ||
    text.includes("आपात");
  const hasPriceConcern =
    text.includes("cheap") ||
    text.includes("sasta") ||
    text.includes("कम पैसे") ||
    text.includes("सस्ता");
  const hasQualityConcern =
    text.includes("best") ||
    text.includes("top") ||
    text.includes("अच्छा") ||
    text.includes("बेस्ट");
  const isThankYou =
    text.includes("thank") ||
    text.includes("धन्यवाद") ||
    text.includes("शुक्रिया") ||
    text.includes("thanks");

  if (isThankYou) {
    return "😊 आपका स्वागत है! क्या मैं किसी और सेवा में मदद कर सकता हूँ?";
  }
  if (hasUrgency) {
    return "🚨 जल्दी? हम तुरंत मदद करेंगे! आपके आसपास के उपलब्ध प्रोफेशनल्स नीचे दिख रहे हैं।";
  }
  if (hasPriceConcern) {
    return "💰 किफायती विकल्प खोज रहे हैं? हमारे पास हर बजट के लिए सेवाएँ हैं। नीचे देखें।";
  }
  if (hasQualityConcern) {
    return "⭐ बेहतरीन सेवा चाहते हैं? हमारे सभी प्रोफेशनल्स रेटिंग के आधार पर चुने गए हैं।";
  }
  if (detectedService && results && results.length > 0) {
    return `समझ गया 👍 आपको "${detectedService}" सेवा की ज़रूरत है। ये रहे आपके लिए मिलते-जुगते विकल्प 👇`;
  }
  if (results && results.length > 0) {
    return `मैंने सुना: “${spokenText}” 🎧 ये कुछ सेवाएँ हैं जो आपकी बात से मेल खाती हैं। चुनें और आगे बढ़ें।`;
  }
  return `मैंने सुना: “${spokenText}” 🎧 मुझे पक्का मैच नहीं मिला। कृपया थोड़ा और बताएँ या नीचे लोकप्रिय सेवाओं में से चुनें।`;
};

// ============================================================
// BODY COMPONENT
// ============================================================

export default function Body() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accountType = localStorage.getItem("category");

  const servicesSectionRef = useRef(null);
  const mainRef = useRef(null);

  const userData = useSelector((state) =>
    accountType === "user" ? state.user.data : state.vendor.data,
  );

  const lang = useSelector((store) => store.category.selectLanguage);

  const [homeBanner, setHomeBanner] = useState(null);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiListening, setAiListening] = useState(false);
  const [aiTranscript, setAiTranscript] = useState("");
  const [aiReply, setAiReply] = useState(
    "नमस्ते 👋 मैं AapkaKaam AI हूँ। बोलकर बताइए आपको कौन-सी सेवा चाहिए।",
  );
  const [aiResults, setAiResults] = useState([]);
  const [aiDetectedService, setAiDetectedService] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [micPermission, setMicPermission] = useState("unknown");
  const [showPermissionCard, setShowPermissionCard] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // ============================================================
  // APP DOWNLOAD POPUP
  // ============================================================

  const [showAppDownload, setShowAppDownload] = useState(false);
  // --------------------------------------------------------
  // GET LOGGED-IN PHONE NUMBER
  // --------------------------------------------------------

  const phoneNo = userData[0]?.phoneNo;

  // Fetch public home banner from backend
  useEffect(() => {
    let isMounted = true;

    const fetchHomeBanner = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/home-banner`);

        if (!isMounted || !response.data?.success) {
          return;
        }

        const banner = response.data.banner;

        if (banner?.enabled === true && banner?.imageUrl) {
          setHomeBanner(banner);
        } else {
          setHomeBanner(null);
        }
      } catch (error) {
        console.error("Failed to fetch home banner:", error.response?.data || error.message);

        // Banner failure must not block the homepage
        if (isMounted) {
          setHomeBanner(null);
        }
      }
    };

    fetchHomeBanner();

    return () => {
      isMounted = false;
    };
  }, []);
  // --------------------------------------------------------
  // CHECK WHETHER APP DOWNLOAD POPUP SHOULD SHOW
  // --------------------------------------------------------

  useEffect(() => {
    const canShowAppDownload = phoneNo;

    if (canShowAppDownload) {
      setShowAppDownload(true);
    }
  }, [phoneNo]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, []);

  const allServices = useMemo(() => {
    if (!Array.isArray(serviceData)) return [];
    return serviceData.flatMap((category) => {
      if (!Array.isArray(category?.services)) return [];
      return category.services.filter(Boolean);
    });
  }, []);

  // Initialize voice search with services
  useEffect(() => {
    if (allServices && allServices.length > 0) {
      initVoiceSearch(allServices);
    }
  }, [allServices]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allServices.filter(
      (service) =>
        service.title.toLowerCase().includes(q) || service.hindi?.toLowerCase().includes(q),
    );
  }, [search, allServices]);

  const visibleCategories = useMemo(() => {
    let categories =
      activeCategory === "All"
        ? serviceData
        : serviceData.filter((category) => category.heading === activeCategory);
    return showAll ? categories : categories.slice(0, 4);
  }, [activeCategory, showAll]);

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        if (!navigator.onLine) throw new Error("offline");

        const id = accountType === "vendor" ? userData[0]?.vendorId : userData[0]?.userId;
        if (!id) return;

        if (accountType === "vendor") {
          const { data } = await axios.get(`${SERVER_URL}/vendor/getVendorByVendor/${id}`, {
            headers: { Authorization: `Bearer ${userData[0]?.token}` },
          });
          const updated = {
            ...userData[0],
            balance: data.balance,
            rating: data.rating,
            ratingCount: data.ratingCount,
          };
          dispatch(addDataVendor(updated));
          localStorage.setItem("vendor", JSON.stringify(updated));
        } else {
          await axios.get(`${SERVER_URL}/user/getUserByUser/${id}`, {
            headers: { Authorization: `Bearer ${userData[0]?.token}` },
          });
          dispatch(addDataUser(userData[0]));
          localStorage.setItem("user", JSON.stringify(userData[0]));
        }
      } catch {
        setError("जानकारी अपडेट नहीं हो सकी");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const searchFor = (value) => {
    setSearch(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setShowAll(true);
    setTimeout(() => {
      if (servicesSectionRef.current) {
        servicesSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        document
          .getElementById("all-services")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Navigation helper function
  const navigateToService = (service) => {
    if (!service) return;

    setIsNavigating(true);
    const token = JSON.parse(localStorage.getItem(accountType) || "{}")?.token;

    // Close AI panel
    setAiOpen(false);

    setTimeout(() => {
      if (token) {
        navigate("/checkBookingDate", {
          state: {
            jobType: service.jobType,
            serviceData: {
              title: service.title,
              hindi: service.hindi,
              description: service.description,
              descriptionHindi: service.descriptionHindi,
              image: service.image,
              jobType: service.jobType,
            },
          },
        });
      } else {
        navigate("/category", {
          state: {
            selectedService: {
              title: service.title,
              hindi: service.hindi,
              description: service.description,
              descriptionHindi: service.descriptionHindi,
              image: service.image,
              jobType: service.jobType,
            },
          },
        });
      }
      setIsNavigating(false);
    }, 300);
  };

  const handleServiceSelect = (service) => {
    navigateToService(service);
  };

  const handleCategorySelect = (categoryName) => {
    navigate("/category", { state: { category: categoryName } });
  };

  // AI Result Selection with Navigation
  const selectAIResult = (service) => {
    setAiDetectedService(service.title);
    setAiResults([service]);
    setAiReply(
      `✅ "${service.title}" चुनी गई। ${service.hindi || "इस सेवा"} के लिए आगे बढ़ रहे हैं।`,
    );
    setSearch(service.title);
    setSelectedService(service);
    navigateToService(service);
  };

  // Quick AI Example Button Handler with Navigation
  const handleAIExampleClick = (serviceTitle) => {
    const foundService = allServices.find((s) => s.title === serviceTitle);
    if (foundService) {
      setSearch(serviceTitle);
      setAiOpen(false);
      navigateToService(foundService);
    }
  };

  // Microphone permission
  useEffect(() => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasMicrophone = Boolean(navigator.mediaDevices?.getUserMedia);
    setVoiceSupported(Boolean(Recognition) && hasMicrophone);
  }, []);

  useEffect(() => {
    let mounted = true;
    const checkMicrophonePermission = async () => {
      try {
        if (!navigator.permissions?.query) return;
        const permission = await navigator.permissions.query({ name: "microphone" });
        if (!mounted) return;
        setMicPermission(permission.state);
        permission.onchange = () => setMicPermission(permission.state);
      } catch {}
    };
    checkMicrophonePermission();
    return () => {
      mounted = false;
    };
  }, []);

  const requestMicrophonePermission = async () => {
    const getUserMedia =
      navigator.mediaDevices?.getUserMedia?.bind(navigator.mediaDevices) ||
      navigator.getUserMedia?.bind(navigator) ||
      navigator.webkitGetUserMedia?.bind(navigator);

    if (!getUserMedia) {
      setAiReply("🎙️ इस browser में microphone access उपलब्ध नहीं है।");
      setMicPermission("unsupported");
      return false;
    }

    try {
      setAiReply("🎙️ Microphone की अनुमति चाहिए...");
      const stream = await new Promise((resolve, reject) => {
        getUserMedia({ audio: true }, resolve, reject);
      });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission("granted");
      setShowPermissionCard(false);
      setAiReply("✅ Microphone की अनुमति मिल गई। अब बोलिए।");
      setTimeout(() => startVoiceSearch(), 150);
      return true;
    } catch (error) {
      setMicPermission(error?.name === "NotAllowedError" ? "denied" : "unknown");
      setAiReply("🎙️ Microphone की अनुमति नहीं मिली। Settings में Allow करें।");
      setShowPermissionCard(false);
      return false;
    }
  };

  // START VOICE SEARCH with Auto-Navigation
  const startVoiceSearch = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setAiReply(
        "🎙️ आपके ब्राउज़र में voice search उपलब्ध नहीं है। Chrome या Edge का नया version इस्तेमाल करें।",
      );
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    setAiListening(true);
    setAiTranscript("");
    setAiDetectedService("");
    setAiResults([]);
    setAiReply("🎙️ सुन रहा हूँ... अपनी समस्या बताइए।");

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setAiTranscript(transcript);

      const lastResult = event.results[event.results.length - 1];
      if (lastResult?.isFinal) {
        const detected = findBestLocalService(transcript);
        const results = getAIServiceResults(transcript, detected || "");

        setAiDetectedService(detected || "");
        setAiResults(results);

        if (detected) setSearch(detected);

        const reply = generateVoiceReply(transcript, detected, results);
        setAiReply(reply);

        // If only one result and high confidence, auto-navigate
        if (results.length === 1 && detected) {
          const singleResult = results[0];

          setAiReply(`✅ "${singleResult.title}" सेवा मिली। आपको रीडायरेक्ट कर रहे हैं...`);

          setTimeout(() => {
            setAiOpen(false);
            navigateToService(singleResult);
          }, 1500);
        }
      }
    };

    recognition.onerror = (event) => {
      setAiListening(false);
      if (event.error === "not-allowed") {
        setAiReply(
          "🎙️ Microphone permission बंद है। Browser settings में microphone की अनुमति दें।",
        );
      } else if (event.error === "no-speech") {
        setAiReply("कुछ सुनाई नहीं दिया 😅 फिर से बोलकर कोशिश करें।");
      } else {
        setAiReply("Voice search में दिक्कत हुई। कृपया फिर से कोशिश करें।");
      }
    };

    recognition.onend = () => {
      setAiListening(false);
    };

    try {
      recognition.start();
    } catch {
      setAiListening(false);
      setAiReply("Voice search अभी शुरू नहीं हो सकी। फिर से दबाएँ।");
    }
  };

  const speakAIReply = () => {
    if (!("speechSynthesis" in window)) {
      setAiReply("🔊 आपके ब्राउज़र में आवाज़ में जवाब देने की सुविधा उपलब्ध नहीं है।");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(aiReply);
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceAssistantPress = async () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasMicrophone =
      Boolean(navigator.mediaDevices?.getUserMedia) ||
      Boolean(navigator.getUserMedia) ||
      Boolean(navigator.webkitGetUserMedia);

    if (!hasMicrophone) {
      setAiReply("🎙️ इस browser में microphone access उपलब्ध नहीं है।");
      return;
    }
    if (!Recognition) {
      setAiReply("🎙️ इस browser में speech recognition उपलब्ध नहीं है। Chrome/Edge का उपयोग करें।");
      setVoiceSupported(false);
      return;
    }
    if (micPermission !== "granted") {
      setShowPermissionCard(true);
      return;
    }
    startVoiceSearch();
  };

  const postLocation = useSelector((store) => store.category.location_post);
  const pinLocation = useSelector((store) => store.category.location_pincode);
  const locationText = postLocation
    ? `${postLocation}${pinLocation ? `, ${pinLocation}` : ""}`
    : userData?.[0]?.address?.[0]
      ? `${userData[0].address[0].post}, ${userData[0].address[0].pincode}`
      : "अपना स्थान चुनें • Select your location";

  return (
    <main className="modern-body body-with-global-nav" ref={mainRef}>
      {/* Dynamic Home Banner */}
      {homeBanner?.enabled && homeBanner?.imageUrl && (
        <section className="home-banner" aria-label="Aapkakaam home banner">
          {homeBanner.clickUrl ? (
            <a
              href={homeBanner.clickUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="home-banner-link"
              aria-label="Open banner link"
            >
              <img
                src={homeBanner.imageUrl}
                alt="Aapkakaam promotional banner"
                className="home-banner-image"
                loading="eager"
                fetchPriority="high"
              />
            </a>
          ) : (
            <img
              src={homeBanner.imageUrl}
              alt="Aapkakaam promotional banner"
              className="home-banner-image"
              loading="eager"
              fetchPriority="high"
            />
          )}
        </section>
      )}
      {/* ========== HERO ========== */}
      <section className="modern-hero">
        <div className="hero-bg">
          <div className="hero-glow glow-1" />
          <div className="hero-glow glow-2" />
          <div className="hero-glow glow-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            🇮🇳 भारत में • आपके आसपास
          </div>
          <h1>
            आपका काम,
            <br />
            <span className="highlight">यानी हमारा काम।</span>
          </h1>
          <p className="hero-desc">
            इलेक्ट्रिशियन से लेकर प्लंबर, ड्राइवर, ट्यूटर और घरेलू सेवाओं तक — अपने आसपास सही
            प्रोफेशनल खोजें।
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => scrollTo("search")}>
              🔍 सेवा खोजें
            </button>
            <button className="btn-secondary" onClick={() => setAiOpen(true)}>
              🤖 AI से पूछें
            </button>
          </div>
          <div className="hero-stats">
            <div>
              <strong>50+</strong>
              <span>सेवाएँ</span>
            </div>
            <div>
              <strong>4.8★</strong>
              <span>औसत रेटिंग</span>
            </div>
            <div>
              <strong>10k+</strong>
              <span>खुश ग्राहक</span>
            </div>
          </div>
        </div>
        <div className="hero-floating">
          <div className="float-card">
            <div className="float-header">
              <span>🔥 Trending</span>
              <span className="live-dot">● Live</span>
            </div>
            <div className="float-list">
              <div className="float-item">
                <span>⚡</span>
                <div>
                  <strong>Electrician</strong>
                  <small>3 near you</small>
                </div>
              </div>
              <div className="float-item">
                <span>🔧</span>
                <div>
                  <strong>Plumber</strong>
                  <small>2 near you</small>
                </div>
              </div>
              <div className="float-item">
                <span>🎨</span>
                <div>
                  <strong>Painter</strong>
                  <small>5 near you</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AdsterraBanner_320x50 />
      {/* ========== SEARCH ========== */}
      <section className="modern-search" id="search">
        <div className="search-container">
          <div className="search-heading">
            <span className="search-eyebrow">🔎 सेवा खोजें • FIND A SERVICE</span>
            <h2>आपको कौन-सा काम करवाना है?</h2>
            <p>
              अपनी जरूरत बताइए और अपने आसपास सही कारीगर खोजें।{" "}
              <span>Find the right professional near you.</span>
            </p>
          </div>
          <div className="search-box">
            <div className="search-input-area">
              <div className="search-input-wrapper">
                <span className="search-input-label">सेवा या काम खोजें</span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="जैसे — प्लंबर, पेंटर, ड्राइवर..."
                />
              </div>
              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
            <button
              className="search-submit"
              onClick={() => {
                const found = allServices.find(
                  (s) =>
                    s.title.toLowerCase() === search.toLowerCase() ||
                    s.hindi?.toLowerCase() === search.toLowerCase(),
                );
                if (found) navigateToService(found);
              }}
            >
              <span>खोजें</span>
              <small>Search</small>
              <strong>→</strong>
            </button>
          </div>
          <div className="search-tags">
            <span className="popular-label">लोकप्रिय • Popular</span>
            <button onClick={() => setSearch("Electrician")}>
              <span>⚡</span>बिजली<small>Electrician</small>
            </button>
            <button onClick={() => setSearch("Plumber")}>
              <span>🔧</span>प्लंबर<small>Plumber</small>
            </button>
            <button onClick={() => setSearch("Painter")}>
              <span>🎨</span>पेंटर<small>Painter</small>
            </button>
            <button onClick={() => setSearch("Driver")}>
              <span>🚕</span>ड्राइवर<small>Driver</small>
            </button>
            <button onClick={() => setSearch("Cook")}>
              <span>🍳</span>कुक<small>Cook</small>
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              <div className="results-header">
                <div>
                  <strong>मिलती-जुलती सेवाएँ</strong>
                  <span>Matching services</span>
                </div>
                <span className="results-count">{Math.min(searchResults.length, 6)}</span>
              </div>
              <div className="results-list">
                {searchResults.slice(0, 6).map((service) => (
                  <button
                    key={service.jobType}
                    className="search-result-item"
                    onClick={() => navigateToService(service)}
                    onMouseEnter={() => setHoveredService(service)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <span className="result-emoji">{getEmoji(service.title)}</span>
                    <div className="result-info">
                      <strong>{service.title}</strong>
                      <small>{service.hindi}</small>
                      {hoveredService?.jobType === service.jobType && (
                        <p className="service-description">
                          {lang === "hin" ? service.descriptionHindi : service.description}
                        </p>
                      )}
                    </div>
                    <span className="result-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="search-trust">
            <span>✓ भरोसेमंद कारीगर</span>
            <span>✓ आपके आसपास</span>
            <span>✓ आसान बुकिंग</span>
          </div>
        </div>
      </section>
      {/* ========== QUICK CATEGORIES ========== */}
      <section className="modern-categories" id="categories">
        <div className="section-header">
          <div>
            <span className="section-tag">📂 श्रेणियाँ</span>
            <h2>अपनी ज़रूरत की सेवा चुनें</h2>
            <p>घर, दुकान, शादी, खेती — हर काम के लिए सही प्रोफेशनल</p>
          </div>
        </div>
        <div className="category-grid">
          {serviceData.map((category) => {
            const meta = CATEGORY_META[category.heading] || {};
            return (
              <button
                key={category.heading}
                className="category-card"
                style={{ borderColor: meta.color || "#e2e8f0" }}
                onClick={() => handleCategoryClick(category.heading)}
              >
                <div
                  className="category-icon"
                  style={{ background: meta.soft || "#f1f5f9", color: meta.color || "#2563eb" }}
                >
                  {meta.emoji || "✨"}
                </div>
                <div className="category-info">
                  <h3>{lang === "hin" ? category.headingHindi : category.heading}</h3>
                  <span>
                    {Array.isArray(category.services) ? category.services.length : 0} सेवाएँ
                  </span>
                </div>
                <span className="category-arrow" style={{ color: meta.color || "#2563eb" }}>
                  →
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <AdsterraBanner_320x50 />
      {/* ========== AI ASSISTANT SECTION ========== */}
      <section className="modern-ai-section">
        <div className="ai-section-bg">
          <div className="ai-glow" />
        </div>
        <div className="ai-section-content">
          <div className="ai-orb-container">
            <div className="ai-orb">
              <span>🤖</span>
              <div className="orb-ring" />
              <div className="orb-ring ring-2" />
            </div>
          </div>
          <div className="ai-text">
            <span className="ai-badge">✨ AI ASSISTANT</span>
            <h2>
              काम बताइए, <span className="highlight">Aapkakaam AI</span> रास्ता बताएगा।
            </h2>
            <p>
              आपको सही सेवा का नाम नहीं पता? कोई बात नहीं। अपनी समस्या अपने शब्दों में बताएँ — हमारा
              AI आपको सही सेवा और प्रोफेशनल तक पहुँचाएगा।
            </p>
            <div className="ai-examples">
              <button onClick={() => handleAIExampleClick("Electrician")}>💡 “पंखा खराब है”</button>
              <button onClick={() => handleAIExampleClick("Plumber")}>🚰 “नल टपक रहा है”</button>
              <button onClick={() => handleAIExampleClick("AC Repair & Installation")}>
                ❄️ “AC ठंडा नहीं कर रहा”
              </button>
              <button onClick={() => handleAIExampleClick("Driver")}>🚗 “ड्राइवर चाहिए”</button>
              <button onClick={() => handleAIExampleClick("Deep Cleaning")}>
                🧹 “घर की सफाई करवानी”
              </button>
              <button onClick={() => handleAIExampleClick("Photography")}>📸 “शादी की फोटो”</button>
              <button onClick={() => handleAIExampleClick("Home Tutor")}>
                📚 “बच्चे को पढ़ाना”
              </button>
              <button onClick={() => handleAIExampleClick("Catering Service")}>
                🍲 “शादी का खाना”
              </button>
            </div>
            <button className="ai-chat-btn" onClick={() => setAiOpen(true)}>
              🤖 AI से बात करें
            </button>
          </div>
        </div>
      </section>
      <AdsterraBanner_320x50 />
      {/* ========== POPULAR SERVICES ========== */}
      <section className="modern-popular">
        <div className="section-header">
          <div>
            <span className="section-tag">⭐ लोकप्रिय</span>
            <h2>सबसे ज़्यादा बुक की गई सेवाएँ</h2>
          </div>
          <button className="see-all" onClick={() => navigate("/category")}>
            सभी देखें →
          </button>
        </div>
        <div className="popular-grid">
          {allServices.slice(0, 8).map((service) => (
            <button
              key={service.jobType}
              className="popular-card"
              onClick={() => navigateToService(service)}
              onMouseEnter={() => setHoveredService(service)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div className="popular-icon">{getEmoji(service.title)}</div>
              <div className="popular-info">
                <strong>{service.title}</strong>
                <small>{service.hindi}</small>
                {hoveredService?.jobType === service.jobType && (
                  <p className="service-description">
                    {lang === "hin" ? service.descriptionHindi : service.description}
                  </p>
                )}
              </div>
              <span className="popular-rating">⭐ 4.8</span>
            </button>
          ))}
        </div>
      </section>
      <AdsterraBanner_320x50 />
      {/* ========== ALL SERVICES ========== */}
      <section className="modern-all-services" id="all-services" ref={servicesSectionRef}>
        <div className="section-header">
          <div>
            <span className="section-tag">🧰 सभी सेवाएँ</span>
            <h2>हर काम के लिए एक साथी</h2>
            {activeCategory !== "All" && (
              <p style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 600 }}>
                {CATEGORY_HINDI[activeCategory] || activeCategory} की सेवाएँ देख रहे हैं
              </p>
            )}
          </div>
          {activeCategory !== "All" && (
            <button
              className="see-all"
              onClick={() => {
                setActiveCategory("All");
                setShowAll(true);
              }}
            >
              सभी देखें ✨
            </button>
          )}
        </div>
        <div className="filter-row">
          <button
            className={activeCategory === "All" ? "active" : ""}
            onClick={() => {
              setActiveCategory("All");
              setShowAll(true);
            }}
          >
            ✨ सभी
          </button>
          {serviceData.map((cat) => (
            <button
              key={cat.heading}
              className={activeCategory === cat.heading ? "active" : ""}
              onClick={() => {
                setActiveCategory(cat.heading);
                setShowAll(true);
              }}
            >
              {CATEGORY_META[cat.heading]?.emoji || "📌"}{" "}
              {CATEGORY_HINDI[cat.heading] || cat.heading}
            </button>
          ))}
        </div>
        {visibleCategories.map((category) => {
          const meta = CATEGORY_META[category.heading] || {};
          return (
            <div key={category.heading} className="service-group">
              <div className="service-group-header">
                <div>
                  <span className="group-icon">{meta.emoji || "📌"}</span>
                  <div>
                    <strong>{CATEGORY_HINDI[category.heading] || category.heading}</strong>
                    <small>{category.heading}</small>
                  </div>
                </div>
                <span>
                  {Array.isArray(category.services) ? category.services.length : 0} सेवाएँ
                </span>
              </div>
              <div className="service-grid">
                {(Array.isArray(category.services) ? category.services : []).map((service) => (
                  <button
                    key={service.jobType}
                    className="service-item"
                    style={{ "--accent": meta.color || "#2563eb" }}
                    onClick={() => navigateToService(service)}
                    onMouseEnter={() => setHoveredService(service)}
                    onMouseLeave={() => setHoveredService(null)}
                  >
                    <span className="service-emoji">{getEmoji(service.title)}</span>
                    <div className="service-item-content">
                      <strong>{service.title}</strong>
                      <small>{service.hindi}</small>
                      {hoveredService?.jobType === service.jobType && (
                        <p className="service-description">
                          {lang === "hin" ? service.descriptionHindi : service.description}
                        </p>
                      )}
                    </div>
                    <span className="service-available">●</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {activeCategory === "All" && !showAll && serviceData.length > 4 && (
          <button className="show-more-btn" onClick={() => setShowAll(true)}>
            सभी श्रेणियाँ देखें →
          </button>
        )}
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="modern-how">
        <div className="how-content">
          <span className="section-tag">📋 3 सरल कदम</span>
          <h2>अपना काम करवाएँ</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">01</div>
              <div>
                <h3>सेवा चुनें</h3>
                <p>अपनी ज़रूरत की सेवा खोजें और चुनें।</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">02</div>
              <div>
                <h3>तारीख चुनें</h3>
                <p>बताएँ कब आपको प्रोफेशनल चाहिए।</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">03</div>
              <div>
                <h3>काम पूरा करें</h3>
                <p>आसपास का प्रोफेशनल आपका काम करेगा।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="modern-cta">
        <div className="cta-content">
          <span>💡 अभी शुरू करें</span>
          <h2>
            अपने आसपास का <span className="highlight">सही प्रोफेशनल</span> खोजें
          </h2>
          <p>हजारों भरोसेमंद स्थानीय सेवा प्रदाता आपके इंतज़ार में हैं।</p>
          <button onClick={() => scrollTo("search")}>सेवा खोजें →</button>
        </div>
      </section>

      {/* ========== FLOATING AI ASSISTANT ========== */}
      {aiOpen && (
        <div className="ai-float-panel">
          <div className="ai-float-header">
            <div className="ai-float-avatar">🤖</div>
            <div>
              <strong>Aapkakaam AI</strong>
              <small>आपकी मदद के लिए तैयार</small>
            </div>
            <button className="ai-float-close" onClick={() => setAiOpen(false)}>
              ✕
            </button>
          </div>
          <div className="ai-float-body">
            {showPermissionCard && (
              <div className="ai-permission-card">
                <div className="permission-icon">🎙️</div>
                <div>
                  <strong>Microphone की अनुमति दें</strong>
                  <p>AI आपकी आवाज़ सुनकर सही सेवा खोजेगा।</p>
                </div>
                <div className="permission-actions">
                  <button className="allow-btn" onClick={requestMicrophonePermission}>
                    अनुमति दें
                  </button>
                  <button className="later-btn" onClick={() => setShowPermissionCard(false)}>
                    बाद में
                  </button>
                </div>
              </div>
            )}
            <div className="ai-message bot">
              {aiReply}
              {aiDetectedService && (
                <span className="ai-confidence">
                  ✅{" "}
                  {aiResults.length > 0 ? `${aiResults.length} सेवाएँ मिलीं` : "कोई सेवा नहीं मिली"}
                </span>
              )}
            </div>
            {aiTranscript && <div className="ai-message user">🎧 “{aiTranscript}”</div>}
            {aiDetectedService && (
              <div className="ai-detected">
                <span>✨</span>
                <div>
                  <small>AI ने पहचाना</small>
                  <strong>{aiDetectedService}</strong>
                </div>
              </div>
            )}
            {aiResults.length > 0 && (
              <div className="ai-results">
                <div className="ai-results-header">
                  <span>🔎 सेवाएँ</span>
                  <span>{aiResults.length}</span>
                </div>
                {aiResults.map((service) => (
                  <button
                    key={service.jobType}
                    className="ai-result-item"
                    onClick={() => selectAIResult(service)}
                  >
                    <span>{getEmoji(service.title)}</span>
                    <div>
                      <strong>{service.title}</strong>
                      <small>{service.hindi}</small>
                    </div>
                    <span className="ai-result-arrow">→</span>
                  </button>
                ))}
              </div>
            )}
            <div className="ai-voice-status">
              <span className={`voice-dot ${aiListening ? "listening" : ""}`} />
              <span>{aiListening ? "सुन रहा हूँ..." : "बोलकर सेवा खोजें"}</span>
              {aiListening && (
                <div className="ai-wave">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>
            <button
              className={`ai-mic-btn ${aiListening ? "listening" : ""}`}
              onClick={handleVoiceAssistantPress}
              disabled={aiListening}
            >
              <span>{aiListening ? "🔴" : "🎙️"}</span>
              {aiListening ? "बोलिए..." : "माइक दबाकर बोलें"}
            </button>
            <div className="ai-actions">
              <button onClick={speakAIReply}>🔊 सुनें</button>
              <button
                onClick={() => {
                  setSearch("");
                  setAiTranscript("");
                  setAiDetectedService("");
                  setAiResults([]);
                  setAiReply("नमस्ते 👋 मैं Aapkakaam AI हूँ। बोलकर बताइए आपको कौन-सी सेवा चाहिए।");
                }}
              >
                🔄 नई खोज
              </button>
            </div>
          </div>
        </div>
      )}

      <button className={`ai-float-btn ${aiOpen ? "open" : ""}`} onClick={() => setAiOpen(!aiOpen)}>
        <span className="ai-btn-pulse" />
        <span className="ai-btn-icon">{aiOpen ? "✕" : "🤖"}</span>
        {!aiOpen && <span className="ai-btn-label">AI</span>}
      </button>
    </main>
  );
}
