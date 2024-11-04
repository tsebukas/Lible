# Lible - koolikella süsteemi disainidokument

## Dokumendi ajalugu
- 2024-03-11: v1 esialgne versioon
  - Põhinõuded
  - Andmemudel
  - Kasutusjuhud
  - Kasutajaliidese disain

## Seotud dokumendid
- [Andmemudel v1](Andmemudel%20v1.md)
- [Kasutusjuhud v1](Koolikella%20süsteemi%20kasutusjuhud.md)
- [Tailwind CSS konfiguratsioon](Tailwind%20CSS%20konfiguratsioon.txt)

## 1. Ülevaade

### 1.1 Eesmärk
Lible on veebipõhine koolikella süsteem, mis võimaldab hallata ja automaatselt juhtida kellade helistamist vastavalt seadistatud tunniplaanidele, arvestades pühasid ja vaheaegu.

### 1.2 Tehnoloogiline stack
- Backend: Python 3.11+ / FastAPI
- Frontend: React + Tailwind CSS
- Andmebaas: SQLite + SQLAlchemy
- Autentimine: Local auth / Active Directory (konfigureeritav)
- Heliväljund: Arvuti heliväljund
- Konteineriseerimine: Docker

## 2. Arhitektuur

### 2.1 Süsteemi komponendid
```
[Veebibrauser] ←→ [FastAPI Backend] ←→ [SQLite DB]
                     ↓
              [Heli väljund (OS)]
```

### 2.2 Põhikomponendid
1. **Veebiliides (Frontend)**
   - React-põhine SPA
   - Tailwind CSS stiilid
   - Responsive disain

2. **Backend API**
   - FastAPI raamistik
   - REST API + WebSocket
   - JWT autentimine

3. **Andmebaas**
   - SQLite andmebaas
   - SQLAlchemy ORM
   - Migratsioonid (Alembic)

4. **Taustateenused**
   - Kellade helistamise scheduler
   - Helifailide haldus
   - Logimine

## 3. Autentimine

### 3.1 Meetodid
- Konfigureeritav autentimismeetod:
  1. Active Directory (LDAP)
  2. Lokaalne kasutajate haldus
- JWT (JSON Web Token) põhine sessioonihaldus
- Kõik kasutajad on võrdsete õigustega

### 3.2 Seadistamine
```yaml
auth:
  type: local  # või 'active_directory'
  secret_key: <jwt_secret>
  token_expire_minutes: 1440
  
  # Active Directory seaded
  ad:
    server: ldap://ad.example.com
    domain: EXAMPLE
    base_dn: DC=example,DC=com
```

## 4. API

### 4.1 REST Endpoints
```
/api
  /auth
    POST /login        - Sisselogimine
    POST /logout       - Väljalogimine
    GET  /me          - Praeguse kasutaja info
    PUT  /me          - Kasutaja andmete muutmine

  /timetables
    GET    /              - Tunniplaanide nimekiri
    POST   /              - Uue tunniplaani loomine
    GET    /{id}          - Tunniplaani detailid
    PUT    /{id}          - Tunniplaani muutmine
    DELETE /{id}          - Tunniplaani kustutamine
    GET    /by-date/{date}- Kuupäeva tunniplaan

  /templates
    GET    /           - Mallide nimekiri
    POST   /           - Uue malli loomine
    GET    /{id}       - Malli detailid
    PUT    /{id}       - Malli muutmine
    DELETE /{id}       - Malli kustutamine

  /sounds
    GET    /           - Helinate nimekiri
    POST   /           - Uue helina üleslaadimine
    GET    /{id}       - Helina allalaadimine
    DELETE /{id}       - Helina kustutamine

  /holidays
    GET    /           - Pühade nimekiri
    POST   /           - Uue püha lisamine
    PUT    /{id}       - Püha muutmine
    DELETE /{id}       - Püha kustutamine
```

