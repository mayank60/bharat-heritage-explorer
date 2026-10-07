import { Food, Festival, Language, Tradition, Craft } from '../types.ts';

export const EXTRA_FOODS: Food[] = [
  // Jharkhand
  {
    id: 'dhuska-jharkhand',
    state_id: 'jharkhand',
    name: 'Dhuska with Black Chickpea Ghugni',
    hindi_name: 'धुस्का एवं चना घुघनी',
    description: 'Crispy deep-fried savory bread prepared from stone-ground fermented rice and chana dal batter, tempered with cumin and paired with spicy black chickpea curry (Ghugni).',
    dietary_type: 'Vegetarian',
  },
  {
    id: 'rugda-jharkhand',
    state_id: 'jharkhand',
    name: 'Wild Rugda / Phutka Forest Mushroom Curry',
    hindi_name: 'रुगड़ा (जंगली मशरूम करी)',
    description: 'Rare indigenous wild puffball mushrooms harvested only during monsoon beneath Sal tree roots, slow-cooked in cold-pressed mustard oil with garlic and whole rustic spices.',
    dietary_type: 'Vegetarian'
  },
  {
    id: 'chilka-roti-jharkhand',
    state_id: 'jharkhand',
    name: 'Chilka Roti with Tomato Chutney',
    hindi_name: 'चिलका रोटी',
    description: 'Delicate traditional crepe prepared from soaked rice and chana dal batter, roasted on earthen tawas with minimal oil, served during tribal harvest festivals.',
    dietary_type: 'Vegetarian'
  },
  // Bihar
  {
    id: 'litti-chokha',
    state_id: 'bihar',
    name: 'Bihari Litti Chokha with Desi Ghee',
    hindi_name: 'लिट्टी चोखा',
    description: 'Whole wheat dough balls stuffed with spiced roasted gram flour (Sattu), baked over cow-dung embers, dipped in pure desi ghee, served with roasted eggplant-tomato-potato mash (Chokha).',
    dietary_type: 'Vegetarian',
  },
  {
    id: 'khaja-silao',
    state_id: 'bihar',
    name: 'GI-Tagged Silao Khaja',
    hindi_name: 'सिलाव खाजा',
    description: 'GI-tagged 52-layered crispy golden sweet made from wheat flour and sugar syrup, famously consumed in ancient Nalanda and Rajgir since the Mauryan era.',
    dietary_type: 'Sweet / Dessert'
  },
  // Telangana & Andhra Pradesh
  {
    id: 'hyderabadi-biryani',
    state_id: 'telangana',
    name: 'Hyderabadi Dum Biryani',
    hindi_name: 'हैदराबादी दम बिरयानी',
    description: 'World-renowned royal creation combining fragrant aged Basmati rice, marinated tender meat, saffron, fried onions (Birista), and mint, slow-cooked under dough seal (Dum).',
    dietary_type: 'Non-Vegetarian',
  },
  {
    id: 'hyderabadi-haleem',
    state_id: 'telangana',
    name: 'GI-Tagged Hyderabadi Royal Haleem',
    hindi_name: 'हैदराबादी हलीम',
    description: 'Nutritious Ramzan delicacy slow-cooked for 12 hours in large copper cauldrons (Bhattis) blending pounded wheat, lentils, mutton, pure ghee, and 24 secret spices into a rich porridge.',
    dietary_type: 'Non-Vegetarian'
  },
  {
    id: 'pootharekulu',
    state_id: 'andhra-pradesh',
    name: 'Atreyapuram Pootharekulu (Paper Sweet)',
    hindi_name: 'पूथारेकुलु (पेपर स्वीट)',
    description: 'GI-tagged paper-thin edible rice starch wrappers folded with pure ghee, powdered jaggery, cardamom, and chopped dry fruits.',
    dietary_type: 'Sweet / Dessert',
  },
  {
    id: 'gongura-pachadi',
    state_id: 'andhra-pradesh',
    name: 'Andhra Gongura Mutton & Pachadi',
    hindi_name: 'गोंगूरा मटन एवं पचड़ी',
    description: 'Iconic tangy and spicy preparation made from sorrel leaves (Gongura) stone-pounded with red chillies, garlic, and mustard seeds.',
    dietary_type: 'Non-Vegetarian',
  },
  // Assam & Northeast
  {
    id: 'masor-tenga',
    state_id: 'assam',
    name: 'Assamese Masor Tenga',
    hindi_name: 'मासोर टेंगा (खट्टी मछली करी)',
    description: 'Light and refreshing tangy freshwater river fish curry cooked with tomatoes, Ou Tenga (elephant apple) or dried lemon, tempered with fenugreek.',
    dietary_type: 'Non-Vegetarian',
  },
  {
    id: 'koldil-paro',
    state_id: 'assam',
    name: 'Koldil Paro (Banana Flower with Pigeon Meat)',
    hindi_name: 'कोलदिल पारो',
    description: 'Ancient Ahom royal delicacy combining finely shredded banana blossom with spiced meat and whole black peppercorns.',
    dietary_type: 'Non-Vegetarian'
  },
  // Odisha
  {
    id: 'chhena-poda-odisha',
    state_id: 'odisha',
    name: 'Chhena Poda (Roasted Cottage Cheese Cake)',
    hindi_name: 'छेना पोड़ा',
    description: 'Traditional baked dessert of Odisha made by kneading fresh cottage cheese, semolina, cardamom, and caramelized sugar, wrapped in Sal leaves and baked in clay kilns.',
    dietary_type: 'Sweet / Dessert'
  },
  {
    id: 'dalma-odisha',
    state_id: 'odisha',
    name: 'Puri Temple Dalma',
    hindi_name: 'ओडिया दालमा',
    description: 'Sacred nutritious dish offered in Puri Jagannath Mahaprasad, prepared with toor dal, raw banana, pumpkin, papaya, tempered with Pancha Phutana and roasted cumin-chilli powder.',
    dietary_type: 'Vegetarian'
  },
  // West Bengal
  {
    id: 'macher-jhol-bengal',
    state_id: 'west-bengal',
    name: 'Bengali Shorshe Ilish (Hilsa in Mustard Gravy)',
    hindi_name: 'शॉर्शे इलिश (सरसों हिलसा)',
    description: 'Pride of Bengali cuisine: fresh silver Hilsa fish steamed in stone-ground yellow and black mustard paste, green chillies, and pungent pure mustard oil.',
    dietary_type: 'Non-Vegetarian'
  },
  {
    id: 'mishti-doi-bengal',
    state_id: 'west-bengal',
    name: 'Bengali Mishti Doi in Earthen Pots',
    hindi_name: 'मिष्टी दोई',
    description: 'Fermented caramelized sweet curd prepared by slow-reducing cow milk with palm jaggery (Nolen Gur) and setting it in porous terracotta pots for natural earthen flavor.',
    dietary_type: 'Sweet / Dessert'
  },
  // Rajasthan
  {
    id: 'dal-baati-churma-platter',
    state_id: 'rajasthan',
    name: 'Dal Baati Churma Platter',
    hindi_name: 'दाल बाटी चूरमा',
    description: 'Hard whole wheat balls baked over cow-dung cake embers and drowned in pure ghee, served with five-lentil panchmel dal and sweet cardamom churma.',
    dietary_type: 'Vegetarian'
  },
  {
    id: 'ker-sangri-rajasthan',
    state_id: 'rajasthan',
    name: 'Pachkoota / Ker Sangri',
    hindi_name: 'केर सांगरी',
    description: 'Authentic desert delicacy made with dried wild caper berries (Ker) and desert bean pods (Sangri) sauteed in mustard oil, red chillies, and amchur.',
    dietary_type: 'Vegetarian'
  },
  // Kerala
  {
    id: 'appam-stew-kerala',
    state_id: 'kerala',
    name: 'Kerala Appam with Coconut Milk Vegetable Stew',
    hindi_name: 'अप्पम एवं वेज स्टू',
    description: 'Fermented rice and coconut hoppers with crispy lace edges and soft pillowy centers, paired with a mild, aromatic coconut milk stew.',
    dietary_type: 'Vegetarian'
  },
  // Karnataka
  {
    id: 'mysore-pak-karnataka',
    state_id: 'karnataka',
    name: 'Royal Mysore Pak',
    hindi_name: 'मैसूर पाक',
    description: 'Melt-in-mouth royal sweet created in the kitchens of Mysore Palace in 1935, made with roasted besan, copious pure desi ghee, and cardamom sugar syrup.',
    dietary_type: 'Sweet / Dessert'
  },
  {
    id: 'bisi-bele-bath',
    state_id: 'karnataka',
    name: 'Bisi Bele Bath',
    hindi_name: 'बिसि बेले भात',
    description: 'Traditional Mysore dish meaning "hot lentil rice", prepared with aromatic spices, tamarind, toasted coconut, roasted cashews, and seasonal vegetables.',
    dietary_type: 'Vegetarian'
  },
  // Punjab
  {
    id: 'makki-di-roti-punjab',
    state_id: 'punjab',
    name: 'Makki Di Roti & Sarson Ka Saag',
    hindi_name: 'मक्के की रोटी एवं सरसों का साग',
    description: 'Iconic Punjabi winter feast consisting of stone-ground cornmeal flatbreads served with slow-cooked mustard and bathua greens, topped with freshly churned white butter and jaggery.',
    dietary_type: 'Vegetarian'
  },
  // Gujarat
  {
    id: 'undhiyu-gujarat',
    state_id: 'gujarat',
    name: 'Surti Undhiyu with Puri',
    hindi_name: 'सुरती उंधियू',
    description: 'Winter mixed vegetable potpourri of Surti papdi beans, baby eggplants, purple yam, and fenugreek muthias slow-cooked upside down in earthen pots.',
    dietary_type: 'Vegetarian'
  },
  // Maharashtra
  {
    id: 'puran-poli-maharashtra',
    state_id: 'maharashtra',
    name: 'Maharashtrian Puran Poli with Katachi Amti',
    hindi_name: 'पूरण पोळी एवं आमटी',
    description: 'Festive sweet flatbread stuffed with soft mashed chana dal and organic jaggery infused with nutmeg and cardamom, roasted in desi ghee.',
    dietary_type: 'Sweet / Dessert'
  },
  // Madhya Pradesh
  {
    id: 'poha-jalebi-mp',
    state_id: 'madhya-pradesh',
    name: 'Indori Poha with Crispy Jalebi & Sev',
    hindi_name: 'इंदौरी पोहा एवं जलेबी',
    description: 'Steamed flattened rice spiced with fennel seeds and special Jeeravan masala, garnished with Ratlami Sev, pomegranate pearls, and paired with hot saffron jalebis.',
    dietary_type: 'Vegetarian'
  },
  // Jammu & Kashmir
  {
    id: 'kashmiri-rogan-josh',
    state_id: 'jammu-and-kashmir',
    name: 'Authentic Kashmiri Rogan Josh',
    hindi_name: 'रोगन जोश',
    description: 'Flagship jewel of the Kashmiri Wazwan, stewed with Kashmiri deggi mirch, fennel powder, ginger, and wild cockscomb flower extract (Ratan Jot) for crimson glow.',
    dietary_type: 'Non-Vegetarian',
  },
  {
    id: 'kashmiri-kahwa',
    state_id: 'jammu-and-kashmir',
    name: 'Kashmiri Saffron Kahwa Tea',
    hindi_name: 'कश्मीरी कहवा',
    description: 'Aromatic green tea brewed in brass Samovars with whole green cardamom, cinnamon quills, crushed almonds, and pure Pampore saffron strands.',
    dietary_type: 'Beverage'
  },
  // Goa
  {
    id: 'goan-fish-curry',
    state_id: 'goa',
    name: 'Goan Fish Curry with Coconut & Kokum',
    hindi_name: 'गोवा फिश करी',
    description: 'Staple coastal curry cooked with freshly grated coconut, Kashmiri red chillies, coriander seeds, and tart dried kokum rind.',
    dietary_type: 'Non-Vegetarian',
  },
  {
    id: 'bebinca',
    state_id: 'goa',
    name: 'Traditional Goan Bebinca',
    hindi_name: 'बेबिन्का केक',
    description: 'Regal Indo-Portuguese pudding consisting of 7 to 16 caramelized layers baked with coconut milk, egg yolks, flour, sugar, and nutmeg.',
    dietary_type: 'Sweet / Dessert',
  },
  // Uttarakhand & Himachal
  {
    id: 'kafuli-uttarakhand',
    state_id: 'uttarakhand',
    name: 'Pahari Kafuli (Spinach & Fenugreek Stew)',
    hindi_name: 'काफुली',
    description: 'Rich iron-loaded Himalayan delicacy made by slow-cooking wild mountain spinach and fenugreek leaves, thickened with rice paste in iron kadhais.',
    dietary_type: 'Vegetarian',
  },
  // Haryana & Delhi
  {
    id: 'bajra-khichdi-haryana',
    state_id: 'haryana',
    name: 'Haryanvi Bajra Khichdi with Homemade White Butter',
    hindi_name: 'बाजरा खिचड़ी एवं सफेद मक्खन',
    description: 'Hearty winter porridge made from coarsely pounded pearl millet and yellow moong dal, served with generous dollops of fresh tindi ghee or butter and jaggery.',
    dietary_type: 'Vegetarian',
  },
  {
    id: 'chandni-chowk-parathe',
    state_id: 'delhi',
    name: 'Old Delhi Parathe Wali Gali Platter',
    hindi_name: 'पुरानी दिल्ली के पराठे',
    description: 'Deep-fried golden flatbreads stuffed with spiced cottage cheese, rabdi, bitter gourd, or potatoes, served with pumpkin sabzi, mint chutney, and tamarind saunth.',
    dietary_type: 'Vegetarian'
  }
];

