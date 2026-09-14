Ny: API-kald til at opdatere AVD-felter.

Ny: Eksporter og importer Flows og/eller Avancerede Virtuelle Enheder fra andre Homey-brugere. Importer via Skabeloner via App-indstillinger, AVD Reparation eller når du opretter AVD'er.

Også nyt: Fuldt tilpasselig Virtuel Enhed (AVD)! Se emnet for eksempler.

Opret en enhed og konfigurer den selv:
* Tekstuel Status, som du kan vælge som Statusindikator på Enhedsflisen i Mobilappen, kan sættes via flows.
* Brugerdefinerede upload-bare ikoner kan indstilles som kapabilitetsikon.
* Lad Enhedsflisen fungere som en Trykknap (bliver lys/mørk efter klik) men sæt Mørk/Lys på Flisen som status fra et flow.
* 10 Numre, Tekster, Ja/Nej, Knapper og Kameraer kan tilføjes.
* Skjul enhedsfliseknappen fra selve enheden.

Og

Et flowkort til at hente Bruger og Klient fra Indsigterne fra x minutter siden (kan være nul for nu). Eksempel: Hent værdien fra Stuen for Temperatur fra 30 minutter siden.

Eller

Indstil kapabiliteter for enheder pr. zone, fx åbne eller lukke alle gardiner i en bestemt zone, inklusive (eller ikke) underzoner, af et bestemt mærke eller enhedstype. Lytter også efter kapabiliteter, som der ikke er nogen triggere for fra app-udvikleren, og giver dig tokens med Bruger og Klient (App), som aktiverede/ændrede kapabilitetsværdien. Og en betingelse i stand til at indstille en kapabilitet og vente på en specifik "fejl".

Nu også et nyt aktionkort, som henter værdien fra en kapabilitet fra en enhed fra [antal] minutter siden (inklusive Bruger og Klient, som ændrede værdien).

Og et App er startet kort (Når) og et App kører kort (Og).

Eksempel: Sæt curtain.windowcoverings_set Til 0 i Hjemmet inklusive underzoner (Ja). Dette vil lukke alle gardiner i Hjemmet og underzoner. At sætte det til 1 vil åbne alle gardiner.

Eksempel: Lyt (se) fra Vacuumcleaner1 for bin_full Flowet vil blive udløst, når en enhed kaldet Vacuumcleaner1 har kapaciteten bin_full ændret.
Tjek værdien for sand og send en notifikation til din telefon for at vide, hvornår støvsugerens beholder er fuld.

Eksempel: Sæt SamsungFrameTV.onof til Sandt og vent på fejl: Tændt allerede... Flowet vil fortsætte efter TV'et er blevet tændt. Så ikke flere flows med forsinkelser for at vente på TV eller Kaffemaskine for at tænde.

Eksempel: Hent værdien fra Stuen for Temperatur fra 30 minutter siden.