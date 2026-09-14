Nouveau : Appel API pour mettre à jour les champs AVD.

Nouveau : Exportez et importez des Flows et/ou des Advanced Virtual Devices d'autres utilisateurs de Homey. Importez via Templates via les Paramètres de l'application, Réparation AVD ou lors de la création d'AVD.

Également nouveau : Appareil Virtuel Complètement Personnalisable (AVD) ! Consultez le sujet pour des exemples.

Créez un appareil et configurez-le vous-même :
* Statut Textuel que vous pouvez sélectionner comme Indicateur de Statut sur la Tuile de l'Appareil dans l'application mobile, définissable via des flows.
* Des icônes téléchargeables personnalisées peuvent être définies comme icône de capacité.
* Faites fonctionner la tuile d'appareil comme un bouton poussoir (restant clair/sombre après avoir cliqué) mais définissez Sombre/Clair sur la Tuile comme statut à partir d’un flow.
* 10 Nombres, Textes, Oui/Non, Boutons et Caméras peuvent être ajoutés.
* Masquez le bouton de la tuile de l'appareil depuis l'appareil lui-même.

Et

Une carte de flow pour récupérer l'Utilisateur et le Client depuis les Insights d'il y a x minutes (peut être zéro pour l'instant). Exemple : Récupérez la valeur de Salon pour la Température d’il y a 30 minutes.

Ou

Définissez les capacités des appareils par zone, par exemple ouvrir ou fermer tous les rideaux dans une zone précise, incluant (ou non) les sous-zones, d’une certaine marque ou type d'appareil. Écoute également les capacités pour lesquelles il n’y a pas de déclencheurs de l'application et vous donne des jetons avec l'Utilisateur et le Client (Application) qui ont activé/changé la valeur de capacité. Et une condition capable de définir une capacité et d’attendre une "erreur" spécifique.

Maintenant aussi une nouvelle carte d'action, qui récupère la valeur d'une capacité d'un appareil d'il y a [nombrede] minutes (incluant l'Utilisateur et le Client qui ont changé la valeur).

Et une carte App a démarré (Quand) et une carte App est en cours d'exécution (Et).

Exemple : Réglez curtain.windowcoverings_set à 0 dans Home incluant les sous-zones (Oui). Cela fermera tous les rideaux dans la maison et les sous-zones. Le régler à 1 ouvrira tous les rideaux.

Exemple : Écouter (surveiller) depuis Vacuumcleaner1 pour bin_full. Le flow sera déclenché lorsqu’un appareil nommé Vacuumcleaner1 aura la capacité bin_full changée. Vérifiez la valeur pour vrai et envoyez une notification sur votre téléphone pour savoir quand le bac de l'aspirateur est plein.

Exemple : Régler SamsungFrameTV.onoff sur True et attendre l'erreur : "Déjà allumé...". Le flow continuera après que la TV a été allumée. Donc plus besoin de flows avec des délais pour attendre que la TV ou la Machine à café s'allume.

Exemple : Récupérer la valeur de Salon pour Température d’il y a 30 minutes.