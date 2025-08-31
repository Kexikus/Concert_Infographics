#!/usr/bin/env python3
"""
Concert Data Converter
Converts old Event data structure to new JSON format matching concerts.js structure.
"""

import json
import re
from datetime import datetime
from typing import List, Dict, Any, Optional

# Artist name to ID mapping based on existing artists.js
ARTIST_NAME_TO_ID = {
    "Subway to Sally": "subway-to-sally",
    "Saltatio Mortis": "saltatio-mortis",
    "Dunkelschön": "dunkelschoen",
    "Nachtgeschrei": "nachtgeschrei",
    "Fiddler's Green": "fiddlers-green",
    "Letzte Instanz": "letzte-instanz",
    "Megaherz": "megaherz",
    "Das Niveau": "das-niveau",
    "Nightwish": "nightwish",
    "Battle Beast": "battle-beast",
    "Eklipse": "eklipse",
    "Brandstein": "brandstein",
    "die ärzte": "die-aerzte",
    "Die Apokalyptischen Reiter": "die-apokalyptischen-reiter",
    "Russkaja": "russkaja",
    "Fejd": "fejd",
    "Alice Cooper": "alice-cooper",
    "Deep Purple": "deep-purple",
    "ASP": "asp",
    "Doro": "doro",
    "Feuerschwanz": "feuerschwanz",
    "Rage": "rage",
    "Motörhead": "motorhead",
    "Sabaton": "sabaton",
    "W:O:A Firefighters": "woa-firefighters",
    "Combichrist": "combichrist",
    "OOMPH!": "oomph",
    "Lord of the Lost": "lord-of-the-lost",
    "Versengold": "versengold",
    "Lordi": "lordi",
    "Darkhaus": "darkhaus",
    "J.B.O.": "jbo",
    "Swiss & Die Andern": "swiss-die-andern",
    "Van Canto": "van-canto",
    "Stimmgewalt": "stimmgewalt",
    "In Legend": "in-legend",
    "Unzucht": "unzucht",
    "Heldmaschine": "heldmaschine",
    "Drescher": "drescher",
    "Wise Guys": "wise-guys",
    "Farin Urlaub Racing Team": "farin-urlaub-racing-team",
    "Arch Enemy": "arch-enemy",
    "Mr. Irish Bastard": "mr-irish-bastard",
    "Freedom Call": "freedom-call",
    "Eluveitie": "eluveitie",
    "Accept": "accept",
    "The Piano Guys": "the-piano-guys",
    "Breaking Benjamin": "breaking-benjamin",
    "D'Artagnan": "dartagnan",
    "Mono Inc.": "mono-inc",
    "Antiheld": "antiheld",
    "Galactic Empire": "galactic-empire",
    "Mr. Hurley und die Pulveraffen": "mr-hurley-und-die-pulveraffen",
    "Bannkreis": "bannkreis",
    "Paddy and the Rats": "paddy-and-the-rats",
    "Ganaim": "ganaim",
    "Incantatem": "incantatem",
    "Grailknights": "grailknights",
    "Evertale": "evertale",
    "MoonSun": "moonsun",
    "Firkin": "firkin",
    "Beast in Black": "beast-in-black",
    "MajorVoice": "majorvoice",
    "Indecent Behavior": "indecent-behavior",
    "Rockin' 1000": "rockin-1000",
    "Gypsys": "gypsys",
    "John Kanaka & The Jack Tars": "john-kanaka-the-jack-tars",
    "Within Temptation": "within-temptation",
    "Joachim Witt": "joachim-witt",
    "Corvus Corax": "corvus-corax",
    "Null Positiv": "null-positiv",
    "In Extremo": "in-extremo",
    "Manntra": "manntra",
    "Krayenzeit": "krayenzeit",
    "Knasterbart": "knasterbart",
    "Vogelfrey": "vogelfrey",
    "The O'Reillys and the Paddyhats": "the-oreillys-and-the-paddyhats",
    "2 Minds Collide": "2-minds-collide",
    "Apocalyptica": "apocalyptica",
    "Amaranthe": "amaranthe",
    "Schandmaul": "schandmaul",
    "Harmony Glen": "harmony-glen",
    "Tir Saor": "tir-saor",
    "Rammstein": "rammstein",
    "Duo Játékok": "duo-jatekok",
    "Tanzwut": "tanzwut",
    "Draco Faucium": "draco-faucium",
    "Powerwolf": "powerwolf",
    "Eisbrecher": "eisbrecher",
    "Steel Panther": "steel-panther",
    "Tarja": "tarja",
    "Sepultura": "sepultura",
    "Knorkator": "knorkator",
    "Betontod": "betontod",
    "Ost+Front": "ost-front",
    "Der Schulz": "der-schulz",
    "Ad Infinitum": "ad-infinitum",
    "April Art": "april-art",
    "Delva": "delva",
    "Iron Maiden": "iron-maiden",
    "Airbourne": "airbourne",
    "Wind Rose": "wind-rose",
    "Lüt": "luet",
    "Drangsal": "drangsal",
    "Von Grambusch": "von-grambusch",
    "Nachtblut": "nachtblut",
    "Dragonforce": "dragonforce",
    "Warkings": "warkings",
    "Turmion Kätilot": "turmion-katilot",
    "Storm Seeker": "storm-seeker",
    "Firewind": "firewind",
    "Incordia": "incordia",
    "Terra Atlantica": "terra-atlantica",
    "Victorious": "victorious",
    "Angus McSix": "angus-mcsix",
    "Future Palace": "future-palace",
    "Blind Channel": "blind-channel",
    "Electric Callboy": "electric-callboy",
    "Baby Metal": "baby-metal",
    "Leichtmatrose": "leichtmatrose",
    "Eva Under Fire": "eva-under-fire",
    "Like A Storm": "like-a-storm",
    "Skillet": "skillet",
    "Blitz Union": "blitz-union",
    "Abélard": "abelard",
    "Bloodred Hourglass": "bloodred-hourglass",
    "The Dark Side of the Moon": "the-dark-side-of-the-moon",
    "Equilibrium": "equilibrium",
    "Rauhbein": "rauhbein",
    "Bloodbound": "bloodbound",
    "Amon Amarth": "amon-amarth",
    "Skald": "skald",
    "Hämatom": "haematom",
    "Korpiklaani": "korpiklaani",
    "In Flames": "in-flames",
    "Blind Guardian": "blind-guardian",
    "Ohrenfeindt": "ohrenfeindt",
    "As I Lay Dying": "as-i-lay-dying",
    "Setyoursails": "setyoursails",
    "Faun": "faun",
    "MacPiet": "macpiet",
    "Ghosts of Atlantis": "ghosts-of-atlantis",
    "Ignea": "ignea",
    "Butcher Babies": "butcher-babies",
    "Fear Factory": "fear-factory",
    "Coldrain": "coldrain",
    "Nothing More": "nothing-more",
    "Reis against the Spülmachine": "reis-against-the-spuelmachine",
    "Habenichtse": "habenichtse",
    "Absolem": "absolem",
    "Kupfergold": "kupfergold"
}

