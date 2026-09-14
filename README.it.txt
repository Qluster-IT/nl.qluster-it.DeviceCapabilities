Nuovo: Chiamata API per aggiornare i campi AVD.

Nuovo: Esporta e importa Flows e/o Dispositivi Virtuali Avanzati da altri utenti di Homey. Importa tramite Template via Impostazioni App, Riparazione AVD o durante la creazione di AVD.

Inoltre nuovo: Dispositivo Virtuale Completamente Personalizzabile (AVD)! Vedi l'argomento per gli esempi.

Crea un dispositivo e configuratelo tu stesso:
* Stato Testuale che puoi selezionare come Indicatore di Stato sul Riquadro Dispositivo nell'App Mobile, impostabile tramite flussi.
* Icone personalizzabili caricabili possono essere impostate come icona delle capacità.
* Fai funzionare il Riquadro Dispositivo come Pulsante (che rimane chiaro/scuro dopo essere stato cliccato) ma imposta Chiaro/Scuro sul Riquadro come stato da un flusso.
* È possibile aggiungere 10 Numeri, Testi, Sì/No, Pulsanti e Telecamere ai dispositivi.
* Nascondi il pulsante del riquadro dispositivo dall'apparecchio stesso.

E

Una scheda flusso per recuperare l'Utente e il Cliente dagli Insights di x minuti fa (può essere zero per ora). Esempio: Recupera il valore da LivingRoom per la temperatura di 30 minuti fa.

Oppure

Imposta le capacità dei dispositivi per zona, ad esempio apri o chiudi tutte le tende in una certa zona, includendo (o meno) le sottozone, di un certo marchio o tipo di dispositivo. Ascolta anche per le capacità per cui non ci sono trigger dallo sviluppatore dell'app e ti dà token con l'Utente e il Cliente (App) che ha attivato/cambiato il valore della capacità. E una condizione in grado di impostare una capacità e aspettare un "errore" specifico.

Ora anche una nuova scheda azione, che recupera il valore da una capacità di un dispositivo da [numero di] minuti fa (includendo l'Utente e il Cliente che ha cambiato il valore).

E una scheda App ha avviato (Quando) e una scheda App è in esecuzione (E).

Esempio: Imposta curtain.windowcoverings_set a 0 in Casa includendo sottozone (Sì). Questo chiuderà tutte le tende in Casa e nelle sottozone. Impostando a 1 si apriranno tutte le tende.

Esempio: Ascolta (guarda) da Vacuumcleaner1 per bin_full. Il flusso verrà attivato quando un dispositivo chiamato Vacuumcleaner1 avrà la capacità bin_full cambiata. Controlla il valore per il vero e invia una notifica al tuo telefono per sapere quando il contenitore del aspirapolvere è pieno.

Esempio: Imposta SamsungFrameTV.onof su Vero e aspetta errore: Già accesa... Il flusso continuerà dopo che la TV è stata accesa. Quindi non più flussi con ritardi per attendere l'accensione di TV o Macchina del caffè.

Esempio: Recupera il valore da LivingRoom per la temperatura di 30 minuti fa.