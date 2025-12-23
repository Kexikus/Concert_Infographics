// Concert data - converted from original event list
const concertsData = [
    {
        "id": "eisheilige-nacht-2025",
        "name": "Eisheilige Nacht 2025",
        "date": "2025-12-20",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "schandmaul",
            "kupfergold",
            "haggefugg"
        ],
        "venueId": "buderus-arena",
        "price": 61.85,
        "logo": "EHN2025.png",
        "notes": null
    },
    {
        "id": "25-jahre-masters-of-chant",
        "name": "25 Jahre Masters of Chant",
        "date": "2025-11-28",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "gregorian"
        ],
        "venueId": "stadthalle-limburg",
        "price": 85.75,
        "logo": "Gregorian25.png",
        "notes": null
    },
    {
        "id": "tanzneid-world-tour",
        "name": "Tanzneid World Tour",
        "date": "2025-11-27",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "electric-callboy",
            "bury-tomorrow",
            "wargasm"
        ],
        "venueId": "festhalle-frankfurt",
        "price": 77.6,
        "logo": "TanzneidTour.png",
        "notes": null
    },
    {
        "id": "the-legendary-tour",
        "name": "The Legendary Tour",
        "date": "2025-11-25",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "sabaton",
            "the-legendary-orchestra"
        ],
        "venueId": "festhalle-frankfurt",
        "price": 87.4,
        "logo": "LegendaryTour.png",
        "notes": null
    },
    {
        "id": "live-rakkatakka-2025",
        "name": "Live Rakkatakka 2025",
        "date": "2025-11-09",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "van-canto",
            "metal-mind"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "price": 33.7,
        "logo": "LiveRakkatakka2025.png",
        "notes": null
    },
    {
        "id": "weltenwanderer-tour-2025",
        "name": "Weltenwanderer Tour 2025",
        "date": "2025-11-08",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "bad-loverz"
        ],
        "venueId": "jahrhunderthalle-frankfurt",
        "price": 67.49,
        "logo": "Weltenwanderer.png",
        "notes": null
    },
    {
        "id": "darkness-tour-2025",
        "name": "Darkness Tour 2025",
        "date": "2025-10-30",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "mono-inc",
            "soulbound",
            "alienare"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "price": 52.55,
        "logo": "Darkness2025.png",
        "notes": null
    },
    {
        "id": "the-greatest-of-all-tours-worldwide",
        "name": "The Greatest of All Tours Worldwide",
        "date": "2025-10-08",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "volbeat",
            "bush",
            "witch-fever"
        ],
        "venueId": "festhalle-frankfurt",
        "price": 106.5,
        "logo": "GreatestOfAllTours.png",
        "notes": null
    },
    {
        "id": "lords-of-fyre",
        "name": "Lords of Fyre",
        "date": "2025-10-04",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "feuerschwanz",
            "lord-of-the-lost",
            "the-dark-side-of-the-moon"
        ],
        "venueId": "stadthalle-offenbach",
        "price": 66.66,
        "logo": "LordsOfFyre.png",
        "notes": null
    },
    {
        "id": "30-jahre-das-jubilumsfestival",
        "name": "30 Jahre - Das Jubiläumsfestival",
        "date": "2025-09-04",
        "endDate": "2025-09-06",
        "type": "festival",
        "artistIds": [
            "in-extremo",
            "asp",
            "eisbrecher",
            "feuerschwanz",
            "versengold",
            "faun",
            "wind-rose",
            "schandmaul",
            "tanzwut",
            "rauhbein",
            "fabula"
        ],
        "venueId": "loreley-freilichtbhne",
        "price": 179.3,
        "logo": "30JahreInExtremo.png",
        "notes": null
    },
    {
        "id": "burgentour-finsterwacht-2025",
        "name": "Burgentour Finsterwacht 2025",
        "date": "2025-08-30",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "tabernis"
        ],
        "venueId": "festung-ehrenbreitstein",
        "price": 67.5,
        "logo": "Finsterwacht2025.png",
        "notes": null
    },
    {
        "id": "mps-speyer-2025",
        "name": "MPS Speyer 2025",
        "date": "2025-08-23",
        "endDate": "2025-08-23",
        "type": "festival",
        "artistIds": [
            "versengold",
            "subway-to-sally",
            "mr-hurley-und-die-pulveraffen"
        ],
        "venueId": "domgarten-speyer",
        "price": 69,
        "logo": "MPS2025Speyer.png",
        "notes": null
    },
    {
        "id": "summer-of-the-wicked-tour-2025",
        "name": "Summer of the Wicked Tour 2025",
        "date": "2025-07-11",
        "endDate": null,
        "type": "festival",
        "artistIds": [
            "powerwolf",
            "warkings",
            "james-boyle"
        ],
        "venueId": "e-werk-open-air-gelnde",
        "price": 67.5,
        "logo": "SummerOfTheWicked2025.png",
        "notes": null
    },
    {
        "id": "dunkelromantische-mainchte",
        "name": "Dunkelromantische Mainächte",
        "date": "2025-05-30",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "asp"
        ],
        "venueId": "rosengarten",
        "price": 67.59,
        "logo": "DunkelromantischeMainaechte.png",
        "notes": null
    },
    {
        "id": "post-mortem-tour",
        "name": "Post Mortem Tour",
        "date": "2025-04-26",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "serenity",
            "brunhilde"
        ],
        "venueId": "essigfabrik",
        "price": 47.45,
        "logo": "PostMortem.png",
        "notes": null
    },
    {
        "id": "keep-me-fed-world-tour-2025",
        "name": "Keep Me Fed World Tour 2025",
        "date": "2025-04-15",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "the-warning",
            "still-talk"
        ],
        "venueId": "palladium",
        "price": 43,
        "logo": "KeepMeFed.png",
        "notes": null
    },
    {
        "id": "nacht-der-balladen-2025",
        "name": "Nacht der Balladen 2025",
        "date": "2025-03-30",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "versengold"
        ],
        "venueId": "rheingoldhalle-mainz",
        "price": 77.45,
        "logo": "NachtDerBalladen2025.png",
        "notes": null
    },
    {
        "id": "escalation-fest-2025",
        "name": "Escalation Fest 2025",
        "date": "2025-02-01",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "electric-callboy"
        ],
        "venueId": "rudolf-weber-arena-oberhausen",
        "price": 75.1,
        "logo": "EscalationFest2025.png",
        "notes": null
    },
    {
        "id": "20-jahre-fr-euch",
        "name": "20 Jahre für euch",
        "date": "2025-01-24",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "haematom",
            "engst",
            "focus"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 48.2,
        "logo": "20JahreFuerEuch.png",
        "notes": null
    },
    {
        "id": "wolkenschieber-tour",
        "name": "Wolkenschieber Tour",
        "date": "2024-12-28",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "korpiklaani",
            "rauhbein"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "price": 60.9,
        "logo": "Wolkenschieber.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2024",
        "name": "Eisheilige Nacht 2024",
        "date": "2024-12-27",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "the-oreillys-and-the-paddyhats",
            "harpyie"
        ],
        "venueId": "posthalle-wuerzburg",
        "price": 60.2,
        "logo": "EHN2024.png",
        "notes": null
    },
    {
        "id": "20-jahre-feuerschwanz",
        "name": "20 Jahre Feuerschwanz",
        "date": "2024-12-14",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "feuerschwanz",
            "die-apokalyptischen-reiter",
            "illumishade"
        ],
        "venueId": "grugahalle",
        "price": 57.45,
        "logo": "20JahreFeuerschwanz.png",
        "notes": null
    },
    {
        "id": "25-jahre-asp-die-zusammenkunft-3",
        "name": "25 Jahre ASP - Die Zusammenkunft 3",
        "date": "2024-11-01",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "asp",
            "samsas-traum",
            "2-minds-collide"
        ],
        "venueId": "halle-02-heidelberg",
        "price": 42,
        "logo": "DieZusammenkunft3.png",
        "notes": null
    },
    {
        "id": "metal-fight-club-vol-2-live",
        "name": "Metal Fight Club Vol. 2 Live",
        "date": "2024-10-26",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "haematom",
            "versengold"
        ],
        "venueId": "posthalle-wuerzburg",
        "price": 59.85,
        "logo": "MetalFightClub2.png",
        "notes": null
    },
    {
        "id": "omg-die-rzte-lol",
        "name": "OMG die ärzte LOL",
        "date": "2024-08-25",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "die-aerzte",
            "donots",
            "cari-cari"
        ],
        "venueId": "flughafen-tempelhof",
        "price": 82,
        "logo": "OMGDieAerzteLOL.png",
        "notes": null
    },
    {
        "id": "mps-speyer-2024",
        "name": "MPS Speyer 2024",
        "date": "2024-08-24",
        "endDate": "2024-08-24",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "subway-to-sally"
        ],
        "venueId": "domgarten-speyer",
        "price": 68,
        "logo": "MPS2024Speyer.png",
        "notes": null
    },
    {
        "id": "wacken-warm-up",
        "name": "Wacken Warm Up",
        "date": "2024-07-29",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "van-canto",
            "elvellon"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "price": 24.9,
        "logo": null,
        "notes": null
    },
    {
        "id": "burgentour-finsterwacht",
        "name": "Burgentour Finsterwacht",
        "date": "2024-07-20",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "burg-wertheim",
        "price": 57.49,
        "logo": "Finsterwacht.png",
        "notes": null
    },
    {
        "id": "europe-tour-2024",
        "name": "Europe Tour 2024",
        "date": "2024-07-17",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "the-warning",
            "still-talk"
        ],
        "venueId": "jazzhaus",
        "price": 36.4,
        "logo": "TheWarningEurope2024.png",
        "notes": null
    },
    {
        "id": "stadium-tour-2024",
        "name": "Stadium Tour 2024",
        "date": "2024-07-11",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "rammstein",
            "abelard"
        ],
        "venueId": "deutsche-bank-park-frankfurt",
        "price": 147,
        "logo": "StadiumTour2024.png",
        "notes": null
    },
    {
        "id": "mps-rastede-2024",
        "name": "MPS Rastede 2024",
        "date": "2024-05-09",
        "endDate": "2024-05-12",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "feuerschwanz",
            "subway-to-sally",
            "mr-hurley-und-die-pulveraffen",
            "tanzwut",
            "kupfergold",
            "john-kanaka-the-jack-tars"
        ],
        "venueId": "schlosspark-rastede",
        "price": 160,
        "logo": "MPS2024Rastede.png",
        "notes": null
    },
    {
        "id": "15-years-of-lord-of-the-lost",
        "name": "15 Years of Lord of the Lost",
        "date": "2024-04-20",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "lord-of-the-lost",
            "the-raven-age",
            "hell-boulevard"
        ],
        "venueId": "lka-longhorn",
        "price": 42.45,
        "logo": "15YearsOfLotL.png",
        "notes": null
    },
    {
        "id": "lichtermeer-tour",
        "date": "2024-04-19",
        "endDate": null,
        "artistIds": [
            "kupfergold",
            "absolem"
        ],
        "venueId": "nachtleben-frankfurt",
        "type": "concert",
        "name": "Lichtermeer Tour",
        "price": 21.6,
        "logo": "Lichtermeer2024.png",
        "notes": null
    },
    {
        "id": "leuchtturm-tour",
        "date": "2024-03-23",
        "endDate": null,
        "artistIds": [
            "mr-hurley-und-die-pulveraffen",
            "habenichtse"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Leuchtturm Tour",
        "price": 34.7,
        "logo": "Leuchtturm2024.png",
        "notes": null
    },
    {
        "id": "lautes-gedenken-tour",
        "date": "2024-02-29",
        "endDate": null,
        "artistIds": [
            "versengold",
            "reis-against-the-spuelmachine"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Lautes Gedenken Tour",
        "price": 47.45,
        "logo": "LautesGedenken2024.png",
        "notes": null
    },
    {
        "id": "tekkno-tour-2024",
        "name": "Tekkno Tour",
        "date": "2024-02-24",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "electric-callboy",
            "nothing-more",
            "coldrain"
        ],
        "venueId": "hanns-martin-schleyer-halle-stuttgart",
        "price": 64.41,
        "logo": "Tekkno2024.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2023",
        "name": "Eisheilige Nacht 2023",
        "date": "2023-12-16",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "fiddlers-green",
            "manntra"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 49,
        "logo": "EHN2023.png",
        "notes": null
    },
    {
        "id": "disruptour",
        "date": "2023-11-25",
        "endDate": null,
        "artistIds": [
            "fear-factory",
            "butcher-babies",
            "ignea",
            "ghosts-of-atlantis"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "DisrupTour",
        "price": 39.3,
        "logo": "Disruptour.png",
        "notes": null
    },
    {
        "id": "versengold---20-jahre",
        "date": "2023-11-04",
        "endDate": null,
        "artistIds": [
            "versengold",
            "eklipse",
            "macpiet"
        ],
        "venueId": "barclays-arena-hamburg",
        "type": "concert",
        "name": "Versengold - 20 Jahre",
        "price": 105.45,
        "logo": "20JahreVersengold.png",
        "notes": null
    },
    {
        "id": "warm-up-wunschkonzert",
        "date": "2023-11-03",
        "endDate": null,
        "artistIds": [
            "versengold"
        ],
        "venueId": "gruenspan-hamburg",
        "type": "concert",
        "name": "Warm-Up Wunschkonzert",
        "price": null,
        "logo": "WarmUpKonzert.png",
        "notes": null
    },
    {
        "id": "escalation-fest-2023",
        "date": "2023-09-23",
        "endDate": "2023-09-23",
        "artistIds": [
            "electric-callboy",
            "swiss-die-andern",
            "future-palace"
        ],
        "venueId": "rudolf-weber-arena-oberhausen",
        "type": "concert",
        "name": "Escalation Fest 2023",
        "price": 77.6,
        "logo": "EscalationFest2023.png",
        "notes": null
    },
    {
        "id": "mps-luhmhlen-2023",
        "name": "MPS Luhmühlen 2023",
        "date": "2023-09-01",
        "endDate": "2023-09-03",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "feuerschwanz",
            "versengold",
            "subway-to-sally",
            "fiddlers-green",
            "mr-hurley-und-die-pulveraffen"
        ],
        "venueId": "tunierplatz-luhmuehlen",
        "price": 44,
        "logo": "MPS2023Luhmuehlen.png",
        "notes": null
    },
    {
        "id": "mps-speyer-2023",
        "name": "MPS Speyer 2023",
        "date": "2023-08-26",
        "endDate": "2023-08-27",
        "type": "festival",
        "artistIds": [
            "versengold",
            "subway-to-sally",
            "faun"
        ],
        "venueId": "domgarten-speyer",
        "price": 48,
        "logo": "MPS2023Speyer.png",
        "notes": null
    },
    {
        "id": "blood-glitter-tour",
        "date": "2023-07-31",
        "endDate": null,
        "artistIds": [
            "lord-of-the-lost",
            "setyoursails"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Blood & Glitter Tour",
        "price": 35.25,
        "logo": "BloodAndGlitter.png",
        "notes": null
    },
    {
        "id": "rockharz-festival-2023",
        "date": "2023-07-05",
        "endDate": "2023-07-08",
        "artistIds": [
            "blind-guardian",
            "in-flames",
            "arch-enemy",
            "amon-amarth",
            "mono-inc",
            "feuerschwanz",
            "korpiklaani",
            "saltatio-mortis",
            "lord-of-the-lost",
            "haematom",
            "versengold",
            "knorkator",
            "mr-hurley-und-die-pulveraffen",
            "equilibrium",
            "as-i-lay-dying",
            "fiddlers-green",
            "unzucht",
            "skald",
            "the-dark-side-of-the-moon",
            "bloodbound",
            "firkin",
            "rauhbein",
            "wind-rose",
            "ohrenfeindt"
        ],
        "venueId": "flugplatz-ballenstedt",
        "type": "festival",
        "name": "Rockharz Festival 2023",
        "price": 154.8,
        "logo": "Rockharz2023.png",
        "notes": null
    },
    {
        "id": "an-evening-with-nightwish",
        "date": "2023-06-12",
        "endDate": null,
        "artistIds": [
            "nightwish",
            "bloodred-hourglass"
        ],
        "venueId": "amphitheater-gelsenkirchen",
        "type": "concert",
        "name": "An Evening with Nightwish",
        "price": 82.35,
        "logo": "AnEveningWithNightwish.png",
        "notes": null
    },
    {
        "id": "stadium-tour-2023",
        "date": "2023-06-11",
        "endDate": null,
        "artistIds": [
            "rammstein",
            "abelard"
        ],
        "venueId": "olympiastadion-muenchen",
        "type": "concert",
        "name": "Stadium Tour 2023",
        "price": 145.35,
        "logo": "StadiumTour2023.png",
        "notes": null
    },
    {
        "id": "mps-rastede-2023",
        "name": "MPS Rastede 2023",
        "date": "2023-05-18",
        "endDate": "2023-05-21",
        "type": "festival",
        "artistIds": [
            "harmony-glen",
            "john-kanaka-the-jack-tars",
            "tir-saor"
        ],
        "venueId": "schlosspark-rastede",
        "price": 100,
        "logo": "MPS2023Rastede.png",
        "notes": null
    },
    {
        "id": "himmelfahrt-tour",
        "date": "2023-05-10",
        "endDate": null,
        "artistIds": [
            "subway-to-sally",
            "blitz-union"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Himmelfahrt Tour",
        "price": 37,
        "logo": "Himmelfahrt.png",
        "notes": null
    },
    {
        "id": "day-of-destiny-tour",
        "date": "2023-05-04",
        "endDate": null,
        "artistIds": [
            "skillet",
            "like-a-storm",
            "eva-under-fire"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "type": "concert",
        "name": "Day of Destiny Tour",
        "price": 54,
        "logo": "DayOfDestiny.png",
        "notes": null
    },
    {
        "id": "endlich-tour",
        "date": "2023-05-01",
        "endDate": null,
        "artistIds": [
            "asp",
            "leichtmatrose"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "type": "concert",
        "name": "Endlich! Tour",
        "price": 36.5,
        "logo": "Endlich.png",
        "notes": null
    },
    {
        "id": "silberne-hochzeit-tour",
        "date": "2023-04-28",
        "endDate": null,
        "artistIds": [
            "tanzwut",
            "manntra"
        ],
        "venueId": "nachtleben-frankfurt",
        "type": "concert",
        "name": "Silberne Hochzeit Tour",
        "price": 34.15,
        "logo": "SilberneHochzeit.png",
        "notes": null
    },
    {
        "id": "the-tour-to-end-all-tours",
        "date": "2023-04-22",
        "endDate": null,
        "artistIds": [
            "sabaton",
            "baby-metal",
            "lordi"
        ],
        "venueId": "festhalle-frankfurt",
        "type": "concert",
        "name": "The Tour to End All Tours",
        "price": 67.3,
        "logo": "TourToEndAllTours.png",
        "notes": null
    },
    {
        "id": "tekkno-tour",
        "date": "2023-04-21",
        "endDate": null,
        "artistIds": [
            "electric-callboy",
            "blind-channel",
            "future-palace"
        ],
        "venueId": "festhalle-frankfurt",
        "type": "concert",
        "name": "Tekkno Tour",
        "price": 60.67,
        "logo": "Tekkno2023.png",
        "notes": null
    },
    {
        "id": "memento-mori-tour",
        "date": "2023-04-20",
        "endDate": null,
        "artistIds": [
            "feuerschwanz",
            "warkings",
            "angus-mcsix"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Memento Mori Tour",
        "price": 37.5,
        "logo": "MementoMori.png",
        "notes": null
    },
    {
        "id": "superpower-tour",
        "date": "2023-04-01",
        "endDate": null,
        "artistIds": [
            "grailknights",
            "victorious",
            "terra-atlantica"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Superpower Tour",
        "price": 21.2,
        "logo": "Superpower2023.png",
        "notes": null
    },
    {
        "id": "nacht-der-balladen-2023",
        "date": "2023-03-19",
        "endDate": null,
        "artistIds": [
            "versengold"
        ],
        "venueId": "rheingoldhalle-mainz",
        "type": "concert",
        "name": "Nacht der Balladen 2023",
        "price": 57.45,
        "logo": "NachtDerBalladen2023.png",
        "notes": null
    },
    {
        "id": "sieg-der-vernunft",
        "date": "2023-03-16",
        "endDate": null,
        "artistIds": [
            "knorkator"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Sieg der Vernunft Tour",
        "price": 32.15,
        "logo": "SiegDerVernunft.png",
        "notes": null
    },
    {
        "id": "titanium-tour",
        "date": "2023-03-11",
        "endDate": null,
        "artistIds": [
            "vogelfrey",
            "incordia"
        ],
        "venueId": "nachtleben-frankfurt",
        "type": "concert",
        "name": "Titanium Tour",
        "price": 28.2,
        "logo": "Titanium.png",
        "notes": null
    },
    {
        "id": "dark-connection-tour",
        "date": "2023-02-28",
        "endDate": null,
        "artistIds": [
            "beast-in-black",
            "firewind"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Dark Connection Tour",
        "price": 43.65,
        "logo": "DarkConnection.png",
        "notes": null
    },
    {
        "id": "kompass-zur-sonne-tour",
        "date": "2022-12-21",
        "endDate": null,
        "artistIds": [
            "in-extremo",
            "russkaja"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "type": "concert",
        "name": "Kompass zur Sonne Tour",
        "price": 50,
        "logo": "KompassZurSonne.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2022",
        "name": "Eisheilige Nacht 2022",
        "date": "2022-12-17",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "mr-hurley-und-die-pulveraffen",
            "tanzwut",
            "mr-irish-bastard"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 44,
        "logo": "EHN2022.png",
        "notes": null
    },
    {
        "id": "phantastischer-lichterweihnachtsmarkt-2022",
        "name": "Phantastischer Lichterweihnachtsmarkt 2022",
        "date": "2022-12-10",
        "endDate": "2022-12-10",
        "type": "festival",
        "artistIds": [
            "feuerschwanz",
            "storm-seeker"
        ],
        "venueId": "fredenbaumpark-dortmund",
        "price": 12,
        "logo": "PLWM2022.png",
        "notes": null
    },
    {
        "id": "human-nature-tour",
        "date": "2022-12-09",
        "endDate": null,
        "artistIds": [
            "nightwish",
            "beast-in-black",
            "turmion-katilot"
        ],
        "venueId": "festhalle-frankfurt",
        "type": "concert",
        "name": "Human :||: Nature Tour",
        "price": 71.3,
        "logo": "HumanNature.png",
        "notes": null
    },
    {
        "id": "wolfsnächte-2022",
        "date": "2022-11-25",
        "endDate": null,
        "artistIds": [
            "powerwolf",
            "dragonforce",
            "warkings"
        ],
        "venueId": "jahrhunderthalle-frankfurt",
        "type": "concert",
        "name": "Wolfsnächte 2022",
        "price": 53,
        "logo": "Wolfsnaechte2022.png",
        "notes": null
    },
    {
        "id": "für-immer-frei-tour",
        "date": "2022-11-11",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis",
            "antiheld"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "type": "concert",
        "name": "Für immer Frei Tour",
        "price": 37.9,
        "logo": "FuerImmerFrei.png",
        "notes": null
    },
    {
        "id": "homecoming-tour",
        "date": "2022-10-20",
        "endDate": null,
        "artistIds": [
            "lord-of-the-lost",
            "nachtblut"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Homecoming Tour",
        "price": 36.75,
        "logo": "HomecomingTour.png",
        "notes": null
    },
    {
        "id": "was-kost-die-welt-tour",
        "date": "2022-10-13",
        "endDate": null,
        "artistIds": [
            "versengold",
            "von-grambusch"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Was Kost Die Welt Tour",
        "price": 40.85,
        "logo": "WasKostDieWelt.png",
        "notes": null
    },
    {
        "id": "hey-tour-2022",
        "name": "Hey! Tour",
        "date": "2022-10-09",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "price": 28,
        "logo": "Hey2022.png",
        "notes": null
    },
    {
        "id": "xsmx",
        "date": "2022-09-24",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "amphitheater-gelsenkirchen",
        "type": "concert",
        "name": "XSMX",
        "price": 47.5,
        "logo": "XSMX.png",
        "notes": null
    },
    {
        "id": "buffalo-bill-in-rom-tour",
        "date": "2022-09-11",
        "endDate": null,
        "artistIds": [
            "die-aerzte",
            "drangsal",
            "luet"
        ],
        "venueId": "maimarktgelaende-mannheim",
        "type": "concert",
        "name": "Buffalo Bill in Rom Tour",
        "price": 70,
        "logo": "BuffaloBillInRom.png",
        "notes": null
    },
    {
        "id": "sinner-rock-2022",
        "date": "2022-09-09",
        "endDate": "2022-09-10",
        "artistIds": [
            "subway-to-sally"
        ],
        "venueId": "festplatz-altengronau",
        "type": "festival",
        "name": "Sinner Rock 2022",
        "price": 45,
        "logo": "SinnerRock2022.png",
        "notes": null
    },
    {
        "id": "metfest-2022",
        "date": "2022-08-06",
        "endDate": null,
        "artistIds": [
            "feuerschwanz",
            "wind-rose",
            "grailknights"
        ],
        "venueId": "carlswerk-koeln",
        "type": "concert",
        "name": "Metfest 2022",
        "price": 55.5,
        "logo": "Metfest2022.png",
        "notes": null
    },
    {
        "id": "legacy-of-the-beast-tour",
        "date": "2022-07-26",
        "endDate": null,
        "artistIds": [
            "iron-maiden",
            "powerwolf",
            "airbourne"
        ],
        "venueId": "deutsche-bank-park-frankfurt",
        "type": "concert",
        "name": "Legacy of the Beast Tour",
        "price": 91.25,
        "logo": "LegacyOfTheBeast.png",
        "notes": null
    },
    {
        "id": "the-book-of-fire-2022",
        "date": "2022-07-22",
        "endDate": null,
        "artistIds": [
            "mono-inc"
        ],
        "venueId": "burg-frankenstein-muehltal",
        "type": "concert",
        "name": "The Book of Fire Tour 2022",
        "price": 36,
        "logo": "TheBookOfFire.png",
        "notes": null
    },
    {
        "id": "sommernächte-2022",
        "date": "2022-07-15",
        "endDate": null,
        "artistIds": [
            "versengold",
            "delva"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Sommernächte 2022",
        "price": 29.7,
        "logo": "Nordlicht2022.png",
        "notes": null
    },
    {
        "id": "rockharz-festival-2022",
        "date": "2022-07-06",
        "endDate": "2022-07-09",
        "artistIds": [
            "powerwolf",
            "in-extremo",
            "eisbrecher",
            "steel-panther",
            "tarja",
            "subway-to-sally",
            "asp",
            "sepultura",
            "beast-in-black",
            "knorkator",
            "betontod",
            "ost-front",
            "knasterbart",
            "der-schulz",
            "paddy-and-the-rats",
            "ad-infinitum",
            "april-art"
        ],
        "venueId": "flugplatz-ballenstedt",
        "type": "festival",
        "name": "Rockharz Festival 2022",
        "price": 127.8,
        "logo": "Rockharz2022.png",
        "notes": null
    },
    {
        "id": "feuertanz-festival-2022",
        "date": "2022-06-24",
        "endDate": "2022-06-25",
        "artistIds": [
            "schandmaul",
            "fiddlers-green",
            "tanzwut",
            "draco-faucium"
        ],
        "venueId": "burg-abenberg",
        "type": "festival",
        "name": "Feuertanz Festival 2022",
        "price": 80,
        "logo": "Feuertanz2022.png",
        "notes": null
    },
    {
        "id": "stadium-tour-2022",
        "date": "2022-06-10",
        "endDate": null,
        "artistIds": [
            "rammstein",
            "duo-jatekok"
        ],
        "venueId": "cannstatter-wasen-stuttgart",
        "type": "concert",
        "name": "Stadium Tour 2022",
        "price": 98.58,
        "logo": "StadiumTour2022.png",
        "notes": null
    },
    {
        "id": "mps-rastede-2022",
        "name": "MPS Rastede 2022",
        "date": "2022-05-28",
        "endDate": "2022-05-31",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "mr-hurley-und-die-pulveraffen",
            "schandmaul",
            "fiddlers-green",
            "dartagnan",
            "harmony-glen",
            "john-kanaka-the-jack-tars",
            "tir-saor"
        ],
        "venueId": "schlosspark-rastede",
        "price": 105,
        "logo": "MPS2022Rastede.png",
        "notes": null
    },
    {
        "id": "nacht-der-balladen-2022",
        "date": "2022-04-23",
        "endDate": null,
        "artistIds": [
            "versengold"
        ],
        "venueId": "kurfuerstliches-schloss-mainz",
        "type": "concert",
        "name": "Nacht der Balladen 2022",
        "price": 47.75,
        "logo": "NachtDerBalladen2022.png",
        "notes": null
    },
    {
        "id": "hock-rock",
        "name": "Hock Rock",
        "date": "2021-09-17",
        "endDate": "2021-09-19",
        "type": "festival",
        "artistIds": [
            "fiddlers-green",
            "saltatio-mortis",
            "versengold",
            "mr-hurley-und-die-pulveraffen"
        ],
        "venueId": "schlossgarten-karlsruhe:HockRock",
        "price": 156,
        "logo": "HockRock.png",
        "notes": null
    },
    {
        "id": "strandkorb-open-air",
        "date": "2021-09-02",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "festplatz-finsterloh-wetzlar",
        "type": "concert",
        "name": "Strandkorb Open Air",
        "price": 47.5,
        "logo": "StrandkorbOpenAir.png",
        "notes": null
    },
    {
        "id": "strandkorb-metfest",
        "date": "2021-07-17",
        "endDate": null,
        "artistIds": [
            "feuerschwanz",
            "russkaja",
            "grailknights"
        ],
        "venueId": "volkspark-dutzendteich-nuernberg",
        "type": "concert",
        "name": "Strandkorb Metfest",
        "price": 49,
        "logo": "StrandkorbMetfest.png",
        "notes": null
    },
    {
        "id": "pumping-iron-power-tour-2020",
        "name": "Pumping Iron Power Tour",
        "date": "2020-02-07",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "grailknights"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "price": 15,
        "logo": "PumpingIronPower2020.png",
        "notes": null
    },
    {
        "id": "the-great-tour",
        "date": "2020-01-31",
        "endDate": null,
        "artistIds": [
            "sabaton",
            "apocalyptica",
            "amaranthe"
        ],
        "venueId": "festhalle-frankfurt",
        "type": "concert",
        "name": "The Great Tour",
        "price": 61.95,
        "logo": "TheGreatTour.png",
        "notes": null
    },
    {
        "id": "kosmonautilus-tour",
        "date": "2020-01-25",
        "endDate": null,
        "artistIds": [
            "asp",
            "2-minds-collide"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "type": "concert",
        "name": "Kosmonautilus Tour",
        "price": 32.4,
        "logo": "Kosmonautilus.png",
        "notes": null
    },
    {
        "id": "metfest-2019",
        "date": "2019-12-28",
        "endDate": null,
        "artistIds": [
            "feuerschwanz",
            "the-oreillys-and-the-paddyhats",
            "grailknights"
        ],
        "venueId": "loewensaal-nuernberg",
        "type": "concert",
        "name": "Metfest 2019",
        "price": 32,
        "logo": "Metfest2019.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2019",
        "name": "Eisheilige Nacht 2019",
        "date": "2019-12-21",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "fiddlers-green",
            "knasterbart",
            "vogelfrey"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 37,
        "logo": "EHN2019.png",
        "notes": null
    },
    {
        "id": "phantastischer-lichterweihnachtsmarkt-2019",
        "name": "Phantastischer Lichterweihnachtsmarkt 2019",
        "date": "2019-11-23",
        "endDate": "2019-11-23",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "fredenbaumpark-dortmund",
        "price": 26,
        "logo": "PLWM2019.png",
        "notes": null
    },
    {
        "id": "nordlicht-tour",
        "date": "2019-10-03",
        "endDate": null,
        "artistIds": [
            "versengold",
            "mr-irish-bastard"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Nordlicht Tour",
        "price": 27.5,
        "logo": "Nordlicht2019.png",
        "notes": null
    },
    {
        "id": "in-castellis-tour-2019",
        "date": "2019-08-30",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis",
            "krayenzeit",
            "das-niveau"
        ],
        "venueId": "burg-wertheim",
        "type": "concert",
        "name": "In Castellis Tour 2019",
        "price": 35,
        "logo": "InCastellis2019.png",
        "notes": null
    },
    {
        "id": "burgentour-2019",
        "date": "2019-08-23",
        "endDate": null,
        "artistIds": [
            "in-extremo",
            "manntra"
        ],
        "venueId": "amphitheater-hanau",
        "type": "concert",
        "name": "Burgentour 2019",
        "price": 46.8,
        "logo": "Burgentour2019.png",
        "notes": null
    },
    {
        "id": "mera-luna-2019",
        "date": "2019-08-10",
        "endDate": "2019-08-11",
        "artistIds": [
            "asp",
            "within-temptation",
            "subway-to-sally",
            "joachim-witt",
            "mono-inc",
            "oomph",
            "corvus-corax",
            "versengold",
            "null-positiv"
        ],
        "venueId": "flugplatz-hildesheim",
        "type": "festival",
        "name": "M'era Luna 2019",
        "price": 109,
        "logo": "MeraLuna2019.png",
        "notes": null
    },
    {
        "id": "mps-kln-2019",
        "name": "MPS Köln 2019",
        "date": "2019-08-03",
        "endDate": "2019-08-04",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "fiddlers-green",
            "john-kanaka-the-jack-tars"
        ],
        "venueId": "fuehlinger-see-koeln",
        "price": 35,
        "logo": "MPS2019Koeln.png",
        "notes": null
    },
    {
        "id": "mps-karlsruhe-2019",
        "name": "MPS Karlsruhe 2019",
        "date": "2019-07-27",
        "endDate": "2019-07-28",
        "type": "festival",
        "artistIds": [
            "versengold",
            "mr-hurley-und-die-pulveraffen"
        ],
        "venueId": "schlossgarten-karlsruhe",
        "price": 25,
        "logo": "MPS2019Karlsruhe.png",
        "notes": null
    },
    {
        "id": "rockin-1000",
        "name": "Rockin' 1000",
        "date": "2019-07-07",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "rockin-1000",
            "gypsys"
        ],
        "venueId": "deutsche-bank-park-frankfurt:Rockin1000",
        "price": 25,
        "logo": "Rockin_1000.png",
        "notes": null
    },
    {
        "id": "mps-rastede-2019",
        "name": "MPS Rastede 2019",
        "date": "2019-05-30",
        "endDate": "2019-06-02",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "fiddlers-green"
        ],
        "venueId": "schlosspark-rastede",
        "price": 50,
        "logo": "MPS2019Rastede.png",
        "notes": null
    },
    {
        "id": "brot-und-spiele-tour-2019",
        "name": "Brot und Spiele Tour",
        "date": "2019-04-11",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "indecent-behavior"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 30,
        "logo": "BrotUndSpiele2019.png",
        "notes": null
    },
    {
        "id": "hey-tour",
        "date": "2019-03-28",
        "endDate": null,
        "artistIds": [
            "subway-to-sally",
            "majorvoice"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Hey! Tour",
        "price": 28,
        "logo": "Hey2019.png",
        "notes": null
    },
    {
        "id": "pumping-iron-power-tour",
        "date": "2019-01-31",
        "endDate": null,
        "artistIds": [
            "grailknights"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Pumping Iron Power Tour",
        "price": 14.4,
        "logo": "PumpingIronPower.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2018",
        "name": "Eisheilige Nacht 2018",
        "date": "2018-12-22",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "versengold",
            "russkaja",
            "paddy-and-the-rats"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 37,
        "logo": "EHN2018.png",
        "notes": null
    },
    {
        "id": "decades-tour",
        "date": "2018-12-05",
        "endDate": null,
        "artistIds": [
            "nightwish",
            "beast-in-black"
        ],
        "venueId": "festhalle-frankfurt",
        "type": "concert",
        "name": "Decades Tour",
        "price": 60.61,
        "logo": "Decades.png",
        "notes": null
    },
    {
        "id": "brot-und-spiele-tour",
        "date": "2018-11-23",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis",
            "firkin"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "type": "concert",
        "name": "Brot und Spiele Tour",
        "price": 30,
        "logo": "BrotUndSpiele2018.png",
        "notes": null
    },
    {
        "id": "tour-number-seven",
        "date": "2018-10-07",
        "endDate": null,
        "artistIds": [
            "van-canto",
            "evertale",
            "moonsun"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Tour Number Seven",
        "price": 28.2,
        "logo": "TourNumberSeven.png",
        "notes": null
    },
    {
        "id": "mps-speyer-2018",
        "name": "MPS Speyer 2018",
        "date": "2018-08-25",
        "endDate": "2018-08-26",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "domgarten-speyer",
        "price": 35,
        "logo": "MPS2018Speyer.png",
        "notes": null
    },
    {
        "id": "feuertal-festival-2018",
        "date": "2018-08-17",
        "endDate": "2018-08-18",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "bannkreis",
            "paddy-and-the-rats",
            "ganaim",
            "incantatem",
            "dunkelschoen"
        ],
        "venueId": "waldbuehne-hardt-wuppertal",
        "type": "festival",
        "name": "Feuertal Festival 2018",
        "price": 78,
        "logo": "Feuertal2018.png",
        "notes": null
    },
    {
        "id": "mps-kln-2018",
        "name": "MPS Köln 2018",
        "date": "2018-08-04",
        "endDate": "2018-08-05",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "fiddlers-green",
            "versengold"
        ],
        "venueId": "fuehlinger-see-koeln",
        "price": 35,
        "logo": "MPS2018Koeln.png",
        "notes": null
    },
    {
        "id": "mps-karlsruhe-2018",
        "name": "MPS Karlsruhe 2018",
        "date": "2018-07-28",
        "endDate": "2018-07-29",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "mr-hurley-und-die-pulveraffen"
        ],
        "venueId": "schlossgarten-karlsruhe",
        "price": 25,
        "logo": "MPS2018Karlsruhe.png",
        "notes": null
    },
    {
        "id": "european-invasion",
        "name": "European Invasion",
        "date": "2018-06-19",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "galactic-empire"
        ],
        "venueId": "alter-schlachthof-wiesbaden:Kesselhaus",
        "price": 22,
        "logo": "EuropeanInvasion2018.png",
        "notes": null
    },
    {
        "id": "schlossgrabenfest",
        "date": "2018-05-31",
        "endDate": "2018-06-03",
        "artistIds": [
            "jbo"
        ],
        "venueId": "karolinenplatz-darmstadt",
        "type": "festival",
        "name": "Schlossgrabenfest 2018",
        "price": 0,
        "logo": "Schlossgrabenfest2018.png",
        "notes": null
    },
    {
        "id": "funkenflug-tour-2018",
        "name": "Funkenflug Tour",
        "date": "2018-04-19",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "versengold",
            "antiheld"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 22,
        "logo": "Funkenflug2018.png",
        "notes": null
    },
    {
        "id": "nacht-der-balladen-2018",
        "date": "2018-02-16",
        "endDate": null,
        "artistIds": [
            "versengold"
        ],
        "venueId": "st-johannis-kirche-wuerzburg",
        "type": "concert",
        "name": "Nacht der Balladen 2018",
        "price": 28,
        "logo": "NachtDerBalladen2018.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2017",
        "name": "Eisheilige Nacht 2017",
        "date": "2017-12-22",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "mono-inc",
            "feuerschwanz"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 37,
        "logo": "EHN2017.png",
        "notes": null
    },
    {
        "id": "zirkus-zeitgeist-tour-2017",
        "name": "Zirkus Zeitgeist Tour",
        "date": "2017-11-17",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "halle-02-heidelberg",
        "price": 28.5,
        "logo": "ZirkusZeitgeist.png",
        "notes": null
    },
    {
        "id": "funkenflug-tour",
        "date": "2017-10-28",
        "endDate": null,
        "artistIds": [
            "versengold",
            "dartagnan"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "type": "concert",
        "name": "Funkenflug Tour",
        "price": 19,
        "logo": "Funkenflug2017.png",
        "notes": null
    },
    {
        "id": "dark-before-dawn-tour",
        "date": "2017-09-03",
        "endDate": null,
        "artistIds": [
            "breaking-benjamin"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Dark Before Dawn Tour",
        "price": 29.45,
        "logo": "DarkBeforeDawn.png",
        "notes": null
    },
    {
        "id": "mps-speyer-2017",
        "name": "MPS Speyer 2017",
        "date": "2017-08-27",
        "endDate": "2017-08-28",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold"
        ],
        "venueId": "domgarten-speyer",
        "price": 30,
        "logo": "MPS2017Speyer.png",
        "notes": null
    },
    {
        "id": "mps-karlsruhe-2017",
        "name": "MPS Karlsruhe 2017",
        "date": "2017-07-29",
        "endDate": "2017-07-30",
        "type": "festival",
        "artistIds": [
            "saltatio-mortis",
            "versengold",
            "feuerschwanz"
        ],
        "venueId": "schlossgarten-karlsruhe",
        "price": 30,
        "logo": "MPS2017Karlsruhe.png",
        "notes": null
    },
    {
        "id": "in-castellis-tour-2017",
        "date": "2017-07-14",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis",
            "versengold"
        ],
        "venueId": "burg-wertheim",
        "type": "concert",
        "name": "In Castellis Tour 2017",
        "price": 34,
        "logo": "InCastellis.png",
        "notes": null
    },
    {
        "id": "uncharted-tour",
        "date": "2017-06-10",
        "endDate": null,
        "artistIds": [
            "the-piano-guys"
        ],
        "venueId": "mitsubishi-electric-halle-duesseldorf",
        "type": "concert",
        "name": "Uncharted Tour",
        "price": 47.5,
        "logo": "Uncharted.png",
        "notes": null
    },
    {
        "id": "neon-tour-2017",
        "name": "NEON Tour",
        "date": "2017-03-24",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally"
        ],
        "venueId": "alter-schlachthof-wiesbaden",
        "price": 27,
        "logo": "Neon2017.png",
        "notes": null
    },
    {
        "id": "zirkus-zeitgeist-derniere",
        "date": "2017-03-04",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "historische-stadthalle-wuppertal",
        "type": "concert",
        "name": "Zirkus Zeitgeist Derniere",
        "price": 33,
        "logo": "ZirkusZeitgeistDerniere.png",
        "notes": null
    },
    {
        "id": "the-last-tour",
        "date": "2017-01-31",
        "endDate": null,
        "artistIds": [
            "sabaton",
            "accept"
        ],
        "venueId": "jahrhunderthalle-frankfurt",
        "type": "concert",
        "name": "The Last Tour",
        "price": 42,
        "logo": "TheLastTour.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2016",
        "name": "Eisheilige Nacht 2016",
        "date": "2016-12-16",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "eluveitie",
            "lord-of-the-lost"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 35,
        "logo": "EHN2016.png",
        "notes": null
    },
    {
        "id": "zirkus-zeitgeist-tour-2016-2",
        "name": "Zirkus Zeitgeist Tour",
        "date": "2016-08-05",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis"
        ],
        "venueId": "colos-saal-aschaffenburg",
        "price": 25.4,
        "logo": "ZirkusZeitgeist2016.png",
        "notes": null
    },
    {
        "id": "neon-tour",
        "date": "2016-04-20",
        "endDate": null,
        "artistIds": [
            "subway-to-sally"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "NEON Tour",
        "price": 27,
        "logo": "Neon2016.png",
        "notes": null
    },
    {
        "id": "voices-of-fire-tour",
        "date": "2016-04-17",
        "endDate": null,
        "artistIds": [
            "van-canto",
            "freedom-call",
            "grailknights"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Voices of Fire Tour",
        "price": 23,
        "logo": "VoicesOfFire.png",
        "notes": null
    },
    {
        "id": "zirkus-zeitgeist-tour-2016",
        "name": "Zirkus Zeitgeist Tour",
        "date": "2016-03-31",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "mr-irish-bastard"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 24,
        "logo": "ZirkusZeitgeist2016.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2015",
        "name": "Eisheilige Nacht 2015",
        "date": "2015-12-19",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "fiddlers-green",
            "letzte-instanz"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 35,
        "logo": "EHN2015.png",
        "notes": null
    },
    {
        "id": "endless-forms-most-beautiful-tour",
        "date": "2015-12-04",
        "endDate": null,
        "artistIds": [
            "nightwish",
            "arch-enemy"
        ],
        "venueId": "jahrhunderthalle-frankfurt",
        "type": "concert",
        "name": "Endless Forms Most Beautiful Tour",
        "price": 50.9,
        "logo": "EFMB2015.png",
        "notes": null
    },
    {
        "id": "zirkus-zeitgeist-tour",
        "date": "2015-11-14",
        "endDate": null,
        "artistIds": [
            "saltatio-mortis",
            "nachtgeschrei"
        ],
        "venueId": "posthalle-wuerzburg",
        "type": "concert",
        "name": "Zirkus Zeitgeist Tour",
        "price": 24,
        "logo": "ZirkusZeitgeist2015.png",
        "notes": null
    },
    {
        "id": "ehrlich-laut-festival-2015",
        "date": "2015-08-20",
        "endDate": "2015-08-22",
        "artistIds": [
            "subway-to-sally",
            "saltatio-mortis"
        ],
        "venueId": "hessenhalle-alsfeld",
        "type": "festival",
        "name": "Ehrlich & Laut Festival 2015",
        "price": 35,
        "logo": "EhrlichUndLaut2015.png",
        "notes": null
    },
    {
        "id": "faszination-weltraum-tour",
        "date": "2015-06-03",
        "endDate": null,
        "artistIds": [
            "farin-urlaub-racing-team"
        ],
        "venueId": "jahrhunderthalle-frankfurt",
        "type": "concert",
        "name": "Es besteht keine Gefahr für die Öffentlichkeit Tour 2015",
        "price": 40,
        "logo": "FURT2015.png",
        "notes": null
    },
    {
        "id": "schlossgrabenfest-2015",
        "date": "2015-05-21",
        "endDate": "2015-05-24",
        "artistIds": [
            "wise-guys"
        ],
        "venueId": "karolinenplatz-darmstadt",
        "type": "festival",
        "name": "Schlossgrabenfest 2015",
        "price": 0,
        "logo": "Schlossgrabenfest2015.png",
        "notes": null
    },
    {
        "id": "mitgift-tour-2015",
        "name": "Mitgift Tour",
        "date": "2015-03-25",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "drescher"
        ],
        "venueId": "centralstation-darmstadt",
        "price": 25.73,
        "logo": "Mitgift2015.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2014",
        "name": "Eisheilige Nacht 2014",
        "date": "2014-12-20",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "saltatio-mortis",
            "unzucht",
            "heldmaschine"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 40.85,
        "logo": "EHN2014.png",
        "notes": null
    },
    {
        "id": "voicefest",
        "date": "2014-12-14",
        "endDate": null,
        "artistIds": [
            "van-canto",
            "stimmgewalt",
            "in-legend"
        ],
        "venueId": "batschkapp-frankfurt",
        "type": "concert",
        "name": "Voicefest",
        "price": 30,
        "logo": null,
        "notes": null
    },
    {
        "id": "2510-tour",
        "name": "25/10 Tour",
        "date": "2014-11-09",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "jbo",
            "swiss-die-andern"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 35,
        "logo": "2510.png",
        "notes": null
    },
    {
        "id": "per-aspera-ad-aspera-tour",
        "name": "Per Aspera ad Aspera Tour",
        "date": "2014-10-29",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "asp"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 27,
        "logo": "PerAsperaAdAspera.png",
        "notes": null
    },
    {
        "id": "mitgift-tour",
        "name": "Mitgift Tour",
        "date": "2014-04-10",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "darkhaus"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 29.9,
        "logo": "Mitgift2014.png",
        "notes": null
    },
    {
        "id": "das-schwarze-1x1-tour-2014",
        "name": "Das Schwarze 1x1 Tour",
        "date": "2014-03-13",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "versengold"
        ],
        "venueId": "batschkapp-frankfurt",
        "price": 25,
        "logo": "DasSchwarzeIXI2014.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2013",
        "name": "Eisheilige Nacht 2013",
        "date": "2013-12-21",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "lordi",
            "lord-of-the-lost"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 35,
        "logo": "EHN2013.png",
        "notes": null
    },
    {
        "id": "das-schwarze-1x1-tour",
        "name": "Das Schwarze 1x1 Tour",
        "date": "2013-11-02",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "versengold"
        ],
        "venueId": "posthalle-wuerzburg",
        "price": 20,
        "logo": "DasSchwarzeIXI2013.png",
        "notes": null
    },
    {
        "id": "gothic-meets-klassik-2013",
        "name": "Gothic Meets Klassik 2013",
        "date": "2013-10-26",
        "endDate": "2013-10-27",
        "type": "festival",
        "artistIds": [
            "subway-to-sally",
            "combichrist",
            "oomph",
            "subway-to-sally",
            "combichrist",
            "lord-of-the-lost"
        ],
        "venueId": "haus-auensee-leipzig",
        "price": 66.75,
        "logo": "GothicMeetsKlassik.png",
        "notes": null
    },
    {
        "id": "woa-2013",
        "name": "W:O:A 2013",
        "date": "2013-08-01",
        "endDate": "2013-08-03",
        "type": "festival",
        "artistIds": [
            "motorhead",
            "deep-purple",
            "nightwish",
            "alice-cooper",
            "doro",
            "rage",
            "subway-to-sally",
            "die-apokalyptischen-reiter",
            "sabaton",
            "asp",
            "russkaja",
            "feuerschwanz",
            "woa-firefighters"
        ],
        "venueId": "wacken-open-air",
        "price": 140,
        "logo": "Wacken2013.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2012-potsdam",
        "name": "Eisheilige Nacht 2012",
        "date": "2012-12-30",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "die-apokalyptischen-reiter",
            "russkaja",
            "subway-to-sally",
            "fejd"
        ],
        "venueId": "metropolishalle-potsdam",
        "price": 34,
        "logo": "EHN2012.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2012",
        "name": "Eisheilige Nacht 2012",
        "date": "2012-12-22",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "die-apokalyptischen-reiter",
            "russkaja",
            "subway-to-sally",
            "fejd"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 34,
        "logo": "EHN2012.png",
        "notes": null
    },
    {
        "id": "sturm-aufs-paradies-tour-2",
        "name": "Sturm aufs Paradies Tour",
        "date": "2012-11-29",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "das-niveau"
        ],
        "venueId": "kuz-mainz",
        "price": 20,
        "logo": "SturmAufsParadies.png",
        "notes": null
    },
    {
        "id": "das-comeback-tour",
        "name": "Das Comeback Tour",
        "date": "2012-10-26",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "die-aerzte"
        ],
        "venueId": "europahalle-karlsruhe",
        "price": 39,
        "logo": "DasComeback.png",
        "notes": null
    },
    {
        "id": "subway-to-sally-fantreffen",
        "date": "2012-09-15",
        "endDate": null,
        "artistIds": [
            "subway-to-sally"
        ],
        "venueId": "ferienland-crispendorf",
        "type": "concert",
        "name": "Subway to Sally Fantreffen",
        "price": 12,
        "logo": null,
        "notes": null
    },
    {
        "id": "schlosshof-festival-2012",
        "date": "2012-08-24",
        "endDate": "2012-08-24",
        "artistIds": [
            "subway-to-sally",
            "saltatio-mortis"
        ],
        "venueId": "schlosshof-fulda",
        "type": "festival",
        "name": "Schlosshof Festival 2012",
        "price": 29.75,
        "logo": null,
        "notes": null
    },
    {
        "id": "otterrock-2012",
        "name": "Otterrock 2012",
        "date": "2012-06-16",
        "endDate": "2012-06-16",
        "type": "festival",
        "artistIds": [
            "subway-to-sally",
            "brandstein"
        ],
        "venueId": "sommerfesthalle-otterstadt",
        "price": 10,
        "logo": "Otterrock2012.png",
        "notes": null
    },
    {
        "id": "imaginaerum-tour",
        "name": "Imaginaerum Tour",
        "date": "2012-04-23",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "nightwish",
            "battle-beast",
            "eklipse"
        ],
        "venueId": "jahrhunderthalle-frankfurt",
        "price": 49.75,
        "logo": "Imaginaerum.png",
        "notes": null
    },
    {
        "id": "sturm-aufs-paradies-tour",
        "name": "Sturm aufs Paradies Tour",
        "date": "2012-04-12",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "saltatio-mortis",
            "das-niveau"
        ],
        "venueId": "alte-batschkapp-frankfurt",
        "price": 20,
        "logo": "SturmAufsParadies.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2011",
        "name": "Eisheilige Nacht 2011",
        "date": "2011-12-17",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "fiddlers-green",
            "letzte-instanz",
            "megaherz"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 30,
        "logo": "EHN2011.png",
        "notes": null
    },
    {
        "id": "schwarz-in-schwarz-tour",
        "name": "Schwarz in Schwarz Tour",
        "date": "2011-10-21",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "nachtgeschrei"
        ],
        "venueId": "hugenottenhalle-neu-isenburg",
        "price": 30,
        "logo": "SchwarzInSchwarz.png",
        "notes": null
    },
    {
        "id": "amphi-festival-2011",
        "name": "Amphi Festival 2011",
        "date": "2011-07-17",
        "endDate": "2011-07-17",
        "type": "festival",
        "artistIds": [
            "subway-to-sally",
            "saltatio-mortis"
        ],
        "venueId": "tanzbrunnen-koeln",
        "price": 56,
        "logo": "Amphi2011.png",
        "notes": null
    },
    {
        "id": "nackt-ii-tour",
        "name": "Nackt II Tour",
        "date": "2011-03-28",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally"
        ],
        "venueId": "centralstation-darmstadt",
        "price": 27.6,
        "logo": "NacktII.png",
        "notes": null
    },
    {
        "id": "eisheilige-nacht-2010",
        "name": "Eisheilige Nacht 2010",
        "date": "2010-12-18",
        "endDate": null,
        "type": "concert",
        "artistIds": [
            "subway-to-sally",
            "saltatio-mortis",
            "dunkelschoen"
        ],
        "venueId": "hessenhallen-giessen",
        "price": 34.5,
        "logo": "EHN.png",
        "notes": null
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = concertsData;
}