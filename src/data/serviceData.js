// Construction
import labour from "../resources/img/labour.png";
import mason from "../resources/img/mason.jpg";
import electrician from "../resources/img/electrician.jpg";
import plumber from "../resources/img/plumber.jpg";
import painter from "../resources/img/painter.jpg";
import carpenter from "../resources/img/carpenter.jpg";
import tileFitter from "../resources/img/tile_fitter.jpg";
import marbleWorker from "../resources/img/marble_fitter.jpg";
import shuttering from "../resources/img/shuttering.jpg";
import welder from "../resources/img/welder.jpg";
import fabricator from "../resources/img/fabricator.jpg";
import glassFitter from "../resources/img/glass_fitter.jpg";
import popWorker from "../resources/img/pop_worker.jpg";

// Repair
import acMechanic from "../resources/img/ac_mechanic.jpg";
import fridgeMechanic from "../resources/img/fridge_mechanic.jpg";
import bikeRepair from "../resources/img/bike_repaire.jpg";
import carRepair from "../resources/img/car_repaire.jpg";
import laptopRepair from "../resources/img/laptop_repaire.jpg";
import cctv from "../resources/img/cctv.jpg";
import inverterRepair from "../resources/img/inverter_repair.jpg";
import microwaveRepair from "../resources/img/microwave_repair.jpg";

// Daily Need
import driver from "../resources/img/driver.jpg";
import homeTutor from "../resources/img/home_tutor.jpg";
import milkMan from "../resources/img/milk_man.jpg";
import washerMan from "../resources/img/washer_man.jpg";
import gardener from "../resources/img/gardener.jpg";
import securityGuard from "../resources/img/security_guard.jpg";
import houseMaid from "../resources/img/house_maid.jpg";
import babySitter from "../resources/img/baby_sitter.jpg";
import oldAgeCare from "../resources/img/old_age_care.jpg";

// Function
import parlour from "../resources/img/parlour.jpg";
import mehandiMaker from "../resources/img/mehandi_maker.jpg";
import pandit from "../resources/img/pandit.jpg";
import cook from "../resources/img/cook.jpg";
import lightsBooking from "../resources/img/lights_booking.jpg";
import tent from "../resources/img/tent.jpg";
import kirtanMandali from "../resources/img/kirtan_mandali.jpg";
import generator from "../resources/img/generator.jpg";
import dj from "../resources/img/dj.jpg";
import waiters from "../resources/img/waiters.jpg";
import ro from "../resources/img/ro.jpg";
import chaat from "../resources/img/chaat.jpg";
import dulhaRath from "../resources/img/dulha_rath.jpg";
import paanWala from "../resources/img/paan_wala.jpg";
import fruitsSeller from "../resources/img/fruits_seller.jpg";
import marriageHall from "../resources/img/marriage_hall.jpg";
import photographer from "../resources/img/photographer.jpg";
import videographer from "../resources/img/photographer.jpg";
import makeupArtist from "../resources/img/makeup_artist.jpg";
import bandParty from "../resources/img/band_party.jpg";
import fireworks from "../resources/img/fireworks.jpg";
import catering from "../resources/img/catering.jpg";

// Transportation
import car from "../resources/img/car.jpg";
import bus from "../resources/img/bus.jpg";
import auto from "../resources/img/auto.jpg";
import eRikshaw from "../resources/img/e-rikshaw.jpg";
import miniTruck from "../resources/img/mini_truck.jpg";

// Rural Work
import dhankutti from "../resources/img/dhankutti.jpg";
import aataChakki from "../resources/img/aata_chakki.jpg";
import latrineTankCleaner from "../resources/img/latrine_tank_cleaner.jpg";
import pualCutter from "../resources/img/pual_cutter.jpg";
import bhoonsaSeller from "../resources/img/bhoonsa_pual_wala.jpg";

// // Home Services
import pestControl from "../resources/img/pest_control.jpg";
import deepCleaning from "../resources/img/deep_cleaning.jpg";
import waterTankCleaning from "../resources/img/water_tank_cleaning.jpg";
import geyserRepair from "../resources/img/geyser_repair.jpg";
import washingMachineRepair from "../resources/img/washing_machine_repair.jpg";
import tvRepair from "../resources/img/tv_repair.jpg";