# Venue name to ID mapping based on existing venues.js
VENUE_NAME_TO_ID = {
    "Hessenhallen": "hessenhallen-giessen",
    "Centralstation": "centralstation-darmstadt",
    "Tanzbrunnen": "tanzbrunnen-koeln",
    "Hugenottenhalle": "hugenottenhalle-neu-isenburg",
    "Alte Batschkapp": "alte-batschkapp-frankfurt",
    "Jahrhunderthalle": "jahrhunderthalle-frankfurt",
    "Sommerfesthalle": "sommerfesthalle-otterstadt",
    "Schlosshof Fulda": "schlosshof-fulda",
    "Ferienland Crispendorf": "ferienland-crispendorf",
    "Europahalle": "europahalle-karlsruhe",
    "KUZ": "kuz-mainz",
    "Metropolishalle": "metropolishalle-potsdam",
    "Wacken": "wacken-open-air",
    "Haus Auensee": "haus-auensee-leipzig",
    "Posthalle": "posthalle-wuerzburg",
    "Batschkapp": "batschkapp-frankfurt",
    "Karolinenplatz": "karolinenplatz-darmstadt",
    "Hessenhalle": "hessenhalle-alsfeld",
    "Colos Saal": "colos-saal-aschaffenburg",
    "Historische Stadthalle": "historische-stadthalle-wuppertal",
    "Alter Schlachthof": "alter-schlachthof-wiesbaden",
    "Mitsubishi Electric Halle": "mitsubishi-electric-halle-duesseldorf",
    "Burg Wertheim": "burg-wertheim",
    "Schlossgarten": "schlossgarten-karlsruhe",
    "Domgarten": "domgarten-speyer",
    "Halle 02": "halle-02-heidelberg",
    "St. Johannis Kirche": "st-johannis-kirche-wuerzburg",
    "Fühlinger See": "fuehlinger-see-koeln",
    "Waldbühne Hardt": "waldbuehne-hardt-wuppertal",
    "Festhalle": "festhalle-frankfurt",
    "Schlosspark": "schlosspark-rastede",
    "Deutsche Bank Park": "deutsche-bank-park-frankfurt",
    "Flugplatz Hildesheim": "flugplatz-hildesheim",
    "Amphitheater": "amphitheater-hanau",
    "Fredenbaumpark": "fredenbaumpark-dortmund",
    "Löwensaal": "loewensaal-nuernberg",
    "Volkspark Dutzendteich": "volkspark-dutzendteich-nuernberg",
    "Festplatz Finsterloh": "festplatz-finsterloh-wetzlar",
    "Kurfürstliches Schloss": "kurfuerstliches-schloss-mainz",
    "Cannstatter Wasen": "cannstatter-wasen-stuttgart",
    "Burg Abenberg": "burg-abenberg",
    "Flugplatz Ballenstedt": "flugplatz-ballenstedt",
    "Burg Frankenstein": "burg-frankenstein-muehltal",
    "Carlswerk": "carlswerk-koeln",
    "Festplatz Altengronau": "festplatz-altengronau",
    "Maimarktgelände": "maimarktgelaende-mannheim",
    "Amphitheater Gelsenkirchen": "amphitheater-gelsenkirchen",
    "Nachtleben": "nachtleben-frankfurt",
    "Rheingoldhalle": "rheingoldhalle-mainz",
    "Olympiastadion": "olympiastadion-muenchen",
    "Tunierplatz Luhmühlen": "tunierplatz-luhmuehlen",
    "Rudolf-Weber-Arena": "rudolf-weber-arena-oberhausen",
    "Grünspan": "gruenspan-hamburg",
    "Barclays Arena": "barclays-arena-hamburg",
    "Hanns-Martin-Schleyer-Halle": "hanns-martin-schleyer-halle-stuttgart"
}

