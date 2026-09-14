Nyhet: API-anrop för att uppdatera AVD-fält.

Nyhet: Exportera och importera Flows och/eller Advanced Virtual Devices från andra Homey-användare. Importera via Mallar via App-inställningar, AVD-reparation eller när du skapar AVDs.

Också nytt: Fullt anpassningsbar virtuell enhet (AVD)! Se ämnet för exempel.

Skapa en enhet och konfigurera den själv:
* Textstatus som du kan välja som statusindikator på enhetsbrickan i mobilappen, kan ställas in via flöden.
* Anpassningsbara ikoner kan laddas upp och ställas in som kapabilitetsikon.
* Få enhetsbrickan att fungera som en tryckknapp (som stannar ljus/mörk efter att ha klickats) men ställ in Mörk/Ljus på brickan som status från ett flöde.
* 10 siffror, texter, ja/nej, knappar och kameror kan läggas till på add_devices.
* Dölj enhetsknappen från enheten själv.

Och

Ett flödeskort för att hämta användaren och klienten från insikter för x minuter sedan (kan vara noll för nu). Exempel: Hämta värdet från Vardagsrum för temperatur från 30 minuter sedan.

Eller

Ställ in enheters kapabiliteter per zon, till exempel öppna eller stänga alla gardiner i en viss zon, inklusive (eller inte) underzonerna, av ett visst märke eller enhetstyp.
Lyssnar även på kapabiliteter som det inte finns några utlösare för från apputvecklaren och ger dig tokens med Användaren och Klienten (App) som aktiverade/ändrade kapabilitetsvärdet.
Och ett villkor som kan ställa in en kapabilitet och vänta på ett specifikt "fel".

Nu också ett nytt åtgärdskort som hämtar värdet från en kapabilitet från en enhet från [antal] minuter sedan (inklusive användaren och klienten som ändrade värdet).

Och ett App har startat-kort (När) och ett App körs-kort (Och).

Exempel: Ställ in curtain.windowcoverings_set till 0 i Hem inklusive underzoner (Ja). Detta kommer att stänga alla gardiner i Hem och underzoner. Att ställa in den till 1 kommer att öppna alla gardiner.

Exempel: Lyssna (vakta) från Vacuumcleaner1 för bin_full
Flödet utlöses när en enhet kallad Vacuumcleaner1 har kapaciteten bin_full ändrad. Kontrollera värdet för sant och skicka en notis till din telefon för att veta när dammsugarens behållare är full.

Exempel: Ställ in SamsungFrameTV.onof till Sant och vänta på fel: Already powered on...
Flödet fortsätter när TV:n har slagits på. Så inga fler flöden med fördröjningar för att vänta på att TV:n eller Kaffemaskinen ska slå på.

Exempel: Hämta värdet från Vardagsrum för temperatur från 30 minuter sedan.