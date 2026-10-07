// Kaal-Drishti (काल-दृष्टि) - Architectural Time-Travel Comparative Archive
// Distinct ancient architectural reconstructions / blueprints vs modern ASI preserved monuments

export interface TimeTravelRecord {
  id: string;
  name: string;
  hindiName: string;
  location: string;
  ancientPeriod: string;
  rulerArchitect: string;
  ancientReconstructionImg: string;
  presentImg: string;
  ancientDescription: string;
  hindiAncientDescription: string;
  presentDescription: string;
  hindiPresentDescription: string;
  architecturalHighlights: {
    feature: string;
    ancientState: string;
    presentState: string;
  }[];
  engineeringFeat: string;
}

export const TIME_TRAVEL_ARCHIVE: Record<string, TimeTravelRecord> = {
  'konark-sun-temple': {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    hindiName: 'कोणार्क सूर्य मंदिर',
    location: 'Puri, Odisha',
    ancientPeriod: '1250 CE (13th Century Ganga Dynasty)',
    rulerArchitect: 'King Narasimhadeva I · Chief Sthapati Bisu Maharana & Dharmapada',
    // Ancient Reconstruction: Historic architectural elevation drawing showing original 229ft tower
    ancientReconstructionImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    // Present Day: Conserved Jagamohana assembly hall
    presentImg: 'https://images.unsplash.com/photo-1600100397608-f010f443b744?auto=format&fit=crop&w=1200&q=80',
    ancientDescription: 'Constructed as a colossal 229-foot (70m) celestial stone chariot for Surya with 24 carved wheels and 7 horses. The main sanctuary tower (Bada Deula) soared higher than any temple in India, crowned with a magnetic lodestone finial that oriented seafaring merchant vessels in the Bay of Bengal.',
    hindiAncientDescription: '13वीं शताब्दी में 229 फीट ऊंचे भव्य गर्भगृह शिखर के साथ सूर्य के 24 चक्रों और 7 अश्वों वाले रथ रूप में निर्मित। मुख्य शिखर में स्थापित विशाल चुंबकीय कलश समुद्री जहाजों के लिए प्राकृतिक दिग्सूचक का कार्य करता था।',
    presentDescription: 'Only the 128-foot assembly hall (Jagamohana) survives today, conserved by the ASI. The interior was stabilized with sand in 1903. The 24 monumental sundial wheels continue to tell exact solar time within seconds.',
    hindiPresentDescription: 'आज 128 फीट ऊंचा जगमोहन मंडप और 24 भव्य खगोलीय पहिए सुरक्षित हैं, जो सूर्य की छाया से सटीक समय बताते हैं। मूल 229 फीट का मुख्य शिखर अब ध्वस्त अवस्था में संरक्षित है।',
    architecturalHighlights: [
      {
        feature: 'Main Vimana Spire (मुख्य गर्भगृह शिखर)',
        ancientState: '229 ft soaring tower with magnetic crowning Kalasha',
        presentState: 'Tower collapsed in 17th century; foundational plinth conserved by ASI'
      },
      {
        feature: 'Astronomical Wheels (रथ चक्र)',
        ancientState: '24 functional astronomical sundials carved in Chlorite stone',
        presentState: 'Intact and world-famous, showing hours and minutes via spoke shadows'
      },
      {
        feature: 'Natamandira (नृत्य मंडप)',
        ancientState: 'Open pillar pavilion with 128 dancing sculpted figures',
        presentState: 'Conserved hypostyle hall with ornate classical Odissi postures'
      }
    ],
    engineeringFeat: 'Interlocking khondalite blocks joined with forged iron dowels without cement or lime mortar, aligned precisely to the equinox sunrise.'
  },
  'hampi-monuments': {
    id: 'hampi-monuments',
    name: 'Hampi - Vijayanagara Imperial City',
    hindiName: 'हम्पी विजयनगर साम्राज्य',
    location: 'Vijayanagara, Karnataka',
    ancientPeriod: '1336–1565 CE (14th-16th Century)',
    rulerArchitect: 'Sangama to Tuluva Dynasties · Emperor Krishnadevaraya',
    // Ancient Reconstruction: Golden brick vimana over stone chariot & bustling bazaar
    ancientReconstructionImg: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    // Present Day: Conserved Stone Chariot in courtyard
    presentImg: 'https://images.unsplash.com/photo-1600100397608-f010f443b744?auto=format&fit=crop&w=1200&q=80',
    ancientDescription: 'The second largest medieval metropolis in the world after Beijing, housing 500,000 citizens. The Vijayanagara capital featured multi-tiered stone bazaars, gold-sheathed chariot spires, flowing Tungabhadra aqueducts, and 56 musical pillars that produced distinct sa-re-ga-ma musical notes.',
    hindiAncientDescription: '15वीं सदी में दुनिया का दूसरा सबसे समृद्ध शहर, जहां 5 लाख लोग रहते थे। सुसज्जित बाजार, सोने से मढ़े शिखर, तुंगभद्रा नहरें और 56 संगीतमय स्तंभ जो बजाने पर सप्तक के स्वर निकालते थे।',
    presentDescription: 'A surreal UNESCO World Heritage landscape of 1,600 surviving monuments set amidst dramatic granite boulder hills. The Stone Chariot (Garuda Shrine) stands majestically in the Vitthala temple courtyard.',
    hindiPresentDescription: 'ग्रेनाइट चट्टानों के बीच 1,600 संरक्षित स्मारकों का विहंगम दृश्य। विट्ठल मंदिर परिसर में भव्य अखंड पाषाण रथ भारत की स्थापत्य कला का अमर प्रतीक है।',
    architecturalHighlights: [
      {
        feature: 'Stone Chariot Spire (रथ शिखर)',
        ancientState: 'Topped with a brick & stucco Dravidian vimana painted in gold & ochre',
        presentState: 'Brick tower removed during colonial conservation to preserve stone balance'
      },
      {
        feature: 'Sule Bazaar (सुलै बाजार)',
        ancientState: 'Kilometer-long 2-story pillared arcade trading diamonds, rubies and Persian horses',
        presentState: 'Colonnaded stone market ruins leading from Virupaksha Temple to the river'
      },
      {
        feature: 'Hydraulic Aqueducts (जल प्रणाली)',
        ancientState: 'Active stone pipelines feeding royal stepped baths and pushkaranis',
        presentState: 'Exquisitely preserved stepped water tank (Kalyani) with stone conduits'
      }
    ],
    engineeringFeat: 'Granite dry-masonry construction where massive megalithic stones were fitted without cement using wedge & tongue-groove joints.'
  },
  'nalanda-university': {
    id: 'nalanda-university',
    name: 'Nalanda Mahavihara',
    hindiName: 'नालंदा महाविहार',
    location: 'Nalanda, Bihar',
    ancientPeriod: '427–1197 CE (5th-12th Century)',
    rulerArchitect: 'Gupta Empire (Kumaragupta I) & King Harshavardhana',
    // Ancient Reconstruction: Multi-level brick stupa with Buddhist dormitories
    ancientReconstructionImg: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    // Present Day: Excavated ruins
    presentImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    ancientDescription: 'The worlds first residential university, hosting 10,000 students and 2,000 masters from China, Korea, Japan, Tibet, and Persia. Features the famed nine-story library "Dharmaganja" with three towers (Ratnodadhi, Ratnasagara, Ratnaranjaka) containing millions of manuscripts.',
    hindiAncientDescription: 'विश्व का प्रथम आवासीय विश्वविद्यालय, जहां 10,000 छात्र और 2,000 आचार्य अध्ययन करते थे। 9 मंजिला धर्मगंज पुस्तकालय में लाखों दुर्लभ पाण्डुलिपियां थीं।',
    presentDescription: 'Excavated red-brick monastic complexes covering 30 acres (approx 10% of total site). The Great Stupa 3 with its multi-layered votive spires and deep meditation alcoves stands as a global pilgrimage center.',
    hindiPresentDescription: '30 एकड़ में फैले लाल ईंटों के बौद्ध विहार, ध्यान कक्ष और स्तूप क्रमांक 3 के बहुस्तरीय अवशेष जो प्राचीन बौद्ध दर्शन के केंद्र हैं।',
    architecturalHighlights: [
      {
        feature: 'Library Dharmaganja (धर्मगंज पुस्तकालय)',
        ancientState: 'Three multi-story towers holding the entire knowledge base of ancient Asia',
        presentState: 'Excavated brick foundations and podium structures'
      },
      {
        feature: 'Monastic Courtyards (विहार आंगन)',
        ancientState: 'Individual student meditation cells with drainage, water well and lecture podium',
        presentState: 'Perfect brick layouts showing ancient acoustic architectural planning'
      }
    ],
    engineeringFeat: 'Advanced natural terracotta drainage and subterranean clay insulation keeping student dormitories cool in summers.'
  },
  'brihadisvara-temple': {
    id: 'brihadisvara-temple',
    name: 'Brihadisvara Temple (Big Temple)',
    hindiName: 'बृहदीश्वर मंदिर, तंजावुर',
    location: 'Thanjavur, Tamil Nadu',
    ancientPeriod: '1010 CE (11th Century)',
    rulerArchitect: 'Emperor Rajaraja Chola I · Master Sculptor Kunjaramallan',
    // Ancient Reconstruction: Gilded kalasham & Chola painted frescoes
    ancientReconstructionImg: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    // Present Day: Intact granite vimana
    presentImg: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    ancientDescription: 'Built entirely from 130,000 tonnes of granite transported over 60 km. The 216-foot Vimana was topped with an 80-tonne monolithic Kumbam dome lifted using an inclined 6-kilometer earthen ramp. Decorated with pure gold Kalashams and imperial Chola frescoes.',
    hindiAncientDescription: '1,30,000 टन ग्रेनाइट से निर्मित। 216 फीट ऊंचे विमान पर 80 टन का अखंड पाषाण कुंभ 6 किमी लंबे मिट्टी के ढलान से चढ़ाया गया था।',
    presentDescription: '1,000+ years old and completely intact without leaning. One of the greatest living temples of UNESCO "Great Living Chola Temples", where daily Vedic worship continues uninterrupted.',
    hindiPresentDescription: '1,000 से अधिक वर्षों बाद भी बिना किसी झुकाव के अडिग। यूनेस्को विश्व धरोहर जहां आज भी प्रतिदिन शास्त्रीय वैदिक पूजा संपन्न होती है।',
    architecturalHighlights: [
      {
        feature: 'Monolithic Kumbam Dome (शिखर कुंभ)',
        ancientState: '80-tonne single granite block carved and placed at 66m height',
        presentState: 'Intact, engineered so precisely that the shadow forms a tight perimeter'
      },
      {
        feature: 'Nandi Pavilion (नंदी मंडप)',
        ancientState: 'Gigantic single-stone Nandi bull facing the inner sanctum',
        presentState: 'One of Indias largest monolithic Nandis (12 ft high, 20 ft long, 25 tonnes)'
      }
    ],
    engineeringFeat: 'Zero-mortar interlocking granite construction standing steadfast in a non-rocky alluvial river basin.'
  },
  'taj-mahal': {
    id: 'taj-mahal',
    name: 'Taj Mahal & Mehtab Riverfront',
    hindiName: 'ताज महल एवं मेहताब बाग',
    location: 'Agra, Uttar Pradesh',
    ancientPeriod: '1632–1648 CE (17th Century)',
    rulerArchitect: 'Emperor Shah Jahan · Ustad Ahmad Lahori',
    // Ancient Reconstruction: Mehtab moonlight reflection & Yamuna watergate
    ancientReconstructionImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    // Present Day: Conserved Makrana marble
    presentImg: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    ancientDescription: 'Designed as a terrestrial replica of Paradise (Jannat). Integrated with Mehtab Bagh across the Yamuna for moonlight viewing. The original interior featured solid silver entrance gates, pearl-embroidered canopy curtains, and gold finials.',
    hindiAncientDescription: 'यमुना किनारे स्वर्ग की प्रतिकृति के रूप में निर्मित। चांदी के मुख्य द्वार, सोने का कलश और 43 प्रकार के दुर्लभ नगीनों (पिएत्रा दूरा) से सुसज्जित।',
    presentDescription: 'Pristine Makrana marble mausoleum with four 40-meter minarets canted slightly outward for seismic protection. Maintained under strict ASI eco-conservation zone with battery vehicle transit.',
    hindiPresentDescription: 'मकराना श्वेत संगमरमर का अप्रतिम स्मारक। भूकंप सुरक्षा हेतु चारों मीनारें बाहर की ओर थोड़ी झुकी हैं। यूनेस्को विश्व धरोहर।',
    architecturalHighlights: [
      {
        feature: 'Double Dome (दोहरा गुंबद)',
        ancientState: '73m outer onion dome with inner acoustic dome for echoing chants',
        presentState: 'Flawlessly conserved, perfect acoustic reverberation of 28 seconds'
      },
      {
        feature: 'Riverfront Terrace (यमुना तटबंध)',
        ancientState: 'River Yamuna flowed directly against the red sandstone terrace',
        presentState: 'Conserved deep wooden well-foundations (ebony wood) nourished by river moisture'
      }
    ],
    engineeringFeat: 'Deep masonry well foundation system with ebony and sal timber that remains permanently petrified and strong when submerged in groundwater.'
  }
};

export const getTimeTravelData = (itemId: string, title: string): TimeTravelRecord => {
  const combined = (itemId + ' ' + title).toLowerCase();
  for (const key of Object.keys(TIME_TRAVEL_ARCHIVE)) {
    if (combined.includes(key) || key.includes(itemId)) {
      return TIME_TRAVEL_ARCHIVE[key];
    }
  }
  // Default to Konark
  return {
    ...TIME_TRAVEL_ARCHIVE['konark-sun-temple'],
    name: title,
    hindiName: title,
    ancientPeriod: 'Classical Antiquity Reconstruction',
    rulerArchitect: 'Imperial Guild of Master Sthapatis',
  };
};
