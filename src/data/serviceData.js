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

// Repair
import acMechanic from "../resources/img/ac_mechanic.jpg";
import fridgeMechanic from "../resources/img/fridge_mechanic.jpg";
import bikeRepair from "../resources/img/bike_repaire.jpg";
import carRepair from "../resources/img/car_repaire.jpg";
import laptopRepair from "../resources/img/laptop_repaire.jpg";

// Daily Need
import driver from "../resources/img/driver.jpg";
import homeTutor from "../resources/img/home_tutor.jpg";
import milkMan from "../resources/img/milk_man.jpg";
import washerMan from "../resources/img/washer_man.jpg";

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

export const serviceData = [
  {
    heading: "Construction & Work",
    headingHindi: "निर्माण कार्य",
    services: [
      { title: "Labour", hindi: "मजदूर", image: labour, jobType: "labour" },
      { title: "Mason", hindi: "राजमिस्त्री", image: mason, jobType: "mason" },
      {
        title: "Electrician",
        hindi: "बिजली मिस्त्री",
        image: electrician,
        jobType: "electrician",
      },
      { title: "Plumber", hindi: "प्लंबर", image: plumber, jobType: "plumber" },
      { title: "Painter", hindi: "पेंटर", image: painter, jobType: "painter" },
      {
        title: "Carpenter",
        hindi: "बढ़ई",
        image: carpenter,
        jobType: "carpenter",
      },
      {
        title: "Tiles Fitter",
        hindi: "टाइल मिस्त्री",
        image: tileFitter,
        jobType: "tiles fitter",
      },
      {
        title: "Marble Fitter",
        hindi: "मार्बल मिस्त्री",
        image: marbleWorker,
        jobType: "marble fitter",
      },
      {
        title: "Shuttering",
        hindi: "शटरिंग बुकिंग",
        image: shuttering,
        jobType: "shuttering",
      },
    ],
  },

  {
    heading: "Repair",
    headingHindi: "मरम्मत सेवा",
    services: [
      {
        title: "AC Mechanic",
        hindi: "एसी मिस्त्री",
        image: acMechanic,
        jobType: "ac mechanic",
      },
      {
        title: "Fridge Mechanic",
        hindi: "फ्रिज मिस्त्री",
        image: fridgeMechanic,
        jobType: "fridge mechanic",
      },
      {
        title: "Bike Repair",
        hindi: "बाइक रिपेयर",
        image: bikeRepair,
        jobType: "bike repaire",
      },
      {
        title: "Car Repair",
        hindi: "कार रिपेयर",
        image: carRepair,
        jobType: "car repaire",
      },
      {
        title: "Laptop Repair",
        hindi: "लैपटॉप रिपेयर",
        image: laptopRepair,
        jobType: "laptop repaire",
      },
    ],
  },

  {
    heading: "Daily Need",
    headingHindi: "दैनिक आवश्यकता",
    services: [
      { title: "Driver", hindi: "ड्राइवर", image: driver, jobType: "driver" },
      {
        title: "Home Tutor",
        hindi: "होम ट्यूटर",
        image: homeTutor,
        jobType: "home tutor",
      },
      {
        title: "Milk Man",
        hindi: "दूध वाला",
        image: milkMan,
        jobType: "milk man",
      },
      {
        title: "Washer Man",
        hindi: "धोबी",
        image: washerMan,
        jobType: "washer man",
      },
    ],
  },

  {
    heading: "Function",
    headingHindi: "कार्यक्रम सेवा",
    services: [
      { title: "Parlour", hindi: "पार्लर", image: parlour, jobType: "parlour" },
      {
        title: "Mehandi Maker",
        hindi: "मेहंदी कलाकार",
        image: mehandiMaker,
        jobType: "menhandi maker",
      },
      {
        title: "Pandit Ji",
        hindi: "पंडित जी",
        image: pandit,
        jobType: "pundit ji",
      },
      { title: "Cook", hindi: "रसोइया", image: cook, jobType: "cook" },
      {
        title: "Lights",
        hindi: "लाइट बुकिंग",
        image: lightsBooking,
        jobType: "lights",
      },
      {
        title: "Tent House",
        hindi: "टेंट हाउस",
        image: tent,
        jobType: "tent house",
      },
      {
        title: "Kirtan Mandali",
        hindi: "कीर्तन मंडली",
        image: kirtanMandali,
        jobType: "kirtan mandli",
      },
      {
        title: "Generator",
        hindi: "जनरेटर",
        image: generator,
        jobType: "generator",
      },
      { title: "DJ", hindi: "डीजे", image: dj, jobType: "dj" },
      {
        title: "Waiter",
        hindi: "वेटर",
        image: waiters,
        jobType: "waiter",
      },
      {
        title: "RO",
        hindi: "आरओ पानी",
        image: ro,
        jobType: "ro",
      },
      { title: "Chaat", hindi: "चाट", image: chaat, jobType: "chaat" },
      {
        title: "Dulha Rath",
        hindi: "दूल्हा रथ",
        image: dulhaRath,
        jobType: "dulha rath",
      },
      {
        title: "Paan Wala",
        hindi: "पान वाला",
        image: paanWala,
        jobType: "paan wala",
      },
      {
        title: "Fruits Seller",
        hindi: "फल विक्रेता",
        image: fruitsSeller,
        jobType: "fruit seller",
      },
      {
        title: "Marriage Hall",
        hindi: "मैरिज हॉल",
        image: marriageHall,
        jobType: "marriage hall",
      },
    ],
  },

  {
    heading: "Transportation",
    headingHindi: "परिवहन सेवा",
    services: [
      {
        title: "Four Wheeler",
        hindi: "चार पहिया",
        image: car,
        jobType: "four wheeler",
      },
      { title: "Bus", hindi: "बस", image: bus, jobType: "bus" },
      {
        title: "Auto",
        hindi: "ऑटो",
        image: auto,
        jobType: "auto",
      },
      {
        title: "E-Rikshaw",
        hindi: "ई-रिक्शा",
        image: eRikshaw,
        jobType: "e-riksha",
      },
      {
        title: "Mini Truck",
        hindi: "मिनी ट्रक",
        image: miniTruck,
        jobType: "mini truck",
      },
    ],
  },

  {
    heading: "Rural Work",
    headingHindi: "ग्रामीण सेवाएँ",
    services: [
      {
        title: "Dhankutti",
        hindi: "धान कुट्टी",
        image: dhankutti,
        jobType: "dhankutti",
      },
      {
        title: "Aata Chakki",
        hindi: "आटा चक्की",
        image: aataChakki,
        jobType: "aata chakki",
      },
      {
        title: "Latrine Tank Cleaner",
        hindi: "शौचालय टैंक सफाई",
        image: latrineTankCleaner,
        jobType: "latrine tank cleaner",
      },
      {
        title: "Pual Cutter",
        hindi: "पुआल कटर",
        image: pualCutter,
        jobType: "pual cutter",
      },
      {
        title: "Bhoonsa Pual Seller",
        hindi: "भूसा विक्रेता",
        image: bhoonsaSeller,
        jobType: "bhoonsa pual seller",
      },
    ],
  },
];

export default serviceData;