export const EXTRA_FESTIVALS: Festival[] = [
  // Jharkhand
  {
    id: 'sarhul-jharkhand',
    state_id: 'jharkhand',
    name: 'Sarhul Nature & Sal Blossom Festival',
    hindi_name: 'सरहुल पर्व (प्रकृति पूजा)',
    month_or_season: 'March - April (Chaitra Shukla Tritiya)',
    significance: 'Most sacred indigenous tribal festival of Oraon, Munda, Ho, and Santhal communities worshipping Mother Earth (Dharti Maa) and the blooming Sal tree in sacred Sarna groves.',
    celebration_style: 'Pahan village priests offer three roosters and water pitchers to predict monsoon rainfall, while men and women dance in circles to the rhythmic beats of Mandar, Dhol, and Nagada.'
  },
  {
    id: 'karam-puja-jharkhand',
    state_id: 'jharkhand',
    name: 'Karam / Karma Tribal Festival',
    hindi_name: 'करम पूजा',
    month_or_season: 'August - September (Bhadrapada Shukla Ekadashi)',
    significance: 'Celebrates youth, agricultural fertility, and brotherhood through the ritual worship of the sacred Karam tree branch planted in the Akhra dancing ground.',
    celebration_style: 'Young unmarried women observe strict day-long fasts, germinating Java barley shoots in bamboo baskets, followed by all-night Jhumair singing and dancing.'
  },
  // Bihar
  {
    id: 'chhath-puja-bihar',
    state_id: 'bihar',
    name: 'Mahaparva Chhath Puja',
    hindi_name: 'महापर्व छठ पूजा',
    month_or_season: 'October - November (Kartik Shukla Shashthi)',
    significance: 'Rigorous 4-day solar and cosmic nature veneration dedicated to Lord Surya and Chhathi Maiya for longevity, prosperity, family well-being, and purity of soul.',
    celebration_style: 'Vratis stand waist-deep in holy rivers to offer Arghya (oblations) to the setting and rising sun with bamboo soop filled with Thekua, sugarcane, and seasonal fruits.'
  },
  // Assam
  {
    id: 'rongali-bihu-assam',
    state_id: 'assam',
    name: 'Rongali / Bohag Bihu',
    hindi_name: 'रोंगाली बिहू',
    month_or_season: 'April (Assamese New Year / Spring)',
    significance: 'Assamese festival of joy, fertility, and agricultural sowing marking the onset of spring and the seeding of paddy fields.',
    celebration_style: 'Youth gather outdoors to dance in circles to the rhythmic beats of the Dhol, Pepa (buffalo horn flute), and Gogona (bamboo jaw harp).'
  },
  {
    id: 'ambubachi-mela-assam',
    state_id: 'assam',
    name: 'Kamakhya Ambubachi Mela',
    hindi_name: 'अंबुवाची मेला (कामाख्या मंदिर)',
    month_or_season: 'June (Ashaad month monsoon)',
    significance: 'Annual tantric congregation celebrating the yearly menstrual cycle of Mother Earth at the sanctum of Goddess Kamakhya on Nilachal Hill.',
    celebration_style: 'Temple doors remain closed for 3 days while thousands of Sadhus and devotees chant hymns, concluding with the distribution of sacred Raktovastra red cloth.'
  },
  // Telangana & Andhra Pradesh
  {
    id: 'bathukamma-telangana',
    state_id: 'telangana',
    name: 'Bathukamma Floral Festival',
    hindi_name: 'बथुकम्मा',
    month_or_season: 'September - October (Navratri season)',
    significance: 'Celebrates womanhood, nature, and Mother Gauri through elaborate seasonal flower arrangements shaped as temple towers.',
    celebration_style: 'Women dressed in traditional Langa Voni sing ancient folk songs in circles around floral towers before immersing them in local lakes.'
  },
  {
    id: 'medaram-jathara-telangana',
    state_id: 'telangana',
    name: 'Sammakka Sarakka Medaram Jathara',
    hindi_name: 'मेदाराम जतारा (महा कुंभ)',
    month_or_season: 'February (Magha Purnima, Biennial)',
    significance: 'Asia’s largest tribal congregation commemorating the historic battle of mother-daughter warriors Sammakka and Sarakka against Kakatiya oppression.',
    celebration_style: 'Over 10 million pilgrims offer their body-weight in jaggery (called Bangaram / Gold) to tree sanctums in the dense Eturnagaram forest.'
  },
  {
    id: 'ugadi-andhra',
    state_id: 'andhra-pradesh',
    name: 'Ugadi (Telugu New Year)',
    hindi_name: 'उगादि',
    month_or_season: 'March - April (Chaitra month)',
    significance: 'Astronomical beginning of the Telugu lunar new year, marked by the ceremonial reading of the Panchanga predictions.',
    celebration_style: 'Families prepare Ugadi Pachadi, a unique preparation combining sweet, sour, salty, bitter, tangy, and spicy tastes reflecting life’s diverse experiences.'
  },
  // Odisha
  {
    id: 'ratha-yatra-puri',
    state_id: 'odisha',
    name: 'Puri Jagannath Ratha Yatra',
    hindi_name: 'पुरी जगन्नाथ रथ यात्रा',
    month_or_season: 'June - July (Ashadha Shukla Dwitiya)',
    significance: 'The world’s oldest and largest annual chariot procession, where Lord Jagannath, Balabhadra, and Subhadra journey to Gundicha Temple.',
    celebration_style: 'Millions of devotees pull massive 45-foot hand-carved wooden chariots through the Grand Bada Danda road with cymbals and conches.'
  },
  // Kerala
  {
    id: 'onam-kerala',
    state_id: 'kerala',
    name: 'Onam & Vallam Kali (Boat Race)',
    hindi_name: 'ओणम एवं नौका दौड़',
    month_or_season: 'August - September (Chingam month)',
    significance: 'Celebrates the mythical homecoming of the benevolent Daitya King Mahabali and the bountiful state harvest.',
    celebration_style: 'Elaborate Pookkalam floral carpets at doorways, 26-dish Onasadya banquets on plantain leaves, and high-speed Snake Boat Races (Chundan Vallam).'
  },
  {
    id: 'thrissur-pooram-kerala',
    state_id: 'kerala',
    name: 'Thrissur Pooram (Mother of all Poorams)',
    hindi_name: 'त्रिशूर पूरम',
    month_or_season: 'April - May (Medam month)',
    significance: 'Grand 200-year-old temple pageant instituted by Sakthan Thampuran featuring competitive display of caparisoned elephants and umbrellas.',
    celebration_style: 'Ilanjithara Melam percussion symphony with over 250 chenda drummers and breathtaking Kudamattam umbrella shifting.'
  },
  // Tamil Nadu
  {
    id: 'pongal-tamil-nadu',
    state_id: 'tamil-nadu',
    name: 'Thai Pongal & Jallikattu',
    hindi_name: 'थाई पोंगल',
    month_or_season: 'January (Thai month)',
    significance: 'Four-day Tamil harvest thanksgiving honoring the Sun God Surya, rain gods, and agricultural cattle.',
    celebration_style: 'Boiling newly harvested rice and milk in earthen pots until it overflows shouting "Pongalo Pongal", Kolam designs, and bull-embracing Jallikattu.'
  },
  // Punjab
  {
    id: 'baisakhi-punjab',
    state_id: 'punjab',
    name: 'Baisakhi Harvest Festival',
    hindi_name: 'बैसाखी',
    month_or_season: '13 or 14 April',
    significance: 'Marks the golden wheat harvest and commemorates the founding of the Khalsa Panth by Guru Gobind Singh Ji in 1699.',
    celebration_style: 'Nagar Kirtan religious processions, visits to Gurdwaras for Karah Parshad, and vigorous energetic Bhangra performances.'
  },
  // Gujarat
  {
    id: 'navratri-garba-gujarat',
    state_id: 'gujarat',
    name: 'Navratri Mahotsav & Rann Utsav',
    hindi_name: 'नवरात्रि महोत्सव एवं रण उत्सव',
    month_or_season: 'September - October & Winter',
    significance: 'The world’s longest dance festival honoring Goddess Durga across nine nights of devotional joy and Shakti worship.',
    celebration_style: 'Hundreds of thousands dressed in mirror-work Chaniya Cholis perform synchronized Garba clapping around illuminated sanctums till dawn.'
  },
  // Rajasthan
  {
    id: 'pushkar-fair-rajasthan',
    state_id: 'rajasthan',
    name: 'Pushkar International Camel & Cultural Fair',
    hindi_name: 'पुष्कर मेला',
    month_or_season: 'October - November (Kartik Purnima)',
    significance: 'Ancient religious pilgrimage where devotees take holy dips in sacred Pushkar Lake and trade embellished livestock.',
    celebration_style: 'Mustache competitions, bridal dress contests, desert camel races, and thousands of oil lamps floating on the lake under the full moon.'
  },
  // Nagaland
  {
    id: 'hornbill-festival-nagaland',
    state_id: 'nagaland',
    name: 'Hornbill Festival (Festival of Festivals)',
    hindi_name: 'हॉर्नबिल महोत्सव',
    month_or_season: '1 - 10 December',
    significance: 'A majestic grand gathering uniting all 17 recognized indigenous Naga tribes to preserve and celebrate their ancestral warrior heritage.',
    celebration_style: 'Traditional Morung dormitory village showcases, ancient war chants, log-drum beating, indigenous games, and tribal feasts at Kisama.'
  },
  {
    id: 'sekrenyi-nagaland',
    state_id: 'nagaland',
    name: 'Angami Sekrenyi Purification Festival',
    hindi_name: 'सेक्रेनी महोत्सव',
    month_or_season: 'February (25th day of Kezei month)',
    significance: '10-day ritual purification festival of the Angami Nagas to cleanse past sins and renew body and soul for the upcoming year.',
    celebration_style: 'Men cleanse themselves at village wells before dawn, wear ceremonial warrior kilts with hornbill feathers, and feast on traditional brew.'
  },
  // Ladakh
  {
    id: 'hemis-festival-ladakh',
    state_id: 'ladakh',
    name: 'Hemis Gompa Monastery Festival',
    hindi_name: 'हेमिस महोत्सव',
    month_or_season: 'June - July (Tsechu 10th day)',
    significance: 'Celebrates the birth anniversary of Guru Padmasambhava (Guru Rinpoche), who brought Vajrayana Buddhism to the trans-Himalayas.',
    celebration_style: 'Monks perform mystical sacred Cham mask dances wearing brocade robes and silk scarves to the clash of long horns and cymbals.'
  },
  // Himachal Pradesh
  {
    id: 'kullu-dussehra',
    state_id: 'himachal-pradesh',
    name: 'International Kullu Dussehra',
    hindi_name: 'कुल्लू दशहरा',
    month_or_season: 'October (Begins on Vijayadashami)',
    significance: 'Unique 7-day celestial congregation dating back to the 17th century when King Jagat Singh consecrated Lord Raghunath.',
    celebration_style: 'Over 200 village deities (Devtas) arrive from surrounding valleys in ornate wooden palanquins to camp at Dhalpur Maidan.'
  },
  // West Bengal
  {
    id: 'durga-puja-bengal',
    state_id: 'west-bengal',
    name: 'Kolkata Durga Puja Festival',
    hindi_name: 'दुर्गा पूजा महामहोत्सव',
    month_or_season: 'September - October (Ashwin Shukla Shashthi to Dashami)',
    significance: 'UNESCO Intangible Cultural Heritage of Humanity celebrating the triumph of Mother Durga over tyranny.',
    celebration_style: 'Thousands of artistically sculpted theme pandals across the city, synchronized Dhunuchi smoke dance, and joyous Sindoor Khela.'
  },
  // Maharashtra
  {
    id: 'ganesh-utsav-maharashtra',
    state_id: 'maharashtra',
    name: 'Maharashtra Ganeshotsav',
    hindi_name: 'गणेशोत्सव',
    month_or_season: 'August - September (Bhadrapada Shukla Chaturthi)',
    significance: 'Mass community celebration revived by Lokmanya Tilak in 1893 to unite citizens through cultural unity and spiritual devotion.',
    celebration_style: 'Massive clay murtis consecrated in Sarvajanik pandals, intense Dhol-Tasha troop performances, and Visarjan processions chanting "Ganpati Bappa Morya".'
  }
];

