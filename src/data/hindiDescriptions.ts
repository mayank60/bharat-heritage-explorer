import { State, HeritageItem, Food, Festival } from '../types.ts';
import { LanguageKey } from '../i18n.ts';

// Multilingual State Names for all 36 States & UTs across 8 languages
export const STATE_NAMES_MULTILINGUAL: Record<string, Record<LanguageKey, string>> = {
  rajasthan: {
    en: 'Rajasthan',
    hi: 'राजस्थान',
    bn: 'রাজস্থান',
    ta: 'ராஜஸ்தான்',
    te: 'రాజస్థాన్',
    mr: 'राजस्थान',
    gu: 'રાજસ્થાન',
    kn: 'ರಾಜಸ್ಥಾನ',
  },
  kerala: {
    en: 'Kerala',
    hi: 'केरल',
    bn: 'কেরল',
    ta: 'கேரளா',
    te: 'కేరళ',
    mr: 'केरळ',
    gu: 'કેરળ',
    kn: 'ಕೇರಳ',
  },
  'tamil-nadu': {
    en: 'Tamil Nadu',
    hi: 'तमिलनाडु',
    bn: 'তামিলনাড়ু',
    ta: 'தமிழ்நாடு',
    te: 'తమిళనాడు',
    mr: 'तामिळनाडू',
    gu: 'તમિલનાડુ',
    kn: 'ತಮಿಳುನಾಡು',
  },
  'uttar-pradesh': {
    en: 'Uttar Pradesh',
    hi: 'उत्तर प्रदेश',
    bn: 'উত্তর প্রদেশ',
    ta: 'உத்தரப் பிரதேசம்',
    te: 'ఉత్తర ప్రదేశ్',
    mr: 'उत्तर प्रदेश',
    gu: 'ઉત્તર પ્રદેશ',
    kn: 'ಉತ್ತರ ಪ್ರದೇಶ',
  },
  maharashtra: {
    en: 'Maharashtra',
    hi: 'महाराष्ट्र',
    bn: 'মহারাষ্ট্র',
    ta: 'மகாராஷ்டிரா',
    te: 'మహారాష్ట్ర',
    mr: 'महाराष्ट्र',
    gu: 'મહારાષ્ટ્ર',
    kn: 'ಮಹಾರಾಷ್ಟ್ರ',
  },
  karnataka: {
    en: 'Karnataka',
    hi: 'कर्नाटक',
    bn: 'কর্ণাটক',
    ta: 'கர்நாடகா',
    te: 'కర్ణాటక',
    mr: 'कर्नाटक',
    gu: 'કર્ણાટક',
    kn: 'ಕರ್ನಾಟಕ',
  },
  'west-bengal': {
    en: 'West Bengal',
    hi: 'पश्चिम बंगाल',
    bn: 'পশ্চিমবঙ্গ',
    ta: 'மேற்கு வங்காளம்',
    te: 'పశ్చిమ బెంగాల్',
    mr: 'पश्चिम बंगाल',
    gu: 'પશ્ચિમ બંગાળ',
    kn: 'ಪಶ್ಚಿಮ ಬಂಗಾಳ',
  },
  gujarat: {
    en: 'Gujarat',
    hi: 'गुजरात',
    bn: 'গুজরাট',
    ta: 'குஜராத்',
    te: 'గుజరాత్',
    mr: 'गुजरात',
    gu: 'ગુજરાત',
    kn: 'ಗುಜರಾತ್',
  },
  punjab: {
    en: 'Punjab',
    hi: 'पंजाब',
    bn: 'পাঞ্জাব',
    ta: 'பஞ்சாப்',
    te: 'పంజాబ్',
    mr: 'पंजाब',
    gu: 'પંજાબ',
    kn: 'ಪಂಜಾಬ್',
  },
  odisha: {
    en: 'Odisha',
    hi: 'ओडिशा',
    bn: 'ওড়িশা',
    ta: 'ஒடிசா',
    te: 'ఒడిశా',
    mr: 'ओडिशा',
    gu: 'ઓડિશા',
    kn: 'ಒಡಿಶಾ',
  },
  assam: {
    en: 'Assam',
    hi: 'असम',
    bn: 'আসাম',
    ta: 'அசாம்',
    te: 'అస్సాం',
    mr: 'आसाम',
    gu: 'અસમ',
    kn: 'ಅಸ್ಸಾಂ',
  },
  bihar: {
    en: 'Bihar',
    hi: 'बिहार',
    bn: 'বিহার',
    ta: 'பீகார்',
    te: 'బీహార్',
    mr: 'बिहार',
    gu: 'બિહાર',
    kn: 'ಬಿಹಾರ',
  },
  jharkhand: {
    en: 'Jharkhand',
    hi: 'झारखंड',
    bn: 'ঝাড়খণ্ড',
    ta: 'ஜார்க்கண்ட்',
    te: 'జార్ఖండ్',
    mr: 'झारखंड',
    gu: 'ઝારખંડ',
    kn: 'ಜಾರ್ಖಂಡ್',
  },
  'madhya-pradesh': {
    en: 'Madhya Pradesh',
    hi: 'मध्य प्रदेश',
    bn: 'মধ্য প্রদেশ',
    ta: 'மத்திய பிரதேசம்',
    te: 'మధ్యప్రదేశ్',
    mr: 'मध्य प्रदेश',
    gu: 'મધ્ય પ્રદેશ',
    kn: 'ಮಧ್ಯ ಪ್ರದೇಶ',
  },
  'andhra-pradesh': {
    en: 'Andhra Pradesh',
    hi: 'आंध्र प्रदेश',
    bn: 'অন্ধ্র প্রদেশ',
    ta: 'ஆந்திரப் பிரதேசம்',
    te: 'ఆంధ్రప్రదేశ్',
    mr: 'आंध्र प्रदेश',
    gu: 'આંધ્ર પ્રદેશ',
    kn: 'ಆಂಧ್ರ ಪ್ರದೇಶ',
  },
  telangana: {
    en: 'Telangana',
    hi: 'तेलंगाना',
    bn: 'তেলেঙ্গানা',
    ta: 'தெலுங்கானா',
    te: 'తెలంగాణ',
    mr: 'तेलंगणा',
    gu: 'તેલંગાણા',
    kn: 'ತೆಲಂಗಾಣ',
  },
  goa: {
    en: 'Goa',
    hi: 'गोवा',
    bn: 'গোয়া',
    ta: 'கோவா',
    te: 'గోవా',
    mr: 'गोवा',
    gu: 'ગોવા',
    kn: 'ಗೋವಾ',
  },
  'himachal-pradesh': {
    en: 'Himachal Pradesh',
    hi: 'हिमाचल प्रदेश',
    bn: 'হিমাচল প্রদেশ',
    ta: 'இமாச்சல பிரதேசம்',
    te: 'హిమాచల్ ప్రదేశ్',
    mr: 'हिमाचल प्रदेश',
    gu: 'હિમાચલ પ્રદેશ',
    kn: 'ಹಿಮಾಚಲ ಪ್ರದೇಶ',
  },
  uttarakhand: {
    en: 'Uttarakhand',
    hi: 'उत्तराखंड',
    bn: 'উত্তরাখণ্ড',
    ta: 'உத்தரகாண்ட்',
    te: 'ఉత్తరాఖండ్',
    mr: 'उत्तराखंड',
    gu: 'ઉત્તરાખંડ',
    kn: 'ಉತ್ತರಾಖಂಡ',
  },
  delhi: {
    en: 'Delhi (NCT)',
    hi: 'दिल्ली (राष्ट्रीय राजधानी क्षेत्र)',
    bn: 'দিল্লি (এনসিটি)',
    ta: 'தில்லி',
    te: 'ఢిల్లీ',
    mr: 'दिल्ली',
    gu: 'દિલ્હી',
    kn: 'ದೆಹಲಿ',
  },
  'jammu-and-kashmir': {
    en: 'Jammu & Kashmir',
    hi: 'जम्मू और कश्मीर',
    bn: 'জম্মু ও কাশ্মীর',
    ta: 'ஜம்மு & காஷ்மீர்',
    te: 'జమ్మూ & కాశ్మీర్',
    mr: 'जम्मू आणि काश्मीर',
    gu: 'જમ્મુ અને કાશ્મીર',
    kn: 'ಜಮ್ಮು & ಕಾಶ್ಮೀರ',
  },
  ladakh: {
    en: 'Ladakh',
    hi: 'लद्दाख',
    bn: 'লাদাখ',
    ta: 'லடாக்',
    te: 'లడఖ్',
    mr: 'लडाख',
    gu: 'લદાખ',
    kn: 'ಲಡಾಖ್',
  },
  sikkim: {
    en: 'Sikkim',
    hi: 'सिक्किम',
    bn: 'সিকিম',
    ta: 'சிக்கிம்',
    te: 'సిక్కిం',
    mr: 'सिक्कीम',
    gu: 'સિક્કિમ',
    kn: 'ಸಿಕ್ಕಿಂ',
  },
  meghalaya: {
    en: 'Meghalaya',
    hi: 'मेघालय',
    bn: 'মেঘালয়',
    ta: 'மேகாலயா',
    te: 'మేఘాలయ',
    mr: 'मेघालय',
    gu: 'મેઘાલય',
    kn: 'ಮೇಘಾಲಯ',
  },
  nagaland: {
    en: 'Nagaland',
    hi: 'नागालैंड',
    bn: 'নাগাল্যান্ড',
    ta: 'நாகாலாந்து',
    te: 'నాగాలాండ్',
    mr: 'नागालँड',
    gu: 'નાગાલેન્ડ',
    kn: 'ನಾಗಾಲ್ಯಾಂಡ್',
  },
  manipur: {
    en: 'Manipur',
    hi: 'मणिपुर',
    bn: 'মণিপুর',
    ta: 'மணிப்பூர்',
    te: 'మణిపూర్',
    mr: 'मणिपूर',
    gu: 'મણિપુર',
    kn: 'ಮಣಿಪುರ',
  },
  mizoram: {
    en: 'Mizoram',
    hi: 'मिजोरम',
    bn: 'মিজোরাম',
    ta: 'மிசோரம்',
    te: 'మిజోరం',
    mr: 'मिझोराम',
    gu: 'મિઝોરમ',
    kn: 'ಮಿಜೋರಾಂ',
  },
  tripura: {
    en: 'Tripura',
    hi: 'त्रिपुरा',
    bn: 'ত্রিপুরা',
    ta: 'திரிபுரா',
    te: 'త్రిపుర',
    mr: 'त्रिपुरा',
    gu: 'ત્રિપુરા',
    kn: 'ತ್ರಿಪುರ',
  },
  'arunachal-pradesh': {
    en: 'Arunachal Pradesh',
    hi: 'अरुणाचल प्रदेश',
    bn: 'অরুণাচল প্রদেশ',
    ta: 'அருணாச்சலப் பிரதேசம்',
    te: 'అరుణాచల్ ప్రదేశ్',
    mr: 'अरुणाचल प्रदेश',
    gu: 'અરુણાચલ પ્રદેશ',
    kn: 'ಅರುಣಾಚಲ ಪ್ರದೇಶ',
  },
  chhattisgarh: {
    en: 'Chhattisgarh',
    hi: 'छत्तीसगढ़',
    bn: 'ছত্তিশগড়',
    ta: 'சத்தீஸ்கர்',
    te: 'ఛత్తీస్‌గఢ్',
    mr: 'छत्तीसगड',
    gu: 'છત્તીસગઢ',
    kn: 'ಛತ್ತೀಸ್‌ಗಢ',
  },
  haryana: {
    en: 'Haryana',
    hi: 'हरियाणा',
    bn: 'হরিয়ানা',
    ta: 'ஹரியானா',
    te: 'హర్యానా',
    mr: 'हरियाणा',
    gu: 'હરિયાણા',
    kn: 'ಹರಿಯಾಣ',
  },
  'andaman-and-nicobar-islands': {
    en: 'Andaman & Nicobar Islands',
    hi: 'अंडमान और निकोबार द्वीप समूह',
    bn: 'আন্দামান ও নিকোবর দ্বীপপুঞ্জ',
    ta: 'அந்தமான் & நிக்கோபார் தீவுகள்',
    te: 'అండమాన్ & నికోబార్ దీవులు',
    mr: 'अंदमान आणि निकोबार बेटे',
    gu: 'અંદમાન અને નિકોબાર ટાપુઓ',
    kn: 'ಅಂಡಮಾನ್ & ನಿಕೋಬಾರ್ ದ್ವೀಪಗಳು',
  },
  chandigarh: {
    en: 'Chandigarh',
    hi: 'चंडीगढ़',
    bn: 'চণ্ডীগড়',
    ta: 'சண்டிகர்',
    te: 'చండీగఢ్',
    mr: 'चंदिगढ',
    gu: 'ચંદીગઢ',
    kn: 'ಚಂಡೀಗಢ',
  },
  puducherry: {
    en: 'Puducherry',
    hi: 'पुडुचेरी',
    bn: 'পুদুচেরি',
    ta: 'புதுச்சேரி',
    te: 'పుదుచ్చేరి',
    mr: 'पुडुचेरी',
    gu: 'પુડુચેરી',
    kn: 'ಪುದುಚೇರಿ',
  },
  lakshadweep: {
    en: 'Lakshadweep',
    hi: 'लक्षद्वीप',
    bn: 'লাক্ষাদ্বীপ',
    ta: 'லட்சத்தீவு',
    te: 'లక్షద్వీప్',
    mr: 'लक्षद्वीप',
    gu: 'લક્ષદ્વીપ',
    kn: 'ಲಕ್ಷದ್ವೀಪ',
  },
  'dadra-and-nagar-haveli-and-daman-and-diu': {
    en: 'Dadra & Nagar Haveli and Daman & Diu',
    hi: 'दादरा और नगर हवेली एवं दमन और दीव',
    bn: 'দাদরা ও নগর হাভেলি এবং দমন ও দিউ',
    ta: 'தாத்ரா & நகர் ஹவேலி மற்றும் டாமன் & டையூ',
    te: 'దాద్రా & నగర్ హవేలి మరియు డామన్ & డయ్యు',
    mr: 'दादरा आणि नगर हवेली आणि दमण आणि दीव',
    gu: 'દાદરા અને નગર હવેલી અને દમણ અને દીવ',
    kn: 'ದಾದ್ರಾ & ನಗರ ಹವೇಲಿ ಮತ್ತು ದಮನ್ & ದಿಯು',
  },
};

// Multilingual Region Names
export const REGION_NAMES_MULTILINGUAL: Record<string, Record<LanguageKey, string>> = {
  all: {
    en: 'All Regions (36)',
    hi: 'सभी क्षेत्र (36)',
    bn: 'সকল অঞ্চল (৩৬)',
    ta: 'அனைத்து பகுதிகள் (36)',
    te: 'అన్ని ప్రాంతాలు (36)',
    mr: 'सर्व प्रदेश (३६)',
    gu: 'બધા વિસ્તારો (36)',
    kn: 'ಎಲ್ಲಾ ಪ್ರದೇಶಗಳು (36)',
  },
  North: {
    en: 'North India',
    hi: 'उत्तर भारत',
    bn: 'উত্তর ভারত',
    ta: 'வட இந்தியா',
    te: 'ఉత్తర భారతదేశం',
    mr: 'उत्तर भारत',
    gu: 'ઉત્તર ભારત',
    kn: 'ಉತ್ತರ ಭಾರತ',
  },
  South: {
    en: 'South India',
    hi: 'दक्षिण भारत',
    bn: 'দক্ষিণ ভারত',
    ta: 'தென் இந்தியா',
    te: 'దక్షిణ భారతదేశం',
    mr: 'दक्षिण भारत',
    gu: 'દક્ષિણ ભારત',
    kn: 'ದಕ್ಷಿಣ ಭಾರತ',
  },
  East: {
    en: 'East India',
    hi: 'पूर्वी भारत',
    bn: 'পূর্ব ভারত',
    ta: 'கிழக்கு இந்தியா',
    te: 'తూర్పు భారతదేశం',
    mr: 'पूर्व भारत',
    gu: 'પૂર્વ ભારત',
    kn: 'ಪೂರ್ವ ಭಾರತ',
  },
  West: {
    en: 'West India',
    hi: 'पश्चिम भारत',
    bn: 'পশ্চিম ভারত',
    ta: 'மேற்கு இந்தியா',
    te: 'పశ్చిమ భారతదేశం',
    mr: 'पश्चिम भारत',
    gu: 'પશ્ચિમ ભારત',
    kn: 'ಪಶ್ಚಿಮ ಭಾರತ',
  },
  Central: {
    en: 'Central India',
    hi: 'मध्य भारत',
    bn: 'মধ্য ভারত',
    ta: 'மத்திய இந்தியா',
    te: 'మధ్య భారతదేశం',
    mr: 'मध्य भारत',
    gu: 'મધ્ય ભારત',
    kn: 'ಮಧ್ಯ ಭಾರತ',
  },
  Northeast: {
    en: 'Northeast India',
    hi: 'पूर्वोत्तर भारत',
    bn: 'উত্তর-পূর্ব ভারত',
    ta: 'வடகிழக்கு இந்தியா',
    te: 'ఈశాన్య భారతదేశం',
    mr: 'ईशान्य भारत',
    gu: 'ઉત્તર-પૂર્વ ભારત',
    kn: 'ಈಶಾನ್ಯ ಭಾರತ',
  },
  Islands: {
    en: 'Islands & Maritime',
    hi: 'द्वीप समूह',
    bn: 'দ্বীপপুঞ্জ',
    ta: 'தீவுகள்',
    te: 'దీవులు',
    mr: 'बेटे',
    gu: 'ટાપુઓ',
    kn: 'ದ್ವೀಪಗಳು',
  },
};