// // Education
import computerTrainer from "../resources/img/computer_trainer.jpg";
// import musicTeacher from "../resources/img/music_teacher.jpg";
// import danceTeacher from "../resources/img/dance_teacher.jpg";
// import artTeacher from "../resources/img/art_teacher.jpg";
// import languageTrainer from "../resources/img/language_trainer.jpg";

export const serviceData = [
  // =========================================================
  // CONSTRUCTION
  // =========================================================

  {
    heading: "Construction & Work",
    headingHindi: "निर्माण कार्य",

    services: [
      {
        title: "Labour",
        hindi: "मजदूर",
        image: labour,
        jobType: "labour",
        description: "Reliable labour for construction, loading, shifting and general work.",
        descriptionHindi:
          "घर, दुकान, निर्माण स्थल, सामान उठाने-रखने और दूसरे मेहनत के काम के लिए भरोसेमंद मजदूर खोजें।",
      },

      {
        title: "Mason",
        hindi: "राजमिस्त्री",
        image: mason,
        jobType: "mason",
        description: "Book a mason for brickwork, walls, plastering and house construction.",
        descriptionHindi:
          "ईंट की चिनाई, दीवार, प्लास्टर और मकान बनाने के काम के लिए राजमिस्त्री बुक करें।",
      },

      {
        title: "Electrician",
        hindi: "बिजली मिस्त्री",
        image: electrician,
        jobType: "electrician",
        description: "Get help with wiring, fans, lights, switches and electrical problems.",
        descriptionHindi:
          "वायरिंग, पंखा, बल्ब, स्विच, बोर्ड और बिजली की खराबी ठीक करवाने के लिए बिजली मिस्त्री बुलाएँ।",
      },

      {
        title: "Plumber",
        hindi: "प्लंबर",
        image: plumber,
        jobType: "plumber",
        description: "Get plumbing help for taps, pipes, leaks, tanks and bathrooms.",
        descriptionHindi: "नल, पाइप, पानी की लीकेज, टंकी और बाथरूम के काम के लिए प्लंबर बुलाएँ।",
      },

      {
        title: "Painter",
        hindi: "पेंटर",
        image: painter,
        jobType: "painter",
        description: "Book a painter for home, shop, room painting and finishing work.",
        descriptionHindi: "घर, कमरे या दुकान की पेंटिंग, रंग-रोगन और फिनिशिंग का काम करवाएँ।",
      },

      {
        title: "Carpenter",
        hindi: "बढ़ई",
        image: carpenter,
        jobType: "carpenter",
        description: "Find a carpenter for doors, windows, furniture, cupboards and woodwork.",
        descriptionHindi: "दरवाजा, खिड़की, फर्नीचर, अलमारी और लकड़ी के काम के लिए बढ़ई बुलाएँ।",
      },

      {
        title: "Tiles Fitter",
        hindi: "टाइल मिस्त्री",
        image: tileFitter,
        jobType: "tiles fitter",
        description: "Book tile fitting for floors, walls, kitchens and bathrooms.",
        descriptionHindi:
          "फर्श, दीवार, किचन और बाथरूम में टाइल लगाने के लिए टाइल मिस्त्री बुक करें।",
      },

      {
        title: "Marble Fitter",
        hindi: "मार्बल मिस्त्री",
        image: marbleWorker,
        jobType: "marble fitter",
        description: "Get marble fitting for floors, stairs, kitchens and other surfaces.",
        descriptionHindi:
          "फर्श, सीढ़ी, किचन और घर की दूसरी जगहों पर मार्बल लगवाने के लिए मिस्त्री खोजें।",
      },

      {
        title: "Shuttering",
        hindi: "शटरिंग बुकिंग",
        image: shuttering,
        jobType: "shuttering",
        description: "Book shuttering support for roofs, slabs and construction work.",
        descriptionHindi: "छत, स्लैब और निर्माण कार्य के लिए शटरिंग लगाने की सेवा बुक करें।",
      },

      {
        title: "Welder",
        hindi: "वेल्डर",
        image: welder,
        jobType: "welder",
        description: "Find a welder for gates, grills, railings, frames and metal work.",
        descriptionHindi:
          "गेट, ग्रिल, रेलिंग, फ्रेम और लोहे की वेल्डिंग के काम के लिए वेल्डर बुलाएँ।",
      },

      {
        title: "Fabricator",
        hindi: "फैब्रिकेटर",
        image: fabricator,
        jobType: "fabricator",
        description: "Get custom metal fabrication for gates, grills, sheds and railings.",
        descriptionHindi:
          "गेट, ग्रिल, शेड, रेलिंग और लोहे के दूसरे स्ट्रक्चर बनवाने के लिए फैब्रिकेटर खोजें।",
      },

      {
        title: "Glass Fitter",
        hindi: "कांच मिस्त्री",
        image: glassFitter,
        jobType: "glass fitter",
        description: "Book glass fitting for windows, doors, shops and partitions.",
        descriptionHindi:
          "खिड़की, दरवाजा, दुकान और पार्टिशन में कांच लगवाने के लिए कांच मिस्त्री बुलाएँ।",
      },

      {
        title: "POP Worker",
        hindi: "पीओपी मिस्त्री",
        image: popWorker,
        jobType: "pop worker",
        description: "Get POP, ceiling design and decorative finishing work.",
        descriptionHindi:
          "घर या ऑफिस की POP, सीलिंग डिजाइन और सजावटी फिनिशिंग के लिए POP मिस्त्री बुक करें।",
      },
    ],
  },

  // =========================================================
  // REPAIR
  // =========================================================

  {
    heading: "Repair",
    headingHindi: "मरम्मत सेवा",

    services: [
      {
        title: "AC Mechanic",
        hindi: "एसी मिस्त्री",
        image: acMechanic,
        jobType: "ac mechanic",
        description: "Book an AC mechanic for cooling, leakage, servicing and common faults.",
        descriptionHindi:
          "AC ठंडा नहीं कर रहा, पानी टपक रहा है या सर्विस करवानी है? AC मिस्त्री बुलाएँ।",
      },

      {
        title: "Fridge Mechanic",
        hindi: "फ्रिज मिस्त्री",
        image: fridgeMechanic,
        jobType: "fridge mechanic",
        description: "Get help with fridge cooling, gas, electrical and common faults.",
        descriptionHindi:
          "फ्रिज ठंडा नहीं कर रहा या कूलिंग और दूसरी खराबी है तो फ्रिज मिस्त्री बुलाएँ।",
      },

      {
        title: "Bike Repair",
        hindi: "बाइक रिपेयर",
        image: bikeRepair,
        jobType: "bike repaire",
        description: "Find help for bike servicing, brakes, tyres, engine and repairs.",
        descriptionHindi:
          "बाइक की सर्विस, ब्रेक, टायर, इंजन और दूसरी खराबी ठीक करवाने के लिए मिस्त्री खोजें।",
      },

      {
        title: "Car Repair",
        hindi: "कार रिपेयर",
        image: carRepair,
        jobType: "car repaire",
        description: "Book car servicing and repair for brakes, battery, engine and common faults.",
        descriptionHindi:
          "कार की सर्विस, ब्रेक, बैटरी, इंजन और सामान्य रिपेयर के लिए मिस्त्री बुलाएँ।",
      },

      {
        title: "Laptop Repair",
        hindi: "लैपटॉप रिपेयर",
        image: laptopRepair,
        jobType: "laptop repaire",
        description: "Get help with slow, damaged or non-working laptops.",
        descriptionHindi:
          "लैपटॉप चालू नहीं हो रहा, धीमा है या हार्डवेयर-सॉफ्टवेयर की समस्या है तो रिपेयर सेवा लें।",
      },

      {
        title: "CCTV Installation",
        hindi: "सीसीटीवी इंस्टालेशन",
        image: cctv,
        jobType: "cctv installation",
        description: "Install CCTV at homes, shops and offices for security and monitoring.",
        descriptionHindi: "घर, दुकान या ऑफिस में CCTV कैमरा लगवाकर सुरक्षा और निगरानी बेहतर करें।",
      },

      {
        title: "Inverter Repair",
        hindi: "इन्वर्टर मरम्मत",
        image: inverterRepair,
        jobType: "inverter repair",
        description: "Get inverter and battery support for charging and backup problems.",
        descriptionHindi:
          "इन्वर्टर, बैटरी, चार्जिंग और बिजली बैकअप की खराबी ठीक करवाने के लिए मिस्त्री बुलाएँ।",
      },

      {
        title: "Microwave Repair",
        hindi: "माइक्रोवेव मरम्मत",
        image: microwaveRepair,
        jobType: "microwave repair",
        description: "Book a technician for microwave heating and common faults.",
        descriptionHindi: "माइक्रोवेव गर्म नहीं कर रहा या दूसरी खराबी है तो मिस्त्री की सेवा लें।",
      },
    ],
  },

  // =========================================================
  // DAILY NEED
  // =========================================================

  {
    heading: "Daily Need",
    headingHindi: "दैनिक आवश्यकता",

    services: [
      {
        title: "Driver",
        hindi: "ड्राइवर",
        image: driver,
        jobType: "driver",
        description: "Find a driver for daily travel, office work, weddings and trips.",
        descriptionHindi:
          "घर, ऑफिस, शादी, यात्रा या रोजमर्रा के आने-जाने के लिए भरोसेमंद ड्राइवर खोजें।",
      },

      {
        title: "Home Tutor",
        hindi: "होम ट्यूटर",
        image: homeTutor,
        jobType: "home tutor",
        description: "Find a home tutor for school subjects, homework and exam preparation.",
        descriptionHindi:
          "बच्चों की पढ़ाई, होमवर्क और परीक्षा की तैयारी के लिए घर पर ट्यूटर खोजें।",
      },

      {
        title: "Milk Man",
        hindi: "दूध वाला",
        image: milkMan,
        jobType: "milk man",
        description: "Connect with a local milk supplier for regular home delivery.",
        descriptionHindi: "घर तक रोजाना दूध पहुँचाने के लिए अपने आसपास के दूध वाले से संपर्क करें।",
      },

      {
        title: "Washer Man",
        hindi: "धोबी",
        image: washerMan,
        jobType: "washer man",
        description: "Find a washer man for washing and ironing clothes.",
        descriptionHindi: "कपड़े धोने और प्रेस करवाने के लिए अपने आसपास के धोबी की सेवा लें।",
      },

      {
        title: "Gardener",
        hindi: "माली",
        image: gardener,
        jobType: "gardener",
        description: "Book a gardener for plants, lawns, gardens and maintenance.",
        descriptionHindi: "घर, खेत या बगीचे की देखभाल और पौधों की देखरेख के लिए माली बुलाएँ।",
      },

      {
        title: "Security Guard",
        hindi: "सुरक्षा गार्ड",
        image: securityGuard,
        jobType: "security guard",
        description: "Find security support for homes, shops, offices and events.",
        descriptionHindi:
          "घर, दुकान, ऑफिस, भवन या कार्यक्रम की सुरक्षा के लिए सिक्योरिटी गार्ड खोजें।",
      },

      {
        title: "House Maid",
        hindi: "घरेलू सहायिका",
        image: houseMaid,
        jobType: "house maid",
        description: "Find help for cleaning, dishes and everyday household work.",
        descriptionHindi: "घर की सफाई, बर्तन और रोजमर्रा के घरेलू काम के लिए घरेलू सहायिका खोजें।",
      },

      {
        title: "Baby Sitter",
        hindi: "बेबी सिटर",
        image: babySitter,
        jobType: "baby sitter",
        description: "Find childcare support for families who need help looking after children.",
        descriptionHindi: "बच्चों की देखभाल के लिए अपने आसपास भरोसेमंद बेबी सिटर खोजें।",
      },

      {
        title: "Old Age Caregiver",
        hindi: "बुजुर्ग देखभालकर्ता",
        image: oldAgeCare,
        jobType: "old age caregiver",
        description: "Find a caregiver for everyday elderly support and assistance.",
        descriptionHindi: "बुजुर्गों की रोजमर्रा की देखभाल और जरूरत की मदद के लिए केयरगिवर खोजें।",
      },
    ],
  },

  // =========================================================
  // FUNCTION
  // =========================================================

  {
    heading: "Function",
    headingHindi: "कार्यक्रम सेवा",

    services: [
      {
        title: "Parlour",
        hindi: "पार्लर",
        image: parlour,
        jobType: "parlour",
        description:
          "Book beauty and parlour services for weddings, festivals and special occasions.",
        descriptionHindi:
          "शादी, त्योहार, पार्टी या खास मौके के लिए पार्लर और ब्यूटी सर्विस बुक करें।",
      },

      {
        title: "Mehandi Maker",
        hindi: "मेहंदी कलाकार",
        image: mehandiMaker,
        jobType: "menhandi maker",
        description: "Find a mehndi artist for weddings, festivals and special occasions.",
        descriptionHindi: "शादी, त्योहार और खास मौकों के लिए हाथों पर खूबसूरत मेहंदी लगवाएँ।",
      },

      {
        title: "Pandit Ji",
        hindi: "पंडित जी",
        image: pandit,
        jobType: "pundit ji",
        description: "Find a Pandit Ji for puja, griha pravesh, weddings and religious ceremonies.",
        descriptionHindi: "पूजा, गृह प्रवेश, शादी और धार्मिक कार्यक्रम के लिए पंडित जी बुक करें।",
      },

      {
        title: "Cook",
        hindi: "रसोइया",
        image: cook,
        jobType: "cook",
        description: "Book a cook for home meals, weddings, parties and functions.",
        descriptionHindi: "घर, शादी या कार्यक्रम के लिए खाना बनाने वाला रसोइया बुक करें।",
      },

      {
        title: "Lights",
        hindi: "लाइट बुकिंग",
        image: lightsBooking,
        jobType: "lights",
        description: "Book decorative lighting for weddings, parties and events.",
        descriptionHindi: "शादी, पार्टी और कार्यक्रम के लिए सजावटी लाइटिंग की व्यवस्था करवाएँ।",
      },

      {
        title: "Tent House",
        hindi: "टेंट हाउस",
        image: tent,
        jobType: "tent house",
        description: "Book tents, chairs, tables and event setup for functions.",
        descriptionHindi:
          "शादी, पार्टी और कार्यक्रम के लिए टेंट, कुर्सी, टेबल और जरूरी सामान बुक करें।",
      },

      {
        title: "Kirtan Mandali",
        hindi: "कीर्तन मंडली",
        image: kirtanMandali,
        jobType: "kirtan mandli",
        description: "Find a kirtan and bhajan group for religious events.",
        descriptionHindi: "कीर्तन, भजन और धार्मिक कार्यक्रम के लिए कीर्तन मंडली बुक करें।",
      },

      {
        title: "Generator",
        hindi: "जनरेटर",
        image: generator,
        jobType: "generator",
        description: "Book a generator for power backup at functions, shops and events.",
        descriptionHindi:
          "शादी, कार्यक्रम, दुकान या जरूरत के समय बिजली बैकअप के लिए जनरेटर बुक करें।",
      },

      {
        title: "DJ",
        hindi: "डीजे",
        image: dj,
        jobType: "dj",
        description: "Book DJ and sound services for weddings, parties and celebrations.",
        descriptionHindi: "शादी, पार्टी और समारोह के लिए DJ और साउंड सिस्टम बुक करें।",
      },

      {
        title: "Waiter",
        hindi: "वेटर",
        image: waiters,
        jobType: "waiter",
        description: "Book waiters to serve guests at weddings, parties and events.",
        descriptionHindi: "शादी, पार्टी और कार्यक्रम में मेहमानों की सेवा के लिए वेटर बुक करें।",
      },

      {
        title: "RO",
        hindi: "आरओ पानी",
        image: ro,
        jobType: "ro",
        description: "Arrange RO drinking water service for events and functions.",
        descriptionHindi: "शादी, कार्यक्रम या दुकान के लिए साफ RO पानी की व्यवस्था करवाएँ।",
      },

      {
        title: "Chaat",
        hindi: "चाट",
        image: chaat,
        jobType: "chaat",
        description: "Arrange chaat and popular street-food counters for parties and functions.",
        descriptionHindi:
          "शादी, पार्टी और कार्यक्रम के लिए चाट और पसंदीदा स्ट्रीट फूड की व्यवस्था करें।",
      },

      {
        title: "Dulha Rath",
        hindi: "दूल्हा रथ",
        image: dulhaRath,
        jobType: "dulha rath",
        description: "Book a decorated dulha rath for the groom's wedding procession.",
        descriptionHindi: "दूल्हे की बारात और शादी के लिए शानदार दूल्हा रथ बुक करें।",
      },

      {
        title: "Paan Wala",
        hindi: "पान वाला",
        image: paanWala,
        jobType: "paan wala",
        description: "Arrange a paan counter or paan service for weddings and events.",
        descriptionHindi: "शादी और कार्यक्रम में मेहमानों के लिए पान की व्यवस्था करवाएँ।",
      },

      {
        title: "Fruits Seller",
        hindi: "फल विक्रेता",
        image: fruitsSeller,
        jobType: "fruit seller",
        description: "Find a local fruit seller for fresh fruits for home and events.",
        descriptionHindi:
          "घर, दुकान या कार्यक्रम के लिए ताजे फल उपलब्ध करवाने वाला स्थानीय विक्रेता खोजें।",
      },

      {
        title: "Marriage Hall",
        hindi: "मैरिज हॉल",
        image: marriageHall,
        jobType: "marriage hall",
        description: "Find and book a suitable marriage hall for weddings and receptions.",
        descriptionHindi:
          "शादी, रिसेप्शन और कार्यक्रम के लिए अपनी जरूरत के हिसाब से मैरिज हॉल खोजें।",
      },

      {
        title: "Photographer",
        hindi: "फोटोग्राफर",
        image: photographer,
        jobType: "photographer",
        description: "Book a photographer for weddings, birthdays and special moments.",
        descriptionHindi:
          "शादी, जन्मदिन और खास मौकों की यादगार तस्वीरों के लिए फोटोग्राफर बुक करें।",
      },

      {
        title: "Videographer",
        hindi: "वीडियोग्राफर",
        image: videographer,
        jobType: "videographer",
        description: "Book video coverage for weddings and special events.",
        descriptionHindi:
          "शादी और कार्यक्रम की वीडियो रिकॉर्डिंग करवाकर अपने खास पलों को सुरक्षित करें।",
      },

      {
        title: "Makeup Artist",
        hindi: "मेकअप कलाकार",
        image: makeupArtist,
        jobType: "makeup artist",
        description: "Book a professional makeup artist for weddings, parties and occasions.",
        descriptionHindi: "शादी, पार्टी और खास मौकों के लिए प्रोफेशनल मेकअप आर्टिस्ट बुक करें।",
      },

      {
        title: "Band Party",
        hindi: "बैंड पार्टी",
        image: bandParty,
        jobType: "band party",
        description: "Book a band party for wedding processions and celebrations.",
        descriptionHindi: "बारात, शादी और खास कार्यक्रम के लिए बैंड पार्टी बुक करें।",
      },

      {
        title: "Fireworks",
        hindi: "पटाखे",
        image: fireworks,
        jobType: "fireworks",
        description: "Find fireworks arrangements for suitable celebrations and events.",
        descriptionHindi: "शादी और खास कार्यक्रमों के लिए आतिशबाजी की व्यवस्था करें।",
      },

      {
        title: "Catering",
        hindi: "कैटरिंग",
        image: catering,
        jobType: "catering",
        description: "Book catering for weddings, parties, religious events and functions.",
        descriptionHindi:
          "शादी, पार्टी, धार्मिक कार्यक्रम और समारोह के लिए खाने-पीने की पूरी कैटरिंग व्यवस्था करवाएँ।",
      },
    ],
  },

  // =========================================================
  // TRANSPORTATION
  // =========================================================

  {
    heading: "Transportation",
    headingHindi: "परिवहन सेवा",

    services: [
      {
        title: "Four Wheeler",
        hindi: "चार पहिया",
        image: car,
        jobType: "four wheeler",
        description: "Book a four-wheeler for family travel, events and local trips.",
        descriptionHindi: "परिवार, यात्रा, शादी या जरूरी काम के लिए चार पहिया वाहन बुक करें।",
      },

      {
        title: "Bus",
        hindi: "बस",
        image: bus,
        jobType: "bus",
        description: "Book a bus for weddings, school trips, group travel and events.",
        descriptionHindi: "शादी, स्कूल, यात्रा या ग्रुप ट्रिप के लिए बस बुक करें।",
      },

      {
        title: "Auto",
        hindi: "ऑटो",
        image: auto,
        jobType: "auto",
        description: "Find an auto for local travel and everyday transportation.",
        descriptionHindi: "रोजमर्रा के आने-जाने और छोटी दूरी के लिए अपने आसपास ऑटो बुक करें।",
      },

      {
        title: "E-Rikshaw",
        hindi: "ई-रिक्शा",
        image: eRikshaw,
        jobType: "e-riksha",
        description: "Book an e-rickshaw for short-distance local travel.",
        descriptionHindi: "छोटी दूरी और रोजमर्रा के आने-जाने के लिए ई-रिक्शा बुक करें।",
      },

      {
        title: "Mini Truck",
        hindi: "मिनी ट्रक",
        image: miniTruck,
        jobType: "mini truck",
        description: "Book a mini truck for furniture, goods and small loads.",
        descriptionHindi: "सामान, फर्नीचर और छोटे माल की ढुलाई के लिए मिनी ट्रक बुक करें।",
      },
    ],
  },

  // =========================================================
  // RURAL WORK
  // =========================================================

  {
    heading: "Rural Work",
    headingHindi: "ग्रामीण सेवाएँ",

    services: [
      {
        title: "Dhankutti",
        hindi: "धान कुट्टी",
        image: dhankutti,
        jobType: "dhankutti",
        description: "Find a local dhankutti service for rice and grain processing.",
        descriptionHindi:
          "धान कुटवाने और अनाज से जुड़े काम के लिए अपने आसपास धान कुट्टी की सेवा खोजें।",
      },

      {
        title: "Aata Chakki",
        hindi: "आटा चक्की",
        image: aataChakki,
        jobType: "aata chakki",
        description: "Find a local flour mill for grinding wheat and other grains.",
        descriptionHindi: "गेहूं और दूसरे अनाज की पिसाई के लिए नजदीकी आटा चक्की खोजें।",
      },

      {
        title: "Latrine Tank Cleaner",
        hindi: "शौचालय टैंक सफाई",
        image: latrineTankCleaner,
        jobType: "latrine tank cleaner",
        description: "Book cleaning support for septic and toilet tanks.",
        descriptionHindi: "शौचालय या सेप्टिक टैंक की सफाई के लिए सफाई कर्मचारी बुलाएँ।",
      },

      {
        title: "Pual Cutter",
        hindi: "पुआल कटर",
        image: pualCutter,
        jobType: "pual cutter",
        description: "Find a pual cutter for cutting straw and preparing animal feed.",
        descriptionHindi: "पुआल काटने और पशुओं के चारे की तैयारी के लिए पुआल कटर बुक करें।",
      },

      {
        title: "Bhoonsa Pual Seller",
        hindi: "भूसा विक्रेता",
        image: bhoonsaSeller,
        jobType: "bhoonsa pual seller",
        description: "Find a local supplier for bhoonsa and pual used as animal feed.",
        descriptionHindi: "पशुओं के चारे के लिए भूसा और पुआल खरीदने हेतु स्थानीय विक्रेता खोजें।",
      },
    ],
  },

  // =========================================================
  // HOME SERVICES
  // =========================================================

  {
    heading: "Home Services",
    headingHindi: "घरेलू सेवाएँ",

    services: [
      {
        title: "Pest Control",
        hindi: "कीट नियंत्रण",
        image: pestControl,
        jobType: "pest control",
        description: "Book pest-control service for common household pests and termites.",
        descriptionHindi:
          "घर में कीड़े-मकौड़े और दीमक जैसी समस्या से छुटकारा पाने के लिए pest control करवाएँ।",
      },

      {
        title: "Deep Cleaning",
        hindi: "गहरी सफाई",
        image: deepCleaning,
        jobType: "deep cleaning",
        description: "Get detailed deep cleaning for homes and spaces.",
        descriptionHindi: "घर की गहरी सफाई करवाकर धूल, गंदगी और जमा मैल साफ करवाएँ।",
      },

      {
        title: "Water Tank Cleaning",
        hindi: "पानी की टंकी सफाई",
        image: waterTankCleaning,
        jobType: "water tank cleaning",
        description: "Book water-tank cleaning to remove dirt and buildup.",
        descriptionHindi: "घर की पानी की टंकी की गंदगी और जमा कचरा साफ करवाएँ।",
      },

      {
        title: "Geyser Repair",
        hindi: "गीजर मरम्मत",
        image: geyserRepair,
        jobType: "geyser repair",
        description: "Get help with geyser heating and common repair problems.",
        descriptionHindi: "गीजर गर्म नहीं कर रहा या खराब है तो गीजर मिस्त्री की सेवा लें।",
      },

      {
        title: "Washing Machine Repair",
        hindi: "वॉशिंग मशीन मरम्मत",
        image: washingMachineRepair,
        jobType: "washing machine repair",
        description: "Find a technician for water, spinning and common washing-machine problems.",
        descriptionHindi: "वॉशिंग मशीन में पानी, स्पिन या दूसरी खराबी हो तो मिस्त्री बुलाएँ।",
      },

      {
        title: "TV Repair",
        hindi: "टीवी मरम्मत",
        image: tvRepair,
        jobType: "tv repair",
        description: "Get help with TV power, display, sound and common problems.",
        descriptionHindi:
          "TV चालू नहीं हो रहा या स्क्रीन और साउंड में समस्या है तो मिस्त्री बुलाएँ।",
      },
    ],
  },

  // =========================================================
  // EDUCATION
  // =========================================================

  {
    heading: "Education & Coaching",
    headingHindi: "शिक्षा सेवाएँ",

    services: [
      {
        title: "Computer Trainer",
        hindi: "कंप्यूटर प्रशिक्षक",
        image: computerTrainer,
        jobType: "computer trainer",
        description: "Find a computer trainer for practical computer learning.",
        descriptionHindi: "कंप्यूटर सीखने के लिए घर या आसपास कंप्यूटर ट्रेनर खोजें।",
      },

      // {
      //   title: "Music Teacher",
      //   hindi: "संगीत शिक्षक",
      //   image: musicTeacher,
      //   jobType: "music teacher",
      //   description: "Find a music teacher for singing and music-learning sessions.",
      //   descriptionHindi: "गायन और संगीत सीखने के लिए संगीत शिक्षक खोजें।",
      // },

      // {
      //   title: "Dance Teacher",
      //   hindi: "नृत्य शिक्षक",
      //   image: danceTeacher,
      //   jobType: "dance teacher",
      //   description: "Find a dance teacher for children, beginners and regular practice.",
      //   descriptionHindi: "डांस सीखने और नियमित अभ्यास के लिए डांस टीचर खोजें।",
      // },

      // {
      //   title: "Art Teacher",
      //   hindi: "कला शिक्षक",
      //   image: artTeacher,
      //   jobType: "art teacher",
      //   description: "Find an art teacher for drawing, painting and creative learning.",
      //   descriptionHindi: "चित्रकला, ड्राइंग और कला सीखने के लिए आर्ट टीचर खोजें।",
      // },

      // {
      //   title: "Language Trainer",
      //   hindi: "भाषा प्रशिक्षक",
      //   image: languageTrainer,
      //   jobType: "language trainer",
      //   description: "Find a language trainer for learning and practising a new language.",
      //   descriptionHindi: "नई भाषा सीखने और बोलने का अभ्यास करने के लिए भाषा ट्रेनर खोजें।",
      // },
    ],
  },
];

export default serviceData;
