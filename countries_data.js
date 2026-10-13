// Comprehensive Global Location Database
const COUNTRY_DATA = {
  "Afghanistan": { code: "+93", states: { "Kabul": ["Kabul City"], "Herat": ["Herat City"] }},
  "Albania": { code: "+355", states: { "Tirana": ["Tirana City"], "Durrës": ["Durrës City"] }},
  "Algeria": { code: "+213", states: { "Algiers": ["Algiers City"], "Oran": ["Oran City"] }},
  "Argentina": { code: "+54", states: { "Buenos Aires": ["Buenos Aires City", "La Plata"], "Córdoba": ["Córdoba City"] }},
  "Australia": { code: "+61", states: { 
    "New South Wales": ["Sydney", "Newcastle", "Wollongong"], 
    "Victoria": ["Melbourne", "Geelong", "Ballarat"],
    "Queensland": ["Brisbane", "Gold Coast", "Cairns"],
    "Western Australia": ["Perth", "Fremantle"],
    "South Australia": ["Adelaide"],
    "Tasmania": ["Hobart"]
  }},
  "Austria": { code: "+43", states: { "Vienna": ["Vienna City"], "Salzburg": ["Salzburg City"], "Tyrol": ["Innsbruck"] }},
  "Bahrain": { code: "+973", states: { "Capital": ["Manama"] }},
  "Bangladesh": { code: "+880", states: { "Dhaka": ["Dhaka City"], "Chittagong": ["Chittagong City"], "Khulna": ["Khulna City"] }},
  "Belgium": { code: "+32", states: { "Brussels": ["Brussels City"], "Antwerp": ["Antwerp City"], "Flemish Brabant": ["Leuven"] }},
  "Brazil": { code: "+55", states: { 
    "São Paulo": ["São Paulo City", "Campinas", "Santos"],
    "Rio de Janeiro": ["Rio de Janeiro City", "Niterói"],
    "Minas Gerais": ["Belo Horizonte"],
    "Bahia": ["Salvador"],
    "Brasília": ["Brasília City"]
  }},
  "Bulgaria": { code: "+359", states: { "Sofia": ["Sofia City"], "Plovdiv": ["Plovdiv City"], "Varna": ["Varna City"] }},
  "Canada": { code: "+1", states: { 
    "Ontario": ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London"],
    "Quebec": ["Montreal", "Quebec City", "Laval"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby"],
    "Alberta": ["Calgary", "Edmonton", "Red Deer"],
    "Manitoba": ["Winnipeg"],
    "Saskatchewan": ["Regina", "Saskatoon"],
    "Nova Scotia": ["Halifax"]
  }},
  "Chile": { code: "+56", states: { "Santiago": ["Santiago City"], "Valparaíso": ["Valparaíso City", "Viña del Mar"] }},
  "China": { code: "+86", states: { 
    "Beijing": ["Beijing City"],
    "Shanghai": ["Shanghai City"],
    "Guangdong": ["Guangzhou", "Shenzhen", "Dongguan"],
    "Zhejiang": ["Hangzhou", "Ningbo"],
    "Jiangsu": ["Nanjing", "Suzhou"],
    "Sichuan": ["Chengdu"],
    "Hubei": ["Wuhan"]
  }},
  "Colombia": { code: "+57", states: { "Bogotá": ["Bogotá City"], "Antioquia": ["Medellín"], "Valle del Cauca": ["Cali"] }},
  "Costa Rica": { code: "+506", states: { "San José": ["San José City"], "Alajuela": ["Alajuela City"] }},
  "Croatia": { code: "+385", states: { "Zagreb": ["Zagreb City"], "Split-Dalmatia": ["Split"] }},
  "Czech Republic": { code: "+420", states: { "Prague": ["Prague City"], "South Moravian": ["Brno"] }},
  "Denmark": { code: "+45", states: { "Capital Region": ["Copenhagen"], "Central Jutland": ["Aarhus"] }},
  "Egypt": { code: "+20", states: { "Cairo": ["Cairo City", "Giza"], "Alexandria": ["Alexandria City"] }},
  "Estonia": { code: "+372", states: { "Harju": ["Tallinn"] }},
  "Finland": { code: "+358", states: { "Uusimaa": ["Helsinki", "Espoo"], "Pirkanmaa": ["Tampere"] }},
  "France": { code: "+33", states: { 
    "Île-de-France": ["Paris", "Versailles", "Boulogne-Billancourt"],
    "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Cannes"],
    "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble"],
    "Occitanie": ["Toulouse", "Montpellier"],
    "Nouvelle-Aquitaine": ["Bordeaux"]
  }},
  "Germany": { code: "+49", states: { 
    "Bavaria": ["Munich", "Nuremberg", "Augsburg"],
    "Berlin": ["Berlin City"],
    "Hamburg": ["Hamburg City"],
    "Hesse": ["Frankfurt", "Wiesbaden"],
    "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen"],
    "Baden-Württemberg": ["Stuttgart", "Mannheim"]
  }},
  "Greece": { code: "+30", states: { "Attica": ["Athens", "Piraeus"], "Central Macedonia": ["Thessaloniki"] }},
  "Hong Kong": { code: "+852", states: { "Hong Kong Island": ["Central", "Wan Chai"], "Kowloon": ["Tsim Sha Tsui"] }},
  "Hungary": { code: "+36", states: { "Budapest": ["Budapest City"], "Pest": ["Gödöllő"] }},
  "Iceland": { code: "+354", states: { "Capital Region": ["Reykjavik"] }},
  "India": { code: "+91", states: { 
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur"],
    "Telangana": ["Hyderabad", "Warangal"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur"],
    "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
    "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
    "Haryana": ["Gurgaon", "Faridabad"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Agra"],
    "Madhya Pradesh": ["Indore", "Bhopal"]
  }},
  "Indonesia": { code: "+62", states: { 
    "Jakarta": ["Jakarta City"],
    "West Java": ["Bandung", "Bekasi"],
    "East Java": ["Surabaya"],
    "Bali": ["Denpasar"]
  }},
  "Iran": { code: "+98", states: { "Tehran": ["Tehran City"], "Isfahan": ["Isfahan City"] }},
  "Iraq": { code: "+964", states: { "Baghdad": ["Baghdad City"], "Basra": ["Basra City"] }},
  "Ireland": { code: "+353", states: { "Leinster": ["Dublin", "Cork"], "Munster": ["Limerick"] }},
  "Israel": { code: "+972", states: { "Tel Aviv": ["Tel Aviv City"], "Jerusalem": ["Jerusalem City"], "Haifa": ["Haifa City"] }},
  "Italy": { code: "+39", states: { 
    "Lazio": ["Rome"],
    "Lombardy": ["Milan", "Bergamo", "Brescia"],
    "Campania": ["Naples"],
    "Sicily": ["Palermo", "Catania"],
    "Veneto": ["Venice", "Verona"],
    "Piedmont": ["Turin"]
  }},
  "Japan": { code: "+81", states: { 
    "Tokyo": ["Tokyo City", "Shibuya", "Shinjuku"],
    "Osaka": ["Osaka City"],
    "Kyoto": ["Kyoto City"],
    "Kanagawa": ["Yokohama"],
    "Aichi": ["Nagoya"],
    "Hokkaido": ["Sapporo"]
  }},
  "Jordan": { code: "+962", states: { "Amman": ["Amman City"] }},
  "Kazakhstan": { code: "+7", states: { "Almaty": ["Almaty City"], "Nur-Sultan": ["Nur-Sultan City"] }},
  "Kenya": { code: "+254", states: { "Nairobi": ["Nairobi City"], "Mombasa": ["Mombasa City"] }},
  "Kuwait": { code: "+965", states: { "Capital": ["Kuwait City"] }},
  "Latvia": { code: "+371", states: { "Riga": ["Riga City"] }},
  "Lebanon": { code: "+961", states: { "Beirut": ["Beirut City"] }},
  "Lithuania": { code: "+370", states: { "Vilnius": ["Vilnius City"] }},
  "Luxembourg": { code: "+352", states: { "Luxembourg": ["Luxembourg City"] }},
  "Malaysia": { code: "+60", states: { 
    "Kuala Lumpur": ["Kuala Lumpur City"],
    "Selangor": ["Petaling Jaya", "Shah Alam"],
    "Penang": ["George Town"],
    "Johor": ["Johor Bahru"]
  }},
  "Mexico": { code: "+52", states: { 
    "Mexico City": ["Mexico City"],
    "Jalisco": ["Guadalajara"],
    "Nuevo León": ["Monterrey"],
    "Puebla": ["Puebla City"],
    "Quintana Roo": ["Cancún"]
  }},
  "Morocco": { code: "+212", states: { "Casablanca-Settat": ["Casablanca"], "Rabat-Salé-Kénitra": ["Rabat"] }},
  "Netherlands": { code: "+31", states: { 
    "North Holland": ["Amsterdam", "Haarlem"],
    "South Holland": ["Rotterdam", "The Hague"],
    "Utrecht": ["Utrecht City"]
  }},
  "New Zealand": { code: "+64", states: { 
    "Auckland": ["Auckland City"],
    "Wellington": ["Wellington City"],
    "Canterbury": ["Christchurch"],
    "Otago": ["Dunedin"]
  }},
  "Nigeria": { code: "+234", states: { "Lagos": ["Lagos City"], "Abuja": ["Abuja City"], "Kano": ["Kano City"] }},
  "Norway": { code: "+47", states: { "Oslo": ["Oslo City"], "Hordaland": ["Bergen"] }},
  "Oman": { code: "+968", states: { "Muscat": ["Muscat City"] }},
  "Pakistan": { code: "+92", states: { 
    "Sindh": ["Karachi"],
    "Punjab": ["Lahore", "Faisalabad", "Rawalpindi"],
    "Khyber Pakhtunkhwa": ["Peshawar"],
    "Islamabad": ["Islamabad City"]
  }},
  "Peru": { code: "+51", states: { "Lima": ["Lima City"], "Cusco": ["Cusco City"] }},
  "Philippines": { code: "+63", states: { 
    "Metro Manila": ["Manila", "Quezon City", "Makati"],
    "Cebu": ["Cebu City"],
    "Davao": ["Davao City"]
  }},
  "Poland": { code: "+48", states: { 
    "Masovian": ["Warsaw"],
    "Lesser Poland": ["Kraków"],
    "Greater Poland": ["Poznań"],
    "Lower Silesian": ["Wrocław"]
  }},
  "Portugal": { code: "+351", states: { "Lisbon": ["Lisbon City"], "Porto": ["Porto City"] }},
  "Qatar": { code: "+974", states: { "Doha": ["Doha City"] }},
  "Romania": { code: "+40", states: { "Bucharest": ["Bucharest City"], "Cluj": ["Cluj-Napoca"] }},
  "Russia": { code: "+7", states: { 
    "Moscow": ["Moscow City"],
    "Saint Petersburg": ["Saint Petersburg City"],
    "Sverdlovsk": ["Yekaterinburg"],
    "Tatarstan": ["Kazan"]
  }},
  "Saudi Arabia": { code: "+966", states: { 
    "Riyadh": ["Riyadh City"],
    "Makkah": ["Jeddah", "Mecca"],
    "Eastern": ["Dammam", "Khobar"]
  }},
  "Serbia": { code: "+381", states: { "Belgrade": ["Belgrade City"], "Novi Sad": ["Novi Sad City"] }},
  "Singapore": { code: "+65", states: { "Central": ["Singapore City", "Marina Bay", "Orchard"] }},
  "Slovakia": { code: "+421", states: { "Bratislava": ["Bratislava City"] }},
  "Slovenia": { code: "+386", states: { "Ljubljana": ["Ljubljana City"] }},
  "South Africa": { code: "+27", states: { 
    "Gauteng": ["Johannesburg", "Pretoria"],
    "Western Cape": ["Cape Town"],
    "KwaZulu-Natal": ["Durban"]
  }},
  "South Korea": { code: "+82", states: { 
    "Seoul": ["Seoul City"],
    "Busan": ["Busan City"],
    "Incheon": ["Incheon City"],
    "Gyeonggi": ["Suwon"]
  }},
  "Spain": { code: "+34", states: { 
    "Madrid": ["Madrid City"],
    "Catalonia": ["Barcelona", "Tarragona"],
    "Andalusia": ["Seville", "Málaga"],
    "Valencia": ["Valencia City"],
    "Basque Country": ["Bilbao"]
  }},
  "Sri Lanka": { code: "+94", states: { "Western": ["Colombo"] }},
  "Sweden": { code: "+46", states: { 
    "Stockholm": ["Stockholm City"],
    "Västra Götaland": ["Gothenburg"],
    "Skåne": ["Malmö"]
  }},
  "Switzerland": { code: "+41", states: { 
    "Zürich": ["Zürich City"],
    "Geneva": ["Geneva City"],
    "Bern": ["Bern City"],
    "Basel-Stadt": ["Basel"]
  }},
  "Taiwan": { code: "+886", states: { "Taipei": ["Taipei City"], "Kaohsiung": ["Kaohsiung City"] }},
  "Thailand": { code: "+66", states: { 
    "Bangkok": ["Bangkok City"],
    "Chiang Mai": ["Chiang Mai City"],
    "Phuket": ["Phuket City"]
  }},
  "Turkey": { code: "+90", states: { 
    "Istanbul": ["Istanbul City"],
    "Ankara": ["Ankara City"],
    "Izmir": ["Izmir City"],
    "Antalya": ["Antalya City"]
  }},
  "Ukraine": { code: "+380", states: { "Kyiv": ["Kyiv City"], "Kharkiv": ["Kharkiv City"], "Odessa": ["Odessa City"] }},
  "United Arab Emirates": { code: "+971", states: { 
    "Dubai": ["Dubai City", "Dubai Marina"],
    "Abu Dhabi": ["Abu Dhabi City"],
    "Sharjah": ["Sharjah City"],
    "Ajman": ["Ajman City"]
  }},
  "United Kingdom": { code: "+44", states: { 
    "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Bristol", "Newcastle"],
    "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"],
    "Wales": ["Cardiff", "Swansea"],
    "Northern Ireland": ["Belfast"]
  }},
  "United States": { code: "+1", states: { 
    "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"],
    "New York": ["New York City", "Buffalo", "Rochester", "Albany"],
    "Texas": ["Houston", "Austin", "Dallas", "San Antonio", "Fort Worth"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville"],
    "Illinois": ["Chicago", "Aurora", "Naperville"],
    "Pennsylvania": ["Philadelphia", "Pittsburgh"],
    "Ohio": ["Columbus", "Cleveland", "Cincinnati"],
    "Georgia": ["Atlanta", "Savannah"],
    "North Carolina": ["Charlotte", "Raleigh"],
    "Michigan": ["Detroit"],
    "Massachusetts": ["Boston", "Cambridge"],
    "Washington": ["Seattle", "Spokane"],
    "Arizona": ["Phoenix", "Tucson"],
    "Colorado": ["Denver", "Colorado Springs"],
    "Nevada": ["Las Vegas", "Reno"]
  }},
  "Uruguay": { code: "+598", states: { "Montevideo": ["Montevideo City"] }},
  "Venezuela": { code: "+58", states: { "Capital District": ["Caracas"], "Zulia": ["Maracaibo"] }},
  "Vietnam": { code: "+84", states: { 
    "Hanoi": ["Hanoi City"],
    "Ho Chi Minh": ["Ho Chi Minh City"],
    "Da Nang": ["Da Nang City"]
  }},
  "Other": { code: "", states: { "Manual Entry": ["Manual Entry"] }}
};

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = COUNTRY_DATA;
}