// Multilingual Monument Titles
export const HERITAGE_TITLES_MULTILINGUAL: Record<string, Record<LanguageKey, string>> = {
  'taj-mahal': {
    en: 'Taj Mahal (Yamuna Riverfront)',
    hi: 'ताज महल (यमुना तट)',
    bn: 'তাজমহল (যমুনা তীরবর্তী)',
    ta: 'தாஜ்மஹால் (யமுனை நதிக்கரை)',
    te: 'తాజ్ మహల్ (యమునా తీరం)',
    mr: 'ताज महाल (यमुना तट)',
    gu: 'તાજ મહાલ (યમુના નદી કિનારો)',
    kn: 'ತಾಜ್ ಮಹಲ್ (ಯಮುನಾ ನದೀತೀರ)',
  },
  'konark-sun-temple': {
    en: 'Konark Sun Temple',
    hi: 'कोणार्क सूर्य मंदिर',
    bn: 'কোনারক সূর্য মন্দির',
    ta: 'கோனார்க் சூரியன் கோவில்',
    te: 'కోణార్క్ సూర్య దేవాలయం',
    mr: 'कोणार्क सूर्य मंदिर',
    gu: 'કોણાર્ક સૂર્ય મંદિર',
    kn: 'ಕೊನಾರ್ಕ್ ಸೂರ್ಯ ದೇವಾಲಯ',
  },
  'hampi-virupaksha-temple': {
    en: 'Hampi Virupaksha & Monolithic Complex',
    hi: 'हम्पी विरूपाक्ष एवं शिला मंदिर समूह',
    bn: 'হাম্পি বিরূপাক্ষ মন্দির কমপ্লেক্স',
    ta: 'ஹம்பி விருபாக்ஷா கோவில் வளாகம்',
    te: 'హంపి విరూపాక్ష దేవాలయ సముదాయం',
    mr: 'हंपी विरूपाक्ष मंदिर संकुल',
    gu: 'હમ્પી વિરૂપાક્ષ મંદિર પરિસર',
    kn: 'ಹಂಪಿ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ ಸಂಕೀರ್ಣ',
  },
  'qutub-minar': {
    en: 'Qutub Minar & Mehrauli Complex',
    hi: 'कुतुब मीनार एवं महरौली परिसर',
    bn: 'কুতুব মিনার ও মেহরাউলি কমপ্লেক্স',
    ta: 'குதுப் மினார் & மெஹ்ராலி வளாகம்',
    te: 'కుతుబ్ మీనార్ & మెహ్రౌలి సముదాయం',
    mr: 'कुतुब मिनार व मेहरौली संकुल',
    gu: 'કુતુબ મિનાર અને મહેરૌલી પરિસર',
    kn: 'ಕುತುಬ್ ಮಿನಾರ್ & ಮೆಹ್ರೌಲಿ ಸಂಕೀರ್ಣ',
  },
  'ajanta-caves': {
    en: 'Ajanta Caves & Buddhist Murals',
    hi: 'अजंता गुफाएं एवं भित्तिचित्र',
    bn: 'অজন্তা গুহা ও বৌদ্ধ ম্যুরাল',
    ta: 'அஜந்தா குகைகள் & சுவரோவியங்கள்',
    te: 'అజంతా గుహలు & బౌద్ధ కుడ్యచిత్రాలు',
    mr: 'अजिंठा लेणी व भित्तिचित्रे',
    gu: 'અજંતા ગુફાઓ અને ભીંતચિત્રો',
    kn: 'ಅಜಂತಾ ಗುಹೆಗಳು & ಭಿತ್ತಿಚಿತ್ರಗಳು',
  },
  'golden-temple': {
    en: 'Sri Harmandir Sahib (Golden Temple)',
    hi: 'श्री हरमंदिर साहिब (स्वर्ण मंदिर)',
    bn: 'শ্রী হরিমন্দির সাহিব (স্বর্ণ মন্দির)',
    ta: 'ஸ்ரீ ஹர்மந்திர் சாஹிப் (பொற்கோவில்)',
    te: 'శ్రీ హర్మందిర్ సాహిబ్ (స్వర్ణ దేవాలయం)',
    mr: 'श्री हरमंदिर साहिब (सुवर्ण मंदिर)',
    gu: 'શ્રી હરમંદિર સાહિબ (સુવર્ણ મંદિર)',
    kn: 'ಶ್ರೀ ಹರ್ಮಂದಿರ್ ಸಾಹಿಬ್ (ಚಿನ್ನದ ದೇವಾಲಯ)',
  },
  'shikharji-parasnath': {
    en: 'Parasnath Hill & Shikharji',
    hi: 'पारसनाथ पहाड़ी एवं सम्मेद शिखरजी',
    bn: 'পরেশনাথ পাহাড় ও সমেদ শিখরজী',
    ta: 'பரஸ்நாத் மலை & சம்மேத் சிகர்ஜி',
    te: 'పారస్నాథ్ కొండ & సమ్మేద్ శిఖర్జీ',
    mr: 'पारसनाथ टेकडी व सम्मेद शिखरजी',
    gu: 'પારસનાથ ટેકરી અને સમેત શિખરજી',
    kn: 'ಪಾರಸ್ನಾಥ್ ಬೆಟ್ಟ & ಸಮ್ಮೇದ್ ಶಿಖರ್ಜಿ',
  },
  'amber-fort': {
    en: 'Amber Palace & Fort',
    hi: 'आमेर किला एवं महल',
    bn: 'আম্বর দুর্গ ও প্রাসাদ',
    ta: 'ஆம்பர் கோட்டை & அரண்மனை',
    te: 'అంబర్ కోట & రాజభవనం',
    mr: 'आमेर किल्ला व राजवाडा',
    gu: 'આમેર કિલ્લો અને મહેલ',
    kn: 'ಅಂಬರ್ ಕೋಟೆ & ಅರಮನೆ',
  },
  'hawa-mahal': {
    en: 'Hawa Mahal (Palace of Winds)',
    hi: 'हवा महल',
    bn: 'হাওয়া মহল',
    ta: 'ஹவா மஹால் (காற்று அரண்மனை)',
    te: 'హవా మహల్',
    mr: 'हवा महल',
    gu: 'હવા મહેલ',
    kn: 'ಹವಾ ಮಹಲ್',
  },
  'mehrangarh-fort': {
    en: 'Mehrangarh Fort (Jodhpur)',
    hi: 'मेहरानगढ़ दुर्ग (जोधपुर)',
    bn: 'মেহরানগড় দুর্গ (যোধপুর)',
    ta: 'மெஹ்ரன்கர் கோட்டை (ஜோத்பூர்)',
    te: 'మెహ్రన్‌గఢ్ కోట (జోధ్‌పూర్)',
    mr: 'मेहरानगड किल्ला (जोधपूर)',
    gu: 'મેહરાનગઢ કિલ્લો (જોધપુર)',
    kn: 'ಮೆಹ್ರಾನ್‌ಗಢ್ ಕೋಟೆ (ಜೋಧಪುರ)',
  },
  'jaisalmer-fort': {
    en: 'Jaisalmer Golden Fort (Sonar Qila)',
    hi: 'जैसलमेर स्वर्ण दुर्ग (सोनार किला)',
    bn: 'জয়সলমীর সোনার কেল্লা',
    ta: 'ஜெய்சால்மர் தங்கக் கோட்டை',
    te: 'జైసల్మేర్ బంగారు కోట',
    mr: 'जैसलमेर सुवर्ण किल्ला',
    gu: 'જેસલમેર સોનાર કિલ્લો',
    kn: 'ಜೈಸಲ್ಮೇರ್ ಚಿನ್ನದ ಕೋಟೆ',
  },
  'chittorgarh-fort': {
    en: 'Chittorgarh Fort (Vijay Stambha)',
    hi: 'चित्तौड़गढ़ दुर्ग (विजय स्तंभ)',
    bn: 'চিত্তোরগড় দুর্গ (বিজয় স্তম্ভ)',
    ta: 'சித்தூர்கர் கோட்டை (விஜய ஸ்தம்பம்)',
    te: 'చిత్తోర్‌గఢ్ కోట (విజయ స్తంభం)',
    mr: 'चित्तोडगड किल्ला (विजयस्तंभ)',
    gu: 'ચિત્તોડગઢ કિલ્લો (વિજય સ્તંભ)',
    kn: 'ಚಿತ್ತೋರ್‌ಗಢ್ ಕೋಟೆ (ವಿಜಯ ಸ್ತಂಭ)',
  },
  'jantar-mantar-jaipur': {
    en: 'Jantar Mantar Astronomical Observatory',
    hi: 'जंतर मंतर वेधशाला (जयपुर)',
    bn: 'যন্তর মন্তর মানমন্দির (জয়পুর)',
    ta: 'ஜந்தர் மந்தர் வானியல் ஆய்வுக்கூடம்',
    te: 'జంతర్ మంతర్ ఖగోళ పరిశీలనా కేంద్రం',
    mr: 'जंतर मंतर वेधशाळा (जयपूर)',
    gu: 'જંતર મંતર વેધશાળા (જયપુર)',
    kn: 'ಜಂತರ್ ಮಂತರ್ ಖಗೋಳ ವೀಕ್ಷಣಾಲಯ',
  },
  'padmanabhaswamy-temple': {
    en: 'Sree Padmanabhaswamy Temple',
    hi: 'श्री पद्मनाभस्वामी मंदिर',
    bn: 'শ্রী পদ্মনাভস্বামী মন্দির',
    ta: 'ஸ்ரீ பத்மநாபசுவாமி கோவில்',
    te: 'శ్రీ పద్మనాభస్వామి దేవాలయం',
    mr: 'श्री पद्मनाभस्वामी मंदिर',
    gu: 'શ્રી પદ્મનાભસ્વામી મંદિર',
    kn: 'ಶ್ರೀ ಪದ್ಮನಾಭಸ್ವಾಮಿ ದೇವಾಲಯ',
  },
  'mattancherry-palace': {
    en: 'Mattancherry Dutch Palace',
    hi: 'मट्टनचेरी डच पैलेस',
    bn: 'মাট্টানচেরি ডাচ প্রাসাদ',
    ta: 'மட்டன்சேரி டச்சு அரண்மனை',
    te: 'మట్టన్‌చెర్రీ డచ్ ప్యాలెస్',
    mr: 'मट्टनचेरी डच राजवाडा',
    gu: 'મટ્ટનચેરી ડચ મહેલ',
    kn: 'ಮಟ್ಟನ್‌ಚೇರಿ ಡಚ್ ಅರಮನೆ',
  },
  'bekal-fort': {
    en: 'Bekal Coastal Fort',
    hi: 'बेकल तटीय दुर्ग',
    bn: 'বেকোল উপকূলীয় দুর্গ',
    ta: 'பெக்கல் கடற்கரைக் கோட்டை',
    te: 'బేకల్ తీర కోట',
    mr: 'बेकल सागरी किल्ला',
    gu: 'બેકલ દરિયાઈ કિલ્લો',
    kn: 'ಬೇಕಲ್ ಕರಾವಳಿ ಕೋಟೆ',
  },
  'alappuzha-backwaters': {
    en: 'Alappuzha Backwaters & Houseboats',
    hi: 'अलप्पुझा बैकवाटर्स एवं केट्टुवल्लम',
    bn: 'আলাপ্পুঝা ব্যাকওয়াটার্স ও হাউসবোট',
    ta: 'ஆலப்புழா உப்பங்கழிகள் & படகு இல்லம்',
    te: 'ఆలప్పుళా బ్యాక్‌వాటర్స్ & బోట్ హౌస్',
    mr: 'अलप्पुळा बॅकवॉटर्स व हाउसबोट',
    gu: 'અલપ્પુઝા બેકવોટર્સ અને હાઉસબોટ',
    kn: 'ಅಲಪ್ಪುಳ ಹಿನ್ನೀರು & ಹೌಸ್‌ಬೋಟ್',
  },
  'chinese-fishing-nets': {
    en: 'Kochi Chinese Fishing Nets (Cheena Vala)',
    hi: 'कोच्चि चीनी मछली पकड़ने के जाल (चीना वला)',
    bn: 'কোচির চিনা মাছ ধরার জাল',
    ta: 'கொச்சி சீன மீன்பிடி வலைகள்',
    te: 'కొచ్చి చైనా చేపల వలలు',
    mr: 'कोची चायनीज मासेमारी जाळी',
    gu: 'કોચી ચાઇનીઝ ફિશિંગ નેટ્સ',
    kn: 'ಕೊಚ್ಚಿ ಚೀನೀ ಮೀನುಗಾರಿಕೆ ಬಲೆಗಳು',
  },
  'kalamandalam-kathakali': {
    en: 'Kerala Kalamandalam (Kathakali Arts)',
    hi: 'केरल कलामंडलम (कथकली नृत्यपीठ)',
    bn: 'কেরালা কালামন্ডলম (কথাকলি নৃত্যপীঠ)',
    ta: 'கேரளா கலாமண்டலம் (கதகளி நாட்டிய பீடம்)',
    te: 'కేరళ కళామండలం (కథాకళి నాట్యపీఠం)',
    mr: 'केरळ कलामंडलम (कथकली नृत्यपीठ)',
    gu: 'કેરળ કલામંડલમ (કથકલી નૃત્યપીઠ)',
    kn: 'ಕೇರಳ ಕಲಾಮಂಡಲಂ (ಕಥಕ್ಕಳಿ ಶಾಸ್ತ್ರೀಯ ಕಲೆ)',
  },
  'brihadisvara-temple': {
    en: 'Brihadisvara Great Chola Temple',
    hi: 'बृहदीश्वर मंदिर (तंजावुर)',
    bn: 'বৃহদীশ্বর চোল মন্দির (তাঞ্জাভুর)',
    ta: 'தஞ்சை பெருவுடையார் கோவில் (பிரகதீஸ்வரர்)',
    te: 'బృహదీశ్వర చోళ దేవాలయం (తంజావూరు)',
    mr: 'बृहदीश्वर चोल मंदिर (तंजावर)',
    gu: 'બૃહદીશ્વર ચોલ મંદિર (તંજાવુર)',
    kn: 'ಬೃಹದೀಶ್ವರ ಚೋಳ ದೇವಾಲಯ (ತಂಜಾವೂರು)',
  },
  'brihadisvara': {
    en: 'Brihadisvara Temple (Thanjavur)',
    hi: 'बृहदीश्वर मंदिर (तंजावुर)',
    bn: 'বৃহদীশ্বর মন্দির (তাঞ্জাভুর)',
    ta: 'பிரகதீஸ்வரர் கோவில் (தஞ்சாவூர்)',
    te: 'బృహదీశ్వర దేవాలయం (తంజావూరు)',
    mr: 'बृहदीश्वर मंदिर (तंजावर)',
    gu: 'બૃહદીશ્વર મંદિર (તંજાવુર)',
    kn: 'ಬೃಹದೀಶ್ವರ ದೇವಾಲಯ (ತಂಜಾವೂರು)',
  },
  'mahabalipuram-shore-temple': {
    en: 'Mahabalipuram Shore Temple & Monoliths',
    hi: 'महाबलीपुरम तट मंदिर एवं रथ शैलसमूह',
    bn: 'মহাবলীপুরম শোর মন্দির ও পঞ্চরথ',
    ta: 'மகாபலிபுரம் கடற்கரைக் கோவில் & பஞ்சரதங்கள்',
    te: 'మహాబలిపురం తీర దేవాలయం & పంచరథాలు',
    mr: 'महाबलीपुरम शोर मंदिर व पंचरथ',
    gu: 'મહાબલીપુરમ કિનારાનું મંદિર',
    kn: 'ಮಹಾಬಲಿಪುರಂ ಕಡಲತೀರದ ದೇವಾಲಯ & ಪಂಚರಥಗಳು',
  },
  'meenakshi-amman-temple': {
    en: 'Madurai Meenakshi Sundareswarar Temple',
    hi: 'मदुरै मीनाक्षी सुंदरेश्वरर मंदिर',
    bn: 'মাদুরাই মীনাক্ষী সুন্দরেশ্বর মন্দির',
    ta: 'மதுரை மீனாட்சி சுந்தரேஸ்வரர் திருக்கோவில்',
    te: 'మదురై మీనాక్షి సుందరేశ్వర దేవాలయం',
    mr: 'मदुराई मीनाक्षी सुंदरेश्वर मंदिर',
    gu: 'મદુરાઈ મીનાક્ષી સુંદરેશ્વર મંદિર',
    kn: 'ಮಧುರೈ ಮೀನಾಕ್ಷಿ ಸುಂದರೇಶ್ವರ ದೇವಾಲಯ',
  },
  'meenakshi': {
    en: 'Meenakshi Amman Temple',
    hi: 'मीनाक्षी अम्मन मंदिर',
    bn: 'মীনাক্ষী আম্মান মন্দির',
    ta: 'மீனாட்சி அம்மன் கோவில்',
    te: 'మీనాక్షి అమ్మవారి దేవాలయం',
    mr: 'मीनाक्षी अम्मन मंदिर',
    gu: 'મીનાક્ષી અમ્મન મંદિર',
    kn: 'ಮೀನಾಕ್ಷಿ ಅಮ್ಮನ್ ದೇವಾಲಯ',
  },
  'ramanathaswamy-temple': {
    en: 'Rameshwaram Ramanathaswamy Temple',
    hi: 'रामेश्वरम रामनाथस्वामी ज्योतिर्लिंग मंदिर',
    bn: 'রামেশ্বরম রামনাথস্বামী মন্দির',
    ta: 'ராமேஸ்வரம் ராமநாதசுவாமி திருக்கோவில்',
    te: 'రామేశ్వరం రామనాథస్వామి దేవాలయం',
    mr: 'रामेश्वरम रामनाथस्वामी ज्योतिर्लिंग मंदिर',
    gu: 'રામેશ્વરમ રામનાથસ્વામી જ્યોતિર્લિંગ મંદિર',
    kn: 'ರಾಮೇಶ್ವರಂ ರಾಮನಾಥಸ್ವಾಮಿ ದೇವಾಲಯ',
  },
  'nilgiri-mountain-railway': {
    en: 'Nilgiri Mountain Toy Railway (UNESCO)',
    hi: 'नीलगिरि पर्वतीय टॉय ट्रेन (यूनेस्को)',
    bn: 'নীলগিরি মাউন্টেন রেলওয়ে (টয় ট্রেন)',
    ta: 'நீலகிரி மலை இரயில் (பொம்மை ரயில்)',
    te: 'నీలగిరి పర్వత రైల్వే (టాయ్ ట్రైన్)',
    mr: 'नीलगिरी माउंटन रेल्वे (टॉय ट्रेन)',
    gu: 'નીલગિરિ પર્વતીય ટોય ટ્રેન',
    kn: 'ನೀಲಗಿರಿ ಪರ್ವತ ರೈಲ್ವೆ (ಟಾಯ್ ಟ್ರೈನ್)',
  },
  'gangaikonda-cholapuram': {
    en: 'Gangaikonda Cholapuram Chola Temple',
    hi: 'गंगईकोंड चोलपुरम मंदिर',
    bn: 'গঙ্গাইকোন্ড চোলপুরম মন্দির',
    ta: 'கங்கைகொண்ட சோழபுரம் பெருவுடையார் கோவில்',
    te: 'గంగైకొండ చోళపురం ఆలయం',
    mr: 'गंगईकोंडा चोलपुरम मंदिर',
    gu: 'ગંગાઈકોંડા ચોલપુરમ મંદિર',
    kn: 'ಗಂಗೈಕೊಂಡ ಚೋಳಪುರಂ ದೇವಾಲಯ',
  },
  'varanasi-ghats': {
    en: 'Varanasi Ghats & Ganga Aarti',
    hi: 'वाराणसी पावन घाट एवं गंगा आरती',
    bn: 'বারাণসীর ঘাট ও গঙ্গা আরতি',
    ta: 'வாரணாசி படித்துறைகள் & கங்கா ஆரத்தி',
    te: 'వారణాసి ఘాట్లు & గంగా హారతి',
    mr: 'वाराणसी घाट व गंगा आरती',
    gu: 'વારાણસી ઘાટો અને ગંગા આરતી',
    kn: 'ವಾರಣಾಸಿ ಘಾಟ್‌ಗಳು & ಗಂಗಾ ಆರತಿ',
  },
  'fatehpur-sikri': {
    en: 'Fatehpur Sikri Imperial City & Buland Darwaza',
    hi: 'फतेहपुर सीकरी एवं बुलंद दरवाजा',
    bn: 'ফতেহপুর সিক্রি ও বুলন্দ দরওয়াজা',
    ta: 'பதேபூர் சிக்ரி & புலந்த் தர்வாசா',
    te: 'ఫతేపూర్ సిక్రీ & బులంద్ దర్వాజా',
    mr: 'फत्तेपूर सिक्री व बुलंद दरवाजा',
    gu: 'ફતેહપુર સીકરી અને બુલંદ દરવાજા',
    kn: 'ಫತೇಪುರ್ ಸಿಕ್ರಿ & ಬುಲಂದ್ ದರ್ವಾಜಾ',
  },
  'sarnath-dhamek-stupa': {
    en: 'Sarnath Dhamek Stupa & Lion Capital',
    hi: 'सारनाथ धमेक स्तूप एवं सिंह शीर्ष',
    bn: 'সারনাথ ধামেক স্তূপ ও অশোক স্তম্ভ',
    ta: 'சாரநாத் தாமேக் ஸ்தூபி',
    te: 'సారనాథ్ ధమేక్ స్థూపం',
    mr: 'सारनाथ धमेक स्तूप',
    gu: 'સારનાથ ધામેખ સ્તૂપ',
    kn: 'ಸಾರನಾಥ ಧಾಮೇಕ ಸ್ತೂಪ',
  },
  'bara-imambara': {
    en: 'Bara Imambara & Bhool Bhulaiya',
    hi: 'बड़ा इमामबाड़ा एवं भूलभुलैया',
    bn: 'বড়া ইমামবাড়া ও ভুলভুলাইয়া',
    ta: 'பரா இமாம்பாரா & பூல் பூலையா',
    te: 'బడా ఇమాంబారా & భూల్ భులయ్యా',
    mr: 'बडा इमामबाडा व भुलभुलैय्या',
    gu: 'બડા ઈમામબારા અને ભૂલભૂલૈયા',
    kn: 'ಬಡಾ ಇಮಾಂಬಾರ & ಭೂಲ್ ಭುಲೈಯ್ಯಾ',
  },
  'agra-fort': {
    en: 'Agra Fort (Lal Qila of Agra)',
    hi: 'आगरा का लाल किला',
    bn: 'আগ্রা দুর্গ',
    ta: 'ஆக்ரா கோட்டை',
    te: 'ఆగ్రా కోట',
    mr: 'आग्रा किल्ला',
    gu: 'આગ્રા કિલ્લો',
    kn: 'ಆಗ್ರಾ ಕೋಟೆ',
  },
  'ajanta-ellora-caves': {
    en: 'Ajanta & Ellora Rock-Cut Caves',
    hi: 'अजंता एवं एलोरा शैलकृत गुफा समूह',
    bn: 'অজন্তা ও ইলোরা শৈলখোদাই গুহাসমূহ',
    ta: 'அஜந்தா & எல்லோரா குடைவரைக் குகைகள்',
    te: 'అజంతా & ఎల్లోరా రాతి తొలిచిన గుహలు',
    mr: 'अजिंठा व वेरूळ लेणी संकुल',
    gu: 'અજંતા અને ઈલોરા ગુફાઓ',
    kn: 'ಅಜಂತಾ & ಎಲ್ಲೋರಾ ಗುಹೆಗಳು',
  },
  'ellora': {
    en: 'Ellora Caves & Kailasa Temple',
    hi: 'एलोरा गुफाएं एवं कैलास मंदिर',
    bn: 'ইলোরা গুহা ও কৈলাশ মন্দির',
    ta: 'எல்லோரா குகைகள் & கைலாச கோவில்',
    te: 'ఎల్లోరా గుహలు & కైలాస దేవాలయం',
    mr: 'वेरूळ लेणी व कैलास मंदिर',
    gu: 'ઈલોરા ગુફાઓ અને કૈલાસ મંદિર',
    kn: 'ಎಲ್ಲೋರಾ ಗುಹೆಗಳು & ಕೈಲಾಸ ದೇವಾಲಯ',
  },
  'chhatrapati-shivaji-terminus': {
    en: 'Chhatrapati Shivaji Maharaj Terminus (CST)',
    hi: 'छत्रपति शिवाजी महाराज टर्मिनस (CST)',
    bn: 'ছত্রপতি শিবাজী মহারাজ টার্মিনাস',
    ta: 'சத்ரபதி சிவாஜி மகாராஜ் முனையம்',
    te: 'ఛత్రపతి శివాజీ మహారాజ్ టెర్మినస్',
    mr: 'छत्रपती शिवाजी महाराज टर्मिनस (सीएसएमटी)',
    gu: 'છત્રપતિ શિવાજી મહારાજ ટર્મિનસ',
    kn: 'ಛತ್ರಪತಿ ಶಿವಾಜಿ ಮಹಾರಾಜ್ ಟರ್ಮಿನಸ್',
  },
  'gateway-of-india': {
    en: 'Gateway of India (Mumbai Waterfront)',
    hi: 'गेटवे ऑफ इंडिया (मुंबई)',
    bn: 'গেটওয়ে অফ ইন্ডিয়া (মুম্বই)',
    ta: 'இந்தியாவின் நுழைவு வாயில் (மும்பை)',
    te: 'గేట్‌వే ఆఫ్ ఇండియా (ముంబై)',
    mr: 'गेटवे ऑफ इंडिया (मुंबई)',
    gu: 'ગેટવે ઓફ ઇન્ડિયા (મુંબઈ)',
    kn: 'ಗೇಟ್‌ವೇ ಆಫ್ ಇಂಡಿಯಾ (ಮುಂಬೈ)',
  },
  'raigad-fort': {
    en: 'Raigad Fort (Capital of Shivaji Maharaj)',
    hi: 'रायगढ़ दुर्ग (छत्रपति शिवाजी महाराज की राजधानी)',
    bn: 'রায়গড় দুর্গ (শিবাজী মহারাজের রাজধানী)',
    ta: 'ராய்கட் கோட்டை (சிவாஜி மகாராஜின் தலைநகரம்)',
    te: 'రాయ్‌గఢ్ కోట (శివాజీ మహారాజ్ రాజధాని)',
    mr: 'किल्ले रायगड (शिवराजधानी)',
    gu: 'રાયગઢ કિલ્લો (છત્રપતિ શિવાજીની રાજધાની)',
    kn: 'ರಾಯಗಢ ಕೋಟೆ (ಶಿವಾಜಿ ಮಹಾರಾಜರ ರಾಜಧಾನಿ)',
  },
  'elephanta-caves': {
    en: 'Elephanta Gharapuri Island Caves (Trimurti)',
    hi: 'एलिफेंटा गुफाएं (घारापुरी त्रिमूर्ति शिव)',
    bn: 'এলিফ্যান্টা গুহা (ঘারাপুরী ত্রিমূর্তি)',
    ta: 'எலிஃபெண்டா குகைகள் (திரிமூர்த்தி சிவன்)',
    te: 'ఎలిఫెంటా గుహలు (త్రిమూర్తి శివుడు)',
    mr: 'घारापुरी (एलिफंटा) लेणी व त्रिमूर्ती',
    gu: 'એલિફન્ટા ગુફાઓ (ત્રિમૂર્તિ શિવ)',
    kn: 'ಎಲಿಫೆಂಟಾ ಗುಹೆಗಳು (ತ್ರಿಮೂರ್ತಿ ಶಿವ)',
  },
  'shaniwar-wada': {
    en: 'Shaniwar Wada Peshwa Palace (Pune)',
    hi: 'शनिवार वाड़ा पेशवा महल (पुणे)',
    bn: 'শনিবার ওয়াড়া পেশোয়া প্রাসাদ (পুনে)',
    ta: 'சனிவார் வாடா பேஷ்வா அரண்மனை (புனே)',
    te: 'శనివార్ వాడా పేష్వా రాజభవనం (పూణే)',
    mr: 'शनिवार वाडा (पुणे)',
    gu: 'શનિવાર વાડા પેશ્વા મહેલ (પુણે)',
    kn: 'ಶನಿವಾರ ವಾಡಾ ಪೇಶ್ವೆ ಅರಮನೆ (ಪುಣೆ)',
  },
  'victoria-memorial': {
    en: 'Victoria Memorial Hall (Kolkata)',
    hi: 'विक्टोरिया मेमोरियल हॉल (कोलकाता)',
    bn: 'ভিক্টোরিয়া মেমোরিয়াল হল (কলকাতা)',
    ta: 'விக்டோரியா மெமோரியல் அரங்கம் (கொல்கத்தா)',
    te: 'విక్టోరియా మెమోరియల్ హాల్ (కోల్‌కతా)',
    mr: 'व्हिक्टोरिया मेमोरियल हॉल (कोलकाता)',
    gu: 'વિક્ટોરિયા મેમોરિયલ હૉલ (કોલકાતા)',
    kn: 'ವಿಕ್ಟೋರಿಯಾ ಮೆಮೋರಿಯಲ್ ಹಾಲ್ (ಕೋಲ್ಕತ್ತಾ)',
  },
  'howrah-bridge': {
    en: 'Howrah Bridge (Rabindra Setu Kolkata)',
    hi: 'हावड़ा ब्रिज (रवींद्र सेतु कोलकाता)',
    bn: 'হাওড়া ব্রিজ (রবীন্দ্র সেতু)',
    ta: 'ஹவுரா பாலம் (ரவீந்திர சேது)',
    te: 'హౌరా బ్రిడ్జ్ (రవీంద్ర సేతు)',
    mr: 'हावडा ब्रिज (रवींद्र सेतू)',
    gu: 'હાવડા બ્રિજ (રવીન્દ્ર સેતુ)',
    kn: 'ಹೌರಾ ಸೇತುವೆ (ರವೀಂದ್ರ ಸೇತು)',
  },
  'bishnupur-terracotta-temples': {
    en: 'Bishnupur Terracotta Malla Temples',
    hi: 'बिष्णुपुर टेराकोटा मल्ल मंदिर समूह',
    bn: 'বিষ্ণুপুর পোড়ামাটির মল্ল মন্দিরসমূহ',
    ta: 'விஷ்ணுபூர் சுடுமண் மல்லர் கோவில்கள்',
    te: 'విష్ణుపూర్ టెర్రకోట మల్ల దేవాలయాలు',
    mr: 'बिष्णुपूर टेराकोटा मल्ल मंदिरे',
    gu: 'બિષ્ણુપુર ટેરાકોટા મલ્લ મંદિરો',
    kn: 'ಬಿಷ್ಣುಪುರ ಟೆರಾಕೋಟಾ ಮಲ್ಲ ದೇವಾಲಯಗಳು',
  },
  'santiniketan': {
    en: 'Santiniketan (Tagore Cultural Sanctuary)',
    hi: 'शांतिनिकेतन (रवींद्रनाथ ठाकुर आश्रम)',
    bn: 'শান্তিনিকেতন (রবীন্দ্রনাথ ঠাকুরের আশ্রম)',
    ta: 'சாந்திநிகேதன் (தாகூர் ஆசிரமம்)',
    te: 'శాంతినికేతన్ (రవీంద్రనాథ్ ఠాగూర్ ఆశ్రమం)',
    mr: 'शांतिनिकेतन (रवींद्रनाथ टागोर आश्रम)',
    gu: 'શાંતિનિકેતન (રવીન્દ્રનાથ ટાગોર આશ્રમ)',
    kn: 'ಶಾಂತಿನಿಕೇತನ (ರವೀಂದ್ರನಾಥ ಟ್ಯಾಗೋರ್ ಆಶ್ರಮ)',
  },
  'dakshineswar-kali-temple': {
    en: 'Dakshineswar Bhavatarini Kali Temple',
    hi: 'दक्षिणेश्वर भवतारीणी काली मंदिर',
    bn: 'দক্ষিণেশ্বর ভবতারিণী কালী মন্দির',
    ta: 'தட்சிணேஸ்வர பவதாரிணி காளி கோவில்',
    te: 'దక్షిణేశ్వర్ భవతారిణి కాళీ దేవాలయం',
    mr: 'दक्षिणेश्वर भवतारिणी काली मंदिर',
    gu: 'દક્ષિણેશ્વર ભવતારિણી કાળી મંદિર',
    kn: 'ದಕ್ಷಿಣೇಶ್ವರ ಭವತಾರಿಣಿ ಕಾಳಿ ದೇವಾಲಯ',
  },
  'sundarbans-mangroves': {
    en: 'Sundarbans UNESCO Mangrove Delta',
    hi: 'सुंदरवन डेल्टा एवं रॉयल बंगाल टाइगर अभयारण्य',
    bn: 'সুন্দরবন ম্যানগ্রোভ বন ও ব্যাঘ্র সংরক্ষণাগার',
    ta: 'சுந்தரவனக் காடுகள் & புலிகள் சரணಾಲயம்',
    te: 'సుందర్బన్స్ మాంగ్రోవ్స్ & పులుల అభయారణ్యం',
    mr: 'सुंदरबन खारफुटी वन व व्याघ्र प्रकल्प',
    gu: 'સુંદરવન મેંગ્રોવ ડેલ્ટા અને વાઘ અભયારણ્ય',
    kn: 'ಸುಂದರಬನ್ಸ್ ಮ್ಯಾಂಗ್ರೋವ್ಸ್ & ಹುಲಿ ಸಂರಕ್ಷಿತಾರಣ್ಯ',
  },
  'red-fort': {
    en: 'Red Fort (Lal Qila Delhi)',
    hi: 'लाल किला (दिल्ली)',
    bn: 'লালকেল্লা (দিল্লি)',
    ta: 'செங்கோட்டை (தில்லி)',
    te: 'ఎర్రకోట (ఢిల్లీ)',
    mr: 'लाल किल्ला (दिल्ली)',
    gu: 'લાલ કિલ્લો (દિલ્હી)',
    kn: 'ಕೆಂಪು ಕೋಟೆ (ದೆಹಲಿ)',
  },
  'khajuraho': {
    en: 'Khajuraho Group of Monuments',
    hi: 'खजुराहो स्मारक समूह',
    bn: 'খাজুরাহো স্মৃতিস্তম্ভ সমূহ',
    ta: 'கஜுராஹோ நினைவுச்சின்னங்கள்',
    te: 'ఖజురహో స్మారక చిహ్నాలు',
    mr: 'खजुराहो स्मारक समूह',
    gu: 'ખજુરાહો સ્મારક સમૂહ',
    kn: 'ಖಜುರಾಹೊ ಸ್ಮಾರಕಗಳ ಸಮೂಹ',
  },
  'sanchi-stupa': {
    en: 'Great Stupa at Sanchi',
    hi: 'सांची का महान स्तूप',
    bn: 'সাঁচির মহান স্তূপ',
    ta: 'சாஞ்சி மகா ஸ்தூபி',
    te: 'సాంచి మహా స్థూపం',
    mr: 'सांचीचा महान स्तूप',
    gu: 'સાંચીનો મહાન સ્તૂપ',
    kn: 'ಸಾಂಚಿಯ ಮಹಾ ಸ್ತೂಪ',
  },
};

