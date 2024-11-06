# Lible - koolikella süsteemi disainidokument

## Dokumendi ajalugu
- 2024-03-11: v1 esialgne versioon
  - Põhinõuded
  - Andmemudel
  - Kasutusjuhud
  - Kasutajaliidese disain
- 2024-03-12: v2 täiendused
  - Toast teadete süsteem
  - Progressi näitamine
  - Sessiooni haldus
  - Ligipääsetavuse täiendused
  - Keelevahetuse täiendused

## Seotud dokumendid
- [Andmemudel v1](Andmemudel%20v1.md)
- [Kasutusjuhud v1](Koolikella%20süsteemi%20kasutusjuhud.md)
- [Tailwind CSS konfiguratsioon](Tailwind%20CSS%20konfiguratsioon.txt)

## 1. Ülevaade

### 1.1 Eesmärk
Lible on veebipõhine koolikella süsteem, mis võimaldab hallata ja automaatselt juhtida kellade helistamist vastavalt seadistatud tunniplaanidele, arvestades pühasid ja vaheaegu.

### 1.2 Tehnoloogiline stack
- Backend: Python 3.11+ / FastAPI
- Frontend: React + TypeScript + Tailwind CSS
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
   - TypeScript tüübid
   - Tailwind CSS stiilid
   - Responsive disain
   - Toast teated
   - Progressi näitamine
   - Keeletugi

2. **Backend API**
   - FastAPI raamistik
   - REST API + WebSocket
   - JWT autentimine
   - Token uuendamine
   - Rate limiting

3. **Andmebaas**
   - SQLite andmebaas
   - SQLAlchemy ORM
   - Migratsioonid (Alembic)

4. **Taustateenused**
   - Kellade helistamise scheduler
   - Helifailide haldus
   - Logimine

## 3. Autentimine ja Sessioonihaldus

### 3.1 Autentimismeetodid
- Konfigureeritav autentimismeetod:
  1. Active Directory (LDAP)
  2. Lokaalne kasutajate haldus
- JWT (JSON Web Token) põhine sessioonihaldus
- Token uuendamine (refresh token)
- Sessiooni aegumise kontroll
- Kõik kasutajad on võrdsete õigustega

### 3.2 Sessiooni Haldus
- Token aegumise kontroll (5 minutit enne)
- Automaatne token uuendamine
- Turvaline väljalogimine
- Sessiooni aegumise teated

### 3.3 Seadistamine
```yaml
auth:
  type: local  # või 'active_directory'
  secret_key: <jwt_secret>
  token_expire_minutes: 1440
  refresh_token_expire_days: 7
  
  # Active Directory seaded
  ad:
    server: ldap://ad.example.com
    domain: EXAMPLE
    base_dn: DC=example,DC=com
```

## 4. Kasutajakogemus

### 4.1 Toast Teated
- Tüübid:
  - Success (roheline)
  - Error (punane)
  - Warning (oranž)
  - Info (sinine)
- Kestused:
  - Success: 3000ms
  - Error: 5000ms
  - Warning: 4000ms
  - Info: 3000ms
- Positsioon: üleval paremal
- Maksimaalselt 3 teadet korraga
- Animeeritud sisse/välja liikumine

### 4.2 Progressi Näitamine
- Vormide salvestamine
- Failide üleslaadimine
- Andmete laadimine
- Autentimine
- Protsessi olekud:
  1. Valideerimine
  2. Töötlemine
  3. Salvestamine
  4. Õnnestumine/Ebaõnnestumine

### 4.3 Ligipääsetavus
- ARIA märgendid
- Klaviatuuri tugi
- Kontrastsed värvid
- Selged veateated
- Laadimise indikaatorid
- Ekraanilugeja tugi

### 4.4 Keeletugi
- Toetatud keeled:
  - Eesti (vaikimisi)
  - Inglise
- Keele salvestamine kasutaja profiili
- Keelevahetuse animatsioon
- Tõlked kõigile teadetele

## 5. UI Komponendid