export const EXTRA_TRADITIONS: Tradition[] = [
  // Jharkhand
  {
    id: 'chhau-dance-jharkhand',
    state_id: 'jharkhand',
    name: 'Seraikela & Purulia Chhau',
    hindi_name: 'छऊ लोक नृत्य',
    type: 'UNESCO Intangible Martial Folk Dance',
    origin: 'Chota Nagpur & Kalinga borderlands (18th Century Royal Patronage)',
    significance: 'Vigorous martial and acrobatic dance celebrating nature, tribal epics, and triumph of good over evil during Chaitra Parva.',
    performance_or_attire: 'Expressive hand-painted clay and papier-mâché masks depicting deities, animals, and ancient warriors.'
  },
  {
    id: 'sohrai-tradition-jharkhand',
    state_id: 'jharkhand',
    name: 'Sohrai & Khovar Matriarchal Mural Tradition',
    hindi_name: 'सोहराई एवं खोवर भित्ति परंपरा',
    type: 'Ancient Indigenous Wall Art Tradition',
    origin: 'Hazaribagh Cave Art Lineage (Dating back 10,000+ years)',
    significance: 'Painted exclusively by tribal women during winter harvest (Sohrai) and wedding season (Khovar) invoking fertility and nature blessings.',
    performance_or_attire: 'Mud plaster walls layered with dark clay and coated with white kaolin clay, etched using broken combs and chewed datun sticks.'
  },
  // Kerala
  {
    id: 'kathakali-kerala',
    state_id: 'kerala',
    name: 'Kathakali Dance-Drama',
    hindi_name: 'कथकली नृत्य नाट्य',
    type: 'Classical Dance Drama',
    origin: '17th Century Kottarakkara Kingdom',
    significance: 'Grand narrative dance depicting epics of Mahabharata and Ramayana with intricate eye mudras (Nava Rasas) and vocal Sopanam music.',
    performance_or_attire: 'Elaborate Pacha (green face paint), Kireedam (sacred wooden crowns), and voluminous multi-layered skirt attire.'
  },
  {
    id: 'kalaripayattu-kerala',
    state_id: 'kerala',
    name: 'Kalaripayattu Martial Art',
    hindi_name: 'कलारिपयट्टु युद्धकला',
    type: 'Ancient Battlefield Martial Science',
    origin: '3rd Century BCE Sangam Era',
    significance: 'Considered the mother of Asian martial arts, combining animal postures (Ashtavadivu), flexible swords (Urumi), and marma pressure healing.',
    performance_or_attire: 'Traditional Kacha waist wrap practiced inside red clay earthen pits (Kalaris).'
  },
  {
    id: 'mohiniyattam-kerala',
    state_id: 'kerala',
    name: 'Mohiniyattam (Dance of the Enchantress)',
    hindi_name: 'मोहिनीअट्टम',
    type: 'Classical Dance Form',
    origin: '16th Century Travancore Royal Courts',
    significance: 'Graceful feminine dance form symbolizing the Mohini avatar of Lord Vishnu, emphasizing Lasya (delicate, lyrical movements).',
    performance_or_attire: 'Off-white Kasavu saree with gold brocade border, jasmine hair wreath (Mulla Poovu), and traditional temple gold ornaments.'
  },
  // Karnataka
  {
    id: 'yakshagana-karnataka',
    state_id: 'karnataka',
    name: 'Yakshagana Folk Theatre',
    hindi_name: 'यक्षगान लोक नाट्य',
    type: 'Traditional Dance-Theatre',
    origin: 'Coastal Karnataka (11th-16th Century Vijayanagara)',
    significance: 'All-night performance enacting mythological episodes with spirited footwork, spontaneous Kannada dialogues, and Chande drumming.',
    performance_or_attire: 'Towering gilded headgear (Mundasu), vibrant face pigments, and ornate chest armors (Bhujakeerthi).'
  },
  {
    id: 'dollu-kunitha-karnataka',
    state_id: 'karnataka',
    name: 'Dollu Kunitha Drum Dance',
    hindi_name: 'डोल्लू कुनिथा',
    type: 'Vigorous Devotional Folk Drum Dance',
    origin: 'Kuruba pastoral community traditions',
    significance: 'High-energy rhythmic dance dedicated to Lord Beereshwara (an avatar of Shiva) performed by a troupe of 10 to 12 drummers.',
    performance_or_attire: 'Dancers beat large hollow wooden drums tied to their waists while executing swift acrobatic leaps and spinning formations.'
  },
  // Gujarat
  {
    id: 'garba-gujarat',
    state_id: 'gujarat',
    name: 'Sacred Garba & Dandiya Raas',
    hindi_name: 'गरबा एवं डांडिया रास',
    type: 'UNESCO Intangible Cultural Heritage',
    origin: 'Ancient fertility and Shakti veneration',
    significance: 'Circular rhythmic clapping dance revolving around the Garbha Deep (perforated earthen lamp) honoring Goddess Durga during Navratri.',
    performance_or_attire: 'Chaniya Cholis embroidered with Abhala mirrorwork and oxidized silver jewelry.'
  },
  // Rajasthan
  {
    id: 'ghoomar-rajasthan',
    state_id: 'rajasthan',
    name: 'Royal Ghoomar Dance',
    hindi_name: 'घूमर नृत्य',
    type: 'Royal Folk Dance',
    origin: 'Bhil tribe, later adopted by Rajput royal courts',
    significance: 'Graceful pirouetting dance welcoming new brides and celebrating festive occasions like Teej and Gangaur.',
    performance_or_attire: 'Flowing 80-kali Ghagra skirts creating hypnotic swirling geometric patterns accompanied by Dholak and Sarangi.'
  },
  {
    id: 'kalbelia-rajasthan',
    state_id: 'rajasthan',
    name: 'Kalbelia Serpent Dance',
    hindi_name: 'कालबेलिया नृत्य',
    type: 'UNESCO Intangible Cultural Heritage',
    origin: 'Nomadic snake-charming communities of Thar Desert',
    significance: 'Sensuous, serpentine dance where performers mimic the graceful, fluid movements of a cobra to the drone of the Poongi pipe.',
    performance_or_attire: 'Black swirling skirts embroidered with silver ribbons and tiny mirror patches that shimmer like snake scales.'
  },
  // Assam
  {
    id: 'bihu-dance-assam',
    state_id: 'assam',
    name: 'Bihu Folk Dance & Pepa Beats',
    hindi_name: 'बिहू लोक नृत्य',
    type: 'Agricultural Harvest Dance',
    origin: 'Brahmaputra Valley indigenous traditions',
    significance: 'Youthful spring celebration marked by rapid hand movements, joyful swaying, and buffalo horn (Pepa) melodies during Rongali Bihu.',
    performance_or_attire: 'Golden Muga silk Mekhela Chador with red floral motifs and Kopou phool (wild orchids) in hair.'
  },
  {
    id: 'sattriya-assam',
    state_id: 'assam',
    name: 'Sattriya Classical Dance',
    hindi_name: 'सत्रिया शास्त्रीय नृत्य',
    type: '500-Year-Old Classical Dance Form',
    origin: '15th Century Vaishnavite monasteries (Sattras) founded by Srimanta Sankaradeva',
    significance: 'Sacred monastic dance offering devotion to Lord Krishna, characterized by graceful rhythmic footwork and Bor Geet hymns.',
    performance_or_attire: 'Raw Pat silk dhotis and chadors, silver Assamese Kopoophool jewelry, and Ghungroo ankle bells.'
  },
  // Punjab
  {
    id: 'bhangra-punjab',
    state_id: 'punjab',
    name: 'Bhangra & Giddha',
    hindi_name: 'भांगड़ा एवं गिद्दा',
    type: 'Harvest & Celebration Folk Dance',
    origin: 'Majha and Malwa farming heartlands',
    significance: 'Exuberant athletic harvest dance marking the ripening of wheat (Baisakhi) to the thunderous beats of the Dhol.',
    performance_or_attire: 'Bright Kurtas, Chadars, Turla Pagri headgear, and Chimta percussion tongs.'
  },
  // Tamil Nadu
  {
    id: 'bharatanatyam-tamil-nadu',
    state_id: 'tamil-nadu',
    name: 'Temple Bharatanatyam',
    hindi_name: 'शास्त्रीय भरतनाट्यम',
    type: 'Classical Sacred Dance',
    origin: 'Natya Shastra & Tanjore Temple Devadasi traditions',
    significance: 'Sacred visual poetry blending Bhava (expression), Raga (melody), and Tala (rhythm) dedicated to Lord Nataraja.',
    performance_or_attire: 'Kanchipuram silk costumes with pleated fan borders, Ghungroo ankle bells, and temple gold jewelry.'
  },
  // Mizoram
  {
    id: 'cheraw-mizoram',
    state_id: 'mizoram',
    name: 'Cheraw Bamboo Dance',
    hindi_name: 'चेराव बांस नृत्य',
    type: 'Indigenous Rhythmic Folk Dance',
    origin: '1st Century CE Lushai traditions',
    significance: 'Performed to ensure safe passage of departing souls and celebrated with great fervor during Chapchar Kut harvest.',
    performance_or_attire: 'Dancers step in and out of rhythmic crossing bamboo poles tapped in sync by four persons on the ground.'
  },
  // Odisha
  {
    id: 'gotipua-odisha',
    state_id: 'odisha',
    name: 'Gotipua Acrobatic Temple Dance',
    hindi_name: 'गोतीपुआ नृत्य',
    type: 'Precursor to Classical Odissi Dance',
    origin: '16th Century Raghurajpur & Puri temples',
    significance: 'Young boys dressed as female servitors perform difficult yogic Bandhas (acrobatic postures) in praise of Lord Jagannath.',
    performance_or_attire: 'Kanchula tight blouses, traditional Pattani dhotis, elaborate white sandalwood face dots, and floral hair crowns.'
  },
  // Chhattisgarh
  {
    id: 'pandavani-chhattisgarh',
    state_id: 'chhattisgarh',
    name: 'Pandavani Folk Ballad Theatre',
    hindi_name: 'पंडवानी लोक गाथा',
    type: 'Traditional Epic Narrative Theatre',
    origin: 'Tribal folklore of central Chhattisgarh',
    significance: 'Dramatic solo narration of episodes from Mahabharata where the singer uses an Ektara or Tambura as a bow, mace, and musical instrument.',
    performance_or_attire: 'Dressed in colorful tribal attire with brass ankle bells and a handheld peacock-feathered Tambura.'
  },
  // Jammu & Kashmir
  {
    id: 'rouf-jammu-kashmir',
    state_id: 'jammu-and-kashmir',
    name: 'Rouf Dance of Kashmir Valley',
    hindi_name: 'रऊफ लोक नृत्य',
    type: 'Spring & Eid Festive Folk Dance',
    origin: 'Kashmiri rural villages',
    significance: 'Interlocked women in two facing rows swaying gracefully to poetic choral lyrics celebrating the arrival of spring and harvest.',
    performance_or_attire: 'Embroidered Kashmiri Pheran gowns, silver head ornaments (Kasaba), and delicate Tilla needlework.'
  }
];

