// Concert venue data - converted from original venue list
const venuesData = [
    {
        "id": "alte-batschkapp-frankfurt",
        "name": "Alte Batschkapp",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 400
    },
    {
        "id": "alter-schlachthof-wiesbaden",
        "name": "Alter Schlachthof",
        "city": "Wiesbaden",
        "country": "Germany",
        "latitude": 50.0833,
        "longitude": 8.25,
        "capacity": 2400,
        "configurations": {
            "Kesselhaus": 300
        }
    },
    {
        "id": "amphitheater-hanau",
        "name": "Amphitheater",
        "city": "Hanau",
        "country": "Germany",
        "latitude": 50.1333,
        "longitude": 8.9167,
        "capacity": 2800
    },
    {
        "id": "amphitheater-gelsenkirchen",
        "name": "Amphitheater Gelsenkirchen",
        "city": "Gelsenkirchen",
        "country": "Germany",
        "latitude": 51.5167,
        "longitude": 7.0833,
        "capacity": 6100
    },
    {
        "id": "barclays-arena-hamburg",
        "name": "Barclays Arena",
        "city": "Hamburg",
        "country": "Germany",
        "latitude": 53.5753,
        "longitude": 10.0153,
        "capacity": 16000
    },
    {
        "id": "batschkapp-frankfurt",
        "name": "Batschkapp",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 1500
    },
    {
        "id": "buderus-arena",
        "name": "Buderus Arena",
        "city": "Wetzlar",
        "country": "Germany",
        "latitude": 50.56514287741329,
        "longitude": 8.50834288420034,
        "capacity": 6000
    },
    {
        "id": "burg-abenberg",
        "name": "Burg Abenberg",
        "city": "Abenberg",
        "country": "Germany",
        "latitude": 49.25,
        "longitude": 10.9667,
        "capacity": 5000
    },
    {
        "id": "burg-frankenstein-muehltal",
        "name": "Burg Frankenstein",
        "city": "Mühltal",
        "country": "Germany",
        "latitude": 49.7833,
        "longitude": 8.6667,
        "capacity": 2000
    },
    {
        "id": "burg-wertheim",
        "name": "Burg Wertheim",
        "city": "Wertheim",
        "country": "Germany",
        "latitude": 49.7667,
        "longitude": 9.5167,
        "capacity": 1500
    },
    {
        "id": "cannstatter-wasen-stuttgart",
        "name": "Cannstatter Wasen",
        "city": "Stuttgart",
        "country": "Germany",
        "latitude": 48.7996,
        "longitude": 9.2372,
        "capacity": 50000
    },
    {
        "id": "carlswerk-koeln",
        "name": "Carlswerk",
        "city": "Köln",
        "country": "Germany",
        "latitude": 50.9375,
        "longitude": 6.9583,
        "capacity": 1600
    },
    {
        "id": "centralstation-darmstadt",
        "name": "Centralstation",
        "city": "Darmstadt",
        "country": "Germany",
        "latitude": 49.8728,
        "longitude": 8.6512,
        "capacity": 950
    },
    {
        "id": "colos-saal-aschaffenburg",
        "name": "Colos Saal",
        "city": "Aschaffenburg",
        "country": "Germany",
        "latitude": 49.9747,
        "longitude": 9.1467,
        "capacity": 500
    },
    {
        "id": "deutsche-bank-park-frankfurt",
        "name": "Deutsche Bank Park",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.0686,
        "longitude": 8.6454,
        "capacity": 65000,
        "configurations": {
            "Rockin1000": 15000
        }
    },
    {
        "id": "domgarten-speyer",
        "name": "Domgarten",
        "city": "Speyer",
        "country": "Germany",
        "latitude": 49.3167,
        "longitude": 8.4333,
        "capacity": 10000
    },
    {
        "id": "e-werk-open-air-gelnde",
        "name": "E-Werk (Open Air Gelände)",
        "city": "Saarbrücken",
        "country": "Germany",
        "latitude": 49.238235371266924,
        "longitude": 6.957258263217587,
        "capacity": null
    },
    {
        "id": "essigfabrik",
        "name": "Essigfabrik",
        "city": "Köln",
        "country": "Germany",
        "latitude": 50.9249733378483,
        "longitude": 6.978493985363258,
        "capacity": 800
    },
    {
        "id": "europahalle-karlsruhe",
        "name": "Europahalle",
        "city": "Karlsruhe",
        "country": "Germany",
        "latitude": 49.0069,
        "longitude": 8.4037,
        "capacity": 9000
    },
    {
        "id": "ferienland-crispendorf",
        "name": "Ferienland Crispendorf",
        "city": "Crispendorf",
        "country": "Germany",
        "latitude": 50.6167,
        "longitude": 11.2833,
        "capacity": null
    },
    {
        "id": "festhalle-frankfurt",
        "name": "Festhalle",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 15000
    },
    {
        "id": "festplatz-altengronau",
        "name": "Festplatz Altengronau",
        "city": "Altengronau",
        "country": "Germany",
        "latitude": 50.2833,
        "longitude": 9.5167,
        "capacity": 2000
    },
    {
        "id": "festplatz-finsterloh-wetzlar",
        "name": "Festplatz Finsterloh",
        "city": "Wetzlar",
        "country": "Germany",
        "latitude": 50.55,
        "longitude": 8.5,
        "capacity": 1400
    },
    {
        "id": "festung-ehrenbreitstein",
        "name": "Festung Ehrenbreitstein",
        "city": "Koblenz",
        "country": "Germany",
        "latitude": 50.36511023847094,
        "longitude": 7.615033947273454,
        "capacity": 1000
    },
    {
        "id": "flughafen-tempelhof",
        "name": "Flughafen Tempelhof",
        "city": "Berlin",
        "country": "Germany",
        "latitude": 52.48278099752736,
        "longitude": 13.38925762757182,
        "capacity": 60000
    },
    {
        "id": "flugplatz-ballenstedt",
        "name": "Flugplatz Ballenstedt",
        "city": "Ballenstedt",
        "country": "Germany",
        "latitude": 51.75,
        "longitude": 11.2333,
        "capacity": 25000
    },
    {
        "id": "flugplatz-hildesheim",
        "name": "Flugplatz Hildesheim",
        "city": "Hildesheim",
        "country": "Germany",
        "latitude": 52.1833,
        "longitude": 9.95,
        "capacity": 25000
    },
    {
        "id": "fredenbaumpark-dortmund",
        "name": "Fredenbaumpark",
        "city": "Dortmund",
        "country": "Germany",
        "latitude": 51.5333,
        "longitude": 7.4667,
        "capacity": 5000
    },
    {
        "id": "fuehlinger-see-koeln",
        "name": "Fühlinger See",
        "city": "Köln",
        "country": "Germany",
        "latitude": 51.0167,
        "longitude": 6.9167,
        "capacity": null
    },
    {
        "id": "grugahalle",
        "name": "Grugahalle",
        "city": "Essen",
        "country": "Germany",
        "latitude": 51.4311730838979,
        "longitude": 6.9980911695729064,
        "capacity": 7480
    },
    {
        "id": "gruenspan-hamburg",
        "name": "Grünspan",
        "city": "Hamburg",
        "country": "Germany",
        "latitude": 53.5511,
        "longitude": 9.9937,
        "capacity": 950
    },
    {
        "id": "halle-02-heidelberg",
        "name": "Halle 02",
        "city": "Heidelberg",
        "country": "Germany",
        "latitude": 49.3988,
        "longitude": 8.6724,
        "capacity": 1500
    },
    {
        "id": "hanns-martin-schleyer-halle-stuttgart",
        "name": "Hanns-Martin-Schleyer-Halle",
        "city": "Stuttgart",
        "country": "Germany",
        "latitude": 48.7996,
        "longitude": 9.2372,
        "capacity": 15500
    },
    {
        "id": "haus-auensee-leipzig",
        "name": "Haus Auensee",
        "city": "Leipzig",
        "country": "Germany",
        "latitude": 51.3397,
        "longitude": 12.3731,
        "capacity": 3600
    },
    {
        "id": "hessenhalle-alsfeld",
        "name": "Hessenhalle",
        "city": "Alsfeld",
        "country": "Germany",
        "latitude": 50.75,
        "longitude": 9.2667,
        "capacity": 3000
    },
    {
        "id": "hessenhallen-giessen",
        "name": "Hessenhallen",
        "city": "Gießen",
        "country": "Germany",
        "latitude": 50.5836,
        "longitude": 8.6742,
        "capacity": 2000
    },
    {
        "id": "historische-stadthalle-wuppertal",
        "name": "Historische Stadthalle",
        "city": "Wuppertal",
        "country": "Germany",
        "latitude": 51.2562,
        "longitude": 7.1508,
        "capacity": 1800
    },
    {
        "id": "hugenottenhalle-neu-isenburg",
        "name": "Hugenottenhalle",
        "city": "Neu Isenburg",
        "country": "Germany",
        "latitude": 50.0478,
        "longitude": 8.7017,
        "capacity": 1800
    },
    {
        "id": "jahrhunderthalle-frankfurt",
        "name": "Jahrhunderthalle",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.0833,
        "longitude": 8.6833,
        "capacity": 5000
    },
    {
        "id": "jazzhaus",
        "name": "Jazzhaus",
        "city": "Freiburg",
        "country": "Germany",
        "latitude": 47.99495672462254,
        "longitude": 7.8405230846233,
        "capacity": 400
    },
    {
        "id": "karolinenplatz-darmstadt",
        "name": "Karolinenplatz",
        "city": "Darmstadt",
        "country": "Germany",
        "latitude": 49.8728,
        "longitude": 8.6512,
        "capacity": 100000
    },
    {
        "id": "kurfuerstliches-schloss-mainz",
        "name": "Kurfürstliches Schloss",
        "city": "Mainz",
        "country": "Germany",
        "latitude": 49.9929,
        "longitude": 8.2473,
        "capacity": 600
    },
    {
        "id": "kuz-mainz",
        "name": "KUZ",
        "city": "Mainz",
        "country": "Germany",
        "latitude": 49.9929,
        "longitude": 8.2473,
        "capacity": 1000
    },
    {
        "id": "lka-longhorn",
        "name": "LKA Longhorn",
        "city": "Stuttgart",
        "country": "Germany",
        "latitude": 48.76746260473925,
        "longitude": 9.251666698318823,
        "capacity": 1500
    },
    {
        "id": "loreley-freilichtbhne",
        "name": "Loreley Freilichtbühne",
        "city": "St. Goarshausen",
        "country": "Germany",
        "latitude": 50.142589065399065,
        "longitude": 7.731245469369651,
        "capacity": 15000
    },
    {
        "id": "loewensaal-nuernberg",
        "name": "Löwensaal",
        "city": "Nürnberg",
        "country": "Germany",
        "latitude": 49.4521,
        "longitude": 11.0767,
        "capacity": 1500
    },
    {
        "id": "maimarktgelaende-mannheim",
        "name": "Maimarktgelände",
        "city": "Mannheim",
        "country": "Germany",
        "latitude": 49.4875,
        "longitude": 8.466,
        "capacity": 28000
    },
    {
        "id": "metropolishalle-potsdam",
        "name": "Metropolishalle",
        "city": "Potsdam",
        "country": "Germany",
        "latitude": 52.3906,
        "longitude": 13.0645,
        "capacity": 2000
    },
    {
        "id": "mitsubishi-electric-halle-duesseldorf",
        "name": "Mitsubishi Electric Halle",
        "city": "Düsseldorf",
        "country": "Germany",
        "latitude": 51.2277,
        "longitude": 6.7735,
        "capacity": 5450
    },
    {
        "id": "nachtleben-frankfurt",
        "name": "Nachtleben",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 280
    },
    {
        "id": "olympiastadion-muenchen",
        "name": "Olympiastadion",
        "city": "München",
        "country": "Germany",
        "latitude": 48.1741,
        "longitude": 11.5501,
        "capacity": 77000
    },
    {
        "id": "palladium",
        "name": "Palladium",
        "city": "Köln",
        "country": "Germany",
        "latitude": 50.96935694209163,
        "longitude": 7.016978469382453,
        "capacity": 4000
    },
    {
        "id": "posthalle-wuerzburg",
        "name": "Posthalle",
        "city": "Würzburg",
        "country": "Germany",
        "latitude": 49.7913,
        "longitude": 9.9534,
        "capacity": 2100
    },
    {
        "id": "rheingoldhalle-mainz",
        "name": "Rheingoldhalle",
        "city": "Mainz",
        "country": "Germany",
        "latitude": 49.9929,
        "longitude": 8.2473,
        "capacity": 1260
    },
    {
        "id": "rosengarten",
        "name": "Rosengarten",
        "city": "Mannheim",
        "country": "Germany",
        "latitude": 49.48558435930464,
        "longitude": 8.477337940496607,
        "capacity": 1367
    },
    {
        "id": "rudolf-weber-arena-oberhausen",
        "name": "Rudolf-Weber-Arena",
        "city": "Oberhausen",
        "country": "Germany",
        "latitude": 51.4969,
        "longitude": 6.8583,
        "capacity": 13000
    },
    {
        "id": "schlossgarten-karlsruhe",
        "name": "Schlossgarten",
        "city": "Karlsruhe",
        "country": "Germany",
        "latitude": 49.0134,
        "longitude": 8.4044,
        "capacity": null,
        "configurations": {
            "HockRock": 3000
        }
    },
    {
        "id": "schlosshof-fulda",
        "name": "Schlosshof Fulda",
        "city": "Fulda",
        "country": "Germany",
        "latitude": 50.5558,
        "longitude": 9.6808,
        "capacity": null
    },
    {
        "id": "schlosspark-rastede",
        "name": "Schlosspark",
        "city": "Rastede",
        "country": "Germany",
        "latitude": 53.25,
        "longitude": 8.2,
        "capacity": 20000
    },
    {
        "id": "sommerfesthalle-otterstadt",
        "name": "Sommerfesthalle",
        "city": "Otterstadt",
        "country": "Germany",
        "latitude": 49.3667,
        "longitude": 8.4333,
        "capacity": 2800
    },
    {
        "id": "st-johannis-kirche-wuerzburg",
        "name": "St. Johannis Kirche",
        "city": "Würzburg",
        "country": "Germany",
        "latitude": 49.7913,
        "longitude": 9.9534,
        "capacity": 800
    },
    {
        "id": "stadthalle-offenbach",
        "name": "Stadthalle",
        "city": "Offenbach",
        "country": "Germany",
        "latitude": 50.08292656780726,
        "longitude": 8.776994708281967,
        "capacity": 4000
    },
    {
        "id": "stadthalle-limburg",
        "name": "Stadthalle",
        "city": "Limburg",
        "country": "Germany",
        "latitude": 50.38711594549639,
        "longitude": 8.062280135700952,
        "capacity": 1000
    },
    {
        "id": "tanzbrunnen-koeln",
        "name": "Tanzbrunnen",
        "city": "Köln",
        "country": "Germany",
        "latitude": 50.9406,
        "longitude": 6.9599,
        "capacity": 12000
    },
    {
        "id": "tunierplatz-luhmuehlen",
        "name": "Tunierplatz Luhmühlen",
        "city": "Luhmühlen",
        "country": "Germany",
        "latitude": 53.3167,
        "longitude": 10.2833,
        "capacity": 25000
    },
    {
        "id": "volkspark-dutzendteich-nuernberg",
        "name": "Volkspark Dutzendteich",
        "city": "Nürnberg",
        "country": "Germany",
        "latitude": 49.4167,
        "longitude": 11.1167,
        "capacity": 1500
    },
    {
        "id": "wacken-open-air",
        "name": "Wacken",
        "city": "Wacken",
        "country": "Germany",
        "latitude": 54.0167,
        "longitude": 9.3833,
        "capacity": 85000
    },
    {
        "id": "waldbuehne-hardt-wuppertal",
        "name": "Waldbühne Hardt",
        "city": "Wuppertal",
        "country": "Germany",
        "latitude": 51.2562,
        "longitude": 7.1508,
        "capacity": 2500
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = venuesData;
}