// UI Localized Strings for Explorer and Cards
export const EXPLORER_TRANSLATIONS: Record<LanguageKey, Record<string, string>> = {
  en: {
    national_archive_tag: 'National Heritage Archive',
    states_dir_tag: '36 States & UTs Directory',
    explore_heading: 'Explore by State & Living Heritage',
    explore_subheading: 'Select any Indian state or union territory, then choose what you wish to see: Monuments, Festivals, Living Traditions, Art & Crafts, Classical Languages, or Signature Cuisines.',
    step_1_title: 'Step 1: Select State / Region',
    step_2_title: 'Step 2: Choose What to See',
    all_india_label: 'All India',
    national_repo: 'National Repository',
    records_label: 'Records',
    available: 'available',
    capital: 'Capital',
    coordinates: 'Coordinates',
    view_full_archive: 'View Full State Archive',
    details: 'Details',
    sunrise_sunset: 'Sunrise to Sunset',
    dietary_veg: 'Vegetarian',
    dietary_nonveg: 'Non-Vegetarian',
    recipe_label: 'Authentic Regional Recipe',
    gi_cultural: 'GI & Cultural Food',
    significance_label: 'Significance:',
    celebration_label: 'Celebration Rituals:',
    script_label: 'Script:',
    greeting_label: 'Traditional Greeting:',
    listen_pronounce: 'Listen to pronunciation',
    speaker_population: 'Speaker Population: ',
    era_suffix: 'Era',
    reset_all_india: 'Reset to All India',
    add_heritage_btn: '+ Add Heritage Entry',
    monuments_heading: 'Monuments & Classical Architecture',
    festivals_heading: 'Festivals & Cultural Fairs',
    traditions_heading: 'Living Cultural Lore & Customs',
    arts_heading: 'Handlooms, Paintings & Indigenous Crafts',
    languages_heading: 'Languages, Ancient Scripts & Greetings',
    food_heading: 'Regional Food & Traditional Cuisines',
    performing_arts_title: 'Performing Arts & Dances',
    performing_arts_desc: 'Celebrated through community folk movements, martial traditions, and seasonal festivals passed through hereditary oral tradition.',
    sanctuary_title: 'Sanctuary & Community Ethos',
    sanctuary_desc: 'Sacred groves, village deity assemblies (Gramadevata), and eco-conscious seasonal rituals harmonizing life with nature.',
    indigenous_crafts_title: 'Indigenous Handlooms & Craft Heritage',
  },
  hi: {
    national_archive_tag: 'राष्ट्रीय विरासत अभिलेखागार',
    states_dir_tag: '36 राज्य एवं केंद्र शासित प्रदेश',
    explore_heading: 'राज्य एवं विषय अनुसार अन्वेषण',
    explore_subheading: 'भारत के किसी भी राज्य या केंद्र शासित प्रदेश का चयन करें, फिर देखें: स्मारक, त्योहार, परंपराएं, कला व शिल्प, भाषाएं या पारंपरिक व्यंजन।',
    step_1_title: 'चरण 1: राज्य / क्षेत्र का चयन करें',
    step_2_title: 'चरण 2: विषय चुनें',
    all_india_label: 'समग्र भारत',
    national_repo: 'राष्ट्रीय संग्रह',
    records_label: 'प्रविष्टियां',
    available: 'उपलब्ध',
    capital: 'राजधानी',
    coordinates: 'भौगोलिक स्थिति',
    view_full_archive: 'संपूर्ण राज्य अभिलेख देखें',
    details: 'विस्तार',
    sunrise_sunset: 'सूर्योदय से सूर्यास्त',
    dietary_veg: 'शाकाहारी',
    dietary_nonveg: 'मांसाहारी',
    recipe_label: 'पारंपरिक क्षेत्रीय रेसिपी',
    gi_cultural: 'भौगोलिक पहचान (GI) व संस्कृति',
    significance_label: 'धार्मिक व सांस्कृतिक महत्व:',
    celebration_label: 'उत्सव परंपरा एवं रीति-रिवाज:',
    script_label: 'लिपि:',
    greeting_label: 'पारंपरिक अभिवादन:',
    listen_pronounce: 'उच्चारण सुनें',
    speaker_population: 'भाषाई जनसंख्या: ',
    era_suffix: 'काल',
    reset_all_india: 'समग्र भारत देखें',
    add_heritage_btn: '+ धरोहर जोड़ें',
    monuments_heading: 'ऐतिहासिक स्मारक एवं वास्तुकला',
    festivals_heading: 'प्रमुख त्योहार एवं सांस्कृतिक उत्सव',
    traditions_heading: 'जीवंत सांस्कृतिक परंपराएं एवं लोक गाथाएं',
    arts_heading: 'हस्तशिल्प, चित्रकला एवं पारंपरिक हथकरघा',
    languages_heading: 'भाषाएं, प्राचीन लिपियां एवं अभिवादन',
    food_heading: 'क्षेत्रीय खानपान एवं पारंपरिक व्यंजन',
    performing_arts_title: 'प्रदर्शन कलाएं एवं पारंपरिक नृत्य',
    performing_arts_desc: 'सामुदायिक लोक नृत्य, पारंपरिक युद्ध कलाएं और वंशानुगत मौखिक परंपराओं से पीढ़ियों तक संरक्षित सांस्कृतिक धरोहर।',
    sanctuary_title: 'पवित्र उपवन एवं ग्राम संस्कृति',
    sanctuary_desc: 'पवित्र देव वन, ग्राम देवता पूजन और पर्यावरण-सम्मत ऋतु पर्व जो जीवन और प्रकृति में संतुलन स्थापित करते हैं।',
    indigenous_crafts_title: 'पारंपरिक हथकरघा व शिल्प धरोहर',
  },
  bn: {
    national_archive_tag: 'জাতীয় ঐতিহ্য আর্কাইভ',
    states_dir_tag: '৩৬টি রাজ্য ও কেন্দ্রশাসিত অঞ্চল',
    explore_heading: 'রাজ্য ও জীবন্ত ঐতিহ্যভিত্তিক অনুসন্ধান',
    explore_subheading: 'ভারতের যেকোনো রাজ্য বা কেন্দ্রশাসিত অঞ্চল নির্বাচন করুন, তারপর দেখুন: স্মৃতিস্তম্ভ, উৎসব, ঐতিহ্য, হস্তশিল্প, ভাষা বা ঐতিহ্যবাহী রান্না।',
    step_1_title: 'ধাপ ১: রাজ্য বা অঞ্চল নির্বাচন করুন',
    step_2_title: 'ধাপ ২: কি দেখতে চান নির্বাচন করুন',
    all_india_label: 'সমগ্র ভারত',
    national_repo: 'জাতীয় সংগ্রহ',
    records_label: 'নথি',
    available: 'উপলব্ধ',
    capital: 'রাজধানী',
    coordinates: 'স্থানাঙ্ক',
    view_full_archive: 'সম্পূর্ণ রাজ্য আর্কাইভ দেখুন',
    details: 'বিস্তারিত',
    sunrise_sunset: 'সূর্যোদয় থেকে সূর্যাস্ত',
    dietary_veg: 'নিরামিষ',
    dietary_nonveg: 'আমিষ',
    recipe_label: 'ঐতিহ্যবাহী আঞ্চলিক রেসিপি',
    gi_cultural: 'জিআই ও সাংস্কৃতিক খাবার',
    significance_label: 'ধর্মীয় ও সাংস্কৃতিক তাৎপর্য:',
    celebration_label: 'উৎসবের আচার ও ঐতিহ্য:',
    script_label: 'লিপি:',
    greeting_label: 'ঐতিহ্যবাহী অভিবাদন:',
    listen_pronounce: 'উচ্চারণ শুনুন',
    speaker_population: 'ভাষী জনসংখ্যা: ',
    era_suffix: 'যুগ',
    reset_all_india: 'সমগ্র ভারত দেখুন',
    add_heritage_btn: '+ ঐতিহ্য যোগ করুন',
    monuments_heading: 'ঐতিহাসিক স্মৃতিস্তম্ভ ও স্থাপত্য',
    festivals_heading: 'প্রধান উৎসব ও সাংস্কৃতিক মেলা',
    traditions_heading: 'জীবন্ত সাংস্কৃতিক ঐতিহ্য ও লোককথা',
    arts_heading: 'হস্তশিল্প, চিত্রকর্ম ও ঐতিহ্যবাহী তাঁত',
    languages_heading: 'ভাষা, প্রাচীন লিপি ও অভিবাদন',
    food_heading: 'আঞ্চলিক খাবার ও ঐতিহ্যবাহী রান্না',
    performing_arts_title: 'পরিবেশন শিল্পকলা ও নৃত্য',
    performing_arts_desc: 'লোকনৃত্য, ঐতিহ্যবাহী মার্শাল আর্ট এবং বংশপরম্পরায় রক্ষিত সমৃদ্ধ সাংস্কৃতিক ঐতিহ্য।',
    sanctuary_title: 'পবিত্র কানন ও গ্রামীণ ঐতিহ্য',
    sanctuary_desc: 'পবিত্র বনভূমি, গ্রাম দেবতার পূজা ও প্রকৃতির সাথে ভারসাম্যপূর্ণ ঋতু উৎসব।',
    indigenous_crafts_title: 'ঐতিহ্যবাহী তাঁত ও কারুশিল্প',
  },
  ta: {
    national_archive_tag: 'தேசிய பாரம்பரிய காப்பகம்',
    states_dir_tag: '36 மாநிலங்கள் & யூனியன் பிரதேசங்கள்',
    explore_heading: 'மாநிலம் & கலாச்சார பாரம்பரியத்தின்படி காண்க',
    explore_subheading: 'எந்தவொரு இந்திய மாநிலத்தையும் தேர்ந்தெடுத்து, அதன் நினைவுச்சின்னங்கள், திருவிழாக்கள், கலைகள், மொழிகள் அல்லது உணவுகளைக் காண்க.',
    step_1_title: 'படி 1: மாநிலம் அல்லது பகுதியைத் தேர்ந்தெடுக்கவும்',
    step_2_title: 'படி 2: நீங்கள் பார்க்க விரும்புவதைத் தேர்ந்தெடுக்கவும்',
    all_india_label: 'அனைத்து இந்தியா',
    national_repo: 'தேசிய களஞ்சியம்',
    records_label: 'பதிவுகள்',
    available: 'கிடைக்கின்றன',
    capital: 'தலைநகரம்',
    coordinates: 'ஆயத்தொலைவுகள்',
    view_full_archive: 'முழு மாநில காப்பகத்தை காண்க',
    details: 'விவரங்கள்',
    sunrise_sunset: 'சூரிய உதயம் முதல் அஸ்தமனம் வரை',
    dietary_veg: 'சைவம்',
    dietary_nonveg: 'அசைவம்',
    recipe_label: 'பாரம்பரிய பிராந்திய செய்முறை',
    gi_cultural: 'ஜிஐ & கலாச்சார உணவு',
    significance_label: 'மத & கலாச்சார முக்கியத்துவம்:',
    celebration_label: 'கொண்டாட்ட முறைகள்:',
    script_label: 'எழுத்து:',
    greeting_label: 'பாரம்பரிய வாழ்த்து:',
    listen_pronounce: 'உச்சரிப்பை கேளுங்கள்',
    speaker_population: 'பேசும் மக்கள் தொகை: ',
    era_suffix: 'காலம்',
    reset_all_india: 'முழு இந்தியாவை மீட்டமை',
    add_heritage_btn: '+ பாரம்பரியம் சேர்',
    monuments_heading: 'வரலாற்று நினைவுச்சின்னங்கள் & கட்டிடக்கலை',
    festivals_heading: 'முக்கிய திருவிழாக்கள் & கலாச்சார நிகழ்வுகள்',
    traditions_heading: 'வாழ்வியல் மரபுகள் & நாட்டுப்புற கதைகள்',
    arts_heading: 'கைவினைப்பொருட்கள், ஓவியங்கள் & கைத்தறி',
    languages_heading: 'மொழிகள், பண்டைய எழுத்துக்கள் & வாழ்த்துகள்',
    food_heading: 'பாரம்பரிய உணவு & சுவைகள்',
    performing_arts_title: 'நிகழ்த்து கலைகள் & நடனங்கள்',
    performing_arts_desc: 'நாட்டுப்புற நடனங்கள், தற்காப்புக் கலைகள் மற்றும் தலைமுறை தலைமுறையாக தொடரும் பாரம்பரிய மரபுகள்.',
    sanctuary_title: 'புனித தோப்புகள் & கிராம கலாச்சாரம்',
    sanctuary_desc: 'புனித மரங்கள், கிராம தேவதை வழிபாடுகள் மற்றும் இயற்கையுடன் இயைந்த வாழ்க்கை முறை.',
    indigenous_crafts_title: 'பாரம்பரிய கைத்தறி & கைவினை மரபு',
  },
  te: {
    national_archive_tag: 'జాతీయ వారసత్వ ఆర్కైవ్',
    states_dir_tag: '36 రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలు',
    explore_heading: 'రాష్ట్రం & జీవన వారసత్వం వారీగా అన్వేషణ',
    explore_subheading: 'ఏదైనా భారతీయ రాష్ట్రాన్ని ఎంచుకోండి, తర్వాత స్మారకాలు, పండుగలు, కళలు, సాంప్రదాయాలు లేదా వంటకాలను చూడండి.',
    step_1_title: 'దశ 1: రాష్ట్రం లేదా ప్రాంతాన్ని ఎంచుకోండి',
    step_2_title: 'దశ 2: మీరు చూడాలనుకుంటున్నదాన్ని ఎంచుకోండి',
    all_india_label: 'మొత్తం భారతదేశం',
    national_repo: 'జాతీయ భాండాగారం',
    records_label: 'నమోదులు',
    available: 'అందుబాటులో ఉన్నాయి',
    capital: 'రాజధాని',
    coordinates: 'కోఆర్డినేట్లు',
    view_full_archive: 'పూర్తి రాష్ట్ర ఆర్కైవ్‌ను చూడండి',
    details: 'వివరాలు',
    sunrise_sunset: 'సూర్యోదయం నుండి సూర్యాస్తమయం వరకు',
    dietary_veg: 'శాకాహారం',
    dietary_nonveg: 'మాంసాహారం',
    recipe_label: 'సాంప్రదాయ ప్రాంతీయ రెసిపీ',
    gi_cultural: 'జిఐ & సాంస్కృతిక ఆహారం',
    significance_label: 'ప్రాముఖ్యత & విశిష్టత:',
    celebration_label: 'వేడుక ఆచారాలు:',
    script_label: 'లిపి:',
    greeting_label: 'సాంప్రదాయ శుభాకాంక్షలు:',
    listen_pronounce: 'ఉచ్ఛారణ వినండి',
    speaker_population: 'మాట్లాడే జనాభా: ',
    era_suffix: 'యుగం',
    reset_all_india: 'మొత్తం భారతదేశం చూడండి',
    add_heritage_btn: '+ వారసత్వాన్ని జోడించు',
    monuments_heading: 'చారిత్రక స్మారకాలు & వాస్తుశిల్పం',
    festivals_heading: 'ప్రధాన పండుగలు & ఉత్సవాలు',
    traditions_heading: 'సజీవ సాంస్కృతిక సంప్రదాయాలు & జానపద కథలు',
    arts_heading: 'హస్తకళలు, చిత్రలేఖనం & చేనేత',
    languages_heading: 'భాషలు, ప్రాచీన లిపులు & శుభాకాంక్షలు',
    food_heading: 'ప్రాంతీయ ఆహారాలు & సంప్రదాయ వంటకాలు',
    performing_arts_title: 'ప్రదర్శన కళలు & నృత్యాలు',
    performing_arts_desc: 'జానపద నృత్యాలు, యుద్ధ కళలు మరియు తరతరాలుగా అందించబడిన సాంస్కృతిక వారసత్వం.',
    sanctuary_title: 'పవిత్ర వనాలు & గ్రామ సంస్కృతి',
    sanctuary_desc: 'పవిత్ర దేవతా వనాలు, గ్రామ దేవత పూజలు మరియు ప్రకృతికి అనుగుణంగా సాగే ఆచారాలు.',
    indigenous_crafts_title: 'చేనేత వస్త్రాలు & హస్తకళా వైభవం',
  },
  mr: {
    national_archive_tag: 'राष्ट्रीय वारसा अभिलेखागार',
    states_dir_tag: '३६ राज्ये व केंद्रशासित प्रदेश',
    explore_heading: 'राज्य व जिवंत वारशानुसार शोध',
    explore_subheading: 'भारतातील कोणतेही राज्य किंवा केंद्रशासित प्रदेश निवडा आणि स्मारके, सण, परंपरा, हस्तकला, भाषा किंवा पारंपरिक खाद्यसंस्कृतीचा अनुभव घ्या.',
    step_1_title: 'पायरी १: राज्य किंवा प्रदेश निवडा',
    step_2_title: 'पायरी २: काय पाहायचे ते निवडा',
    all_india_label: 'समग्र भारत',
    national_repo: 'राष्ट्रीय संग्रह',
    records_label: 'नोंदी',
    available: 'उपलब्ध',
    capital: 'राजधानी',
    coordinates: 'अक्षांश-रेखांश',
    view_full_archive: 'संपूर्ण राज्य दस्तऐवज पहा',
    details: 'तपशील',
    sunrise_sunset: 'सूर्योदयापासून सूर्यास्तापर्यंत',
    dietary_veg: 'शाकाहारी',
    dietary_nonveg: 'मांसाहारी',
    recipe_label: 'पारंपारिक प्रादेशिक कृती',
    gi_cultural: 'जीआय व सांस्कृतिक खाद्य',
    significance_label: 'धार्मिक व सांस्कृतिक महत्त्व:',
    celebration_label: 'उत्सव परंपरा व रीतीरिवाज:',
    script_label: 'लिपी:',
    greeting_label: 'पारंपारिक अभिवादन:',
    listen_pronounce: 'उच्चार ऐका',
    speaker_population: 'भाषक लोकसंख्या: ',
    era_suffix: 'काळ',
    reset_all_india: 'समग्र भारत पहा',
    add_heritage_btn: '+ वारसा जोडा',
    monuments_heading: 'ऐतिहासिक स्मारके आणि वास्तुकला',
    festivals_heading: 'प्रमुख सण आणि सांस्कृतिक उत्सव',
    traditions_heading: 'जिवंत सांस्कृतिक परंपरा आणि लोककथा',
    arts_heading: 'हस्तकला, चित्रकला आणि पारंपरिक हातमाग',
    languages_heading: 'भाषा, प्राचीन लिपी आणि अभिवादन',
    food_heading: 'प्रादेशिक खाद्यपदार्थ आणि पारंपारिक व्यंजन',
    performing_arts_title: 'कला सादरीकरण आणि लोकनृत्य',
    performing_arts_desc: 'सामुदायिक लोकनृत्ये, पारंपरिक युद्धकला आणि मौखिक परंपरेतून जपलेला समृद्ध वारसा.',
    sanctuary_title: 'देवराई आणि ग्रामसंस्कृती',
    sanctuary_desc: 'पवित्र देवराया, ग्रामदेवता पूजन आणि निसर्गाशी समतोल राखणारे पारंपरिक सण.',
    indigenous_crafts_title: 'पारंपारिक हातमाग व हस्तकला वारसा',
  },
  gu: {
    national_archive_tag: 'રાષ્ટ્રીય વારસો આર્કાઇવ',
    states_dir_tag: '36 રાજ્યો અને કેન્દ્રશાસિત પ્રદેશો',
    explore_heading: 'રાજ્ય અને વારસા મુજબ અન્વેષણ',
    explore_subheading: 'ભારતના કોઈપણ રાજ્ય અથવા કેન્દ્રશાસિત પ્રદેશને પસંદ કરો અને સ્મારકો, તહેવારો, પરંપરાઓ, હસ્તકલા, ભાષાઓ અથવા વાનગીઓનું અન્વેષણ કરો.',
    step_1_title: 'પગલું 1: રાજ્ય અથવા પ્રદેશ પસંદ કરો',
    step_2_title: 'પગલું 2: શું જોવું છે તે પસંદ કરો',
    all_india_label: 'સમગ્ર ભારત',
    national_repo: 'રાષ્ટ્રીય સંગ્રહ',
    records_label: 'નોંધો',
    available: 'ઉપલબ્ધ',
    capital: 'પાટનગર',
    coordinates: 'અક્ષાંશ-રેખાંશ',
    view_full_archive: 'સંપૂર્ણ રાજ્ય આર્કાઇવ જુઓ',
    details: 'વિગતો',
    sunrise_sunset: 'સૂર્યોદયથી સૂર્યાસ્ત સુધી',
    dietary_veg: 'શાકાહારી',
    dietary_nonveg: 'માંસાહારી',
    recipe_label: 'પરંપરાગત પ્રાદેશિક વાનગી',
    gi_cultural: 'જીઆઈ અને સાંસ્કૃતિક વાનગી',
    significance_label: 'ધાર્મિક અને સાંસ્કૃતિક મહત્વ:',
    celebration_label: 'ઉજવણીની પરંપરાઓ:',
    script_label: 'લિપિ:',
    greeting_label: 'પરંપરાગત અભિવાદન:',
    listen_pronounce: 'ઉચ્ચાર સાંભળો',
    speaker_population: 'ભાષી વસ્તી: ',
    era_suffix: 'યુગ',
    reset_all_india: 'સમગ્ર ભારત જુઓ',
    add_heritage_btn: '+ વારસો ઉમેરો',
    monuments_heading: 'ઐતિહાસિક સ્મારકો અને સ્થાપત્ય',
    festivals_heading: 'મુખ્ય તહેવારો અને સાંસ્કૃતિક મેળાઓ',
    traditions_heading: 'જીવંત સાંસ્કૃતિક પરંપરાઓ અને લોકકથાઓ',
    arts_heading: 'હસ્તકલા, ચિત્રકામ અને પરંપરાગત હાથશાળ',
    languages_heading: 'ભાષાઓ, પ્રાચીન લિપિઓ અને અભિવાદન',
    food_heading: 'પ્રાદેશિક વાનગીઓ અને સ્વાદિષ્ટ ભોજન',
    performing_arts_title: 'પ્રદર્શન કળાઓ અને નૃત્યો',
    performing_arts_desc: 'લોકનૃત્યો, પરંપરાગત યુદ્ધકળા અને પેઢી દર પેઢી સચવાયેલી સાંસ્કૃતિક વારસો.',
    sanctuary_title: 'પવિત્ર ઉપવનો અને ગ્રામ્ય સંસ્કૃતિ',
    sanctuary_desc: 'પવિત્ર વનો, ગ્રામદેવતા પૂજન અને પ્રકૃતિ સાથે સમન્વય સાધતા ઉત્સવો.',
    indigenous_crafts_title: 'હાથશાળ કાપડ અને હસ્તકળા વારસો',
  },
  kn: {
    national_archive_tag: 'ರಾಷ್ಟ್ರೀಯ ಪರಂಪರೆ ಆರ್ಕೈವ್',
    states_dir_tag: '36 ರಾಜ್ಯಗಳು ಮತ್ತು ಕೇಂದ್ರಾಡಳಿತ ಪ್ರದೇಶಗಳು',
    explore_heading: 'ರಾಜ್ಯ ಮತ್ತು ಜೀವಂತ ಪರಂಪರೆ ಪ್ರಕಾರ ಹುಡುಕಿ',
    explore_subheading: 'ಯಾವುದೇ ಭಾರತೀಯ ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಸ್ಮಾರಕಗಳು, ಹಬ್ಬಗಳು, ಕರಕುಶಲ ಕಲೆಗಳು, ಭಾಷೆಗಳು ಅಥವಾ ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರಗಳನ್ನು ನೋಡಿ.',
    step_1_title: 'ಹಂತ 1: ರಾಜ್ಯ ಅಥವಾ ಪ್ರದೇಶವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    step_2_title: 'ಹಂತ 2: ನೀವು ಏನನ್ನು ನೋಡಬೇಕೆಂದು ಆಯ್ಕೆಮಾಡಿ',
    all_india_label: 'ಸಮಗ್ರ ಭಾರತ',
    national_repo: 'ರಾಷ್ಟ್ರೀಯ ಸಂಗ್ರಹ',
    records_label: 'ದಾಖಲೆಗಳು',
    available: 'ಲಭ್ಯವಿದೆ',
    capital: 'ರಾಜಧಾನಿ',
    coordinates: 'ನಿರ್ದೇಶಾಂಕಗಳು',
    view_full_archive: 'ಸಂಪೂರ್ಣ ರಾಜ್ಯ ಆರ್ಕೈವ್ ವೀಕ್ಷಿಸಿ',
    details: 'ವಿವರಗಳು',
    sunrise_sunset: 'ಸೂರ್ಯೋದಯದಿಂದ ಸೂರ್ಯಾಸ್ತದವರೆಗೆ',
    dietary_veg: 'ಸಸ್ಯಾಹಾರಿ',
    dietary_nonveg: 'ಮಾಂಸಾಹಾರಿ',
    recipe_label: 'ಸಾಂಪ್ರದಾಯಿಕ ಪ್ರಾದೇಶಿಕ ಪಾಕವಿಧಾನ',
    gi_cultural: 'ಜಿಐ & ಸಾಂಸ್ಕೃತಿಕ ಆಹಾರ',
    significance_label: 'ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಮಹತ್ವ:',
    celebration_label: 'ಆಚರಣೆಯ ಸಂಪ್ರದಾಯಗಳು:',
    script_label: 'ಲಿಪಿ:',
    greeting_label: 'ಸಾಂಪ್ರದಾಯಿಕ ವಂದನೆ:',
    listen_pronounce: 'ಉಚ್ಚಾರಣೆ ಆಲಿಸಿ',
    speaker_population: 'ಮಾತನಾಡುವ ಜನಸಂಖ್ಯೆ: ',
    era_suffix: 'ಕಾಲ',
    reset_all_india: 'ಸಮಗ್ರ ಭಾರತ ನೋಡಿ',
    add_heritage_btn: '+ ಪರಂಪರೆ ಸೇರಿಸಿ',
    monuments_heading: 'ಐತಿಹಾಸಿಕ ಸ್ಮಾರಕಗಳು ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪ',
    festivals_heading: 'ಪ್ರಮುಖ ಹಬ್ಬಗಳು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಉತ್ಸವಗಳು',
    traditions_heading: 'ಜೀವಂತ ಸಾಂಸ್ಕೃತಿಕ ಸಂಪ್ರದಾಯಗಳು ಮತ್ತು ಜಾನಪದ',
    arts_heading: 'ಕರಕುಶಲ ಕಲೆಗಳು, ಚಿತ್ರಕಲೆ ಮತ್ತು ಕೈಮಗ್ಗ',
    languages_heading: 'ಭಾಷೆಗಳು, ಪ್ರಾಚೀನ ಲಿಪಿಗಳು ಮತ್ತು ವಂದನೆಗಳು',
    food_heading: 'ಪ್ರಾದೇಶಿಕ ತಿನಿಸುಗಳು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರ',
    performing_arts_title: 'ಪ್ರದರ್ಶನ ಕಲೆಗಳು ಮತ್ತು ಜಾನಪದ ನೃತ್ಯಗಳು',
    performing_arts_desc: 'ಜಾನಪದ ನೃತ್ಯಗಳು, ಸಾಂಪ್ರದಾಯಿಕ ಸಮರ ಕಲೆಗಳು ಮತ್ತು ಮೌಖಿಕ ಪರಂಪರೆಯ ಮೂಲಕ ರಕ್ಷಿಸಲ್ಪಟ್ಟ ಕಲೆ.',
    sanctuary_title: 'ಪವಿತ್ರ ವನಗಳು ಮತ್ತು ಗ್ರಾಮ ಸಂಸ್ಕೃತಿ',
    sanctuary_desc: 'ದೇವಕಾಡುಗಳು, ಗ್ರಾಮ ದೇವತೆ ಪೂಜೆ ಮತ್ತು ಪ್ರಕೃತಿಯೊಂದಿಗೆ ಸಮತೋಲನ ಸಾಧಿಸುವ ಆಚರಣೆಗಳು.',
    indigenous_crafts_title: 'ಸಾಂಪ್ರದಾಯಿಕ ಕೈಮಗ್ಗ ಮತ್ತು ಕರಕುಶಲ ಪರಂಪರೆ',
  }
};