def create_id_from_name(name: str) -> str:
    """Create a URL-friendly ID from a name."""
    # Remove special characters and convert to lowercase
    id_str = re.sub(r'[^\w\s-]', '', name.lower())
    # Replace spaces and multiple hyphens with single hyphens
    id_str = re.sub(r'[\s_]+', '-', id_str)
    # Remove leading/trailing hyphens
    id_str = id_str.strip('-')
    return id_str

def convert_date(date_str: str) -> str:
    """Convert date from YY-MM-DD format to YYYY-MM-DD format."""
    try:
        # Parse the date assuming YY-MM-DD format
        year_part, month, day = date_str.split('-')
        
        # Convert 2-digit year to 4-digit year
        if len(year_part) == 2:
            year_int = int(year_part)
            # Assume years 00-30 are 2000s, 31-99 are 1900s
            if year_int <= 30:
                year = 2000 + year_int
            else:
                year = 1900 + year_int
        else:
            year = int(year_part)
        
        return f"{year:04d}-{month}-{day}"
    except ValueError:
        print(f"Warning: Could not parse date '{date_str}'")
        return date_str

def get_artist_id(artist_name: str) -> str:
    """Get artist ID from name, with fallback to generated ID."""
    if artist_name in ARTIST_NAME_TO_ID:
        return ARTIST_NAME_TO_ID[artist_name]
    else:
        generated_id = create_id_from_name(artist_name)
        print(f"Warning: Artist '{artist_name}' not found in mapping, using generated ID: '{generated_id}'")
        return generated_id

def get_venue_id(venue_name: str) -> str:
    """Get venue ID from name, with fallback to generated ID."""
    if venue_name in VENUE_NAME_TO_ID:
        return VENUE_NAME_TO_ID[venue_name]
    else:
        generated_id = create_id_from_name(venue_name)
        print(f"Warning: Venue '{venue_name}' not found in mapping, using generated ID: '{generated_id}'")
        return generated_id

