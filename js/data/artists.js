// Concert artist data - converted from original band list
const artistsData = [
    {
        "id": "subway-to-sally",
        "name": "Subway to Sally",
        "country": "Germany",
        "logo": "Subway_to_Sally.png"
    },
    {
        "id": "saltatio-mortis",
        "name": "Saltatio Mortis",
        "country": "Germany",
        "logo": "Saltatio_Mortis.png"
    },
    {
        "id": "dunkelschoen",
        "name": "Dunkelschön",
        "country": "Germany",
        "logo": "Dunkelschoen.png"
    },
    {
        "id": "nachtgeschrei",
        "name": "Nachtgeschrei",
        "country": "Germany",
        "logo": "Nachtgeschrei.png"
    },
    {
        "id": "fiddlers-green",
        "name": "Fiddler's Green",
        "country": "Germany",
        "logo": "Fiddlers_Green.png"
    },
    {
        "id": "letzte-instanz",
        "name": "Letzte Instanz",
        "country": "Germany",
        "logo": "Letzte_Instanz.png"
    },
    {
        "id": "megaherz",
        "name": "Megaherz",
        "country": "Germany",
        "logo": "Megaherz.png"
    },
    {
        "id": "das-niveau",
        "name": "Das Niveau",
        "country": "Germany",
        "logo": "Das_Niveau.png"
    },
    {
        "id": "nightwish",
        "name": "Nightwish",
        "country": "Finland",
        "logo": "Nightwish.png"
    },
    {
        "id": "battle-beast",
        "name": "Battle Beast",
        "country": "Finland",
        "logo": "Battle_Beast.png"
    },
    {
        "id": "eklipse",
        "name": "Eklipse",
        "country": "France",
        "logo": "Eklipse.png"
    },
    {
        "id": "brandstein",
        "name": "Brandstein",
        "country": "Germany",
        "logo": null
    },
    {
        "id": "die-aerzte",
        "name": "die ärzte",
        "country": "Germany",
        "logo": "Die_Ärzte.png"
    },
    {
        "id": "die-apokalyptischen-reiter",
        "name": "Die Apokalyptischen Reiter",
        "country": "Germany",
        "logo": "Die_Apokalyptischen_Reiter.png"
    },
    {
        "id": "russkaja",
        "name": "Russkaja",
        "country": "Austria",
        "logo": "Russkaja.png"
    },
    {
        "id": "fejd",
        "name": "Fejd",
        "country": "Sweden",
        "logo": "Fejd.png"
    },
    {
        "id": "alice-cooper",
        "name": "Alice Cooper",
        "country": "USA",
        "logo": "Alice_Cooper.png"
    },
    {
        "id": "deep-purple",
        "name": "Deep Purple",
        "country": "UK",
        "logo": "Deep_Purple.png"
    },
    {
        "id": "asp",
        "name": "ASP",
        "country": "Germany",
        "logo": "ASP.png"
    },
    {
        "id": "doro",
        "name": "Doro",
        "country": "Germany",
        "logo": "Doro.png"
    },
    {
        "id": "feuerschwanz",
        "name": "Feuerschwanz",
        "country": "Germany",
        "logo": "Feuerschwanz.png"
    },
    {
        "id": "rage",
        "name": "Rage",
        "country": "Germany",
        "logo": "Rage.png"
    },
    {
        "id": "motorhead",
        "name": "Motörhead",
        "country": "UK",
        "logo": "Motorhead.png"
    },
    {
        "id": "sabaton",
        "name": "Sabaton",
        "country": "Sweden",
        "logo": "Sabaton.png"
    },
    {
        "id": "woa-firefighters",
        "name": "W:O:A Firefighters",
        "country": "Germany",
        "logo": null
    },
    {
        "id": "combichrist",
        "name": "Combichrist",
        "country": "Norway",
        "logo": "Combichrist.png"
    },
    {
        "id": "oomph",
        "name": "OOMPH!",
        "country": "Germany",
        "logo": "Oomph.png"
    },
    {
        "id": "lord-of-the-lost",
        "name": "Lord of the Lost",
        "country": "Germany",
        "logo": "Lord_of_the_Lost.png"
    },
    {
        "id": "versengold",
        "name": "Versengold",
        "country": "Germany",
        "logo": "Versengold.png"
    },
    {
        "id": "lordi",
        "name": "Lordi",
        "country": "Finland",
        "logo": "Lordi.png"
    },
    {
        "id": "darkhaus",
        "name": "Darkhaus",
        "country": "Germany",
        "logo": "Darkhaus.png"
    },
    {
        "id": "jbo",
        "name": "J.B.O.",
        "country": "Germany",
        "logo": "JBO.png"
    },
    {
        "id": "swiss-die-andern",
        "name": "Swiss & Die Andern",
        "country": "Germany",
        "logo": "Swiss.png"
    },
    {
        "id": "van-canto",
        "name": "Van Canto",
        "country": "Germany",
        "logo": "Van_Canto.png"
    },
    {
        "id": "stimmgewalt",
        "name": "Stimmgewalt",
        "country": "Germany",
        "logo": "Stimmgewalt.png"
    },
    {
        "id": "in-legend",
        "name": "In Legend",
        "country": "Germany",
        "logo": "In_Legend.png"
    },
    {
        "id": "unzucht",
        "name": "Unzucht",
        "country": "Germany",
        "logo": "Unzucht.png"
    },
    {
        "id": "heldmaschine",
        "name": "Heldmaschine",
        "country": "Germany",
        "logo": "Heldmaschine.png"
    },
    {
        "id": "drescher",
        "name": "Drescher",
        "country": "Germany",
        "logo": "Drescher.png"
    },
    {
        "id": "wise-guys",
        "name": "Wise Guys",
        "country": "Germany",
        "logo": "Wise_Guys.png"
    },
    {
        "id": "farin-urlaub-racing-team",
        "name": "Farin Urlaub Racing Team",
        "country": "Germany",
        "logo": "FURT.png"
    },
    {
        "id": "arch-enemy",
        "name": "Arch Enemy",
        "country": "Sweden",
        "logo": "Arch_Enemy.png"
    },
    {
        "id": "mr-irish-bastard",
        "name": "Mr. Irish Bastard",
        "country": "Germany",
        "logo": "Mr_Irish_Bastard.png"
    },
    {
        "id": "freedom-call",
        "name": "Freedom Call",
        "country": "Germany",
        "logo": "Freedom_Call.png"
    },
    {
        "id": "eluveitie",
        "name": "Eluveitie",
        "country": "Switzerland",
        "logo": "Eluveitie.png"
    },
    {
        "id": "accept",
        "name": "Accept",
        "country": "Germany",
        "logo": "Accept.png"
    },
    {
        "id": "the-piano-guys",
        "name": "The Piano Guys",
        "country": "USA",
        "logo": "The_Piano_Guys.png"
    },
    {
        "id": "breaking-benjamin",
        "name": "Breaking Benjamin",
        "country": "USA",
        "logo": "Breaking_Benjamin.png"
    },
    {
        "id": "dartagnan",
        "name": "D'Artagnan",
        "country": "Germany",
        "logo": "Dartagnan.png"
    },
    {
        "id": "mono-inc",
        "name": "Mono Inc.",
        "country": "Germany",
        "logo": "Mono_Inc.png"
    },
    {
        "id": "antiheld",
        "name": "Antiheld",
        "country": "Germany",
        "logo": "Antiheld.png"
    },
    {
        "id": "galactic-empire",
        "name": "Galactic Empire",
        "country": "USA",
        "logo": "Galactic_Empire.png"
    },
    {
        "id": "mr-hurley-und-die-pulveraffen",
        "name": "Mr. Hurley und die Pulveraffen",
        "country": "Germany",
        "logo": "Mr_Hurley.png"
    },
    {
        "id": "bannkreis",
        "name": "Bannkreis",
        "country": "Germany",
        "logo": "Bannkreis.png"
    },
    {
        "id": "paddy-and-the-rats",
        "name": "Paddy and the Rats",
        "country": "Hungary",
        "logo": "Paddy_and_the_Rats.png"
    },
    {
        "id": "ganaim",
        "name": "Ganaim",
        "country": "Germany",
        "logo": "Ganaim.png"
    },
    {
        "id": "incantatem",
        "name": "Incantatem",
        "country": "Germany",
        "logo": "Incantatem.png"
    },
    {
        "id": "grailknights",
        "name": "Grailknights",
        "country": "Germany",
        "logo": "Grailknights.png"
    },
    {
        "id": "evertale",
        "name": "Evertale",
        "country": "Germany",
        "logo": "Evertale.png"
    },
    {
        "id": "moonsun",
        "name": "MoonSun",
        "country": "Germany",
        "logo": "MoonSun.png"
    },
    {
        "id": "firkin",
        "name": "Firkin",
        "country": "Germany",
        "logo": "Firkin.png"
    },
    {
        "id": "beast-in-black",
        "name": "Beast in Black",
        "country": "Finland",
        "logo": "Beast_in_Black.png"
    },
    {
        "id": "majorvoice",
        "name": "MajorVoice",
        "country": "Germany",
        "logo": "MajorVoice.png"
    },
    {
        "id": "indecent-behavior",
        "name": "Indecent Behavior",
        "country": "Germany",
        "logo": "Indecent_Behavior.png"
    },
    {
        "id": "rockin-1000",
        "name": "Rockin' 1000",
        "country": "Italy",
        "logo": "Rockin_1000.png"
    },
    {
        "id": "gypsys",
        "name": "Gypsys",
        "country": "Germany",
        "logo": null
    },
    {
        "id": "john-kanaka-the-jack-tars",
        "name": "John Kanaka & The Jack Tars",
        "country": "Germany",
        "logo": "The_Jack_Tars.png"
    },
    {
        "id": "within-temptation",
        "name": "Within Temptation",
        "country": "Netherlands",
        "logo": "Within_Temptation.png"
    },
    {
        "id": "joachim-witt",
        "name": "Joachim Witt",
        "country": "Germany",
        "logo": "Joachim_Witt.png"
    },
    {
        "id": "corvus-corax",
        "name": "Corvus Corax",
        "country": "Germany",
        "logo": "Corvus_Corax.png"
    },
    {
        "id": "null-positiv",
        "name": "Null Positiv",
        "country": "Germany",
        "logo": "Null_Positiv.png"
    },
    {
        "id": "in-extremo",
        "name": "In Extremo",
        "country": "Germany",
        "logo": "In_Extremo.png"
    },
    {
        "id": "manntra",
        "name": "Manntra",
        "country": "Croatia",
        "logo": "Manntra.png"
    },
    {
        "id": "krayenzeit",
        "name": "Krayenzeit",
        "country": "Germany",
        "logo": "Krayenzeit.png"
    },
    {
        "id": "knasterbart",
        "name": "Knasterbart",
        "country": "Germany",
        "logo": "Knasterbart.png"
    },
    {
        "id": "vogelfrey",
        "name": "Vogelfrey",
        "country": "Germany",
        "logo": "Vogelfrey.png"
    },
    {
        "id": "the-oreillys-and-the-paddyhats",
        "name": "The O'Reillys and the Paddyhats",
        "country": "Germany",
        "logo": "The_OReillys.png"
    },
    {
        "id": "2-minds-collide",
        "name": "2 Minds Collide",
        "country": "Germany",
        "logo": "2_Minds_Collide.png"
    },
    {
        "id": "apocalyptica",
        "name": "Apocalyptica",
        "country": "Finland",
        "logo": "Apocalyptica.png"
    },
    {
        "id": "amaranthe",
        "name": "Amaranthe",
        "country": "Sweden",
        "logo": "Amaranthe.png"
    },
    {
        "id": "schandmaul",
        "name": "Schandmaul",
        "country": "Germany",
        "logo": "Schandmaul.png"
    },
    {
        "id": "harmony-glen",
        "name": "Harmony Glen",
        "country": "Germany",
        "logo": "Harmony_Glen.png"
    },
    {
        "id": "tir-saor",
        "name": "Tir Saor",
        "country": "Germany",
        "logo": "Tir_Saor.png"
    },
    {
        "id": "rammstein",
        "name": "Rammstein",
        "country": "Germany",
        "logo": "Rammstein.png"
    },
    {
        "id": "duo-jatekok",
        "name": "Duo Játékok",
        "country": "Hungary",
        "logo": "Duo_Jatekok.png"
    },
    {
        "id": "tanzwut",
        "name": "Tanzwut",
        "country": "Germany",
        "logo": "Tanzwut.png"
    },
    {
        "id": "draco-faucium",
        "name": "Draco Faucium",
        "country": "Germany",
        "logo": "Draco_Faucium.png"
    },
    {
        "id": "powerwolf",
        "name": "Powerwolf",
        "country": "Germany",
        "logo": "Powerwolf.png"
    },
    {
        "id": "eisbrecher",
        "name": "Eisbrecher",
        "country": "Germany",
        "logo": "Eisbrecher.png"
    },
    {
        "id": "steel-panther",
        "name": "Steel Panther",
        "country": "USA",
        "logo": "Steel_Panther.png"
    },
    {
        "id": "tarja",
        "name": "Tarja",
        "country": "Finland",
        "logo": "Tarja.png"
    },
    {
        "id": "sepultura",
        "name": "Sepultura",
        "country": "Brazil",
        "logo": "Sepultura.png"
    },
    {
        "id": "knorkator",
        "name": "Knorkator",
        "country": "Germany",
        "logo": "Knorkator.png"
    },
    {
        "id": "betontod",
        "name": "Betontod",
        "country": "Germany",
        "logo": "Betontod.png"
    },
    {
        "id": "ost-front",
        "name": "Ost+Front",
        "country": "Germany",
        "logo": "OstFront.png"
    },
    {
        "id": "der-schulz",
        "name": "Der Schulz",
        "country": "Germany",
        "logo": "Der_Schulz.png"
    },
    {
        "id": "ad-infinitum",
        "name": "Ad Infinitum",
        "country": "Switzerland",
        "logo": "Ad_Infinitum.png"
    },
    {
        "id": "april-art",
        "name": "April Art",
        "country": "Germany",
        "logo": "April_Art.png"
    },
    {
        "id": "delva",
        "name": "Delva",
        "country": "Germany",
        "logo": "Delva.png"
    },
    {
        "id": "iron-maiden",
        "name": "Iron Maiden",
        "country": "UK",
        "logo": "Iron_Maiden.png"
    },
    {
        "id": "airbourne",
        "name": "Airbourne",
        "country": "Australia",
        "logo": "Airbourne.png"
    },
    {
        "id": "wind-rose",
        "name": "Wind Rose",
        "country": "Italy",
        "logo": "Wind_Rose.png"
    },
    {
        "id": "luet",
        "name": "Lüt",
        "country": "Germany",
        "logo": "Luet.png"
    },
    {
        "id": "drangsal",
        "name": "Drangsal",
        "country": "Germany",
        "logo": "Drangsal.png"
    },
    {
        "id": "von-grambusch",
        "name": "Von Grambusch",
        "country": "Germany",
        "logo": "Von_Grambusch.png"
    },
    {
        "id": "nachtblut",
        "name": "Nachtblut",
        "country": "Germany",
        "logo": "Nachtblut.png"
    },
    {
        "id": "dragonforce",
        "name": "Dragonforce",
        "country": "UK",
        "logo": "Dragonforce.png"
    },
    {
        "id": "warkings",
        "name": "Warkings",
        "country": "Germany",
        "logo": "Warkings.png"
    },
    {
        "id": "turmion-katilot",
        "name": "Turmion Kätilot",
        "country": "Finland",
        "logo": "Turmion_Katilot.png"
    },
    {
        "id": "storm-seeker",
        "name": "Storm Seeker",
        "country": "Germany",
        "logo": "Storm_Seeker.png"
    },
    {
        "id": "firewind",
        "name": "Firewind",
        "country": "Greece",
        "logo": "Firewind.png"
    },
    {
        "id": "incordia",
        "name": "Incordia",
        "country": "Germany",
        "logo": "Incordia.png"
    },
    {
        "id": "terra-atlantica",
        "name": "Terra Atlantica",
        "country": "Germany",
        "logo": "Terra_Atlantica.png"
    },
    {
        "id": "victorious",
        "name": "Victorious",
        "country": "Sweden",
        "logo": "Victorious.png"
    },
    {
        "id": "angus-mcsix",
        "name": "Angus McSix",
        "country": "Switzerland",
        "logo": "Angus_McSix.png"
    },
    {
        "id": "future-palace",
        "name": "Future Palace",
        "country": "Germany",
        "logo": "Future_Palace.png"
    },
    {
        "id": "blind-channel",
        "name": "Blind Channel",
        "country": "Finland",
        "logo": "Blind_Channel.png"
    },
    {
        "id": "electric-callboy",
        "name": "Electric Callboy",
        "country": "Germany",
        "logo": "Electric_Callboy.png"
    },
    {
        "id": "baby-metal",
        "name": "Baby Metal",
        "country": "Japan",
        "logo": "Baby_Metal.png"
    },
    {
        "id": "leichtmatrose",
        "name": "Leichtmatrose",
        "country": "Germany",
        "logo": "Leichtmatrose.png"
    },
    {
        "id": "eva-under-fire",
        "name": "Eva Under Fire",
        "country": "USA",
        "logo": "Eva_Under_Fire.png"
    },
    {
        "id": "like-a-storm",
        "name": "Like A Storm",
        "country": "New Zealand",
        "logo": "Like_A_Storm.png"
    },
    {
        "id": "skillet",
        "name": "Skillet",
        "country": "USA",
        "logo": "Skillet.png"
    },
    {
        "id": "blitz-union",
        "name": "Blitz Union",
        "country": "Germany",
        "logo": "Blitz_Union.png"
    },
    {
        "id": "abelard",
        "name": "Abélard",
        "country": "Germany",
        "logo": "Abelard.png"
    },
    {
        "id": "bloodred-hourglass",
        "name": "Bloodred Hourglass",
        "country": "Finland",
        "logo": "Bloodred_Hourglass.png"
    },
    {
        "id": "the-dark-side-of-the-moon",
        "name": "The Dark Side of the Moon",
        "country": "Germany",
        "logo": "The_Dark_Side_of_the_Moon.png"
    },
    {
        "id": "equilibrium",
        "name": "Equilibrium",
        "country": "Germany",
        "logo": "Equilibrium.png"
    },
    {
        "id": "rauhbein",
        "name": "Rauhbein",
        "country": "Germany",
        "logo": "Rauhbein.png"
    },
    {
        "id": "bloodbound",
        "name": "Bloodbound",
        "country": "Sweden",
        "logo": "Bloodbound.png"
    },
    {
        "id": "amon-amarth",
        "name": "Amon Amarth",
        "country": "Sweden",
        "logo": "Amon_Amarth.png"
    },
    {
        "id": "skald",
        "name": "Skald",
        "country": "France",
        "logo": "Skald.png"
    },
    {
        "id": "haematom",
        "name": "Hämatom",
        "country": "Germany",
        "logo": "Hämatom.png"
    },
    {
        "id": "korpiklaani",
        "name": "Korpiklaani",
        "country": "Finland",
        "logo": "Korpiklaani.png"
    },
    {
        "id": "in-flames",
        "name": "In Flames",
        "country": "Sweden",
        "logo": "In_Flames.png"
    },
    {
        "id": "blind-guardian",
        "name": "Blind Guardian",
        "country": "Germany",
        "logo": "Blind_Guardian.png"
    },
    {
        "id": "ohrenfeindt",
        "name": "Ohrenfeindt",
        "country": "Germany",
        "logo": "Ohrenfeindt.png"
    },
    {
        "id": "as-i-lay-dying",
        "name": "As I Lay Dying",
        "country": "USA",
        "logo": "As_I_Lay_Dying.png"
    },
    {
        "id": "setyoursails",
        "name": "Setyoursails",
        "country": "Germany",
        "logo": "Setyoursails.png"
    },
    {
        "id": "faun",
        "name": "Faun",
        "country": "Germany",
        "logo": "Faun.png"
    },
    {
        "id": "macpiet",
        "name": "MacPiet",
        "country": "Germany",
        "logo": "MacPiet.png"
    },
    {
        "id": "ghosts-of-atlantis",
        "name": "Ghosts of Atlantis",
        "country": "UK",
        "logo": "Ghosts_of_Atlantis.png"
    },
    {
        "id": "ignea",
        "name": "Ignea",
        "country": "Ukraine",
        "logo": "Ignea.png"
    },
    {
        "id": "butcher-babies",
        "name": "Butcher Babies",
        "country": "USA",
        "logo": "Butcher_Babies.png"
    },
    {
        "id": "fear-factory",
        "name": "Fear Factory",
        "country": "USA",
        "logo": "Fear_Factory.png"
    },
    {
        "id": "coldrain",
        "name": "Coldrain",
        "country": "Japan",
        "logo": "Coldrain.png"
    },
    {
        "id": "nothing-more",
        "name": "Nothing More",
        "country": "USA",
        "logo": "Nothing_More.png"
    },
    {
        "id": "reis-against-the-spuelmachine",
        "name": "Reis against the Spülmachine",
        "country": "Germany",
        "logo": "Reis_Against_The_Spuelmachine.png"
    },
    {
        "id": "habenichtse",
        "name": "Habenichtse",
        "country": "Germany",
        "logo": "Habenichtse.png"
    },
    {
        "id": "absolem",
        "name": "Absolem",
        "country": "Germany",
        "logo": "Absolem.png"
    },
    {
        "id": "kupfergold",
        "name": "Kupfergold",
        "country": "Germany",
        "logo": "Kupfergold.png"
    }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = artistsData;
}