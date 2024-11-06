# Lible - koolikella süsteemi kasutusjuhud v2

## 1. Autentimine ja kasutajahaldus

### 1.1 Sisselogimine
- **Peategevus**: Kasutaja logib süsteemi sisse
- **Eeltingimused**: -
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja avab süsteemi
  2. Sisestab kasutajanime ja parooli
  3. Süsteem kontrollib andmeid (AD või lokaalne)
  4. Süsteem kuvab progressi teate
  5. Süsteem logib kasutaja sisse
  6. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Valed andmed: süsteem kuvab veateate
  - AD pole saadaval: süsteem proovib lokaalset autentimist
  - Võrguühenduse viga: süsteem kuvab veateate

### 1.2 Väljalogimine
- **Peategevus**: Kasutaja logib süsteemist välja
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja vajutab väljalogimisnuppu
  2. Süsteem kuvab progressi teate
  3. Süsteem tühistab kasutaja tokeni
  4. Süsteem kuvab õnnestumise teate
  5. Süsteem suunab sisselogimislehele
- **Alternatiivsed vood**:
  - Võrguühenduse viga: süsteem logib kasutaja lokaalselt välja

### 1.3 Sessiooni haldus
- **Peategevus**: Süsteem haldab kasutaja sessiooni
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Süsteem, Kasutaja
- **Põhivoog**:
  1. Süsteem kontrollib tokeni kehtivust
  2. 5 minutit enne aegumist kuvab hoiatuse
  3. Proovib tokenit automaatselt uuendada
  4. Õnnestumise korral jätkab sessiooni
- **Alternatiivsed vood**:
  - Token aegunud: süsteem logib välja ja suunab sisselogimislehele
  - Uuendamine ebaõnnestub: süsteem kuvab veateate

### 1.4 Keelevahetamine
- **Peategevus**: Kasutaja muudab kasutajaliidese keelt
- **Eeltingimused**: -
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja vajutab keelevahetusnuppu
  2. Süsteem vahetab keelt
  3. Süsteem kuvab kinnituse
  4. Süsteem salvestab eelistuse
- **Alternatiivsed vood**:
  - Salvestamine ebaõnnestub: süsteem säilitab valiku ainult sessiooni ajaks

## 2. Tunniplaanide haldus

### 2.1 Tunniplaani loomine
- **Peategevus**: Kasutaja loob uue tunniplaani
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja alustab uue tunniplaani loomist
  2. Sisestab põhiandmed (nimi, kehtivusaeg, nädalapäevad)
  3. Süsteem valideerib andmed
  4. Süsteem kuvab progressi teated
  5. Lisab sündmusi (kas üksikult või mallide põhjal)
  6. Salvestab tunniplaani
  7. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Valideerimine ebaõnnestub: süsteem kuvab veateated
  - Kattuvate perioodidega tunniplaan: süsteem hoiatab kasutajat
  - Salvestamine ebaõnnestub: süsteem kuvab veateate

### 2.2 Tunniplaani muutmine
- **Peategevus**: Kasutaja muudab olemasolevat tunniplaani
- **Eeltingimused**: Tunniplaan on olemas
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib tunniplaani
  2. Teeb vajalikud muudatused
  3. Süsteem valideerib andmed
  4. Süsteem kuvab progressi teated
  5. Salvestab muudatused
  6. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Valideerimine ebaõnnestub: süsteem kuvab veateated
  - Kattuvate perioodidega tunniplaan: süsteem hoiatab kasutajat
  - Salvestamine ebaõnnestub: süsteem kuvab veateate

### 2.3 Tunniplaani sündmuse lisamine
- **Peategevus**: Kasutaja lisab tunniplaani uue sündmuse
- **Eeltingimused**: Tunniplaan on valitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib lisamise viisi (mall või üksiksündmus)
  2. Malli puhul:
     - Valib malli
     - Määrab põhisündmuse aja
     - Süsteem arvutab teiste sündmuste ajad
  3. Üksiksündmuse puhul:
     - Sisestab nime
     - Määrab kellaaja
     - Valib helina
  4. Süsteem valideerib andmed
  5. Süsteem kuvab progressi teated
  6. Salvestab sündmuse
  7. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Valideerimine ebaõnnestub: süsteem kuvab veateated
  - Kattuv kellaaeg: süsteem hoiatab kasutajat
  - Salvestamine ebaõnnestub: süsteem kuvab veateate