### 4.2 Autentimine
- Kõik API päringud (v.a /auth/login) nõuavad JWT tokenit
- Token saadetakse Authorization päises: `Bearer <token>`

### 4.3 API vastuste formaat
Kõik API vastused järgivad ühtset formaati:

```json
{
    "success": true,
    "data": "<vastuse andmed>",
    "message": null
}
```

Veateate näide:
```json
{
    "success": false,
    "data": null,
    "message": "Veateade kasutajale"
}
```

Eduka päringu näide:
```json
{
    "success": true,
    "data": {
        "id": 1,
        "name": "Tavaline tunniplaan",
        "valid_from": "2024-09-01",
        "valid_until": null,
        "weekdays": 31,
        "events": [
            {
                "id": 1,
                "time": "08:00",
                "name": "1. tund",
                "sound_id": 1,
                "template_instance_id": 123,
                "is_template_base": true
            }
        ]
    },
    "message": null
}
```

## 5. Kasutajaliides

### 5.1 Põhivaated
1. **Kalendrivaade** (avaleht)
   - Kuu kalender
   - Päeva sündmused
   - Värvikoodid:
     - Roheline: tavaline tunniplaan
     - Oranž: eriline tunniplaan
     - Hall: tunde ei toimu

2. **Tunniplaanide haldus**
   - Tunniplaanide nimekiri
   - Tunniplaani detailvaade/muutmine
   - Sündmuste lisamine (üksik või mallipõhine)

3. **Mallide haldus**
   - Mallide nimekiri
   - Malli detailvaade/muutmine
   - Malli sündmuste ajastamine

4. **Pühade haldus**
   - Pühade/vaheaegade nimekiri
   - Püha lisamine/muutmine

### 5.2 Kohustuslikud väljad ja valideerimine

#### Kohustuslike väljade märgistamine
- Kohustuslikke välju tähistatakse punase tärniga (*) välja nime järel
- Kohustusliku välja silt on bold kirjas
```jsx
<label className="font-medium">
  Tunniplaani nimi
  <span className="text-warning ml-0.5">*</span>
</label>
```

#### Valideerimise reeglid

**Tunniplaan (Timetable)**:
- name:
  - Kohustuslik
  - Min pikkus: 2 tähemärki
  - Max pikkus: 100 tähemärki
- valid_from:
  - Kohustuslik
  - Peab olema kehtiv kuupäev
  - Ei saa olla minevikus
- valid_until:
  - Valikuline
  - Kui on määratud, peab olema hilisem kui valid_from
- weekdays:
  - Kohustuslik
  - Vähemalt üks nädalapäev peab olema valitud
  - Bitmask vahemikus 1-127

**Sündmus (TimetableEvent)**:
- event_name:
  - Kohustuslik
  - Min pikkus: 2 tähemärki
  - Max pikkus: 100 tähemärki
- event_time:
  - Kohustuslik
  - Formaat: "HH:MM"
  - Vahemik: "00:00" kuni "23:59"
- sound_id:
  - Kohustuslik
  - Peab viitama olemasolevale helinale

**Mall (EventTemplate)**:
- name:
  - Kohustuslik
  - Min pikkus: 2 tähemärki
  - Max pikkus: 100 tähemärki
- description:
  - Valikuline
  - Max pikkus: 500 tähemärki

**Malli sündmus (EventTemplateItem)**:
- offset_minutes:
  - Kohustuslik
  - Täisarv vahemikus -120 kuni 120
- event_name:
  - Kohustuslik
  - Min pikkus: 2 tähemärki
  - Max pikkus: 100 tähemärki
- sound_id:
  - Kohustuslik
  - Peab viitama olemasolevale helinale

**Helifail (Sound)**:
- name:
  - Kohustuslik
  - Min pikkus: 2 tähemärki
  - Max pikkus: 100 tähemärki
- filename:
  - Kohustuslik
  - Lubatud laiendid: .mp3
  - Max failisuurus: 2MB