export const EXTRA_CRAFTS: Craft[] = [
  // Jharkhand
  {
    id: 'sohrai-khovar-art-jharkhand',
    state_id: 'jharkhand',
    name: 'Sohrai & Khovar Painting',
    hindi_name: 'सोहराई एवं खोवर चित्रकला',
    gi_tag: true,
    craft_type: 'GI-Tagged Indigenous Mud Mural & Canvas Art',
    materials: 'Local alluvial soils (Charak matti white kaolin, Lal matti red hematite, Kali matti manganese black), broken plastic combs, datun twigs',
    description: 'Ancient GI-tagged ritualistic matriarchal art form of Hazaribagh featuring stylized peacocks, bulls, deer, and lotus motifs painted with dual-tone clay scraping technique.'
  },
  // Bihar
  {
    id: 'madhubani-painting-bihar',
    state_id: 'bihar',
    name: 'Mithila / Madhubani Painting',
    hindi_name: 'मधुबनी चित्रकला',
    gi_tag: true,
    craft_type: 'Folk Wall & Canvas Art',
    materials: 'Handmade cow-dung paper, bamboo twigs, natural mineral dyes (indigo, turmeric, soot, lampblack)',
    description: 'Ancient art practiced by women of Mithila depicting Hindu deities, sacred flora, peacock motifs, and weddings with dual-line borders.'
  },
  // Chhattisgarh
  {
    id: 'dokra-craft-chhattisgarh',
    state_id: 'chhattisgarh',
    name: 'Bastar Dokra Bell Metal Casting',
    hindi_name: 'बस्तर ढोकरा धातु शिल्प',
    gi_tag: true,
    craft_type: 'Non-Ferrous Lost-Wax Metal Casting',
    materials: 'Beeswax wires, clay mould from riverbanks, molten scrap brass and bell metal',
    description: '4,000-year-old metallurgical craft dating back to the Indus Valley Dancing Girl, hand-crafting tribal deities, elephants, and oil lamps.'
  },
  {
    id: 'bastar-iron-craft',
    state_id: 'chhattisgarh',
    name: 'Bastar Wrought Iron Craft (Loha Shilp)',
    hindi_name: 'बस्तर लौह शिल्प',
    gi_tag: true,
    craft_type: 'Hand-Forged Recycled Wrought Iron',
    materials: 'Recycled scrap iron, coal forge, hand-hammers and tongs without modern casting moulds',
    description: 'GI-tagged ancestral smithy craft of the Agaria community transforming scrap iron into graceful tribal musicians, deers, and lamps.'
  },
  // Jammu & Kashmir
  {
    id: 'pashmina-kashmir',
    state_id: 'jammu-and-kashmir',
    name: 'Kashmir Pashmina & Sozni Needlework',
    hindi_name: 'कश्मीरी पश्मीना एवं सोज़नी शॉल',
    gi_tag: true,
    craft_type: 'Luxury Hand-Woven Textile',
    materials: 'Undercoat down of Changthangi mountain goats (Pashm), hand-spun wooden Charkha, fine silk threads',
    description: 'Finest hand-spun cashmere shawls passing through a ring test, adorned with meticulous microscopic needlepoint floral Paisley embroidery.'
  },
  // Tamil Nadu
  {
    id: 'kanchipuram-silk-tamil-nadu',
    state_id: 'tamil-nadu',
    name: 'Kanchipuram Temple Silk Sarees',
    hindi_name: 'कांचीपुरम रेशम साड़ी',
    gi_tag: true,
    craft_type: 'Handloom Zari Brocade Weaving',
    materials: 'Pure mulberry silk from South India, 24-carat pure silver and gold dipped Zari threads',
    description: 'Woven with interlocking Korvai technique connecting contrast pallu and temple gopuram border patterns with legendary durability.'
  },
  {
    id: 'tanjore-painting-tamil-nadu',
    state_id: 'tamil-nadu',
    name: 'Thanjavur Sacred Gold Foil Painting',
    hindi_name: 'तंजावूर स्वर्ण चित्रकला',
    gi_tag: true,
    craft_type: 'Classical Gold Leaf & Gem Painting',
    materials: 'Teak wood board, chalk paste (Gesso relief), 22-carat gold foil leaf, Jaipur semi-precious gems',
    description: 'Epitome of Chola and Maratha religious artwork characterized by radiant gilded relief figures of baby Krishna, Rama, and temple deities.'
  },
  // Rajasthan
  {
    id: 'blue-pottery-jaipur',
    state_id: 'rajasthan',
    name: 'Jaipur Blue Pottery',
    hindi_name: 'जयपुर ब्लू पॉटरी',
    gi_tag: true,
    craft_type: 'Zero-Clay Glazed Ceramic Art',
    materials: 'Quartz stone powder, Fuller’s earth (Multani Mitti), glass scrap, natural gum, cobalt oxide blue pigment',
    description: 'Turko-Persian glazed pottery crafted entirely without natural clay, fired at low heat with delicate cobalt floral and Persian arabesque designs.'
  },
  // Karnataka
  {
    id: 'channapatna-toys-karnataka',
    state_id: 'karnataka',
    name: 'Channapatna Lacquerware Toys',
    hindi_name: 'चन्नापटना खिलौने',
    gi_tag: true,
    craft_type: 'Turned Wood Lacquer Craft',
    materials: 'Soft Wrightia tinctoria (Aale Mara) ivory wood, non-toxic vegetable dyes (turmeric, kumkum, indigo), natural shellac',
    description: '18th-century royal craft patronized by Tipu Sultan, crafting smooth, child-safe wooden toys on turning lathes with high-gloss natural polish.'
  },
  {
    id: 'bidriware-karnataka',
    state_id: 'karnataka',
    name: 'Bidriware Silver Inlay Metal Craft',
    hindi_name: 'बिद्रीवेयर धातु शिल्प',
    gi_tag: true,
    craft_type: 'Silver Inlay on Blackened Zinc Alloy',
    materials: 'Zinc and copper alloy, pure silver wire inlay, ancient soil from the 15th-century Bidar Fort containing oxidizers',
    description: 'Bahmani Sultanate metal art where intricate pure silver floral motifs are hammered into engraved blackened metal.'
  },
  // Maharashtra
  {
    id: 'warli-painting-maharashtra',
    state_id: 'maharashtra',
    name: 'Warli Tribal Wall Art',
    hindi_name: 'वारली लोक चित्रकला',
    gi_tag: true,
    craft_type: 'Indigenous Tribal Mural Art',
    materials: 'Red ochre mud plaster (Geru), rice paste white pigment, bamboo chew-stick brush',
    description: 'Sacred geometric visual language using circles (sun/moon), triangles (mountains), and squares (sacred enclosure) showing the Tarpa circular dance.'
  },
  // Punjab
  {
    id: 'phulkari-punjab',
    state_id: 'punjab',
    name: 'Punjab Phulkari Floral Embroidery',
    hindi_name: 'पंजाब फुलकारी',
    gi_tag: true,
    craft_type: 'Geometric Darning-Stitch Needlework',
    materials: 'Hand-spun coarse Khaddar cotton fabric, untwisted pure Pat floss silk yarn in crimson, amber, and gold',
    description: 'Traditional bridal heirloom embroidered from the reverse side of the cloth creating stunning geometric flower gardens (Bagh).'
  },
  // Uttar Pradesh
  {
    id: 'banarasi-brocade-uttar-pradesh',
    state_id: 'uttar-pradesh',
    name: 'Varanasi Banarasi Katan Silk Brocade',
    hindi_name: 'बनारसी जरी ब्रोकेड',
    gi_tag: true,
    craft_type: 'Imperial Jacquard Handloom Silk',
    materials: 'Finest Katan silk warps, real silver and gold metallic Zari threads',
    description: 'Mughal royal heritage weaving featuring gold Jal lattices, bel leaf arabesques, and mina work that takes up to 6 months per royal saree.'
  },
  // Telangana
  {
    id: 'pochampally-ikat-telangana',
    state_id: 'telangana',
    name: 'Pochampally Tie-and-Dye Ikat',
    hindi_name: 'पोचमपल्ली इकत',
    gi_tag: true,
    craft_type: 'Double Ikat Handloom Weaving',
    materials: 'Pure mulberry silk and fine cotton, natural and azo-free reactive dyes',
    description: 'Intricate geometric diamond patterns where both warp and weft threads are precisely dyed prior to weaving on pit looms in Bhoodan Pochampally.'
  },
  // Odisha
  {
    id: 'pattachitra-odisha',
    state_id: 'odisha',
    name: 'Raghurajpur Palm-Leaf Pattachitra',
    hindi_name: 'पट्टचित्र चित्रकला',
    gi_tag: true,
    craft_type: 'Ancient Palm-Leaf & Cloth Scroll Art',
    materials: 'Treated dried palm leaves, iron stylus (Lekhani), natural conch shell white and lampblack ink',
    description: 'Meticulous micro-engravings illustrating the 10 incarnations of Vishnu (Dasavatara) and episodes of Gita Govinda with natural herbal inks.'
  },
  // Kerala
  {
    id: 'aranmula-kannadi-kerala',
    state_id: 'kerala',
    name: 'Aranmula Kannadi (Sacred Metal Mirror)',
    hindi_name: 'आरणमुला कन्नाड़ी (धातु दर्पण)',
    gi_tag: true,
    craft_type: 'Front-Surface Metal Alloy Mirror',
    materials: 'Secret copper-tin metallurgy alloy, hand-cast into handmade clay moulds, hand-polished with velvet for 45 days',
    description: 'Mystical 8-metal alloy mirror free of glass distortion, produced only by one traditional artisan family in Aranmula for temple sanctums.'
  }
];