## 3. Mallide haldus

### 3.1 Sündmuse malli loomine
- **Peategevus**: Kasutaja loob uue sündmuse malli
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja alustab uue malli loomist
  2. Sisestab malli nime ja kirjelduse
  3. Lisab malli sündmused:
     - Sündmuse nimi
     - Ajaline nihe põhisündmusest
     - Helin
  4. Süsteem valideerib andmed
  5. Süsteem kuvab progressi teated
  6. Salvestab malli
  7. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Valideerimine ebaõnnestub: süsteem kuvab veateated
  - Sama nimega mall: süsteem hoiatab kasutajat
  - Salvestamine ebaõnnestub: süsteem kuvab veateate

### 3.2 Malli muutmine
- **Peategevus**: Kasutaja muudab olemasolevat malli
- **Eeltingimused**: Mall on olemas
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib malli
  2. Teeb muudatused
  3. Süsteem valideerib andmed
  4. Süsteem kuvab progressi teated
  5. Salvestab muudatused
  6. Süsteem kuvab õnnestumise teate ja hoiatuse
- **Järeltingimused**: 
  - Süsteem teavitab, et muudatused ei mõjuta juba kasutusel olevaid malli instantse
  - Süsteem säilitab muudatuste ajaloo

## 4. Helinate haldus

### 4.1 Helina lisamine
- **Peategevus**: Kasutaja lisab uue helina
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib helifaili
  2. Süsteem valideerib faili
  3. Sisestab helina nime
  4. Testib helinat
  5. Süsteem kuvab progressi teated
  6. Salvestab helina
  7. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Vale failitüüp: süsteem kuvab veateate
  - Liiga suur fail: süsteem kuvab veateate
  - Üleslaadimine ebaõnnestub: süsteem kuvab veateate

### 4.2 Helina muutmine/kustutamine
- **Peategevus**: Kasutaja muudab või kustutab helina
- **Eeltingimused**: Helin on olemas
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib helina
  2. Teeb muudatused või kustutab
  3. Süsteem kuvab progressi teated
  4. Salvestab muudatused
  5. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Helin on kasutusel: süsteem hoiatab kasutajat
  - Kustutamine ebaõnnestub: süsteem kuvab veateate

## 5. Pühade ja vaheaegade haldus

### 5.1 Püha/vaheaja lisamine
- **Peategevus**: Kasutaja lisab uue püha või vaheaja
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja sisestab perioodi (algus ja lõpp)
  2. Süsteem valideerib andmed
  3. Süsteem kuvab progressi teated
  4. Salvestab
  5. Süsteem kuvab õnnestumise teate
- **Alternatiivsed vood**:
  - Valideerimine ebaõnnestub: süsteem kuvab veateated
  - Kattuv periood: süsteem hoiatab kasutajat
  - Salvestamine ebaõnnestub: süsteem kuvab veateate

## 6. Süsteemi töö

### 6.1 Kellade automaatne helistamine
- **Peategevus**: Süsteem helistab kella vastavalt tunniplaanile
- **Eeltingimused**: Süsteem töötab, helinad on seadistatud
- **Osalised**: Süsteem
- **Põhivoog**:
  1. Süsteem kontrollib, kas on püha/vaheaeg
  2. Kui ei ole, leiab kehtiva tunniplaani
  3. Kontrollib, kas on vaja helistada kella
  4. Mängib vajadusel helina
  5. Logib tegevuse
- **Alternatiivsed vood**:
  - Heliväljund pole saadaval: süsteem logib vea
  - Helifail puudub: süsteem logib vea
  - Mängimine ebaõnnestub: süsteem logib vea

## Lible süsteemi märkused
1. Kõik muudatused nõuavad kasutaja autentimist
2. Süsteem logib kõik olulised tegevused
3. Kõik ajad on seadistatud kohalikus ajavööndis
4. Süsteem peab olema võimeline töötama ka võrguühenduse katkemisel
5. Kõik tegevused kuvatakse kasutajale progressi teadetega
6. Kõik veateated on selged ja informatiivsed
7. Süsteem säilitab kasutaja keele-eelistuse
8. Kõik vormid valideeritakse nii kliendi- kui serveripoolel
