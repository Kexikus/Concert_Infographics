// Concert venue data - converted from original venue list
const venuesData = [
    {
        "id": "hessenhallen-giessen",
        "name": "Hessenhallen",
        "city": "Gießen",
        "country": "Germany",
        "latitude": 50.5836,
        "longitude": 8.6742,
        "capacity": null
    },
    {
        "id": "centralstation-darmstadt",
        "name": "Centralstation",
        "city": "Darmstadt",
        "country": "Germany",
        "latitude": 49.8728,
        "longitude": 8.6512,
        "capacity": 1200
    },
    {
        "id": "tanzbrunnen-koeln",
        "name": "Tanzbrunnen",
        "city": "Köln",
        "country": "Germany",
        "latitude": 50.9406,
        "longitude": 6.9599,
        "capacity": 10000
    },
    {
        "id": "hugenottenhalle-neu-isenburg",
        "name": "Hugenottenhalle",
        "city": "Neu Isenburg",
        "country": "Germany",
        "latitude": 50.0478,
        "longitude": 8.7017,
        "capacity": null
    },
    {
        "id": "alte-batschkapp-frankfurt",
        "name": "Alte Batschkapp",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 1500
    },
    {
        "id": "jahrhunderthalle-frankfurt",
        "name": "Jahrhunderthalle",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.0833,
        "longitude": 8.6833,
        "capacity": 8000
    },
    {
        "id": "sommerfesthalle-otterstadt",
        "name": "Sommerfesthalle",
        "city": "Otterstadt",
        "country": "Germany",
        "latitude": 49.3667,
        "longitude": 8.4333,
        "capacity": null
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
        "id": "ferienland-crispendorf",
        "name": "Ferienland Crispendorf",
        "city": "Crispendorf",
        "country": "Germany",
        "latitude": 50.6167,
        "longitude": 11.2833,
        "capacity": null
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
        "id": "kuz-mainz",
        "name": "KUZ",
        "city": "Mainz",
        "country": "Germany",
        "latitude": 49.9929,
        "longitude": 8.2473,
        "capacity": null
    },
    {
        "id": "metropolishalle-potsdam",
        "name": "Metropolishalle",
        "city": "Potsdam",
        "country": "Germany",
        "latitude": 52.3906,
        "longitude": 13.0645,
        "capacity": 3500
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
        "id": "haus-auensee-leipzig",
        "name": "Haus Auensee",
        "city": "Leipzig",
        "country": "Germany",
        "latitude": 51.3397,
        "longitude": 12.3731,
        "capacity": 5000
    },
    {
        "id": "posthalle-wuerzburg",
        "name": "Posthalle",
        "city": "Würzburg",
        "country": "Germany",
        "latitude": 49.7913,
        "longitude": 9.9534,
        "capacity": 1500
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
        "id": "karolinenplatz-darmstadt",
        "name": "Karolinenplatz",
        "city": "Darmstadt",
        "country": "Germany",
        "latitude": 49.8728,
        "longitude": 8.6512,
        "capacity": null
    },
    {
        "id": "hessenhalle-alsfeld",
        "name": "Hessenhalle",
        "city": "Alsfeld",
        "country": "Germany",
        "latitude": 50.7500,
        "longitude": 9.2667,
        "capacity": null
    },
    {
        "id": "colos-saal-aschaffenburg",
        "name": "Colos Saal",
        "city": "Aschaffenburg",
        "country": "Germany",
        "latitude": 49.9747,
        "longitude": 9.1467,
        "capacity": 2000
    },
    {
        "id": "historische-stadthalle-wuppertal",
        "name": "Historische Stadthalle",
        "city": "Wuppertal",
        "country": "Germany",
        "latitude": 51.2562,
        "longitude": 7.1508,
        "capacity": 3200
    },
    {
        "id": "alter-schlachthof-wiesbaden",
        "name": "Alter Schlachthof",
        "city": "Wiesbaden",
        "country": "Germany",
        "latitude": 50.0833,
        "longitude": 8.2500,
        "capacity": 1200
    },
    {
        "id": "mitsubishi-electric-halle-duesseldorf",
        "name": "Mitsubishi Electric Halle",
        "city": "Düsseldorf",
        "country": "Germany",
        "latitude": 51.2277,
        "longitude": 6.7735,
        "capacity": 7500
    },
    {
        "id": "burg-wertheim",
        "name": "Burg Wertheim",
        "city": "Wertheim",
        "country": "Germany",
        "latitude": 49.7667,
        "longitude": 9.5167,
        "capacity": null
    },
    {
        "id": "schlossgarten-karlsruhe",
        "name": "Schlossgarten",
        "city": "Karlsruhe",
        "country": "Germany",
        "latitude": 49.0134,
        "longitude": 8.4044,
        "capacity": null
    },
    {
        "id": "domgarten-speyer",
        "name": "Domgarten",
        "city": "Speyer",
        "country": "Germany",
        "latitude": 49.3167,
        "longitude": 8.4333,
        "capacity": null
    },
    {
        "id": "halle-02-heidelberg",
        "name": "Halle 02",
        "city": "Heidelberg",
        "country": "Germany",
        "latitude": 49.3988,
        "longitude": 8.6724,
        "capacity": 3000
    },
    {
        "id": "st-johannis-kirche-wuerzburg",
        "name": "St. Johannis Kirche",
        "city": "Würzburg",
        "country": "Germany",
        "latitude": 49.7913,
        "longitude": 9.9534,
        "capacity": null
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
        "id": "waldbuehne-hardt-wuppertal",
        "name": "Waldbühne Hardt",
        "city": "Wuppertal",
        "country": "Germany",
        "latitude": 51.2562,
        "longitude": 7.1508,
        "capacity": null
    },
    {
        "id": "festhalle-frankfurt",
        "name": "Festhalle",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 13500
    },
    {
        "id": "schlosspark-rastede",
        "name": "Schlosspark",
        "city": "Rastede",
        "country": "Germany",
        "latitude": 53.2500,
        "longitude": 8.2000,
        "capacity": null
    },
    {
        "id": "deutsche-bank-park-frankfurt",
        "name": "Deutsche Bank Park",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.0686,
        "longitude": 8.6454,
        "capacity": 51500
    },
    {
        "id": "flugplatz-hildesheim",
        "name": "Flugplatz Hildesheim",
        "city": "Hildesheim",
        "country": "Germany",
        "latitude": 52.1833,
        "longitude": 9.9500,
        "capacity": null
    },
    {
        "id": "amphitheater-hanau",
        "name": "Amphitheater",
        "city": "Hanau",
        "country": "Germany",
        "latitude": 50.1333,
        "longitude": 8.9167,
        "capacity": null
    },
    {
        "id": "fredenbaumpark-dortmund",
        "name": "Fredenbaumpark",
        "city": "Dortmund",
        "country": "Germany",
        "latitude": 51.5333,
        "longitude": 7.4667,
        "capacity": null
    },
    {
        "id": "loewensaal-nuernberg",
        "name": "Löwensaal",
        "city": "Nürnberg",
        "country": "Germany",
        "latitude": 49.4521,
        "longitude": 11.0767,
        "capacity": 1400
    },
    {
        "id": "volkspark-dutzendteich-nuernberg",
        "name": "Volkspark Dutzendteich",
        "city": "Nürnberg",
        "country": "Germany",
        "latitude": 49.4167,
        "longitude": 11.1167,
        "capacity": null
    },
    {
        "id": "festplatz-finsterloh-wetzlar",
        "name": "Festplatz Finsterloh",
        "city": "Wetzlar",
        "country": "Germany",
        "latitude": 50.5500,
        "longitude": 8.5000,
        "capacity": null
    },
    {
        "id": "kurfuerstliches-schloss-mainz",
        "name": "Kurfürstliches Schloss",
        "city": "Mainz",
        "country": "Germany",
        "latitude": 49.9929,
        "longitude": 8.2473,
        "capacity": null
    },
    {
        "id": "cannstatter-wasen-stuttgart",
        "name": "Cannstatter Wasen",
        "city": "Stuttgart",
        "country": "Germany",
        "latitude": 48.7996,
        "longitude": 9.2372,
        "capacity": 60000
    },
    {
        "id": "burg-abenberg",
        "name": "Burg Abenberg",
        "city": "Abenberg",
        "country": "Germany",
        "latitude": 49.2500,
        "longitude": 10.9667,
        "capacity": null
    },
    {
        "id": "flugplatz-ballenstedt",
        "name": "Flugplatz Ballenstedt",
        "city": "Ballenstedt",
        "country": "Germany",
        "latitude": 51.7500,
        "longitude": 11.2333,
        "capacity": null
    },
    {
        "id": "burg-frankenstein-muehltal",
        "name": "Burg Frankenstein",
        "city": "Mühltal",
        "country": "Germany",
        "latitude": 49.7833,
        "longitude": 8.6667,
        "capacity": null
    },
    {
        "id": "carlswerk-koeln",
        "name": "Carlswerk",
        "city": "Köln",
        "country": "Germany",
        "latitude": 50.9375,
        "longitude": 6.9583,
        "capacity": 2000
    },
    {
        "id": "festplatz-altengronau",
        "name": "Festplatz Altengronau",
        "city": "Altengronau",
        "country": "Germany",
        "latitude": 50.2833,
        "longitude": 9.5167,
        "capacity": null
    },
    {
        "id": "maimarktgelaende-mannheim",
        "name": "Maimarktgelände",
        "city": "Mannheim",
        "country": "Germany",
        "latitude": 49.4875,
        "longitude": 8.4660,
        "capacity": null
    },
    {
        "id": "amphitheater-gelsenkirchen",
        "name": "Amphitheater Gelsenkirchen",
        "city": "Gelsenkirchen",
        "country": "Germany",
        "latitude": 51.5167,
        "longitude": 7.0833,
        "capacity": 13000
    },
    {
        "id": "nachtleben-frankfurt",
        "name": "Nachtleben",
        "city": "Frankfurt",
        "country": "Germany",
        "latitude": 50.1109,
        "longitude": 8.6821,
        "capacity": 1000
    },
    {
        "id": "rheingoldhalle-mainz",
        "name": "Rheingoldhalle",
        "city": "Mainz",
        "country": "Germany",
        "latitude": 49.9929,
        "longitude": 8.2473,
        "capacity": 4500
    },
    {
        "id": "olympiastadion-muenchen",
        "name": "Olympiastadion",
        "city": "München",
        "country": "Germany",
        "latitude": 48.1741,
        "longitude": 11.5501,
        "capacity": 69250
    },
    {
        "id": "tunierplatz-luhmuehlen",
        "name": "Tunierplatz Luhmühlen",
        "city": "Luhmühlen",
        "country": "Germany",
        "latitude": 53.3167,
        "longitude": 10.2833,
        "capacity": null
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
        "id": "gruenspan-hamburg",
        "name": "Grünspan",
        "city": "Hamburg",
        "country": "Germany",
        "latitude": 53.5511,
        "longitude": 9.9937,
        "capacity": 1200
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
        "id": "hanns-martin-schleyer-halle-stuttgart",
        "name": "Hanns-Martin-Schleyer-Halle",
        "city": "Stuttgart",
        "country": "Germany",
        "latitude": 48.7996,
        "longitude": 9.2372,
        "capacity": 15500
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = venuesData;
}