export const EXTRA_LANGUAGES: Language[] = [
  // Andhra Pradesh & Telangana
  {
    id: 'telugu',
    state_id: 'andhra-pradesh',
    name: 'Telugu (తెలుగు)',
    hindi_name: 'तेलुगु',
    script: 'Telugu Script (Classical Language)',
    speakers_count: '96 Million+ Speakers',
    greeting: 'Namaskaram (నమస్కారం)'
  },
  // Karnataka
  {
    id: 'kannada',
    state_id: 'karnataka',
    name: 'Kannada (ಕನ್ನಡ)',
    hindi_name: 'कन्नड़',
    script: 'Kannada Script (Classical Language)',
    speakers_count: '55 Million+ Speakers',
    greeting: 'Namaskara (ನಮಸ್ಕಾರ)'
  },
  // Odisha
  {
    id: 'odia',
    state_id: 'odisha',
    name: 'Odia (ଓଡ଼ିଆ)',
    hindi_name: 'ओडिया',
    script: 'Odia Script (Classical Language)',
    speakers_count: '40 Million+ Speakers',
    greeting: 'Namaskar (ନମସ୍କାର)'
  },
  // Gujarat
  {
    id: 'gujarati',
    state_id: 'gujarat',
    name: 'Gujarati (ગુજરાતી)',
    hindi_name: 'गुजराती',
    script: 'Gujarati Script',
    speakers_count: '60 Million+ Speakers',
    greeting: 'Kem Chho / Jai Shri Krishna (જય શ્રી કૃષ્ણ)'
  },
  // Punjab
  {
    id: 'punjabi',
    state_id: 'punjab',
    name: 'Punjabi (ਪੰਜਾਬੀ)',
    hindi_name: 'पंजाबी',
    script: 'Gurmukhi Script',
    speakers_count: '130 Million+ Worldwide',
    greeting: 'Sat Sri Akaal (ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ)'
  },
  // Assam
  {
    id: 'assamese',
    state_id: 'assam',
    name: 'Assamese (অসমীয়া)',
    hindi_name: 'असमिया',
    script: 'Assamese-Bengali Script (Classical Language)',
    speakers_count: '15 Million+ Speakers',
    greeting: 'Nomoskar (নমস্কাৰ)'
  },
  // Jammu & Kashmir
  {
    id: 'kashmiri',
    state_id: 'jammu-and-kashmir',
    name: 'Kashmiri (कॉशुर / کٲशُر)',
    hindi_name: 'कश्मीरी',
    script: 'Perso-Arabic & Sharada script',
    speakers_count: '7 Million+ Speakers',
    greeting: 'Adaab / Namaskar (سلام)'
  },
  // Ladakh
  {
    id: 'ladakhi',
    state_id: 'ladakh',
    name: 'Ladakhi (Bhoti)',
    hindi_name: 'लद्दाखी (भोटी)',
    script: 'Tibetan Uchen script',
    speakers_count: '120,000+ Speakers',
    greeting: 'Julley (नमस्ते / स्वागत)'
  },
  // Goa
  {
    id: 'konkani',
    state_id: 'goa',
    name: 'Konkani (कोंकणी)',
    hindi_name: 'कोंकणी',
    script: 'Devanagari and Roman scripts',
    speakers_count: '3 Million+ Speakers',
    greeting: 'Deo Boro Dis Dium (नमस्कार)'
  },
  // Manipur
  {
    id: 'manipuri',
    state_id: 'manipur',
    name: 'Meitei / Manipuri',
    hindi_name: 'मणिपुरी / मैतेई',
    script: 'Meitei Mayek script (Classical Language)',
    speakers_count: '1.8 Million+ Speakers',
    greeting: 'Khurumjari (খুরুমজরি)'
  },
  // Mizoram
  {
    id: 'mizo',
    state_id: 'mizoram',
    name: 'Mizo (Lushai)',
    hindi_name: 'मिज़ो',
    script: 'Roman Latin script',
    speakers_count: '850,000+ Speakers',
    greeting: 'Chibai (Welcome / Greetings)'
  },
  // Nagaland
  {
    id: 'nagamese',
    state_id: 'nagaland',
    name: 'Nagamese / Ao Naga',
    hindi_name: 'नागामीज़ / एओ नागा',
    script: 'Roman Latin script',
    speakers_count: '500,000+ Speakers',
    greeting: 'Kholay / Ya’ateh'
  },
  // Meghalaya
  {
    id: 'khasi',
    state_id: 'meghalaya',
    name: 'Khasi',
    hindi_name: 'खासी',
    script: 'Roman Latin script',
    speakers_count: '1.4 Million+ Speakers',
    greeting: 'Khublei (Blessings / Thank you)'
  },
  // Sikkim
  {
    id: 'sikkimese',
    state_id: 'sikkim',
    name: 'Sikkimese (Denzongke) & Nepali',
    hindi_name: 'सिक्किमी (भूटिया) एवं नेपाली',
    script: 'Uchen Tibetan and Devanagari',
    speakers_count: '650,000+ Speakers',
    greeting: 'Kuzu Zangpo / Namaste'
  },
  // Tripura
  {
    id: 'kokborok',
    state_id: 'tripura',
    name: 'Kokborok',
    hindi_name: 'कोकबोरोक',
    script: 'Bengali and Roman scripts',
    speakers_count: '1 Million+ Speakers',
    greeting: 'Khumulwng / Khulumkha'
  },
  // Uttarakhand
  {
    id: 'garhwali',
    state_id: 'uttarakhand',
    name: 'Garhwali & Kumaoni',
    hindi_name: 'गढ़वाली एवं कुमाऊँनी',
    script: 'Devanagari script',
    speakers_count: '5 Million+ Speakers',
    greeting: 'Danda Dharun / Pranam'
  },
  // Haryana
  {
    id: 'haryanvi',
    state_id: 'haryana',
    name: 'Haryanvi (Bangru)',
    hindi_name: 'हरियाणवी',
    script: 'Devanagari script',
    speakers_count: '10 Million+ Speakers',
    greeting: 'Ram Ram Ji (राम राम जी)'
  },
  // Chhattisgarh
  {
    id: 'chhattisgarhi',
    state_id: 'chhattisgarh',
    name: 'Chhattisgarhi',
    hindi_name: 'छत्तीसगढ़ी',
    script: 'Devanagari script',
    speakers_count: '18 Million+ Speakers',
    greeting: 'Jai Johar (जय जोहार)'
  },
  // Jharkhand
  {
    id: 'santhali',
    state_id: 'jharkhand',
    name: 'Santhali',
    hindi_name: 'संथाली',
    script: 'Ol Chiki script (ᱚᱞ ᱪᱤᱠᱤ)',
    speakers_count: '7.5 Million+ Speakers',
    greeting: 'Johar (ᱡᱚᱦᱟᱨ)'
  }
];
