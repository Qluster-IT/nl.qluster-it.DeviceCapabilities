Nyhet: API-kall for å oppdatere AVD-felt.

Nyhet: Eksporter og importer Flows og/eller Advanced Virtual Devices fra andre Homey-brukere. Importer gjennom Maler via App-innstillinger, AVD-reparasjon eller når du lager AVD-er.

Også nytt: Fullt tilpassbart virtuelt apparat (AVD)! Se temaet for eksempler.

Lag en enhet og konfigurer den selv:
* Tekststatus som du kan velge som statusindikator på enheten i mobilappen, som kan settes gjennom flows.
* Tilpassede opplastbare ikoner kan settes som ferdighetsikon.
* La enheten fungere som en trykknapp (blir lys/mørk etter klikk), men sett mørk/lys på knappen som status fra en flow.
* 10 tall, tekster, ja/nei, knapper og kameraer kan legges til enheten.
* Skjul enhetens knapp fra selve enheten.

Og 

Et kort for å hente brukeren og klienten fra innsikt fra x minutter siden (kan være null for nå). Eksempel: Hent verdien fra Stue for temperatur fra 30 minutter siden.

Eller

Sett ferdigheter til enheter per sone, for eksempel åpne eller lukke alle gardiner i en bestemt sone, inkludert (eller ikke) undersoner, av et bestemt merke eller enhetstype. Lytter også til ferdigheter uten triggere fra apputvikleren og gir deg tokens med brukeren og klienten (app) som aktiverte/endrede ferdighetsverdien. Og en tilstand som kan sette en ferdighet og vente på en spesifikk "feil".

Nå også et nytt handlingskort som henter verdien fra en ferdighet fra en enhet fra [antall] minutter siden (inkludert brukeren og klienten som endret verdien).

Og et App har startet-kort (Når) og et App kjører-kort (Og).

Eksempel: Sett gardin.windowcoverings_set til 0 i huset inkludert undersoner (Ja). Dette vil lukke alle gardiner i hjemmet og undersonene. Å sette det til 1 vil åpne alle gardiner.

Eksempel: Lytt (se) fra Vacuumcleaner1 for bin_full Flowen vil bli utløst når en enhet kalt Vacuumcleaner1 har endret kapasiteten bin_full. Sjekk verdien for true og send en melding til telefonen din for å vite når støvsugerens beholder er full.

Eksempel: Sett SamsungFrameTV.onof til True og vent på feil: Allerde slått på... Flowen vil fortsette etter at TV-en har blitt slått på. Så ingen flere flows med forsinkelser for å vente på at TV-en eller kaffemaskinen skal slå seg på.

Eksempel: Hent verdien fra Stue for temperatur fra 30 minutter siden.