def convert_event_to_concert(event_data: tuple) -> Dict[str, Any]:
    """Convert a single Event tuple to concert JSON format."""
    # Parse the event tuple
    name = event_data[0]
    location = event_data[1]
    bands = event_data[2]
    date = event_data[3]
    is_festival = event_data[4] if len(event_data) > 4 else False
    end_date = event_data[5] if len(event_data) > 5 else None
    
    # Create concert ID from name
    concert_id = create_id_from_name(name)
    
    # Convert date format
    converted_date = convert_date(date)
    converted_end_date = convert_date(end_date) if end_date else None
    
    # Convert band names to artist IDs
    artist_ids = [get_artist_id(band) for band in bands]
    
    # Get venue ID
    venue_id = get_venue_id(location)
    
    # Determine type
    event_type = "festival" if is_festival else "concert"
    
    return {
        "id": concert_id,
        "date": converted_date,
        "endDate": converted_end_date,
        "artistIds": artist_ids,
        "venueId": venue_id,
        "type": event_type,
        "name": name,
        "price": None,
        "logo": None,
        "notes": None
    }

def main():
    """Main conversion function."""
    # Define the old data structure
    old_events = [
        ("Amphi Festival 2011", "Tanzbrunnen", ["Subway to Sally", "Saltatio Mortis"], "11-07-17", True, "11-07-17"),
        ("Eisheilige Nacht 2010", "Hessenhallen", ["Subway to Sally", "Saltatio Mortis", "Dunkelschön"], "10-12-18"),
        ("Nackt II Tour", "Centralstation", ["Subway to Sally"], "11-03-28"),
        ("Schwarz in Schwarz Tour", "Hugenottenhalle", ["Subway to Sally", "Nachtgeschrei"], "11-10-21"),
        ("Eisheilige Nacht 2011", "Hessenhallen", ["Subway to Sally", "Fiddler's Green", "Letzte Instanz", "Megaherz"], "11-12-17"),
        ("Sturm aufs Paradies Tour", "Alte Batschkapp", ["Saltatio Mortis", "Das Niveau"], "12-04-12"),
        ("Imaginaerum Tour", "Jahrhunderthalle", ["Nightwish", "Battle Beast", "Eklipse"], "12-04-23"),
        ("Otterrock 2012", "Sommerfesthalle", ["Subway to Sally", "Brandstein"], "12-06-16", True, "12-06-16"),
        ("Schlosshof Festival 2012", "Schlosshof Fulda", ["Subway to Sally", "Saltatio Mortis"], "12-08-24", True, "12-08-24"),
        ("Subway to Sally Fantreffen", "Ferienland Crispendorf", ["Subway to Sally"], "12-09-15"),
        ("Das Comeback Tour", "Europahalle", ["die ärzte"], "12-10-26"),
        ("Sturm aufs Paradies Tour", "KUZ", ["Saltatio Mortis", "Das Niveau"], "12-11-29"),
        ("Eisheilige Nacht 2012", "Hessenhallen", ["Subway to Sally", "Die Apokalyptischen Reiter", "Russkaja", "Fejd"], "12-12-22"),
        ("Eisheilige Nacht 2012", "Metropolishalle", ["Subway to Sally", "Die Apokalyptischen Reiter", "Russkaja", "Fejd"], "12-12-30"),
        ("W:O:A 2013", "Wacken", ["Alice Cooper", "Deep Purple", "ASP", "Die Apokalyptischen Reiter", "Doro", "Feuerschwanz", "Rage", "Motörhead", "Nightwish", "Russkaja", "Sabaton", "Subway to Sally", "W:O:A Firefighters"], "13-08-01", True, "13-08-03"),
        ("Gothic Meets Klassik 2013", "Haus Auensee", ["Subway to Sally", "Combichrist", "OOMPH!", "Subway to Sally", "Combichrist", "Lord of the Lost"], "13-10-26", True, "13-10-27"),
        ("Das Schwarze 1x1 Tour", "Posthalle", ["Saltatio Mortis", "Versengold"], "13-11-02"),
        ("Eisheilige Nacht 2013", "Hessenhallen", ["Subway to Sally", "Lordi", "Lord of the Lost"], "13-12-21"),
        ("Das Schwarze 1x1 Tour", "Batschkapp", ["Saltatio Mortis", "Versengold"], "14-03-13"),
        ("Mitgift Tour", "Batschkapp", ["Subway to Sally", "Darkhaus"], "14-04-10"),
        ("Per Aspera ad Aspera Tour", "Batschkapp", ["ASP"], "14-10-29"),
        ("Nur die Besten werden alt Tour", "Batschkapp", ["J.B.O.", "Swiss & Die Andern"], "14-11-09"),
        ("Voicefest", "Batschkapp", ["Van Canto", "Stimmgewalt", "In Legend"], "14-12-14"),
        ("Eisheilige Nacht 2014", "Hessenhallen", ["Subway to Sally", "Saltatio Mortis", "Unzucht", "Heldmaschine"], "14-12-20"),
        ("Mitgift Tour", "Centralstation", ["Subway to Sally", "Drescher"], "15-03-25"),
        ("Schlossgrabenfest 2015", "Karolinenplatz", ["Wise Guys"], "15-05-21", True, "15-05-24"),
        ("Faszination Weltraum Tour", "Jahrhunderthalle", ["Farin Urlaub Racing Team"], "15-06-03"),
        ("Ehrlich & Laut Festival 2015", "Hessenhalle", ["Subway to Sally", "Saltatio Mortis"], "15-08-20", True, "15-08-22"),
        ("Zirkus Zeitgeist Tour", "Posthalle", ["Saltatio Mortis", "Nachtgeschrei"], "15-11-14"),
        ("Endless Forms Most Beautiful Tour", "Jahrhunderthalle", ["Nightwish", "Arch Enemy"], "15-12-04"),
        ("Eisheilige Nacht 2015", "Hessenhallen", ["Subway to Sally", "Fiddler's Green", "Letzte Instanz"], "15-12-19"),
        ("Zirkus Zeitgeist Tour", "Batschkapp", ["Saltatio Mortis", "Mr. Irish Bastard"], "16-03-31"),
        ("Voices of Fire Tour", "Batschkapp", ["Van Canto", "Freedom Call", "Grailknights"], "16-04-17"),
        ("NEON Tour", "Batschkapp", ["Subway to Sally"], "16-04-20"),
        ("Zirkus Zeitgeist Tour", "Colos Saal", ["Saltatio Mortis"], "16-08-05"),
        ("Eisheilige Nacht 2016", "Hessenhallen", ["Subway to Sally", "Eluveitie", "Lord of the Lost"], "16-12-16"),
        ("The Last Tour", "Batschkapp", ["Sabaton", "Accept"], "17-01-31"),
        ("Zirkus Zeitgeist Derniere", "Historische Stadthalle", ["Saltatio Mortis"], "17-03-04"),
        ("NEON Tour", "Alter Schlachthof", ["Subway to Sally"], "17-03-24"),
        ("Uncharted Tour", "Mitsubishi Electric Halle", ["The Piano Guys"], "17-06-10"),
        ("In Castellis Tour 2017", "Burg Wertheim", ["Saltatio Mortis", "Versengold"], "17-07-14"),
        ("MPS", "Schlossgarten", ["Saltatio Mortis", "Versengold", "Feuerschwanz"], "17-07-29", True, "17-07-30"),
        ("MPS", "Domgarten", ["Saltatio Mortis", "Versengold"], "17-08-27", True, "17-08-28"),
        ("Dark Before Dawn Tour", "Batschkapp", ["Breaking Benjamin"], "17-09-03"),
        ("Funkenflug Tour", "Colos Saal", ["Versengold", "D'Artagnan"], "17-10-28"),
        ("Zirkus Zeitgeist Tour", "Halle 02", ["Saltatio Mortis"], "17-11-17"),
        ("Eisheilige Nacht 2017", "Hessenhallen", ["Subway to Sally", "Mono Inc.", "Feuerschwanz"], "17-12-22"),
        ("Nacht der Balladen 2018", "St. Johannis Kirche", ["Versengold"], "18-02-16"),
        ("Funkenflug Tour", "Batschkapp", ["Versengold", "Antiheld"], "18-04-19"),
        ("Schlossgrabenfest", "Karolinenplatz", ["J.B.O."], "18-05-31", True, "31-06-03"),
        ("European Invasion", "Alter Schlachthof", ["Galactic Empire"], "18-06-19"),
        ("MPS", "Schlossgarten", ["Saltatio Mortis", "Versengold", "Mr. Hurley und die Pulveraffen"], "18-07-28", True, "18-07-29"),
        ("MPS", "Fühlinger See", ["Saltatio Mortis", "Fiddler's Green", "Versengold"], "18-08-04", True, "18-08-05"),
        ("Feuertal Festival 2018", "Waldbühne Hardt", ["Saltatio Mortis", "Versengold", "Bannkreis", "Paddy and the Rats", "Ganaim", "Incantatem", "Dunkelschön"], "18-08-17", True, "18-08-18"),
        ("MPS", "Domgarten", ["Saltatio Mortis"], "18-08-25", True, "18-08-26"),
        ("Tour Number Seven", "Batschkapp", ["Van Canto", "Evertale", "MoonSun"], "18-10-07"),
        ("Brot und Spiele Tour", "Alter Schlachthof", ["Saltatio Mortis", "Firkin"], "18-11-23"),
        ("Decades Tour", "Festhalle", ["Nightwish", "Beast in Black"], "18-12-05"),
        ("Eisheilige Nacht 2018", "Hessenhallen", ["Subway to Sally", "Versengold", "Russkaja", "Paddy and the Rats"], "18-12-22"),
        ("Pumping Iron Power Tour", "Colos Saal", ["Grailknights"], "19-01-31"),
        ("Hey! Tour", "Batschkapp", ["Subway to Sally", "MajorVoice"], "19-03-28"),
        ("Brot und Spiele Tour", "Batschkapp", ["Saltatio Mortis", "Indecent Behavior"], "19-04-11"),
        ("MPS", "Schlosspark", ["Saltatio Mortis", "Versengold", "Fiddler's Green"], "19-05-30", True, "19-06-02"),
        ("M'era Luna 2019", "Flugplatz Hildesheim", ["ASP", "Within Temptation", "Subway to Sally", "Joachim Witt", "Mono Inc.", "OOMPH!", "Corvus Corax", "Versengold", "Null Positiv"], "19-08-10", True, "19-03-11"),
        ("Burgentour 2019", "Amphitheater", ["In Extremo", "Manntra"], "19-08-23"),
        ("In Castellis Tour 2019", "Burg Wertheim", ["Saltatio Mortis", "Krayenzeit", "Das Niveau"], "19-08-30"),
        ("Nordlicht Tour", "Batschkapp", ["Versengold", "Mr. Irish Bastard"], "19-10-03"),
        ("Rockin' 1000", "Deutsche Bank Park", ["Rockin' 1000", "Gypsys"], "19-07-07"),
        ("MPS", "Schlossgarten", ["Versengold", "Mr. Hurley und die Pulveraffen"], "19-07-27", True, "19-07-28"),
        ("MPS", "Fühlinger See", ["Saltatio Mortis", "Versengold", "Fiddler's Green", "John Kanaka & The Jack Tars"], "19-08-03", True, "19-08-04"),
        ("PLWM", "Fredenbaumpark", ["Saltatio Mortis"], "19-11-23", True, "19-11-23"),
        ("Eisheilige Nacht 2019", "Hessenhallen", ["Subway to Sally", "Fiddler's Green", "Knasterbart", "Vogelfrey"], "19-12-21"),
        ("Metfest 2019", "Löwensaal", ["Feuerschwanz", "The O'Reillys and the Paddyhats", "Grailknights"], "19-12-28"),
        ("Kosmonautilus Tour", "Alter Schlachthof", ["ASP", "2 Minds Collide"], "20-01-25"),
        ("The Great Tour", "Festhalle", ["Sabaton", "Apocalyptica", "Amaranthe"], "20-01-31"),
        ("Pumping Iron Power Tour", "Colos Saal", ["Grailknights"], "20-02-07"),
        ("Strandkorb Metfest", "Volkspark Dutzendteich", ["Feuerschwanz", "Russkaja", "Grailknights"], "21-07-17"),
        ("Strandkorb Open Air", "Festplatz Finsterloh", ["Saltatio Mortis"], "21-09-02"),
        ("Hock Rock", "Schlossgarten", ["Fiddler's Green", "Saltatio Mortis", "Versengold", "Mr. Hurley und die Pulveraffen"], "21-09-17", True, "21-09-19"),
        ("Nacht der Balladen 2022", "Kurfürstliches Schloss", ["Versengold"], "22-04-23"),
        ("MPS", "Schlosspark", ["Saltatio Mortis", "Versengold", "Mr. Hurley und die Pulveraffen", "Schandmaul", "Fiddler's Green", "D'Artagnan", "Harmony Glen", "John Kanaka & The Jack Tars", "Tir Saor"], "22-05-28", True, "22-05-31"),
        ("Stadium Tour 2022", "Cannstatter Wasen", ["Rammstein", "Duo Játékok"], "22-06-10"),
        ("Feuertanz Festival 2022", "Burg Abenberg", ["Schandmaul", "Fiddler's Green", "Tanzwut", "Draco Faucium"], "22-06-24", True, "22-06-25"),
        ("Rockharz Festival 2022", "Flugplatz Ballenstedt", ["Powerwolf", "In Extremo", "Eisbrecher", "Steel Panther", "Tarja", "Subway to Sally", "ASP",
                                                                     "Sepultura", "Beast in Black", "Knorkator", "Betontod", "Ost+Front", "Knasterbart",
                                                                     "Der Schulz", "Paddy and the Rats", "Ad Infinitum", "April Art"], "22-07-06", True, "22-07-09"),
        ("Sommernächte 2022", "Colos Saal", ["Versengold", "Delva"], "22-07-15"),
        ("Frankenstein Kulturfestival 2022", "Burg Frankenstein", ["Mono Inc."], "22-07-22"),
        ("Legacy of the Beast Tour", "Deutsche Bank Park", ["Iron Maiden", "Powerwolf", "Airbourne"], "22-07-26"),
        ("Metfest 2022", "Carlswerk", ["Feuerschwanz", "Wind Rose", "Grailknights"], "22-08-06"),
        ("Sinner Rock 2022", "Festplatz Altengronau", ["Subway to Sally"], "22-09-09", True, "22-09-10"),
        ("Buffalo Bill in Rome Tour", "Maimarktgelände", ["die ärzte", "Drangsal", "Lüt"], "22-09-11"),
        ("XSMX", "Amphitheater Gelsenkirchen", ["Saltatio Mortis"], "22-09-24"),
        ("Hey! Tour", "Alter Schlachthof", ["Subway to Sally"], "22-10-09"),
        ("Was Kost Die Welt Tour", "Batschkapp", ["Versengold", "Von Grambusch"], "22-10-13"),
        ("Homecoming Tour", "Batschkapp", ["Lord of the Lost", "Nachtblut"], "22-10-20"),
        ("Für immer Frei Tour", "Alter Schlachthof", ["Saltatio Mortis", "Antiheld"], "22-11-11"),
        ("Wolfsnächte 2022", "Jahrhunderthalle", ["Powerwolf", "Dragonforce", "Warkings"], "22-11-25"),
        ("Human :||: Nature Tour", "Festhalle", ["Nightwish", "Beast in Black", "Turmion Kätilot"], "22-12-09"),
        ("PLWM", "Fredenbaumpark", ["Feuerschwanz", "Storm Seeker"], "22-12-10", True, "22-12-10"),
        ("Eisheilige Nacht 2022", "Hessenhallen", ["Subway to Sally", "Mr. Hurley und die Pulveraffen", "Tanzwut", "Mr. Irish Bastard"], "22-12-17"),
        ("Kompass zur Sonne Tour", "Alter Schlachthof", ["In Extremo", "Russkaja"], "22-12-21"),
        ("Dark Connection Tour", "Batschkapp", ["Beast in Black", "Firewind"], "23-02-28"),
        ("Titanium Tour", "Nachtleben", ["Vogelfrey", "Incordia"], "23-03-11"),
        ("Tour der Vernunft", "Colos Saal", ["Knorkator"], "23-03-16"),
        ("Nacht der Balladen 2023", "Rheingoldhalle", ["Versengold"], "23-03-19"),
        ("Superpower Tour", "Colos Saal", ["Grailknights", "Victorious", "Terra Atlantica"], "23-04-01"),
        ("Memento Mori Tour", "Batschkapp", ["Feuerschwanz", "Warkings", "Angus McSix"], "23-04-20"),
        ("Tekkno Tour", "Festhalle", ["Electric Callboy", "Blind Channel", "Future Palace"], "23-04-21"),
        ("The Tour to End All Tours", "Festhalle", ["Sabaton", "Baby Metal", "Lordi"], "23-04-22"),
        ("Silberne Hochzeit Tour", "Nachtleben", ["Tanzwut", "Manntra"], "23-04-28"),
        ("Endlich! Tour", "Alter Schlachthof", ["ASP", "Leichtmatrose"], "23-05-01"),
        ("Days of Destiny Tour", "Alter Schlachthof", ["Skillet", "Like A Storm", "Eva Under Fire"], "23-05-04"),
        ("Himmelfahrt Tour", "Batschkapp", ["Subway to Sally", "Blitz Union"], "23-05-10"),
        ("MPS", "Schlosspark", ["Harmony Glen", "John Kanaka & The Jack Tars", "Tir Saor"], "23-05-18", True, "23-05-21"),
        ("Stadium Tour 2023", "Olympiastadion", ["Rammstein", "Abélard"], "23-06-11"),
        ("An Evening with Nightwish", "Amphitheater Gelsenkirchen", ["Nightwish", "Bloodred Hourglass"], "23-06-12"),
        ("Rockharz Festival 2023", "Flugplatz Ballenstedt", ["Blind Guardian", "In Flames", "Arch Enemy", "Amon Amarth", "Mono Inc.", "Feuerschwanz",
                                                                     "Korpiklaani", "Saltatio Mortis", "Lord of the Lost", "Hämatom", "Versengold", "Knorkator",
                                                                     "Mr. Hurley und die Pulveraffen", "Equilibrium", "As I Lay Dying", "Fiddler's Green", "Unzucht", 
                                                                     "Skald", "The Dark Side of the Moon", "Bloodbound", "Firkin", "Rauhbein", "Wind Rose", 
                                                                     "Ohrenfeindt"], "23-07-05", True, "23-07-08"),
        ("Blood & Glitter Tour", "Colos Saal", ["Lord of the Lost", "Setyoursails"], "23-07-31"),
        ("MPS", "Domgarten", ["Versengold", "Subway to Sally", "Faun"], "23-08-26", True, "23-08-27"),
        ("MPS", "Tunierplatz Luhmühlen", ["Saltatio Mortis", "Feuerschwanz", "Versengold", "Subway to Sally", "Fiddler's Green", 
                                                  "Mr. Hurley und die Pulveraffen"], "23-09-01", True, "23-09-03"),
        ("Escalation Fest", "Rudolf-Weber-Arena", ["Electric Callboy", "Swiss & Die Andern", "Future Palace"], "23-09-23", True, "23-09-23"),
        ("Warm-Up Wunschkonzert", "Grünspan", ["Versengold"], "23-11-03"),
        ("Versengold - 20 Jahre", "Barclays Arena", ["Versengold", "Eklipse", "MacPiet"], "23-11-04"),
        ("DisrupTour", "Batschkapp", ["Fear Factory", "Butcher Babies", "Ignea", "Ghosts of Atlantis"], "23-11-25"),
        ("Eisheilige Nacht 2023", "Hessenhallen", ["Subway to Sally", "Fiddler's Green", "Manntra"], "23-12-16"),
        ("Tekkno Tour", "Hanns-Martin-Schleyer-Halle", ["Electric Callboy", "Nothing More", "Coldrain"], "24-02-24"),
        ("Lautes Gedenken Tour", "Batschkapp", ["Versengold", "Reis against the Spülmachine"], "24-02-29"),
        ("Leuchtturm Tour", "Colos Saal", ["Mr. Hurley und die Pulveraffen", "Habenichtse"], "24-03-23"),
        ("Lichtermeer Tour", "Nachtleben", ["Kupfergold", "Absolem"], "24-04-19")
        ]
    
    # Convert all events to the new format
    converted_concerts = []
    for event in old_events:
        try:
            concert = convert_event_to_concert(event)
            converted_concerts.append(concert)
        except Exception as e:
            print(f"Error converting event {event[0]}: {e}")
    
    # Sort concerts by date
    converted_concerts.sort(key=lambda x: x['date'])
    
    # Create the output JSON structure
    output = {
        "concerts": converted_concerts
    }
    
    # Write to JSON file
    output_filename = "converted_concerts.json"
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(converted_concerts, f, indent=4, ensure_ascii=False)
    
    print(f"Successfully converted {len(converted_concerts)} concerts to {output_filename}")
    
    # Also create a JavaScript file format matching the original structure
    js_output_filename = "converted_concerts.js"
    with open(js_output_filename, 'w', encoding='utf-8') as f:
        f.write("// Concert data - converted from original event list\n")
        f.write("const concertsData = ")
        json.dump(converted_concerts, f, indent=4, ensure_ascii=False)
        f.write(";\n\n")
        f.write("// Export for use in other modules\n")
        f.write("if (typeof module !== 'undefined' && module.exports) {\n")
        f.write("    module.exports = concertsData;\n")
        f.write("}\n")
    
    print(f"Also created JavaScript version: {js_output_filename}")
    
    # Print some statistics
    festivals = [c for c in converted_concerts if c['type'] == 'festival']
    concerts = [c for c in converted_concerts if c['type'] == 'concert']
    
    print(f"\nConversion Statistics:")
    print(f"Total events: {len(converted_concerts)}")
    print(f"Festivals: {len(festivals)}")
    print(f"Concerts: {len(concerts)}")
    print(f"Date range: {converted_concerts[0]['date']} to {converted_concerts[-1]['date']}")

if __name__ == "__main__":
    main()