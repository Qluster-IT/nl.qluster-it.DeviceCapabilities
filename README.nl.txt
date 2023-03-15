Nieuw: Chronographs en Better Logic Library Variabelen kunnen nu direct worden weergegeven op AVD-velden zonder flows.

Nieuw: API-oproep om AVD-velden bij te werken.

Nieuw: Exporteer en importeer Flows en/of Advanced Virtual Devices van andere Homey gebruikers.
Importeer via Templates via App Settings, AVD Repair of bij het aanmaken van AVD's.

Ook nieuw: Volledig Aanpasbaar Virtueel Apparaat (AVD) met Unieke Tekst Status Indicator!
Zie het Forum voor voorbeelden en uitleg.

Maak een apparaat aan en configureer het zelf:
* Tekstuele status die u kunt selecteren als statusindicator op de apparaattegel in de mobiele app, instelbaar via flows.
* Aangepaste uploadbare pictogrammen kunnen worden ingesteld als capabilities pictogram.
* Laat de apparaattegel functioneren als een drukknop (blijft licht/donker nadat erop is geklikt) maar stel Donker/licht op de tegel in als status van een flow.
* 10 nummers, teksten, ja/nee's, knoppen en camera's kunnen add_devices zijn.
* Verberg de apparaattegelknop van het apparaat zelf.

En

Een flowkaart om de Gebruiker en Klant uit de Inzichten van x minuten geleden op te halen (kan voorlopig nul zijn).
Voorbeeld: Haal de waarde op uit LivingRoom voor Temperature van 30 minuten geleden.

Of

Stel mogelijkheden van apparaten per zone in, bijvoorbeeld het openen of sluiten van alle gordijnen in een bepaalde zone, inclusief (of niet) de subzones, van een bepaald merk of apparaattype.
Luistert ook naar mogelijkheden waarvan er geen triggers zijn van de app-ontwikkelaar en geeft u tokens met de gebruiker en client (app) die de capabilitieswaarde hebben geactiveerd/gewijzigd.
En een voorwaarde die in staat is om een ​​capability in te stellen en te wachten op een specifieke "fout".

Nu ook een nieuwe actiekaart, die de waarde ophaalt van een capability van een apparaat van [aantal] minuten geleden (inclusief de Gebruiker en Client die de waarde hebben gewijzigd).

En een app is gestart kaart (wanneer) en een app loopt kaart (en).

Voorbeeld: curtain.windowcoverings_set instellen op 0 in Home inclusief subzones (Ja).
Hierdoor worden alle gordijnen in de Home en subzones gesloten. Als u deze op 1 zet, worden alle gordijnen geopend.

Voorbeeld: Luister (kijk) van Stofzuiger1 voor bin_full
De flow wordt geactiveerd wanneer een apparaat met de naam Stofzuiger1 de capability bin_full heeft gewijzigd.
Controleer of de waarde waar is en stuur een melding naar uw telefoon om te weten wanneer de stofzuigerbak vol is.

Voorbeeld: Stel SamsungFrameTV.onof in op True en wacht op fout: Al ingeschakeld...
De flow gaat door nadat de tv is ingeschakeld. Dus geen flows meer met vertragingen bij het wachten tot de tv of het koffiezetapparaat is ingeschakeld.

Voorbeeld: Haal de waarde op uit LivingRoom voor Temperature van 30 minuten geleden.