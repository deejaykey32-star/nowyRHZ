// Konfiguracja strony pielgrzymki.
// Klucz API Mapy.com (bezpłatny): https://developer.mapy.com/ → "Mapy.com API" → utwórz projekt i klucz.
// Ustaw w panelu klucza ograniczenie do domeny, na której publikujesz stronę.
// Klucz można też wkleić w zakładce „Ustawienia” na stronie – wtedy zapisze się tylko w tej przeglądarce.
window.PILGRIM_CONFIG = {
  MAPY_API_KEY: '',
  // Rok pielgrzymki (daty 14–28 czerwca).
  YEAR: 2027,
  // Domyślny profil trasy Mapy.com: bike_road (preferuje asfalt – najlepszy dla wózka),
  // foot_fast (pieszo, najkrótsza), car_short (drogi publiczne, najkrótsza).
  ROUTE_TYPE: 'bike_road'
};