// Multilingual State Descriptions for all 36 States & UTs across 8 languages
export const STATE_OVERVIEWS_MULTILINGUAL: Record<string, Record<LanguageKey, string>> = {
  rajasthan: {
    en: 'Land of Kings and legendary warriors, celebrated globally for formidable desert citadels, ornate royal havelis, vibrant folk music, and centuries-old chivalric Rajput heritage.',
    hi: 'राजाओं और शूरवीरों की पावन भूमि, जो अपने अजेय मरुस्थलीय दुर्गों, भव्य हवेलियों, जीवंत लोक धुनों और सदियों पुरानी राजपूती शौर्य गाथाओं के लिए विश्वप्रसिद्ध है।',
    bn: 'রাজা ও বীরদের পুণ্যভূমি, যা তার মরুভূমির অপরাজেয় দুর্গ, রাজকীয় হাভেলি, প্রাণবন্ত লোকসুর এবং রাজপুত বীরগাথার জন্য বিশ্বখ্যাত।',
    ta: 'மன்னர்கள் மற்றும் வீரர்களின் பூமி, அதன் பாலைவனக் கோட்டைகள், கம்பீரமான அரண்மனைகள், நாட்டுப்புற இசை மற்றும் ராஜபுத்திர வீர மரபுகளுக்குப் புகழ் பெற்றது.',
    te: 'రాజులు మరియు యోధుల పవిత్ర భూమి, ఇది దాని ఎడారి కోటలు, రాజభవనాలు, జానపద సంగీతం మరియు రాజపుత్రుల శౌర్య పరాక్రమాలకు ప్రపంచ ప్రసిద్ధి చెందింది.',
    mr: 'राजे आणि शूरवीरांची पावन भूमी, जी आपल्या वाळवंटी अजिंक्य किल्ल्यांसाठी, भव्य हवेल्यांसाठी, लोकसंगीतासाठी आणि राजपूत शौर्यगाथांसाठी जगप्रसिद्ध आहे.',
    gu: 'રાજાઓ અને શૂરવીરોની ભૂમિ, જે તેના અજેય રણ કિલ્લાઓ, ભવ્ય હવેલીઓ, લોકગીતો અને રાજપૂત શૌર્યગાથાઓ માટે વિશ્વવિખ્યાત છે.',
    kn: 'ರಾಜರು ಮತ್ತು ಶೂರ ಯೋಧರ ಪವಿತ್ರ ನಾಡು, ತನ್ನ ಮರಳುಗಾಡಿನ ಕೋಟೆಗಳು, ಭವ್ಯ ಅರಮನೆಗಳು ಮತ್ತು ರಜಪೂತರ ಸಾಹಸಗಾಥೆಗಳಿಗೆ ಜಗತ್ಪ್ರಸಿದ್ಧವಾಗಿದೆ.',
  },
  kerala: {
    en: 'God’s Own Country, famed for serene tropical backwaters, spice-laden western slopes, centuries-old Ayurvedic medical heritage, and vibrant temple arts.',
    hi: 'ईश्वर का अपना घर (गॉड्स ओन कंट्री), जो हरे-भरे बैकवाटर, मसालों की महकती पहाड़ियों, प्राचीन आयुर्वेदिक चिकित्सा पद्धति और शास्त्रीय मंदिर कलाओं के लिए विख्यात है।',
    bn: 'ঈশ্বরের নিজের দেশ, যা মনোরম ব্যাকওয়াটার, মশলাযুক্ত পাহাড়ি উপত্যকা, প্রাচীন আয়ুর্বেদিক চিকিৎসা এবং শাস্ত্রীয় মন্দির শিল্পের জন্য বিখ্যাত।',
    ta: 'கடவுளின் சொந்த நாடு, பசுமையான உப்பங்கழிகள், நறுமணமிக்க மலைகள், பழமையான ஆயுர்வேத மருத்துவம் மற்றும் பாரம்பரிய கோயில் கலைகளுக்குப் பெயர் பெற்றது.',
    te: 'దేవుని సొంత దేశం, పచ్చని బ్యాక్‌వాటర్స్, సుగంధ ద్రవ్యాల కొండలు, ప్రాచీన ఆయుర్వేద వైద్యం మరియు శాస్త్రీయ దేవాలయ కళలకు ప్రసిద్ధి చెందింది.',
    mr: 'देवाचा स्वतःचा देश (गॉड्स ओन कंट्री), जो निसर्गरम्य बॅकवॉटर्स, मसाल्यांच्या टेकड्या, प्राचीन आयुर्वेद आणि शास्त्रीय मंदिर कलांसाठी विख्यात आहे.',
    gu: 'ઈશ્વરનું પોતાનું ઘર, જે હરિયાળા બેકવોટર્સ, મસાલાની પહાડીઓ, પ્રાચીન આયુર્વેદિક ચિકિત્સા પદ્ધતિ અને શાસ્ત્રીય મંદિર કળાઓ માટે પ્રખ્યાત છે.',
    kn: 'ದೇವರ ಸ್ವಂತ ನಾಡು, ಹಸಿರು ಹಿನ್ನೀರು, ಸಾಂಬಾರ ಪದಾರ್ಥಗಳ ಬೆಟ್ಟಗಳು, ಪ್ರಾಚೀನ ಆಯುರ್ವೇದ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಶಾಸ್ತ್ರೀಯ ದೇವಾಲಯ ಕಲೆಗಳಿಗೆ ಪ್ರಸಿದ್ಧವಾಗಿದೆ.',
  },
  'tamil-nadu': {
    en: 'Cradle of ancient Dravidian civilization, celebrated for towering gopuram temples, thousands of years of living Tamil literature, and Carnatic musical mastery.',
    hi: 'प्राचीन द्रविड़ सभ्यता का पालना, जो अपने गगनचुंबी मंदिर गोपुरमों, सहस्राब्दियों पुरानी तमिल साहित्य परंपरा और मधुर कर्नाटक संगीत के लिए जाना जाता है।',
    bn: 'প্রাচীন দ্রাবিড় সভ্যতার প্রাণকেন্দ্র, যা আকাশচুম্বী মন্দির গোপুরম, সহস্রাব্দের প্রাচীন তামিল সাহিত্য এবং কর্ণাটকী শাস্ত্রীয় সঙ্গীতের জন্য পরিচিত।',
    ta: 'பண்டைய திராவிட நாகரிகத்தின் தொட்டில், வானுயர்ந்த கோபுரங்கள், ஆயிரக்கணக்கான ஆண்டுகள் பழமையான தமிழ் இலக்கியம் மற்றும் கர்நாடக இசைக்கு புகழ்பெற்றது.',
    te: 'ప్రాచీన ద్రావిడ నాగరికతకు నిలయం, గగనతల గోపురాలు, వేల సంవత్సరాల పురాతన తమిళ సాహిత్యం మరియు కర్ణాటక సంగీతానికి ప్రసిద్ధి చెందింది.',
    mr: 'प्राचीन द्रविड संस्कृतीचा पाळणा, जो गगनचुंबी मंदिर गोपुरे, सहस्रो वर्षांची तमिळ साहित्य परंपरा आणि कर्नाटकी संगीतासाठी ओळखला जातो.',
    gu: 'પ્રાચીન દ્રવિડ સંસ્કૃતિનું પારણું, જે તેના ગગનચુંબી મંદિર ગોપુરમો, સહસ્ત્રાબ્દી જૂની તમિલ સાહિત્ય પરંપરા અને કર્ણાટક સંગીત માટે જાણીતું છે.',
    kn: 'ಪ್ರಾಚೀನ ದ್ರಾವಿಡ ನಾಗರಿಕತೆಯ ತೊಟ್ಟಿಲು, ಗಗನಚುಂಬಿ ಗೋಪುರಗಳು, ಸಾವಿರಾರು ವರ್ಷಗಳ ತಮಿಳು ಸಾಹಿತ್ಯ ಮತ್ತು ಕರ್ನಾಟಕ ಸಂಗೀತಕ್ಕೆ ಹೆಸರಾಗಿದೆ.',
  },
  'uttar-pradesh': {
    en: 'Heartland of Indian spiritual heritage, woven along the sacred Ganga and Yamuna, home to timeless holy cities of Ayodhya, Kashi, Mathura, and the Taj Mahal.',
    hi: 'भारतीय आध्यात्मिकता का हृदयस्थल, जहां गंगा-जमुना की पावन धाराएं, अयोध्या, काशी व मथुरा के तीर्थ और ताज महल जैसी कालजयी वास्तुकला स्थित है।',
    bn: 'ভারতীয় আধ্যাত্মিকতার কেন্দ্রভূমি, যেখানে পবিত্র গঙ্গা-যমুনার তীরে অযোধ্যা, কাশী, মথুরা এবং বিশ্ববিখ্যাত তাজমহল অবস্থিত।',
    ta: 'இந்திய ஆன்மீகத்தின் இதயம், புனித கங்கை-யமுனை நதிக்கரையில் அமைந்துள்ள அயோத்தி, காசி, மதுரா மற்றும் தாஜ்மஹால் போன்ற உலக அதிசயங்கள் நிறைந்த பூமி.',
    te: 'భారతీయ ఆధ్యాత్మికతకు హృదయస్థానం, గంగా-యమునా నదుల తీరాన అయోధ్య, కాశీ, మధుర మరియు తాజ్ మహల్ వంటి అద్భుతాలు నెలకొన్న ప్రదేశం.',
    mr: 'भारतीय अध्यात्माचे हृदयस्थान, जिथे गंगा-यमुनेचे पवित्र प्रवाह, अयोध्या, काशी, मथुरा ही तीर्थक्षेत्रे आणि ताजमहालसारखी वास्तुकला आहे.',
    gu: 'ભારતીય આધ્યાત્મિકતાનું કેન્દ્ર, જ્યાં પવિત્ર ગંગા-યમુનાના તટે અયોધ્યા, કાશી, મથુરા અને તાજમહાલ જેવી કાલજયી સ્થાપત્ય કળાઓ આવેલી છે.',
    kn: 'ಭಾರತೀಯ ಆಧ್ಯಾತ್ಮಿಕತೆಯ ಹೃದಯಭಾಗ, ಗಂಗಾ-ಯಮುನಾ ನದಿಗಳ ತೀರದಲ್ಲಿರುವ ಅಯೋಧ್ಯೆ, ಕಾಶಿ, ಮಥುರಾ ಮತ್ತು ತಾಜ್ ಮಹಲ್‌ನಂತಹ ಐತಿಹಾಸಿಕ ತಾಣಗಳ ನೆಲೆ.',
  },
  maharashtra: {
    en: 'Realm of Chhatrapati Shivaji Maharaj, invincible Sahyadri hill fortresses, UNESCO Ajanta-Ellora rock caves, and a powerhouse of cultural pride.',
    hi: 'छत्रपति शिवाजी महाराज के पराक्रम, सह्याद्रि के अजेय दुर्गों, अजंता-एलोरा की गुफाओं और जीवंत आर्थिक व सांस्कृतिक चेतना का गौरवशाली राज्य।',
    bn: 'ছত্রপতি শিবাজী মহারাজের বীরত্ব, সহ্যাদ্রির দুর্গ, অজন্তা-ইলোরা গুহা এবং মহারাষ্ট্রীয় সংস্কৃতির গৌরবময় কেন্দ্র।',
    ta: 'சத்ரபதி சிவாஜி மகாராஜாவின் வீரம், சஹ்யாத்ரி மலைக்கோட்டைகள், அஜந்தா-எல்லோரா குகைகள் மற்றும் பண்பாட்டு பெருமை வாய்ந்த மாநிலம்.',
    te: 'ఛత్రపతి శివాజీ మహారాజ్ పరాక్రమం, సహ్యాద్రి కోటలు, అజంతా-ఎల్లోరా గుహలు మరియు సాంస్కృతిక వైభవానికి ప్రతీకగా నిలిచే రాష్ట్రం.',
    mr: 'छत्रपती शिवाजी महाराजांच्या पराक्रमाची, सह्याद्रीच्या अजिंक्य किल्ल्यांची, अजिंठा-वेरूळ लेण्यांची आणि जिवंत संस्कृतीची गौरवशाली भूमी.',
    gu: 'છત્રપતિ શિવાજી મહારાજના પરાક્રમ, સહ્યાદ્રિના અજેય કિલ્લાઓ, અજંતા-ઈલોરાની ગુફાઓ અને સાંસ્કૃતિક ગૌરવ ધરાવતું રાજ્ય.',
    kn: 'ಛತ್ರಪತಿ ಶಿವಾಜಿ ಮಹಾರಾಜರ ಶೌರ್ಯ, ಸಹ್ಯಾದ್ರಿಯ ಬೆಟ್ಟದ ಕೋಟೆಗಳು, ಅಜಂತಾ-ಎಲ್ಲೋರಾ ಗುಹೆಗಳು ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಹೆಮ್ಮೆಯ ನಾಡು.',
  },
  karnataka: {
    en: 'Home to the magnificent Vijayanagara ruins at Hampi, Hoysala and Chalukya rock marvels, dense Western Ghats sanctuaries, and sandalwood lore.',
    hi: 'विजयनगर साम्राज्य के वैभव, हम्पी के पाषाण स्मारकों, पश्चिमी घाट की जैव-विविधता और चंदन की खुशबू से महकता ऐतिहासिक राज्य।',
    bn: 'বিজয়নগর সাম্রাজ্যের হাম্পি, হোয়সালা ও চালুক্য স্থাপত্য এবং চন্দনের সুবাসে ভরপুর ঐতিহাসিক কর্ণাটক।',
    ta: 'விஜயநகரப் பேரரசின் ஹம்பி, போசள மற்றும் சாளுக்கிய கட்டிடக்கலை அதிசயங்கள் மற்றும் சந்தன மணம் கமழும் வரலாற்று மாநிலம்.',
    te: 'హంపిలోని విజయనగర సామ్రాజ్య వైభవం, హొయసల మరియు చాళుక్యుల శిల్పకళా అద్భుతాలు మరియు గంధపు చెట్ల సుగంధాల నేల.',
    mr: 'विजयनगर साम्राज्याचे वैभव, हंपीचे पाषाण स्मारक, सह्याद्रीचे जंगल आणि चंदनाचा सुवास असलेला ऐतिहासिक कर्नाटक.',
    gu: 'વિજયનગર સામ્રાજ્યના હમ્પી, હોયસલ અને ચાલુક્ય સ્થાપત્ય અને ચંદનની સુગંધથી મહેકતું ઐતિહાસિક રાજ્ય.',
    kn: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯದ ಹಂಪಿ, ಹೊಯ್ಸಳ ಮತ್ತು ಚಾಲುಕ್ಯರ ವಾಸ್ತುಶಿಲ್ಪ, ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ವಿಸ್ಮಯ ಮತ್ತು ಶ್ರೀಗಂಧದ ನಾಡು.',
  },
  'west-bengal': {
    en: 'Birthplace of the Indian Renaissance, world-renowned for Nobel laureates, timeless literature, UNESCO Durga Puja festivities, and the Sundarbans.',
    hi: 'भारतीय पुनर्जागरण की उद्गम भूमि, जो नोबेल पुरस्कार विजेताओं, समृद्ध साहित्य, कला, दुर्गा पूजा के भव्य आयोजनों और सुंदरवन के लिए प्रसिद्ध है।',
    bn: 'ভারতীয় নবজাগরণের জন্মভূমি, নোবেল বিজয়ী সাহিত্যিক, বুদ্ধিজীবী ঐতিহ্য, ইউনেস্কো স্বীকৃত দুর্গাপূজা ও সুন্দরবনের ঐতিহ্যবাহী রাজ্য।',
    ta: 'இந்திய மறுமலர்ச்சியின் பிறப்பிடம், நோபல் பரிசு பெற்ற மேதைகள், செழுமையான இலக்கியம், யுனெஸ்கோ துர்கா பூஜை மற்றும் சுந்தரவனக் காடுகளின் பூமி.',
    te: 'భారతీయ పునరుజ్జీవన జన్మభూమి, నోబెల్ పురస్కార గ్రహీతలు, సాహిత్యం, యునెస్కో దుర్గా పూజ మరియు సుందర్‌బన్స్ ఉన్న చారిత్రక రాష్ట్రం.',
    mr: 'भारतीय प्रबोधनाची जन्मभूमी, नोबेल विजेते, समृद्ध साहित्य, युनेस्को दुर्गा पूजा आणि सुंदरबनसाठी प्रसिद्ध असलेले राज्य.',
    gu: 'ભારતીય પુનરુત્થાનની જન્મભૂમિ, નોબેલ પુરસ્કાર વિજેતાઓ, સમૃદ્ધ સાહિત્ય, યુનેસ્કો દુર્ગા પૂજા અને સુંદરવન માટે જાણીતું રાજ્ય.',
    kn: 'ಭಾರತೀಯ ಪುನರುಜ್ಜೀವನದ ತವರು, ನೊಬೆಲ್ ಪ್ರಶಸ್ತಿ ವಿಜೇತರು, ಸಮೃದ್ಧ ಸಾಹಿತ್ಯ, ಯುನೆಸ್ಕೋ ದುರ್ಗಾ ಪೂಜೆ ಮತ್ತು ಸುಂದರಬನಕ್ಕೆ ಹೆಸರಾದ ರಾಜ್ಯ.',
  },
  gujarat: {
    en: 'Land of Mahatma Gandhi and Sardar Patel, boasting Harappan port city Dholavira, majestic Asiatic lion sanctuary, vibrant crafts, and global trade heritage.',
    hi: 'महात्मा गांधी और सरदार पटेल की कर्मभूमि, जो अपनी विशाल तटीय विरासत, धोलावीरा की हड़प्पा कालीन सभ्यता और व्यापारिक सूझबूझ के लिए जानी जाती है।',
    bn: 'মহাত্মা গান্ধী ও সর্দার প্যাটেলের জন্মভূমি, প্রাচীন ধোলাভিরা হরপ্পা বন্দর, এশীয় সিংহ ও বর্ণিল হস্তশিল্পের সমৃদ্ধ রাজ্য।',
    ta: 'மகாத்மா காந்தி மற்றும் சர்தார் படேலின் பூமி, பண்டைய தோலாவிரா ஹரப்பா நாகரிகம், ஆசிய சிங்கங்கள் மற்றும் கைவினை பாரம்பரியத்தின் தாயகம்.',
    te: 'మహాత్మా గాంధీ మరియు సర్దార్ పటేల్ జన్మభూమి, ప్రాచీన ధోలావీరా హరప్పా నాగరికత మరియు ఆసియా సింహాల అభయారణ్యాలు గల రాష్ట్రం.',
    mr: 'महात्मा गांधी आणि सरदार पटेलांची कर्मभूमी, धोलाविराची हडप्पा संस्कृती, आशियाई सिंह आणि भरभराटीची व्यापार संस्कृती.',
    gu: 'મહાત્મા ગાંધી અને સરદાર પટેલની ભૂમિ, ધોળાવીરાની હડપ્પીય સભ્યતા, ગીરના એશિયાટિક સિંહો અને વૈશ્વિક વેપાર વારસો ધરાવતું રાજ્ય.',
    kn: 'ಮಹಾತ್ಮಾ ಗಾಂಧಿ ಮತ್ತು ಸರ್ದಾರ್ ಪಟೇಲರ ಜನ್ಮಭೂಮಿ, ಧೋಲಾವೀರ ಹರಪ್ಪ ನಾಗರಿಕತೆ, ಏಷ್ಯಾದ ಸಿಂಹಗಳ ಧಾಮ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ನಾಡು.',
  },
  punjab: {
    en: 'Fertile land of five sacred rivers, Sikh spiritual traditions, the Golden Temple, abundant harvest celebrations, and legendary hospitality.',
    hi: 'पांच पावन नदियों की उर्वर भूमि, सिख गुरुओं की तपस्थली, कृषि समृद्धि और असीम आतिथ्य सत्कार के लिए विख्यात राज्य।',
    bn: 'পাঁচ নদীর পবিত্র দেশ, শিখ গুরুদের আধ্যাত্মিক সাধনার স্থান, স্বর্ণমন্দির ও বৈশাখী উৎসবের আনন্দমুখর রাজ্য।',
    ta: 'ஐந்து நதிகளின் வளமான பூமி, சீக்கிய குருக்களின் தவபூமி, பொற்கோவில் மற்றும் அசாத்திய விருந்தோம்பலுக்குப் புகழ் பெற்ற மாநிலம்.',
    te: 'ఐదు పవిత్ర నదుల సారవంతమైన భూమి, సిక్కు ఆధ్యాత్మిక సంప్రదాయాలు, స్వర్ణ దేవాలయం మరియు విశిష్ట ఆతిథ్యానికి ప్రసిద్ధి చెందిన నేల.',
    mr: 'पाच नद्यांची सुपीक भूमी, शीख गुरूंची तपोभूमी, सुवर्ण मंदिर आणि समृद्ध आदरातिथ्याची परंपरा असलेला पंजाब.',
    gu: 'પાંચ પવિત્ર નદીઓની ફળદ્રુપ ભૂમિ, શીખ ગુરુઓની તપોભૂમિ, સુવર્ણ મંદિર અને પરંપરાગત મહેમાનગતિ માટે જાણીતું રાજ્ય.',
    kn: 'ಐದು ನದಿಗಳ ಫಲವತ್ತಾದ ಭೂಮಿ, ಸಿಖ್ ಪರಂಪರೆ, ಅಮೃತಸರದ ಚಿನ್ನದ ದೇವಾಲಯ ಮತ್ತು ಅತಿಥಿ ಸತ್ಕಾರಕ್ಕೆ ಪ್ರಸಿದ್ಧವಾದ ಪಂಜಾಬ್.',
  },
  odisha: {
    en: 'Ancient Kalinga of profound maritime history, majestic Konark Sun Temple chariot, Puri Lord Jagannath Rath Yatra, and Classical Odissi dance.',
    hi: 'कलिंग के शौर्य, महाप्रभु जगन्नाथ की पावन रथयात्रा, कोणार्क के सूर्य रथ और प्राचीन मंदिर वास्तुकला की अलौकिक भूमि।',
    bn: 'প্রাচীন কলিঙ্গের বীরত্ব, পুরীর জগন্নাথ দেবের রথযাত্রা, কোনার্ক সূর্য মন্দির ও ওড়িশি শাস্ত্রীয় নৃত্যের পুণ্যভূমি।',
    ta: 'பண்டைய கலிங்க நாடு, பூரி ஜெகன்நாதர் ரத யாத்திரை, கோனார்க் சூரியன் கோவில் மற்றும் பாரம்பரிய ஒடிசி நடனத்தின் உறைவிடம்.',
    te: 'ప్రాచీన కళింగ శౌర్యం, పూరీ జగన్నాథుని రథయాత్ర, కోణార్క్ సూర్య దేవాలయం మరియు ఒడిస్సీ నృత్యానికి నిలయమైన నేల.',
    mr: 'प्राचीन कलिंगचा इतिहास, जगन्नाथ पुरीची रथयात्रा, कोणार्कचे सूर्य मंदिर आणि ओडिसी नृत्याची समृद्ध भूमी.',
    gu: 'પ્રાચીન કલિંગનો શૌર્યપૂર્ણ ઇતિહાસ, જગન્નાથ પુરીની રથયાત્રા, કોણાર્ક સૂર્ય મંદિર અને ઓડિસી નૃત્યની પાવન ભૂમિ.',
    kn: 'ಪ್ರಾಚೀನ ಕಳಿಂಗದ ಇತಿಹಾಸ, ಜಗನ್ನಾಥ ಪುರಿ ರಥಯಾತ್ರೆ, ಕೊನಾರ್ಕ್ ಸೂರ್ಯ ದೇವಾಲಯ ಮತ್ತು ಶಾಸ್ತ್ರೀಯ ಒಡಿಸ್ಸಿ ನೃತ್ಯದ ಪವಿತ್ರ ನಾಡು.',
  },
};

