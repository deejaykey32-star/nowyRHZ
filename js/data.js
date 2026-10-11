// Dane trasy „Wielkiej Pętli Trzech Sanktuariów”.
// Współrzędne [szerokość, długość] są przybliżone – przed wyjściem warto je sprawdzić
// na mapie i w razie potrzeby poprawić tutaj (punkty trasy = "via", ciekawe miejsca = "pois").

window.PILGRIMAGE = {
  title: 'Wielka Pętla Trzech Sanktuariów',
  subtitle: 'Kochłowice – Jasna Góra – Łagiewniki – Kochłowice',

  stages: [
    {
      id: 1,
      name: 'Etap I: Z Kochłowic do Matki Bożej Częstochowskiej',
      short: 'Kochłowice → Jasna Góra',
      days: '4 dni, 14–17 czerwca',
      color: '#2563eb',
      about: 'Teren silnie zurbanizowany, a następnie podmiejski. Trasa w większości płaska, prowadząca przez miasta aglomeracji śląskiej i spokojniejsze wsie w kierunku północnym.'
    },
    {
      id: 2,
      name: 'Etap II: Główny Szlak Orlich Gniazd',
      short: 'Jasna Góra → Łagiewniki',
      days: '7 dni, 18–24 czerwca',
      color: '#c2410c',
      about: 'Najbardziej wymagający fizycznie odcinek. Pojawią się podjazdy i zjazdy, dlatego wsparcie asystentów lub dostawka elektryczna do wózka będą tu kluczowe. Trasa wiedzie utwardzonymi szlakami rowerowymi i lokalnymi drogami asfaltowymi o małym natężeniu ruchu.'
    },
    {
      id: 3,
      name: 'Etap III: Powrót w stronę domu',
      short: 'Łagiewniki → Kochłowice',
      days: '4 dni, 25–28 czerwca',
      color: '#047857',
      about: 'Powrót z Krakowa na Górny Śląsk. Teren systematycznie opada (więcej zjazdów niż podjazdów). Wykorzystujemy dawne trasy królewskie i gęstą sieć miasteczek ze ścieżkami dla pieszych i rowerów.'
    }
  ],

  days: [
    {
      n: 1, date: '06-14', stage: 1, km: 20, level: 1,
      from: 'Ruda Śląska (Kochłowice)', to: 'Radzionków / Tarnowskie Góry',
      start: 'Poranna Msza Święta i błogosławieństwo w Sanktuarium Matki Bożej z Lourdes w Kochłowicach.',
      route: 'Przejazd przez Chorzów Batory i centrum Bytomia.',
      pois: [
        { name: 'Sanktuarium MB z Lourdes, Kochłowice', at: [50.2550, 18.8985], note: 'Msza Święta na rozpoczęcie i błogosławieństwo.' },
        { name: 'Rynek w Bytomiu', at: [50.3480, 18.9157], note: 'Możliwy odpoczynek – twarda nawierzchnia.' }
      ],
      via: [
        [50.2550, 18.8985, 'Kochłowice – Sanktuarium'],
        [50.2810, 18.9160, 'Chorzów Batory'],
        [50.3480, 18.9157, 'Bytom – Rynek'],
        [50.3990, 18.9000, 'Radzionków'],
        [50.4300, 18.8700, 'Tarnowskie Góry (płd. dzielnice)']
      ],
      sleep: 'Okolice Radzionkowa lub południowych dzielnic Tarnowskich Gór.',
      intention: 'Oddanie słabości ciała w ręce Maryi – jak chorzy w Lourdes.'
    },
    {
      n: 2, date: '06-15', stage: 1, km: 18, level: 1,
      from: 'Tarnowskie Góry', to: 'Miasteczko Śląskie / Ożarowice',
      route: 'Wyjazd z Tarnowskich Gór w kierunku wschodnim, z wykorzystaniem ciągów pieszo-rowerowych.',
      pois: [
        { name: 'Zalew Nakło-Chechło', at: [50.4670, 18.9240], note: 'Asfaltowe alejki wokół jeziora – idealne miejsce na dłuższy, bezpieczny postój.' }
      ],
      via: [
        [50.4300, 18.8700, 'Tarnowskie Góry'],
        [50.4670, 18.9240, 'Zalew Nakło-Chechło'],
        [50.4800, 18.9950, 'Tąpkowice'],
        [50.4690, 19.0460, 'Ożarowice']
      ],
      sleep: 'Ożarowice lub Zendek (okolice lotniska w Pyrzowicach).',
      intention: 'Za tych, którzy idą przez życie samotnie – by spotkali swojego asystenta w drodze.'
    },
    {
      n: 3, date: '06-16', stage: 1, km: 20, level: 2,
      from: 'Ożarowice', to: 'Koziegłowy / Poraj',
      route: 'Zmiana krajobrazu na bardziej wiejski. Korzystamy z dróg powiatowych.',
      warn: 'Wymagana asysta z tyłu ze względu na ruch aut.',
      pois: [
        { name: 'Rynek w Koziegłowach', at: [50.5995, 19.1640] },
        { name: 'Zalew Porajski', at: [50.6650, 19.2400], note: 'Malownicze miejsce na odpoczynek.' }
      ],
      via: [
        [50.4690, 19.0460, 'Ożarowice'],
        [50.5995, 19.1640, 'Koziegłowy – Rynek'],
        [50.6650, 19.2400, 'Zalew Porajski'],
        [50.6800, 19.2150, 'Poraj']
      ],
      sleep: 'Poraj lub Jastrząb (rozwinięta baza turystyczna z podjazdami dla wózków).',
      intention: 'Za kierowców mijających nas na drogach – o rozwagę i życzliwość.'
    },
    {
      n: 4, date: '06-17', stage: 1, km: 17, level: 1,
      from: 'Poraj', to: 'Jasna Góra, Częstochowa',
      route: 'Wjazd do Częstochowy od strony południowej – najlepiej wzdłuż al. Wojska Polskiego (równe chodniki i ścieżki rowerowe).',
      pois: [
        { name: 'Aleja Najświętszej Maryi Panny', at: [50.8114, 19.1180], note: 'Płaski, reprezentacyjny deptak prowadzący prosto pod klasztor.' },
        { name: 'Jasna Góra', at: [50.8123, 19.0972], note: 'Serce pielgrzymki – miejsce duchowej siły i wspólnoty.' }
      ],
      via: [
        [50.6800, 19.2150, 'Poraj'],
        [50.7820, 19.1560, 'Częstochowa – al. Wojska Polskiego'],
        [50.8114, 19.1250, 'Aleja NMP'],
        [50.8123, 19.0972, 'Jasna Góra']
      ],
      sleep: 'Domy Pielgrzyma na Jasnej Górze (w pełni dostosowane do potrzeb osób z niepełnosprawnościami).',
      intention: 'Zawierzenie wszystkich uczestników przed Cudownym Obrazem – siła na etap jurajski.'
    },
    {
      n: 5, date: '06-18', stage: 2, km: 26, level: 2,
      from: 'Częstochowa', to: 'Złoty Potok',
      route: 'Wymarsz z Jasnej Góry i kierunek na Olsztyn wydzieloną, gładką ścieżką rowerową. Dalej spokojne, asfaltowe drogi przez Biskupice i Choroń.',
      pois: [
        { name: 'Ruiny Zamku w Olsztynie', at: [50.7497, 19.2756], note: 'Widoczne z płaskiej drogi.' },
        { name: 'Stawy w Złotym Potoku', at: [50.7110, 19.4330], note: 'Spacer asfaltową aleją wokół stawów młyńskich.' }
      ],
      via: [
        [50.8123, 19.0972, 'Jasna Góra'],
        [50.7497, 19.2756, 'Olsztyn'],
        [50.7310, 19.3110, 'Biskupice'],
        [50.7050, 19.3590, 'Choroń'],
        [50.7105, 19.4350, 'Złoty Potok']
      ],
      sleep: 'Złoty Potok.',
      intention: 'Za wszystkich, którzy opiekują się chorymi i niepełnosprawnymi.'
    },
    {
      n: 6, date: '06-19', stage: 2, km: 18, level: 2,
      from: 'Złoty Potok', to: 'Zamek Mirów / Bobolice',
      route: 'Zjazd w kierunku Żarek, finał dnia pod odrestaurowanym Zamkiem w Bobolicach.',
      warn: 'Zjazd w stronę Żarek – kontrola hamulców przed startem.',
      pois: [
        { name: 'Stodoły w Żarkach', at: [50.6260, 19.3700], note: 'Utwardzony teren targowy.' },
        { name: 'Zamek Mirów', at: [50.6130, 19.4740] },
        { name: 'Zamek Bobolice', at: [50.6060, 19.4940], note: 'Wybrukowana droga i asfalt pozwalają podjechać pod same mury.' }
      ],
      via: [
        [50.7105, 19.4350, 'Złoty Potok'],
        [50.6260, 19.3700, 'Żarki'],
        [50.6130, 19.4740, 'Mirów'],
        [50.6060, 19.4940, 'Bobolice']
      ],
      sleep: 'Okolice Mirowa lub Bobolic.',
      intention: 'Za tych, których życie legło w gruzach – by odbudowali je na Skale.'
    },
    {
      n: 7, date: '06-20', stage: 2, km: 15, level: 1,
      from: 'Bobolice', to: 'Podlesice',
      route: 'Bardzo spokojny odcinek relaksacyjny poprowadzony po równym, nowym asfalcie przez Hucisko i Kotowice.',
      pois: [
        { name: 'Skały Kroczyckie – Góra Zborów', at: [50.5710, 19.5290], note: 'Widok z poziomu jezdni.' }
      ],
      via: [
        [50.6060, 19.4940, 'Bobolice'],
        [50.5960, 19.5150, 'Hucisko'],
        [50.5830, 19.5100, 'Kotowice'],
        [50.5745, 19.5280, 'Podlesice']
      ],
      sleep: 'Podlesice.',
      intention: 'Dzień odpoczynku i wdzięczności – za asystentów i całą ekipę.'
    },
    {
      n: 8, date: '06-21', stage: 2, km: 19, level: 3,
      from: 'Podlesice', to: 'Ogrodzieniec (Podzamcze)',
      route: 'Droga powiatowa z Kroczyc przez Morsko. Dojazd pod zamek ułatwia chodnik u podnóża góry w Podzamczu.',
      warn: 'Droga powiatowa – wymagana szczególna ostrożność, samochód techniczny z tyłu.',
      pois: [
        { name: 'Zamek Ogrodzieniec', at: [50.4530, 19.5530], note: 'Można obejść z zewnątrz wybrukowanymi/asfaltowymi ścieżkami u podstawy skał.' }
      ],
      via: [
        [50.5745, 19.5280, 'Podlesice'],
        [50.5600, 19.5100, 'Kroczyce'],
        [50.5250, 19.5300, 'Morsko'],
        [50.4530, 19.5530, 'Podzamcze']
      ],
      sleep: 'Podzamcze / Ogrodzieniec.',
      intention: 'O pokorę wobec kruchości ludzkich dzieł – mury kruszeją, duch idzie dalej.'
    },
    {
      n: 9, date: '06-22', stage: 2, km: 24, level: 2,
      from: 'Ogrodzieniec', to: 'Wolbrom',
      route: 'Zjazd ze wzniesień Ogrodzieńca, dalej drogą asfaltową w stronę Pilicy, przejście przez południową część Jury do Wolbromia.',
      warn: 'Zjazd z Ogrodzieńca – asystent z tyłu, kontrola prędkości.',
      pois: [
        { name: 'Zamek w Pilicy i rynek', at: [50.4660, 19.6560] }
      ],
      via: [
        [50.4530, 19.5530, 'Podzamcze'],
        [50.4660, 19.6560, 'Pilica'],
        [50.3800, 19.7600, 'Wolbrom']
      ],
      sleep: 'Wolbrom.',
      intention: 'Za rodziny osób z niepełnosprawnościami – o siły na codzienność.'
    },
    {
      n: 10, date: '06-23', stage: 2, km: 27, level: 2,
      from: 'Wolbrom', to: 'Ojców',
      route: 'Szosą przez Trzyciąż i Skałę. Finałem jest zjazd do Doliny Prądnika.',
      warn: 'Zjazd do Doliny Prądnika jest stromy. Droga w dolinie bywa uczęszczana przez auta – sprawdźcie aktualną organizację ruchu na miejscu.',
      pois: [
        { name: 'Zamek w Pieskowej Skale', at: [50.2435, 19.7790] },
        { name: 'Maczuga Herkulesa', at: [50.2450, 19.7800] },
        { name: 'Ojcowski Park Narodowy', at: [50.2110, 19.8290], note: 'Utwardzona droga przez dolinę – jeden z najprzyjemniejszych dni dla wózka.' }
      ],
      via: [
        [50.3800, 19.7600, 'Wolbrom'],
        [50.3120, 19.8340, 'Trzyciąż'],
        [50.2340, 19.8530, 'Skała'],
        [50.2110, 19.8290, 'Ojców']
      ],
      sleep: 'Ojców.',
      intention: 'O zachwyt nad pięknem stworzenia i umiejętność zatrzymania się.'
    },
    {
      n: 11, date: '06-24', stage: 2, km: 25, level: 2,
      from: 'Ojców', to: 'Kraków (Łagiewniki)', special: 'Rozesłanie',
      route: 'Wyjazd z Doliny Prądnika asfaltem przez Prądnik Korzkiewski i wjazd do północnego Krakowa. W mieście płaska infrastruktura (np. Bulwary Wiślane).',
      pois: [
        { name: 'Błonia Krakowskie', at: [50.0600, 19.9120] },
        { name: 'Wawel', at: [50.0540, 19.9355] },
        { name: 'Sanktuarium Bożego Miłosierdzia', at: [50.0197, 19.9330], note: 'Uroczysta Msza Święta z grupami z innych ścieżek.' }
      ],
      via: [
        [50.2110, 19.8290, 'Ojców'],
        [50.1580, 19.8840, 'Prądnik Korzkiewski'],
        [50.1200, 19.9200, 'Zielonki'],
        [50.0600, 19.9120, 'Błonia'],
        [50.0540, 19.9355, 'Wawel / Bulwary'],
        [50.0197, 19.9330, 'Łagiewniki']
      ],
      sleep: 'Domy duszpasterskie w Łagiewnikach.',
      intention: '„Jezu, ufam Tobie” – złożenie całego trudu drogi w oceanie Miłosierdzia.'
    },
    {
      n: 12, date: '06-25', stage: 3, km: 26, level: 2,
      from: 'Łagiewniki', to: 'Krzeszowice',
      route: 'Przez krakowski Salwator na zachód w stronę Zabierzowa, trzymając się bocznych, utwardzonych dróg równoległych do ruchliwej DK79.',
      warn: 'Unikać jazdy samą DK79 – trzymać się dróg równoległych.',
      pois: [
        { name: 'Salwator', at: [50.0530, 19.9070] },
        { name: 'Pałac Potockich w Krzeszowicach', at: [50.1340, 19.6330], note: 'Dostępny park ze żwirowymi/asfaltowymi alejkami.' }
      ],
      via: [
        [50.0197, 19.9330, 'Łagiewniki'],
        [50.0530, 19.9070, 'Salwator'],
        [50.1140, 19.7980, 'Zabierzów'],
        [50.1340, 19.6330, 'Krzeszowice']
      ],
      sleep: 'Krzeszowice.',
      intention: 'O wierność łasce przyniesionej z sanktuariów do codzienności.'
    },
    {
      n: 13, date: '06-26', stage: 3, km: 25, level: 2,
      from: 'Krzeszowice', to: 'Jaworzno',
      route: 'Przejazd przez Dulową i Trzebinię.',
      pois: [
        { name: 'Park Gródek w Jaworznie', at: [50.2150, 19.2950], note: 'Twarde, spacerowe ścieżki dostępne dla wózków – modlitwa w naturze.' }
      ],
      via: [
        [50.1340, 19.6330, 'Krzeszowice'],
        [50.1370, 19.5300, 'Dulowa'],
        [50.1600, 19.4710, 'Trzebinia'],
        [50.2150, 19.2950, 'Jaworzno – Park Gródek']
      ],
      sleep: 'Jaworzno.',
      intention: 'Za Kościół – by był otwarty i bez barier w sercach i umysłach.'
    },
    {
      n: 14, date: '06-27', stage: 3, km: 24, level: 1,
      from: 'Jaworzno', to: 'Katowice',
      route: 'Trasa przez Mysłowice, wkraczająca z powrotem w tkankę śląskiej metropolii.',
      pois: [
        { name: 'Dolina Trzech Stawów', at: [50.2410, 19.0450], note: 'Równe, wydzielone od aut asfaltowe ścieżki rekreacyjne.' }
      ],
      via: [
        [50.2150, 19.2950, 'Jaworzno'],
        [50.2420, 19.1410, 'Mysłowice'],
        [50.2410, 19.0450, 'Katowice – Dolina Trzech Stawów']
      ],
      sleep: 'Katowice (południowe dzielnice).',
      intention: 'Za mieszkańców Śląska – ludzi pracy i ich rodziny.'
    },
    {
      n: 15, date: '06-28', stage: 3, km: 25, level: 1,
      from: 'Katowice', to: 'Ruda Śląska (Kochłowice)', special: 'Zakończenie',
      route: 'Finałowy marsz w pełni po infrastrukturze miejskiej (Katowice Załęże, Chorzów, aż po Rudę Śląską).',
      pois: [
        { name: 'Sanktuarium MB z Lourdes, Kochłowice', at: [50.2550, 18.8985], note: 'Uroczysty powrót – zakończenie pętli.' }
      ],
      via: [
        [50.2410, 19.0450, 'Dolina Trzech Stawów'],
        [50.2660, 18.9800, 'Katowice Załęże'],
        [50.2810, 18.9160, 'Chorzów'],
        [50.2550, 18.8985, 'Kochłowice – Sanktuarium']
      ],
      sleep: 'Dom.',
      intention: 'Dziękczynienie – wracamy jako inni ludzie, przemienieni przez Drogę.'
    }
  ],

  safety: [
    { title: 'Asysta techniczna (samochód)', text: 'Na wielu odcinkach dróg lokalnych (bez szerokich poboczy) jadący z tyłu na światłach awaryjnych samochód techniczny jest warunkiem bezwzględnego bezpieczeństwa. Przewozi sprzęt serwisowy (np. zapasowe dętki do wózka) oraz większy bagaż.' },
    { title: 'Hamulce w wózku', text: 'Na Jurze Krakowsko-Częstochowskiej zjazdy mogą być strome. Konieczny jest przegląd układu hamulcowego, ewentualnie grube rękawiczki skórzane dla osoby obsługującej ciągi lub zamontowanie specjalnych spowalniaczy dla asystenta.' },
    { title: 'Widoczność', text: 'Wózek powinien być wyposażony w silne oświetlenie (najlepiej lampy ostrzegawcze z przodu i z tyłu) oraz flagę odblaskową na wysięgniku (chorągiewkę bezpieczeństwa).' }
  ],

  checklist: [
    { group: 'Wózek', items: ['Przegląd hamulców', 'Zapasowe dętki i łatki', 'Pompka i klucze', 'Dostawka elektryczna naładowana', 'Lampy ostrzegawcze przód / tył', 'Chorągiewka odblaskowa na wysięgniku', 'Spowalniacze / uchwyty dla asystenta'] },
    { group: 'Asystenci', items: ['Grube rękawice skórzane', 'Kamizelki odblaskowe', 'Grafik zmian pchających', 'Wygodne obuwie i plastry'] },
    { group: 'Samochód techniczny', items: ['Światła awaryjne sprawne', 'Trójkąt i tablica „Uwaga pielgrzymka”', 'Bagaż i namiot/rampa', 'Woda pitna (zapas na cały dzień)', 'Apteczka rozszerzona'] },
    { group: 'Osobiste', items: ['Leki na cały wyjazd', 'Peleryna przeciwdeszczowa', 'Krem z filtrem i nakrycie głowy', 'Poduszka przeciwodleżynowa', 'Powerbank i ładowarki', 'Dokumenty i legitymacja', 'Różaniec i śpiewnik'] }
  ],

  reflection: [
    {
      title: 'Teologia: Ad Iesum per Mariam i Moc w Słabości',
      body: [
        'Trasa tej pielgrzymki rysuje klasyczny szlak teologii katolickiej: od Maryi do Chrystusa (Przez Maryję do Jezusa).',
        '<b>Początek i koniec – Kochłowice (MB z Lourdes).</b> Lourdes to miejsce szczególnego pochylenia się nad chorymi, cierpiącymi i tymi, którzy doświadczają ograniczeń ciała. Rozpoczęcie drogi tutaj to akt oddania swojej fizyczności i słabości w ręce Maryi.',
        '<b>Serce – Jasna Góra.</b> Miejsce duchowej siły, wstawiennictwa i poczucia wspólnoty. Tu pielgrzym nabiera mocy na najtrudniejszy, jurajski etap drogi.',
        '<b>Cel i kulminacja – Łagiewniki.</b> Spotkanie z Chrystusem i wezwaniem „Jezu, ufam Tobie”. Cały wysiłek, pot i ograniczenia znoszone na trasie zostają tu złożone w oceanie Miłosierdzia.',
        'Obecność wózka jest żywą realizacją słów św. Pawła: <i>„Moc w słabości się doskonali”</i> (2 Kor 12,9). Wózek nie jest znakiem braku, lecz narzędziem łaski – dowodem, że przed Bogiem nie stajemy o własnych siłach, tak jak pielgrzym na wózku jest zależny od pomocy drugiego człowieka.'
      ]
    },
    {
      title: 'Filozofia: Homo Viator i Etyka Spotkania',
      body: [
        'Pielgrzymka to realizacja idei <i>Homo viator</i> – człowieka w drodze. Pielgrzym na wózku obnaża prawdę, o której zdrowi często zapominają: nikt z nas nie idzie sam.',
        '<b>Zależność i zaufanie.</b> Pielgrzym ufa asystentowi (że go nie puści, że zahamuje na zjeździe), a asystent oddaje swoje siły pielgrzymowi. To wyraz etyki spotkania w duchu Emmanuela Levinasa czy ks. Józefa Tischnera – zaprzeczenie współczesnego indywidualizmu.',
        '<b>Oswajanie przestrzeni.</b> Wybór dróg asfaltowych zamiast leśnych ścieżek wskazuje, że sacrum można odnaleźć w prozie życia – na twardym asfalcie, poboczu szosy, wśród pędzących samochodów.'
      ]
    },
    {
      title: 'Symbolika: Pętla, Koło i Asfalt',
      body: [
        '<b>Wózek (Koło).</b> Koła obracające się przez 15 dni to symbol wytrwałości i cykliczności życia. Wózek, kojarzony ze szpitalem, na szlaku staje się rydwanem wolności i zwycięstwa ducha nad materią.',
        '<b>Pętla (Wyjście i Powrót).</b> Trasa zaczyna się i kończy w Kochłowicach. Wychodzimy z domu, doświadczamy trudów i łask, wracamy do codzienności – ale nie jako ci sami ludzie. Przemienia nas Droga.',
        '<b>Jurajskie Zamki.</b> Zrujnowane twierdze (Bobolice, Ogrodzieniec) przypominają o kruchości ludzkich dzieł. Mury kruszeją, ale kruchy człowiek na wózku – dzięki sile ducha – jedzie dalej.'
      ]
    },
    {
      title: 'Znaczenie: Triumf Ducha i Świadectwo',
      body: [
        'Dla osoby na wózku i jej ekipy to akt emancypacji – dowód, że ograniczenia fizyczne nie mogą uwięzić pragnienia Boga i przygody.',
        '<b>Dla mijanych ludzi</b> to kazanie bez słów: przełamuje stereotypy i prowokuje pytanie „Skoro on może z takim trudem podążać do celu, to na co ja narzekam?”.',
        '<b>Dla Kościoła</b> to przypomnienie, że wiara i przestrzeń duchowa mają być bez barier – nie tylko architektonicznych, ale przede wszystkim w sercach i umysłach.',
        'To droga, w której słabość ciała staje się najmocniejszym nośnikiem wiary, nadziei i miłości.'
      ]
    }
  ]
};
