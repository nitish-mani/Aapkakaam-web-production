import React, { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { SERVER_URL } from "../../utils/base";
import { addDataVendor } from "../../utils/vendorslice";
import { addDataUser } from "../../utils/userslice";
import AdsterraBanner_320x50 from "../../ads/adsterraInFrameBanner";
import serviceData from "../../data/serviceData";
import "./body.css";

const CATEGORY_META = {
  "Construction & Work": {
    emoji: "🏗️",
    color: "#2563eb",
    soft: "#eff6ff",
    gradient: "linear-gradient(135deg,#2563eb,#60a5fa)",
    desc: "आपके आसपास उपलब्ध निर्माण और मजदूरी की भरोसेमंद सेवाएँ।",
    hi: "आपकी सभी निर्माण आवश्यकताओं के लिए पेशेवर सेवाएँ।",
  },
  Repair: {
    emoji: "🔧",
    color: "#ea580c",
    soft: "#fff7ed",
    gradient: "linear-gradient(135deg,#ea580c,#fb923c)",
    desc: "घर और उपकरणों की मरम्मत के लिए स्थानीय विशेषज्ञ।",
    hi: "घर और उपकरणों के लिए विशेषज्ञ मरम्मत सेवाएँ।",
  },
  "Daily Need": {
    emoji: "📋",
    color: "#059669",
    soft: "#ecfdf5",
    gradient: "linear-gradient(135deg,#059669,#34d399)",
    desc: "रोज़मर्रा की ज़रूरतों के लिए आपके आसपास की सेवाएँ।",
    hi: "आपके जीवन को सरल बनाने वाली आवश्यक दैनिक सेवाएँ।",
  },
  Function: {
    emoji: "🎉",
    color: "#7c3aed",
    soft: "#f5f3ff",
    gradient: "linear-gradient(135deg,#7c3aed,#a78bfa)",
    desc: "शादी, समारोह और कार्यक्रम के लिए स्थानीय सेवा प्रदाता।",
    hi: "संपूर्ण कार्यक्रम प्रबंधन और समारोह सेवाएँ।",
  },
  Transportation: {
    emoji: "🚗",
    color: "#0284c7",
    soft: "#f0f9ff",
    gradient: "linear-gradient(135deg,#0284c7,#38bdf8)",
    desc: "आने-जाने और सामान ढुलाई के लिए स्थानीय परिवहन।",
    hi: "हर आवश्यकता के लिए सुरक्षित और विश्वसनीय परिवहन।",
  },
  "Rural Work": {
    emoji: "🌾",
    color: "#a16207",
    soft: "#fefce8",
    gradient: "linear-gradient(135deg,#a16207,#eab308)",
    desc: "गाँव और ग्रामीण क्षेत्रों की ज़रूरतों के लिए स्थानीय सेवाएँ।",
    hi: "ग्रामीण समुदायों के लिए समर्पित सेवाएँ।",
  },
  "Home Services": {
    emoji: "🏠",
    color: "#0891b2",
    soft: "#ecfeff",
    gradient: "linear-gradient(135deg,#0891b2,#22d3ee)",
    desc: "घर की सफाई, मरम्मत और रखरखाव सेवाएँ।",
    hi: "आपके घर को साफ-सुथरा और बेहतर बनाने के लिए सेवाएँ।",
  },
  "Health & Wellness": {
    emoji: "❤️",
    color: "#dc2626",
    soft: "#fef2f2",
    gradient: "linear-gradient(135deg,#dc2626,#f87171)",
    desc: "आपके स्वास्थ्य और तंदुरुस्ती के लिए सेवाएँ।",
    hi: "आपके स्वास्थ्य और फिटनेस के लिए विशेषज्ञ सेवाएँ।",
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

const CATEGORY_HINDI = {
  "Construction & Work": "निर्माण और मजदूरी",
  Repair: "मरम्मत और सर्विस",
  "Daily Need": "रोज़मर्रा की ज़रूरत",
  Function: "शादी और समारोह",
  Transportation: "यातायात और वाहन",
  "Rural Work": "खेती और ग्रामीण काम",
  "Home Services": "घरेलू सेवाएँ",
  "Health & Wellness": "स्वास्थ्य सेवाएँ",
  "Education & Coaching": "शिक्षा सेवाएँ",
};

const SERVICE_EMOJI = {
  Labour: "👷",
  Mason: "🧱",
  Electrician: "⚡",
  Plumber: "🔧",
  Painter: "🎨",
  Carpenter: "🪚",
  "Tiles Fitter": "🔲",
  "Marble Fitter": "💎",
  Shuttering: "🏗️",
  Welder: "🔥",
  Fabricator: "🔩",
  "Glass Fitter": "🪟",
  "POP Worker": "🎭",
  "AC Mechanic": "❄️",
  "Fridge Mechanic": "🧊",
  "Bike Repair": "🏍️",
  "Car Repair": "🚗",
  "Laptop Repair": "💻",
  "CCTV Installation": "📹",
  "Inverter Repair": "🔋",
  "Microwave Repair": "📡",
  Driver: "🚕",
  "Home Tutor": "📚",
  "Milk Man": "🥛",
  "Washer Man": "👕",
  Gardener: "🌱",
  "Security Guard": "🛡️",
  "House Maid": "🧹",
  "Baby Sitter": "👶",
  "Old Age Caregiver": "🤝",
  Parlour: "💄",
  "Mehandi Maker": "🤲",
  "Pandit Ji": "🕉️",
  Cook: "🍳",
  Lights: "💡",
  "Tent House": "⛺",
  "Kirtan Mandali": "🎵",
  Generator: "⚡",
  DJ: "🎧",
  Waiter: "🍽️",
  RO: "💧",
  Chaat: "🌮",
  "Dulha Rath": "🐎",
  "Paan Wala": "🌿",
  "Fruits Seller": "🍎",
  "Marriage Hall": "💒",
  Photographer: "📸",
  Videographer: "🎥",
  "Makeup Artist": "💋",
  "Band Party": "🥁",
  Fireworks: "🎆",
  Catering: "🍲",
  "Four Wheeler": "🚙",
  Bus: "🚌",
  Auto: "🛺",
  "E-Rikshaw": "🛵",
  "Mini Truck": "🚚",
  Tempo: "🚐",
  Tractor: "🚜",
  "Pickup Van": "🛻",
  Dhankutti: "🌾",
  "Aata Chakki": "🌾",
  "Latrine Tank Cleaner": "🧹",
  "Pual Cutter": "✂️",
  "Bhoonsa Pual Seller": "🌾",
  "Tractor Ploughing": "🚜",
  "Crop Sprayer": "🌱",
  "Well Driller": "⛰️",
  "Pest Control": "🐜",
  "Deep Cleaning": "🧽",
  "Sofa Cleaning": "🛋️",
  "Carpet Cleaning": "🧹",
  "Water Tank Cleaning": "💧",
  "AC Service": "❄️",
  "Geyser Repair": "🔥",
  "Washing Machine Repair": "🧺",
  "TV Repair": "📺",
  "Mobile Repair": "📱",
  Physiotherapist: "💪",
  "Yoga Trainer": "🧘",
  "Nurse at Home": "👩‍⚕️",
  "Lab Test at Home": "🧪",
  Ambulance: "🚑",
  "Blood Donor": "🩸",
  "Computer Trainer": "💻",
  "Music Teacher": "🎵",
  "Dance Teacher": "💃",
  "Art Teacher": "🎨",
  "Language Trainer": "🗣️",
};

const getEmoji = (title) => SERVICE_EMOJI[title] || "✨";

export default function Body() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accountType = localStorage.getItem("category");

  // Ref for scrolling to services section
  const servicesSectionRef = useRef(null);
  const mainRef = useRef(null);

  const userData = useSelector((state) =>
    accountType === "user" ? state.user.data : state.vendor.data,
  );

  const lang = useSelector((store) => store.category.selectLanguage);

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

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });

    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, []);

  const allServices = useMemo(() => {
    if (!Array.isArray(serviceData)) return [];

    return serviceData.flatMap((category) => {
      if (!Array.isArray(category?.services)) return [];

      return category.services.filter(Boolean);
    });
  }, []);

  const totalServices = allServices.length;

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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        if (!navigator.onLine) throw new Error("offline");

        const id = accountType === "vendor" ? userData[0]?.vendorId : userData[0]?.userId;

        if (!id) return;

        if (accountType === "vendor") {
          const { data } = await axios.get(`${SERVER_URL}/vendor/getVendorByVendor/${id}`, {
            headers: {
              Authorization: `Bearer ${userData[0]?.token}`,
            },
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
            headers: {
              Authorization: `Bearer ${userData[0]?.token}`,
            },
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

  // Handle category click - scroll to services and filter
  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    setShowAll(true);

    // Scroll to services section with delay to ensure render
    setTimeout(() => {
      if (servicesSectionRef.current) {
        servicesSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        // Fallback: scroll to id
        document.getElementById("all-services")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // UPDATED: Handle service selection with full service data including descriptions
  const handleServiceSelect = (service) => {
    const token = JSON.parse(localStorage.getItem(accountType) || "{}")?.token;

    if (token) {
      // Pass the full service data to the next page
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
      // If not logged in, pass service data to category page
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
  };

  // UPDATED: Handle category selection with service data
  const handleCategorySelect = (categoryName) => {
    navigate("/category", { state: { category: categoryName } });
  };

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
      } catch {
        // Some browsers do not expose microphone permission state.
      }
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

  const normalizeVoiceText = (value = "") =>
    value
      .toLowerCase()
      .replace(/[.,!?;:'"()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const findBestLocalService = (spokenText = "") => {
    const text = normalizeVoiceText(spokenText);

    const intentMap = [
      {
        terms: [
          "electrician",
          "electric",
          "electrical",
          "बिजली",
          "इलेक्ट्रिशियन",
          "पंखा",
          "फैन",
          "स्विच",
          "वायरिंग",
        ],
        service: "Electrician",
      },
      {
        terms: [
          "plumber",
          "plumbing",
          "water leakage",
          "tap repair",
          "नल",
          "प्लंबर",
          "पानी",
          "लीकेज",
          "पाइप",
          "टंकी",
        ],
        service: "Plumber",
      },
      {
        terms: ["painter", "painting", "paint", "पेंटर", "पेंट", "रंग", "पुताई"],
        service: "Painter",
      },
      {
        terms: ["carpenter", "wood work", "बढ़ई", "बढई", "लकड़ी", "फर्नीचर"],
        service: "Carpenter",
      },
      { terms: ["driver", "driving", "ड्राइवर", "चालक"], service: "Driver" },
      { terms: ["ac", "air conditioner", "ac repair", "एसी", "कूलिंग"], service: "AC Mechanic" },
      { terms: ["fridge", "refrigerator", "फ्रिज", "फ्रीज"], service: "Fridge Mechanic" },
      { terms: ["bike", "motorcycle", "बाइक", "मोटरसाइकिल"], service: "Bike Repair" },
      { terms: ["car", "कार", "गाड़ी"], service: "Car Repair" },
      { terms: ["mobile", "phone", "मोबाइल", "फोन"], service: "Mobile Repair" },
      { terms: ["laptop", "computer", "लैपटॉप", "कंप्यूटर"], service: "Laptop Repair" },
      {
        terms: ["tutor", "teacher", "home tutor", "tuition", "ट्यूटर", "शिक्षक", "ट्यूशन", "पढ़ाई"],
        service: "Home Tutor",
      },
      { terms: ["cook", "cooking", "food", "कुक", "खाना", "रसोइया"], service: "Cook" },
      { terms: ["dj", "music", "डीजे", "संगीत"], service: "DJ" },
      { terms: ["photographer", "photography", "फोटोग्राफर", "फोटो"], service: "Photographer" },
      { terms: ["cctv", "camera installation", "सीसीटीवी", "कैमरा"], service: "CCTV Installation" },
      { terms: ["gardener", "garden", "माली", "बगीचा", "पौधे"], service: "Gardener" },
      {
        terms: ["cleaning", "cleaner", "house cleaning", "सफाई", "क्लीनिंग"],
        service: "Deep Cleaning",
      },
      { terms: ["tractor", "ट्रैक्टर"], service: "Tractor" },
      { terms: ["driver", "ड्राइवर"], service: "Driver" },
      { terms: ["tent", "टेंट"], service: "Tent House" },
    ];

    const intent = intentMap.find(({ terms }) =>
      terms.some((term) => text === term || text.includes(term)),
    );

    return intent?.service || null;
  };

  const getAIServiceResults = (spokenText = "", detectedService = "") => {
    const text = normalizeVoiceText(spokenText);
    const detected = normalizeVoiceText(detectedService);
    const directTarget = detected || normalizeVoiceText(findBestLocalService(spokenText) || "");

    if (directTarget) {
      const directMatches = allServices.filter((service) => {
        const title = normalizeVoiceText(service.title);
        const hindi = normalizeVoiceText(service.hindi || "");
        return (
          title === directTarget ||
          title.includes(directTarget) ||
          directTarget.includes(title) ||
          hindi.includes(directTarget) ||
          directTarget.includes(hindi)
        );
      });
      if (directMatches.length) return directMatches.slice(0, 8);
    }

    const intentService = findBestLocalService(spokenText);
    if (intentService) {
      const intentMatches = allServices.filter((service) => {
        const title = normalizeVoiceText(service.title);
        return (
          title === normalizeVoiceText(intentService) ||
          title.includes(normalizeVoiceText(intentService)) ||
          normalizeVoiceText(intentService).includes(title)
        );
      });
      if (intentMatches.length) return intentMatches.slice(0, 8);
    }

    const words = text
      .split(" ")
      .map((word) => word.trim())
      .filter((word) => word.length >= 2);

    if (!words.length) return [];

    return allServices
      .map((service) => {
        const title = normalizeVoiceText(service.title);
        const hindi = normalizeVoiceText(service.hindi || "");
        let score = 0;
        words.forEach((word) => {
          if (title.includes(word)) score += 3;
          if (hindi.includes(word)) score += 2;
        });
        return { service, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.service);
  };

  const findServiceFromVoice = (spokenText = "") => {
    const text = spokenText.toLowerCase();
    const keywordMap = [
      ["electrician", "Electrician"],
      ["electric", "Electrician"],
      ["electrical", "Electrician"],
      ["पंखा", "Electrician"],
      ["बिजली", "Electrician"],
      ["स्विच", "Electrician"],
      ["वायरिंग", "Electrician"],
      ["इलेक्ट्रिशियन", "Electrician"],
      ["नल", "Plumber"],
      ["पाइप", "Plumber"],
      ["लीकेज", "Plumber"],
      ["पानी", "Plumber"],
      ["प्लंबर", "Plumber"],
      ["एसी", "AC Mechanic"],
      ["ac", "AC Mechanic"],
      ["फ्रिज", "Fridge Mechanic"],
      ["रेफ्रिजरेटर", "Fridge Mechanic"],
      ["मोबाइल", "Mobile Repair"],
      ["फोन", "Mobile Repair"],
      ["लैपटॉप", "Laptop Repair"],
      ["कंप्यूटर", "Laptop Repair"],
      ["गाड़ी", "Car Repair"],
      ["कार", "Car Repair"],
      ["बाइक", "Bike Repair"],
      ["मोटरसाइकिल", "Bike Repair"],
      ["ड्राइवर", "Driver"],
      ["पेंट", "Painter"],
      ["पेंटर", "Painter"],
      ["रंग", "Painter"],
      ["बढ़ई", "Carpenter"],
      ["लकड़ी", "Carpenter"],
      ["सफाई", "Deep Cleaning"],
      ["क्लीनिंग", "Deep Cleaning"],
      ["माली", "Gardener"],
      ["बगीचा", "Gardener"],
      ["पौधा", "Gardener"],
      ["ट्यूशन", "Home Tutor"],
      ["पढ़ाई", "Home Tutor"],
      ["शिक्षक", "Home Tutor"],
      ["शादी", "Marriage Hall"],
      ["कैटरिंग", "Catering"],
      ["खाना", "Cook"],
      ["कुक", "Cook"],
      ["डीजे", "DJ"],
      ["संगीत", "DJ"],
      ["फोटो", "Photographer"],
      ["फोटोग्राफर", "Photographer"],
      ["सीसीटीवी", "CCTV Installation"],
      ["cctv", "CCTV Installation"],
      ["ट्रैक्टर", "Tractor"],
      ["खेती", "Tractor Ploughing"],
      ["किसान", "Tractor Ploughing"],
      ["शिफ्ट", "Mini Truck"],
      ["मूविंग", "Mini Truck"],
      ["टेंट", "Tent House"],
      ["ब्यूटी", "Parlour"],
      ["मेकअप", "Makeup Artist"],
    ];

    const found = keywordMap.find(([keyword]) => text.includes(keyword));
    return found ? found[1] : null;
  };

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
        const service = findServiceFromVoice(transcript);
        const detected = findBestLocalService(transcript) || service || "";
        const results = getAIServiceResults(transcript, detected);
        setAiDetectedService(detected);
        setAiResults(results);
        if (detected) setSearch(detected);

        if (detected && results.length) {
          setAiReply(
            `समझ गया 👍 आपको "${detected}" सेवा की ज़रूरत लग रही है। नीचे आपके लिए मिलती-जुलती सेवाएँ हैं।`,
          );
        } else if (detected) {
          setAiReply(
            `समझ गया 👍 शायद आपको "${detected}" सेवा चाहिए। नीचे उपलब्ध विकल्प खोज रहा हूँ।`,
          );
        } else if (results.length) {
          setAiReply(`मैंने सुना: “${transcript}” 🎧 नीचे आपकी बात से मिलती-जुलती सेवाएँ हैं।`);
        } else {
          setAiReply(
            `मैंने सुना: “${transcript}” 🎧 मुझे पक्का match नहीं मिला। आप थोड़ा और विवरण बताइए।`,
          );
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

  const selectAIResult = (service) => {
    setAiDetectedService(service.title);
    setAiResults([service]);
    setAiReply(
      `✅ "${service.title}" चुनी गई। ${service.hindi || "इस सेवा"} के लिए आगे बढ़ सकते हैं।`,
    );
    setSearch(service.title);
    setSelectedService(service);
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

  // Render location text
  const postLocation = useSelector((store) => store.category.location_post);
  const pinLocation = useSelector((store) => store.category.location_pincode);
  const locationText = postLocation
    ? `${postLocation}${pinLocation ? `, ${pinLocation}` : ""}`
    : userData?.[0]?.address?.[0]
      ? `${userData[0].address[0].post}, ${userData[0].address[0].pincode}`
      : "अपना स्थान चुनें • Select your location";

  return (
    <main className="modern-body body-with-global-nav" ref={mainRef}>
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
              <strong>500+</strong>
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

      {/* ========== SEARCH ========== */}
      <section className="modern-search" id="search">
        <div className="search-container">
          <div className="search-heading">
            <span className="search-eyebrow">🔎 सेवा खोजें • FIND A SERVICE</span>

            <h2>आपको कौन-सा काम करवाना है?</h2>

            <p>
              अपनी जरूरत बताइए और अपने आसपास सही कारीगर खोजें।
              <span> Find the right professional near you.</span>
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

            <button className="search-submit">
              <span>खोजें</span>
              <small>Search</small>
              <strong>→</strong>
            </button>
          </div>

          <div className="search-tags">
            <span className="popular-label">लोकप्रिय • Popular</span>

            <button onClick={() => setSearch("Electrician")}>
              <span>⚡</span>
              बिजली
              <small>Electrician</small>
            </button>

            <button onClick={() => setSearch("Plumber")}>
              <span>🔧</span>
              प्लंबर
              <small>Plumber</small>
            </button>

            <button onClick={() => setSearch("Painter")}>
              <span>🎨</span>
              पेंटर
              <small>Painter</small>
            </button>

            <button onClick={() => setSearch("Driver")}>
              <span>🚕</span>
              ड्राइवर
              <small>Driver</small>
            </button>

            <button onClick={() => setSearch("Cook")}>
              <span>🍳</span>
              कुक
              <small>Cook</small>
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
                    onClick={() => handleServiceSelect(service)}
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
              काम बताइए, <span className="highlight">AapkaKaam AI</span> रास्ता बताएगा।
            </h2>
            <p>
              आपको सही सेवा का नाम नहीं पता? कोई बात नहीं। अपनी समस्या अपने शब्दों में बताएँ — हमारा
              AI आपको सही सेवा और प्रोफेशनल तक पहुँचाएगा।
            </p>
            <div className="ai-examples">
              <button onClick={() => searchFor("Electrician")}>💡 “पंखा खराब है”</button>
              <button onClick={() => searchFor("Plumber")}>🚰 “नल टपक रहा है”</button>
              <button onClick={() => searchFor("AC Mechanic")}>❄️ “AC ठंडा नहीं कर रहा”</button>
              <button onClick={() => searchFor("Driver")}>🚗 “ड्राइवर चाहिए”</button>
            </div>
            <button className="ai-chat-btn" onClick={() => setAiOpen(true)}>
              🤖 AI से बात करें
            </button>
          </div>
        </div>
      </section>

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
              onClick={() => handleServiceSelect(service)}
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
                    onClick={() => handleServiceSelect(service)}
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
                <p>हमारा प्रोफेशनल आपका काम करेगा।</p>
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
              <strong>AapkaKaam AI</strong>
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

            <div className="ai-message bot">{aiReply}</div>

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
                    <span>→</span>
                  </button>
                ))}
              </div>
            )}

            <div className="ai-voice-status">
              <span className={`voice-dot ${aiListening ? "listening" : ""}`} />
              <span>{aiListening ? "सुन रहा हूँ..." : "बोलकर सेवा खोजें"}</span>
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
                  setAiReply("नमस्ते 👋 मैं AapkaKaam AI हूँ। बोलकर बताइए आपको कौन-सी सेवा चाहिए।");
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