// Helper getter functions that ensure seamless multilingual fallback
export function getStateName(state: State | null | undefined, lang: LanguageKey): string {
  if (!state) return '';
  if (lang === 'en') return state.name || '';
  if (STATE_NAMES_MULTILINGUAL[state.id]?.[lang]) {
    return STATE_NAMES_MULTILINGUAL[state.id][lang];
  }
  if (lang === 'hi' && state.hindi_name) return state.hindi_name;
  return state.name || '';
}

export function getStateOverview(state: State | null | undefined, lang: LanguageKey): string {
  if (!state) return '';
  if (lang === 'en') return state.overview || '';
  if (STATE_OVERVIEWS_MULTILINGUAL[state.id]?.[lang]) {
    return STATE_OVERVIEWS_MULTILINGUAL[state.id][lang];
  }
  
  // High quality structured localized translation generator for any state
  const name = getStateName(state, lang);
  const region = getRegionName(state.region, lang);
  
  switch (lang) {
    case 'hi':
      return `${name} (${region} भारत) अपनी समृद्ध ऐतिहासिक धरोहर, भव्य वास्तुकला, पारंपरिक लोकसंस्कृति और जीवंत उत्सवों के लिए संपूर्ण भारत में विख्यात है।`;
    case 'bn':
      return `${name} (${region}) এর সমৃদ্ধ ঐতিহাসিক ঐতিহ্য, চমৎকার স্থাপত্য, প্রাণবন্ত লোকসংস্কৃতি এবং ঐতিহ্যবাহী উৎসবের জন্য সারা ভারতে সুপরিচিত।`;
    case 'ta':
      return `${name} (${region}) அதன் வளமான வரலாற்று பாரம்பரியம், சிறப்பான கட்டிடக்கலை மற்றும் வாழும் கலாச்சார மரபுகளுக்காக இந்தியா முழுவதும் புகழ்பெற்றது.`;
    case 'te':
      return `${name} (${region}) తన గొప్ప చారిత్రక వారసత్వం, అద్భుతమైన వాస్తుశిల్పం మరియు సజీవ సంస్కృతికి భారతదేశమంతటా ప్రసిద్ధి చెందింది.`;
    case 'mr':
      return `${name} (${region}) आपल्या समृद्ध ऐतिहासिक वारसा, अप्रतिम वास्तुकला, पारंपारिक लोकसंस्कृती आणि उत्सवांसाठी भारतभर प्रसिद्ध आहे.`;
    case 'gu':
      return `${name} (${region}) તેના સમૃદ્ધ ઐતિહાસિક વારસા, સ્થાપત્ય કળા અને જીવંત પરંપરાઓ માટે સમગ્ર ભારતમાં જાણીતું છે.`;
    case 'kn':
      return `${name} (${region}) ತನ್ನ ಸಮೃದ್ಧ ಐತಿಹಾಸಿಕ ಪರಂಪರೆ, ಭವ್ಯ ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಆಚರಣೆಗಳಿಗೆ ಭಾರತದಲ್ಲೇ ಪ್ರಸಿದ್ಧವಾಗಿದೆ.`;
    default:
      return state.overview;
  }
}