**Püha (Holiday)**:
- valid_from:
  - Kohustuslik
  - Peab olema kehtiv kuupäev
- valid_until:
  - Kohustuslik
  - Peab olema hilisem kui valid_from
  - Maksimaalne periood: 1 aasta

Valideerimise vead kuvatakse välja all punases kirjas:
```jsx
{error && (
  <p className="text-sm text-warning mt-1">{error}</p>
)}
```

### 5.3 Disainielemendid
1. **Värvid**
   - Primary: #2b4c82 (logo sinine)
   - Secondary: #4a78b3
   - Background: #f8fafc
   - Success: #16a34a
   - Warning: #ea580c

2. **Tüpograafia**
   - Peamine font: Arial
   - Pealkirjad: 24px/20px/16px
   - Põhitekst: 14px
   - Sekundaarne tekst: 12px

## 6. Äriloogika reeglid

### 6.1 Mallide muutmine
- Olemasolevad mallide instantsid säilitavad oma seaded
- Mallis tehtud muudatused ei mõjuta olemasolevaid instantse
- Kasutajat teavitatakse: "Mallis tehtud muudatused ei mõjuta juba kasutusel olevaid tunniplaane"
- Põhjendus: olemasolevate tunniplaanide automaatne muutmine võib tekitada ootamatuid olukordi

### 6.2 Ajavööndite käsitlemine
- Süsteem kasutab alati serveri lokaalset aega
- Kuupäevad salvestatakse andmebaasi UTC formaadis
- Kellaajad salvestatakse "wall time" formaadis (kohalik aeg)
- Frontend teisendab ajad kasutaja ajavööndisse
- Konfiguratsioonifailis määratakse serveri ajavöönd:
```yaml
system:
  timezone: "Europe/Tallinn"
```

### 6.3 Tunniplaanide kattumine
- Samal nädalapäeval võib olla mitu tunniplaani
- Prioriteet:
  1. Kui päev on püha/vaheaeg - tunde pole
  2. Kehtivusajaga (valid_until pole NULL) tunniplaan
  3. Vaikimisi tunniplaan (valid_until on NULL)
- Sama prioriteediga tunniplaanide kattumine pole lubatud
- Süsteem kontrollib kattuvusi tunniplaani salvestamisel

## 7. Helifailide käsitlemine

### 7.1 Nõuded helifailidele
- Formaat: MP3
- Maksimaalne suurus: 2MB
- Helifaili preview brauseris

### 7.2 Helinate mängimine
- Heliväljund läbi arvuti helisüsteemi
- Vajab õigusi helisüsteemi kasutamiseks
- Logitakse mängimise õnnestumine/ebaõnnestumine

## 8. Paigaldamine ja seadistamine

### 8.1 Süsteeminõuded
- Python 3.11+
- Node.js 18+
- SQLite 3
- Heliväljund
- Docker (valikuline)

### 8.2 Konfiguratsioon (config.yaml)
```yaml
server:
  host: 0.0.0.0
  port: 8000
  debug: false

database:
  url: sqlite:///db/schoolbell.db

auth:
  type: local  # või 'active_directory'
  secret_key: <jwt_secret>
  token_expire_minutes: 1440
  
  # Active Directory seaded
  ad:
    server: ldap://ad.example.com
    domain: EXAMPLE
    base_dn: DC=example,DC=com

system:
  timezone: "Europe/Tallinn"

audio:
  output_device: default
  storage_path: ./sounds
```

## 9. Edasised arendused (v2)

### 9.1 Võimalikud täiendused
- Tunniplaani import/eksport (CSV/Excel)
- Pühade automaatne import
- Helifailide konverteerimine
- Detailsem õiguste haldus

### 9.2 Tehnilised täiendused
- Hajutatud andmebaas
- API rate limiting
- WebSocket tugi reaalajas uuendusteks
- Põhjalikum monitooring