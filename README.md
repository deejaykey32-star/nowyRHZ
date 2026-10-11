# Wielka Pętla Trzech Sanktuariów

Strona pielgrzymki na wózku: **Kochłowice – Jasna Góra – Łagiewniki – Kochłowice** (15 dni, 14–28 czerwca, ok. 330 km), z mapą i nawigacją [Mapy.com](https://mapy.com) (dawniej Mapy.cz).

## Co jest na stronie

- **Mapa** całej pętli w kolorach etapów, sanktuaria (✝), noclegi (numery dni) i punkty orientacyjne. Z kluczem API trasy wyznacza Mapy.com po drogach, profilem „rower szosowy”, który wybiera asfalt.
- **Plan**: 15 dni w trzech etapach. Przy każdym dniu jest przebieg, ostrzeżenia, poziom trudności, nocleg i intencja dnia oraz przyciski:
  - 🧭 *Nawiguj w Mapy.com*: otwiera trasę dnia (ze wszystkimi punktami) w aplikacji lub na stronie Mapy.com,
  - 📍 *Z mojej pozycji*: nawigacja od miejsca, w którym jesteście, do celu dnia,
  - noclegi i apteki w pobliżu, pogoda, plik GPX, „dzień ukończony” (pasek postępu).
- **Dziś**: odliczanie do startu, a w trakcie pielgrzymki karta bieżącego dnia. Tryb GPS pokazuje, ile km zostało do noclegu i czy jesteście na trasie, oraz wysyła Waszą pozycję asyście (link do Mapy.com). Są tu też telefony alarmowe i numery ekipy.
- **Logistyka**: zasady bezpieczeństwa wózka, lista kontrolna sprzętu, kontakty ekipy, eksport GPX całej pętli i druk planu.
- **Duchowość**: teologia, filozofia, symbolika i znaczenie drogi oraz intencje na każdy dzień.
- Strona działa na telefonie i można ją dodać do ekranu głównego. Po pierwszym otwarciu interfejs działa offline, ale kafelki mapy wymagają internetu.

Postęp, lista kontrolna, kontakty i klucz API zapisują się tylko w przeglądarce danego urządzenia.

## Klucz API Mapy.com

Podkłady i wyznaczanie tras Mapy.com wymagają bezpłatnego klucza:

1. Zarejestruj się na <https://developer.mapy.com/> i utwórz klucz API.
2. W ustawieniach klucza ogranicz go do domeny, na której publikujesz stronę.
3. Wpisz klucz w `config.js` (`MAPY_API_KEY`) albo wklej go w zakładce **Ustawienia** na stronie.

Bez klucza strona pokazuje mapę OpenStreetMap z liniami orientacyjnymi. Przyciski nawigacji do Mapy.com działają zawsze.

## Edycja trasy

Wszystkie dane są w `js/data.js`. Każdy dzień ma tam punkty trasy (`via`: `[szerokość, długość, nazwa]`) i ciekawe miejsca (`pois`). **Współrzędne są przybliżone.** Przed wyjściem sprawdźcie je na mapie, zwłaszcza na drogach lokalnych Jury, i w razie potrzeby poprawcie. Po zmianie punktów trasy przeliczają się same.

Rok pielgrzymki ustawia się w `config.js` (`YEAR`) albo w zakładce Ustawienia.

## Uruchomienie i publikacja

To statyczna strona bez budowania, a Leaflet jest dołączony w `vendor/`.

```bash
python3 -m http.server 8000   # http://localhost:8000
```

Publikacja przez GitHub Pages: *Settings → Pages → Deploy from a branch*, gałąź główna, katalog `/`. GPS i tryb offline wymagają HTTPS, który GitHub Pages zapewnia.