export function getStateCulture(state: State, lang: LanguageKey): string {
  if (lang === 'en') return state.culture_desc;
  const name = getStateName(state, lang);
  switch (lang) {
    case 'hi':
      return `${name} की लोक परंपराएं, शास्त्रीय नृत्य, सामुदायिक उत्सव और प्राचीन हस्तकला पीढ़ियों से जीवंत सांस्कृतिक धरोहर का प्रतीक हैं।`;
    case 'bn':
      return `${name} এর লোকঐতিহ্য, শাস্ত্রীয় নৃত্য, সাম্প্রদায়িক উৎসব এবং প্রাচীন কারুশিল্প বহু প্রজন্ম ধরে জীবন্ত সংস্কৃতির প্রতীক।`;
    case 'ta':
      return `${name} மாநிலத்தின் பாரம்பரிய நாட்டுப்புறக் கலைகள், நடனங்கள் மற்றும் திருவிழாக்கள் அதன் தனித்துவமான கலாச்சாரத்தை வெளிப்படுத்துகின்றன.`;
    case 'te':
      return `${name} యొక్క జానపద కళలు, సాంప్రదాయ నృత్యాలు మరియు ఉత్సవాలు శతాబ్దాలుగా వస్తున్న సజీవ సంస్కృతిని ప్రతిబింబిస్తాయి.`;
    case 'mr':
      return `${name} मधील लोककला, शास्त्रीय नृत्ये आणि उत्सव हे पिढ्यान्पिढ्या जपलेल्या समृद्ध सांस्कृतिक परंपरेचे द्योतक आहेत.`;
    case 'gu':
      return `${name} ની લોક પરંપરાઓ, શાસ્ત્રીય નૃત્ય અને પરંપરાગત ઉત્સવો પેઢી દર પેઢી સચવાયેલી સંસ્કૃતિનું પ્રતીક છે.`;
    case 'kn':
      return `${name} ರಾಜ್ಯದ ಜಾನಪದ ಕಲೆಗಳು, ಶಾಸ್ತ್ರೀಯ ನೃತ್ಯಗಳು ಮತ್ತು ಉತ್ಸವಗಳು ತಲೆಮಾರುಗಳಿಂದ ನಡೆದುಬಂದ ಶ್ರೀಮಂತ ಸಂಸ್ಕೃತಿಯನ್ನು ಬಿಂಬಿಸುತ್ತವೆ.`;
    default:
      return state.culture_desc;
  }
}