### 5.1 Põhikomponendid
1. **Button**
   - Variandid: primary, secondary, outline, ghost
   - Suurused: sm, md, lg
   - Laadimise olek
   - Ikoonide tugi
   - Keelatud olek

2. **Input**
   - Tüübid: text, number, date, time
   - Veateated
   - Ikoonide tugi
   - Kohustuslik märgistus
   - Keelatud olek

3. **Select**
   - Otsing
   - Mitu valikut
   - Kohandatud valikud
   - Veateated
   - Keelatud olek

4. **Dialog**
   - Modaalne/mittemodaalne
   - Animatsioonid
   - Klaviatuuri tugi
   - Sulgemise kinnitamine

5. **Card**
   - Päis
   - Sisu
   - Jalus
   - Laadimise olek

6. **Alert**
   - Tüübid: info, success, warning, error
   - Sulgemise võimalus
   - Ikoonide tugi

7. **Toast**
   - Tüübid: info, success, warning, error
   - Automaatne sulgumine
   - Progressiriba
   - Animatsioonid

### 5.2 Layout Komponendid
1. **Header**
   - Logo
   - Navigatsioon
   - Kasutaja menüü
   - Keele valik

2. **Navigation**
   - Aktiivne leht
   - Ikoonid
   - Responsive menüü
   - Alammenüüd

3. **Footer**
   - Versioon
   - Lingid
   - Autoriõigused

## 6. Äriloogika

### 6.1 Mallide muutmine
- Olemasolevad mallide instantsid säilitavad oma seaded
- Mallis tehtud muudatused ei mõjuta olemasolevaid instantse
- Kasutajat teavitatakse muudatuste mõjust
- Muudatuste ajaloo säilitamine

### 6.2 Ajavööndite käsitlemine
- Süsteem kasutab serveri lokaalset aega
- Kuupäevad UTC formaadis
- Kellaajad kohalikus ajas
- Frontend teisendab ajad kasutaja ajavööndisse

### 6.3 Tunniplaanide kattumine
- Prioriteedid:
  1. Pühad/vaheajad
  2. Kehtivusajaga tunniplaan
  3. Vaikimisi tunniplaan
- Kattuvuste kontroll salvestamisel
- Kasutaja teavitamine konfliktidest

## 7. Helifailide haldus

### 7.1 Nõuded
- Formaat: MP3
- Maksimaalne suurus: 2MB
- Helifaili eelvaade
- Automaatne valideerimine

### 7.2 Mängimine
- Heliväljund läbi OS
- Helitugevuse kontroll
- Fade in/out efektid
- Veakäsitlus

## 8. Seadistamine

### 8.1 Konfiguratsioon
- Keskkonna muutujad
- YAML konfiguratsioon
- TypeScript tüübid
- Vaikeväärtused

### 8.2 Paigaldamine
- Docker tugi
- Arenduskeskkond
- Toodangukeskkond
- Varundamine

## 9. Monitooring

### 9.1 Logimine
- Tegevuste logi
- Veateated
- Jõudluse mõõtmine
- Kasutusstatistika

### 9.2 Teavitused
- Süsteemi oleku teavitused
- Veateated
- Ressursikasutuse hoiatused
- E-posti teavitused

## 10. Turvalisus

### 10.1 Autentimine
- JWT tokenid
- Token uuendamine
- Paroolide krüpteerimine
- Sessiooni aegumise kontroll

### 10.2 API Turvalisus
- Rate limiting
- CORS seaded
- XSS kaitse
- CSRF kaitse

### 10.3 Andmeturve
- Andmete krüpteerimine
- Varundamine
- Logide turvaline säilitamine
- Isikuandmete kaitse

## 11. Jõudlus

### 11.1 Frontend
- Code splitting
- Lazy loading
- Puhverdamine
- Pildioptimeerimine

### 11.2 Backend
- Andmebaasi indeksid
- Päringute optimeerimine
- Puhverdamine
- Ressursside piiramine

## 12. Testimine

### 12.1 Frontend
- Komponenditestid
- Integratsioonitestid
- E2E testid
- Jõudlustestid

### 12.2 Backend
- Ühiktestid
- API testid
- Koormustestid
- Turvatestid
