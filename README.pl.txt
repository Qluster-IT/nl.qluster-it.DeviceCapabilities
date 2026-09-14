Nowość: wywołanie API do aktualizacji pól AVD.

Nowość: Eksportuj i importuj Flows i/lub Advanced Virtual Devices od innych użytkowników Homey. Importuj przez Szablony w Ustawieniach Aplikacji, Naprawie AVD lub przy tworzeniu nowych AVD.

Również nowość: W pełni konfigurowalne Wirtualne Urządzenie (AVD)!
Zobacz temat, aby uzyskać przykłady.

Stwórz urządzenie i skonfiguruj je samodzielnie:
* Tekstowy Status, który możesz wybrać jako Wskaźnik Statusu na Kafelku Urządzenia w Aplikacji Mobilnej, ustawialne przez flows.
* Niestandardowe, wgrywalne ikony mogą być ustawione jako ikona zdolności.
* Kafelek Urządzenia może działać jako Przycisk (pozostający jasny/ciemny po kliknięciu), ale ustawiaj Ciemny/Jasny na Kafelku jako status z flows.
* 10 Liczb, Tekstów, Tak/Nie, Przycisków i Kamer może być dodane jako device.
* Ukryj przycisk kafelka urządzenia z samego urządzenia.

I 

Karta przepływu do pobierania Użytkownika i Klienta z Insights sprzed x minut (może być zero na teraz).
Przykład: Pobierz wartość z LivingRoom dla Temperatury sprzed 30 minut.

Lub

Ustaw zdolności urządzenia na strefę, na przykład otwórz lub zamknij wszystkie zasłony w określonej strefie, w tym (lub nie) podstrefy, określonej marki lub typu urządzenia.
Również nasłuchuje zdolności, których nie ma wyzwalaczy od dewelopera aplikacji i daje Ci tokeny z Użytkownikiem i Klientem (Aplikacja), który aktywowała/zmieniła wartość zdolności.
A także warunek mogący ustawić zdolność i czekać na określony "błąd".

Teraz także nowa karta akcji, która pobiera wartość z zdolności urządzenia sprzed [numberof] minut (w tym Użytkownik i Klient, który zmienił wartość).

I karta "Aplikacja została uruchomiona" (Kiedy) oraz karta "Aplikacja działa" (I).

Przykład: Ustaw "curtain.windowcoverings_set" na 0 w Home w tym podstrefy (Tak).
To zamknie wszystkie zasłony w Home i podstrefach. Ustawienie na 1 otworzy wszystkie zasłony.

Przykład: Nasłuchuj (oglądaj) z Vacuumcleaner1 dla bin_full.
Przepływ zostanie uruchomiony, gdy urządzenie o nazwie Vacuumcleaner1 zmieni stan bin_full.
Sprawdź wartość jako prawda i wyślij powiadomienie na swój telefon, aby wiedzieć, kiedy kosz odkurzacza się zapełnił.

Przykład: Ustaw SamsungFrameTV.onof na Prawda i czekaj na błąd: Już włączony...
Przepływ będzie kontynuowany po włączeniu TV. Więc więcej nie czekaj na opóźnienia włączenia TV lub Ekspresu do Kawy.

Przykład: Pobierz wartość z LivingRoom dla Temperatury sprzed 30 minut.