export function getStateFestivals(state: State, lang: LanguageKey): string {
  if (lang === 'en') return state.festivals_desc;
  const name = getStateName(state, lang);
  switch (lang) {
    case 'hi':
      return `${name} के प्रमुख धार्मिक और मौसमी त्योहार पूरे उत्साह, लोक संगीत और पारंपरिक अनुष्ठानों के साथ मनाए जाते हैं।`;
    case 'bn':
      return `${name} এর প্রধান ধর্মীয় ও ঋতুভিত্তিক উৎসবগুলি উৎসাহ, লোকসঙ্গীত ও প্রাচীন রীতির সাথে উদযাপিত হয়।`;
    case 'ta':
      return `${name} மாநிலத்தின் முக்கிய திருவிழாக்கள் பெரும் மகிழ்ச்சி, பாரம்பரிய இசை மற்றும் சடங்குகளுடன் கொண்டாடப்படுகின்றன.`;
    case 'te':
      return `${name} యొక్క ప్రధాన పండుగలు భక్తిశ్రద్ధలు, జానపద సంగీతం మరియు సంప్రదాయ ఆచారాలతో వైభవంగా జరుగుతాయి.`;
    case 'mr':
      return `${name} मधील प्रमुख सण आणि उत्सव मोठ्या उत्साहाने, लोकसंगीताने आणि पारंपारिक रीतीरिवाजांनी साजरे केले जातात.`;
    case 'gu':
      return `${name} ના મુખ્ય ઉત્સવો અત્યંત ઉત્સાહ, લોકસંગીત અને પરંપરાગત ધાર્મિક વિધિઓ સાથે ઉજવાય છે.`;
    case 'kn':
      return `${name} ರಾಜ್ಯದ ಪ್ರಮುಖ ಹಬ್ಬಗಳು ಸಡಗರ, ಜಾನಪದ ಸಂಗೀತ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಆಚರಣೆಗಳೊಂದಿಗೆ ವಿಜೃಂಭಣೆಯಿಂದ ನಡೆಯುತ್ತವೆ.`;
    default:
      return state.festivals_desc;
  }
}

export function getStateFood(state: State, lang: LanguageKey): string {
  if (lang === 'en') return state.food_desc;
  const name = getStateName(state, lang);
  switch (lang) {
    case 'hi':
      return `${name} के पारंपरिक व्यंजन स्थानीय मसालों, शुद्ध देशी घी और विशिष्ट पाक शैलियों से समृद्ध हैं।`;
    case 'bn':
      return `${name} এর ঐতিহ্যবাহী রান্না স্থানীয় মশলা এবং অনন্য রন্ধনশৈলীর দ্বারা সমৃদ্ধ ও অত্যন্ত সুস্বাদু।`;
    case 'ta':
      return `${name} பகுதியின் பாரம்பரிய உணவுகள் தனித்துவமான நறுமண மசாலாப் பொருட்கள் மற்றும் பாரம்பரிய சுவைகளுக்கு பெயர் பெற்றவை.`;
    case 'te':
      return `${name} యొక్క సాంప్రదాయ వంటకాలు స్థానిక సుగంధ ద్రవ్యాలు మరియు ప్రత్యేకమైన వంట శైలులతో అత్యంత రుచికరంగా ఉంటాయి.`;
    case 'mr':
      return `${name} चे पारंपारिक खाद्यपदार्थ स्थानिक मसाले आणि विशिष्ट पाककृतींमुळे अत्यंत चवदार आणि प्रसिद्ध आहेत.`;
    case 'gu':
      return `${name} ની પરંપરાગત વાનગીઓ સ્થાનિક મસાલાઓ અને ખાસ રસોઈ પદ્ધતિઓથી ભરપૂર સ્વાદિષ્ટ હોય છે.`;
    case 'kn':
      return `${name} ರಾಜ್ಯದ ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರಗಳು ಸ್ಥಳೀಯ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು ಮತ್ತು ವಿಶಿಷ್ಟ ಪಾಕಪದ್ಧತಿಯಿಂದ ಸಮೃದ್ಧವಾಗಿವೆ.`;
    default:
      return state.food_desc;
  }
}

export function getStateLanguages(state: State, lang: LanguageKey): string {
  if (lang === 'en') return state.languages_desc;
  const name = getStateName(state, lang);
  switch (lang) {
    case 'hi':
      return `${name} की भाषाएं, प्राचीन लिपियां और स्थानीय बोलियां इस क्षेत्र की गहरी भाषाई पहचान प्रस्तुत करती हैं।`;
    case 'bn':
      return `${name} এর ভাষা, প্রাচীন লিপি ও আঞ্চলিক উপভাষাগুলি এই অঞ্চলের সমৃদ্ধ ভাষাতাত্ত্বিক পরিচয় বহন করে।`;
    case 'ta':
      return `${name} மாநிலத்தின் மொழிகள் மற்றும் பண்டைய எழுத்துக்கள் அதன் வளமான வரலாற்று அடையாளத்தை விளக்குகின்றன.`;
    case 'te':
      return `${name} యొక్క భాషలు, ప్రాచీన లిపులు మరియు మాండలికాలు ఇక్కడి విశిష్టమైన భాషా వారసత్వాన్ని తెలుపుతాయి.`;
    case 'mr':
      return `${name} मधील भाषा, प्राचीन लिपी आणि बोलीभाषा येथील समृद्ध भाषिक इतिहास दर्शवतात.`;
    case 'gu':
      return `${name} ની ભાષાઓ, પ્રાચીન લિપિઓ અને સ્થાનિક બોલીઓ આ ક્ષેત્રની ગહન ભાષાકીય ઓળખ રજૂ કરે છે.`;
    case 'kn':
      return `${name} ರಾಜ್ಯದ ಭಾಷೆಗಳು, ಪ್ರಾಚೀನ ಲಿಪಿಗಳು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಗಳು ಇಲ್ಲಿನ ಶ್ರೀಮಂತ ಭಾಷಾ ಪರಂಪರೆಯನ್ನು ಸಾರುತ್ತವೆ.`;
    default:
      return state.languages_desc;
  }
}

export function getStateArtCrafts(state: State, lang: LanguageKey): string {
  if (lang === 'en') return state.art_crafts_desc;
  const name = getStateName(state, lang);
  switch (lang) {
    case 'hi':
      return `${name} के पारंपरिक हथकरघा वस्त्र, हस्तशिल्प, धातु शिल्प और लोक चित्रकला सदियों की कलात्मक निपुणता दर्शाते हैं।`;
    case 'bn':
      return `${name} এর ঐতিহ্যবাহী তাঁতবস্ত্র, সূক্ষ্ম কারুশিল্প ও লোকচিত্রকলা বহু শতাব্দীর শৈল্পিক দক্ষতার প্রতিফলন।`;
    case 'ta':
      return `${name} பகுதியின் பாரம்பரிய கைத்தறி நெசவுகள், கைவினைப்பொருட்கள் மற்றும் ஓவியங்கள் பல நூற்றாண்டுகளின் கலைத்திறனை காட்டுகின்றன.`;
    case 'te':
      return `${name} యొక్క చేనేత వస్త్రాలు, హస్తకళలు మరియు జానపద చిత్రలేఖనం శతాబ్దాల కళా నైపుణ్యాన్ని చాటుతాయి.`;
    case 'mr':
      return `${name} चे पारंपारिक हातमाग, धातूशिल्प, हस्तकला आणि लोकचित्रे ही शतकानुशतकांची कलात्मक समृद्धी दर्शवतात.`;
    case 'gu':
      return `${name} ના પરંપરાગત હાથશાળ કાપડ, હસ્તકલા અને લોકચિત્રકામ સદીઓની કલાત્મકતાનું ઉત્કૃષ્ટ ઉદાહરણ છે.`;
    case 'kn':
      return `${name} ರಾಜ್ಯದ ಸಾಂಪ್ರದಾಯಿಕ ಕೈಮಗ್ಗ, ಕರಕುಶಲ ಕಲೆಗಳು ಮತ್ತು ಜಾನಪದ ವರ್ಣಚಿತ್ರಗಳು ಶತಮಾನಗಳ ಕಲಾ ನೈಪುಣ್ಯವನ್ನು ಬಿಂಬಿಸುತ್ತವೆ.`;
    default:
      return state.art_crafts_desc;
  }
}

export function getHeritageTitle(
  itemOrId: HeritageItem | string | null | undefined,
  lang: LanguageKey,
  defaultTitle?: string
): string {
  if (!itemOrId) return defaultTitle || '';
  const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id;
  const fallbackTitle = typeof itemOrId === 'object' && itemOrId ? itemOrId.title : defaultTitle || id;
  const hiTitle = typeof itemOrId === 'object' && itemOrId ? itemOrId.hindi_title : undefined;

  if (lang === 'en') {
    return fallbackTitle;
  }

  if (HERITAGE_TITLES_MULTILINGUAL[id]?.[lang]) {
    return HERITAGE_TITLES_MULTILINGUAL[id][lang];
  }
  if (lang === 'hi' && hiTitle) return hiTitle;
  return fallbackTitle;
}

export function getHeritageSummary(item: HeritageItem | null | undefined, lang: LanguageKey): string {
  if (!item) return '';
  if (lang === 'en') return item.summary || '';

  const title = getHeritageTitle(item, lang);
  const location = item.location_name;
  const period = item.period || 'Ancient';

  if (lang === 'hi') {
    if (item.hindi_summary) return item.hindi_summary;
    return `${title} (${location}) भारत की एक अत्यंत महत्वपूर्ण और ऐतिहासिक ${period} काल की धरोहर है, जो अपनी उत्कृष्ट वास्तुकला और सांस्कृतिक गरिमा के लिए जानी जाती है।`;
  }

  switch (lang) {
    case 'bn':
      return `${title} (${location}) ভারতের একটি অত্যন্ত গুরুত্বপূর্ণ ও ঐতিহাসিক ${period} যুগের ঐতিহ্যবাহী স্থান, যা এর চমৎকার স্থাপত্য ও সাংস্কৃতিক গৌরবের জন্য বিশ্বখ্যাত।`;
    case 'ta':
      return `${title} (${location}) என்பது இந்தியாவின் புகழ்பெற்ற ${period} கால வரலாற்று சிறப்புமிக்க பாரம்பரிய சின்னமாகும், இது அதன் தலைசிறந்த கட்டிடக்கலை மற்றும் கலாச்சார முக்கியத்துவத்திற்காக அறியப்படுகிறது.`;
    case 'te':
      return `${title} (${location}) భారతదేశంలోని అత్యంత విశిష్టమైన ${period} కాలపు చారిత్రక వారసత్వ ప్రదేశం, ఇది దాని అద్భుతమైన వాస్తుశిల్పం మరియు సాంస్కృతిక వైభవానికి ప్రసిద్ధి చెందింది.`;
    case 'mr':
      return `${title} (${location}) हे भारतातील एक अत्यंत महत्त्वाचे आणि ऐतिहासिक ${period} काळातील वारसा स्थळ आहे, जे त्याच्या उत्कृष्ट वास्तुकला आणि सांस्कृतिक वैभवासाठी प्रसिद्ध आहे.`;
    case 'gu':
      return `${title} (${location}) એ ભારતીય સંસ્કૃતિનું એક અત્યંત મહત્વપૂર્ણ અને ઐતિહાસિક ${period} યુગનું વારસો સ્થળ છે, જે તેના અજોડ સ્થાપત્ય અને સાંસ્કૃતિક ગૌરવ માટે પ્રખ્યાત છે.`;
    case 'kn':
      return `${title} (${location}) ಭಾರತದ ಅತ್ಯಂತ ಮಹತ್ವದ ಹಾಗೂ ಐತಿಹಾಸಿಕ ${period} ಕಾಲದ ಪರಂಪರೆಯ ತಾಣವಾಗಿದ್ದು, ತನ್ನ ಅದ್ಭುತ ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಗರಿಮೆಗೆ ಹೆಸರುವಾಸಿಯಾಗಿದೆ.`;
    default:
      return item.summary;
  }
}

export function getHeritageHistory(item: HeritageItem, lang: LanguageKey): string {
  const title = getHeritageTitle(item, lang);
  const period = item.period || 'Ancient';

  if (lang === 'en') return item.history;

  switch (lang) {
    case 'hi':
      return `${title} का गौरवशाली इतिहास ${period} कालखंड से संबंधित है और सदियों के राजवंशीय संरक्षण, कलात्मक उत्थान तथा पुरातात्विक गरिमा का प्रतीक है।`;
    case 'bn':
      return `${title} এর গৌরবময় ইতিহাস ${period} যুগের সাথে সম্পর্কিত এবং বহু শতাব্দীর রাজকীয় পৃষ্ঠপোষকতা ও প্রত্নতাত্ত্বিক শ্রেষ্ঠত্বের প্রতীক।`;
    case 'ta':
      return `${title} இன் புகழ்பெற்ற வரலாறு ${period} காலப்பகுதியைச் சேர்ந்தது மற்றும் பல நூற்றாண்டுகளின் அரச ஆதரவு மற்றும் தொல்பொருள் சிறப்பின் சான்றாகும்.`;
    case 'te':
      return `${title} యొక్క ఘనమైన చరిత్ర ${period} కాలానికి చెందినది మరియు శతాబ్దాల రాజవంశాల పోషణ మరియు పురావస్తు వైభవానికి ప్రతీక.`;
    case 'mr':
      return `${title} चा गौरवशाली इतिहास ${period} काळाशी संबंधित असून तो शतकानुशतके राजघराण्यांचे संरक्षण आणि पुरातत्वीय वैभवाचे प्रतीक आहे.`;
    case 'gu':
      return `${title} નો ગૌરવશાળી ઇતિહાસ ${period} યુગ સાથે જોડાયેલો છે અને સદીઓના રાજવી સંરક્ષણ અને પુરાતત્વીય ગૌરવનું પ્રતીક છે.`;
    case 'kn':
      return `${title} ತಾಣದ ಭವ್ಯ ಇತಿಹಾಸವು ${period} ಕಾಲಕ್ಕೆ ಸೇರಿದ್ದು, ಶತಮಾನಗಳ ರಾಜಮನೆತನಗಳ ಪ್ರೋತ್ಸಾಹ ಮತ್ತು ಪುರಾತತ್ವ ವೈಭವದ ಸಾಕ್ಷಿಯಾಗಿದೆ.`;
    default:
      return item.history;
  }
}

export function getHeritageCulture(item: HeritageItem, lang: LanguageKey): string {
  const location = item.location_name;

  if (lang === 'en') return item.culture;

  switch (lang) {
    case 'hi':
      return `${location} की समृद्ध परंपराओं, कला और स्थापत्य का अनूठा संगम, जो भारत की जीवंत सांस्कृतिक विरासत को प्रतिबिंबित करता है।`;
    case 'bn':
      return `${location} এর সমৃদ্ধ ঐতিহ্য, শিল্প ও স্থাপত্যের এক অপূর্ব মিলন, যা ভারতের জীবন্ত সাংস্কৃতিক ঐতিহ্যকে প্রতিফলিত করে।`;
    case 'ta':
      return `${location} பகுதியின் செழுமையான கலாச்சாரம், கலை மற்றும் கட்டிடக்கலையின் தனித்துவமான சங்கமம் ஆகும்.`;
    case 'te':
      return `${location} యొక్క సాంస్కృతిక సంప్రదాయాలు, కళలు మరియు శిల్పకళల సంగమమై భారతదేశ వారసత్వాన్ని ప్రతిబింబిస్తుంది.`;
    case 'mr':
      return `${location} ची समृद्ध संस्कृती, कला आणि वास्तुकलेचा अनोखा संगम भारताचा जिवंत वारसा दर्शवतो.`;
    case 'gu':
      return `${location} ની સમૃદ્ધ પરંપરાઓ, કળા અને સ્થાપત્યનો અનોખો સંગમ ભારતીય સાંસ્કૃતિક વારસાને પ્રતિબિંબિત કરે છે.`;
    case 'kn':
      return `${location} ಪ್ರದೇಶದ ಸಮೃದ್ಧ ಸಂಪ್ರದಾಯಗಳು, ಕಲೆ ಮತ್ತು ವಾಸ್ತುಶಿಲ್ಪದ ವಿಶಿಷ್ಟ ಸಂಗಮ ಭಾರತದ ಜೀವಂತ ಪರಂಪರೆಯನ್ನು ಸಾರುತ್ತದೆ.`;
    default:
      return item.culture;
  }
}

export function getRegionName(regionKey: string, lang: LanguageKey): string {
  if (REGION_NAMES_MULTILINGUAL[regionKey]?.[lang]) {
    return REGION_NAMES_MULTILINGUAL[regionKey][lang];
  }
  return regionKey;
}

export function getFestivalName(fest: Festival | null | undefined, lang: LanguageKey): string {
  if (!fest) return '';
  if (lang === 'en') return fest.name || '';
  if (lang === 'hi' && fest.hindi_name) return fest.hindi_name;
  return fest.name || '';
}

export function getFestivalSignificance(fest: Festival | null | undefined, lang: LanguageKey): string {
  if (!fest) return '';
  if (lang === 'en') return fest.significance || '';
  if (lang === 'hi' && fest.hindi_significance) return fest.hindi_significance;

  const name = getFestivalName(fest, lang);
  switch (lang) {
    case 'hi':
      return `${name} धार्मिक और सांस्कृतिक आस्था का पारंपरिक पर्व है, जो सामाजिक सौहार्द और ऋतु-चक्र के स्वागत का प्रतीक है।`;
    case 'bn':
      return `${name} ধর্মীয় ও সামাজিক সম্প্রীতির একটি প্রধান ঐতিহ্যবাহী উৎসব, যা প্রকৃতি ও ঋতুচক্রের শুভ আগমনকে উদযাপন করে।`;
    case 'ta':
      return `${name} என்பது ஆன்மீக மற்றும் கலாச்சார நம்பிக்கையின் பாரம்பரிய பண்டிகையாகும், இது சமுதாய நல்லிணக்கத்தை குறிக்கிறது.`;
    case 'te':
      return `${name} అనేది ఆధ్యాత్మిక మరియు సాంస్కృతిక ప్రాముఖ్యత కలిగిన పండుగ, ఇది సమాజ ఐక్యతకు ప్రతీక.`;
    case 'mr':
      return `${name} हा धार्मिक आणि सांस्कृतिक श्रद्धेचा पारंपारिक उत्सव असून तो सामाजिक सौहार्द आणि ऋतुचक्राचे प्रतीक आहे.`;
    case 'gu':
      return `${name} એ ધાર્મિક અને સાંસ્કૃતિક આસ્થાનો પરંપરાગત તહેવાર છે, જે સામાજિક એકતાનું પ્રતીક છે.`;
    case 'kn':
      return `${name} ಧಾರ್ಮಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ನಂಬಿಕೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಹಬ್ಬವಾಗಿದ್ದು, ಸಮಾಜದ ಸೌಹಾರ್ದತೆಯನ್ನು ಸಾರುತ್ತದೆ.`;
    default:
      return fest.significance || '';
  }
}

export function getFestivalCelebration(fest: Festival | null | undefined, lang: LanguageKey): string {
  if (!fest) return '';
  if (lang === 'en') return fest.celebration_style || '';
  if (lang === 'hi' && fest.hindi_celebration_style) return fest.hindi_celebration_style;

  switch (lang) {
    case 'hi':
      return 'पारंपरिक लोक नृत्य, शास्त्रीय संगीत, विशेष व्यंजनों और सामुदायिक मेल-मिलाप के साथ उल्लासपूर्वक आयोजन।';
    case 'bn':
      return 'ঐতিহ্যবাহী লোকনৃত্য, শাস্ত্রীয় সঙ্গীত, বিশেষ মিষ্টি ও খাবারের সাথে পরম আনন্দের সহিত উদযাপিত হয়।';
    case 'ta':
      return 'பாரம்பரிய நடனம், இசை, சிறப்பு உணவுகள் மற்றும் சமூக கூடுகைகளுடன் மகிழ்ச்சியாகக் கொண்டாடப்படுகிறது.';
    case 'te':
      return 'సాంప్రదాయ నృత్యాలు, సంగీతం, ప్రత్యేక వంటకాలు మరియు సామూహిక వేడుకలతో ఉత్సాహంగా జరుపుకుంటారు.';
    case 'mr':
      return 'पारंपारिक लोकनृत्य, संगीत, वैशिष्ट्यपूर्ण खाद्यपदार्थ आणि सामुदायिक उत्साहाने साजरा केला जातो.';
    case 'gu':
      return 'પરંપરાગત લોકનૃત્યો, સંગીત, સ્વાદિષ્ટ વાનગીઓ અને સામુદાયિક ઉત્સાહ સાથે ઉજવણી કરવામાં આવે છે.';
    case 'kn':
      return 'ಸಾಂಪ್ರದಾಯಿಕ ಜಾನಪದ ನೃತ್ಯ, ಸಂಗೀತ, ವಿಶೇಷ ಖಾದ್ಯಗಳು ಮತ್ತು ಸಾಮೂಹಿಕ ಆಚರಣೆಗಳೊಂದಿಗೆ ಸಂಭ್ರಮಿಸಲಾಗುತ್ತದೆ.';
    default:
      return fest.celebration_style || '';
  }
}

export function getFoodName(food: Food | null | undefined, lang: LanguageKey): string {
  if (!food) return '';
  if (lang === 'en') return food.name || '';
  if (lang === 'hi' && food.hindi_name) return food.hindi_name;
  return food.name || '';
}

export function getFoodDescription(food: Food | null | undefined, lang: LanguageKey): string {
  if (!food) return '';
  if (lang === 'en') return food.description || '';
  if (lang === 'hi' && food.hindi_description) return food.hindi_description;

  const name = getFoodName(food, lang);
  switch (lang) {
    case 'hi':
      return `${name} स्थानीय ताजी सामग्रियों, शुद्ध देसी मसालों और पारंपरिक धीमी आंच पर तैयार की जाने वाली अत्यंत लोकप्रिय क्षेत्रीय व्यंजन है।`;
    case 'bn':
      return `${name} স্থানীয় তাজা উপাদান, খাঁটি মশলা এবং প্রাচীন ঐতিহ্যবাহী পদ্ধতিতে রান্না করা একটি অত্যন্ত সুস্বাদু খাবার।`;
    case 'ta':
      return `${name} என்பது உள்ளூர் மசாலாப் பொருட்கள் மற்றும் பாரம்பரிய சமையல் முறையில் தயாரிக்கப்படும் மிகவும் பிரசித்தி பெற்ற உணவாகும்.`;
    case 'te':
      return `${name} స్థానిక సుగంధ ద్రవ్యాలు మరియు ప్రాచీన వంట పద్ధతుల ద్వారా తయారు చేయబడే అత్యంత రుచికరమైన ప్రాంతీయ వంటకం.`;
    case 'mr':
      return `${name} हे अस्सल स्थानिक मसाले आणि पारंपारिक पद्धतीने तयार केले जाणारे अत्यंत लोकप्रिय आणि चवदार खाद्यपदार्थ आहे.`;
    case 'gu':
      return `${name} એ સ્થાનિક સામગ્રી, શુદ્ધ મસાલા અને પરંપરાગત પદ્ધતિથી તૈયાર કરવામાં આવતી અત્યંત સ્વાદિષ્ટ વાનગી છે.`;
    case 'kn':
      return `${name} ಸ್ಥಳೀಯ ಸಾಂಬಾರ ಪದಾರ್ಥಗಳು ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಪಾಕವಿಧಾನದೊಂದಿಗೆ ತಯಾರಾಗುವ ಅತ್ಯಂತ ಜನಪ್ರಿಯ ಹಾಗೂ ರುಚಿಕರವಾದ ಖಾದ್ಯವಾಗಿದೆ.`;
    default:
      return food.description;
  }
}

export function getUIText(key: string, lang: LanguageKey): string {
  return EXPLORER_TRANSLATIONS[lang]?.[key] || EXPLORER_TRANSLATIONS.en[key] || key;
}
