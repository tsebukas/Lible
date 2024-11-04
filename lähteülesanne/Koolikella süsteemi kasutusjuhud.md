# Lible - koolikella süsteemi kasutusjuhud v1

## 1. Autentimine ja kasutajahaldus

### 1.1 Sisselogimine
- **Peategevus**: Kasutaja logib süsteemi sisse
- **Eeltingimused**: -
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja avab süsteemi
  2. Sisestab kasutajanime ja parooli
  3. Süsteem kontrollib andmeid (AD või lokaalne)
  4. Süsteem logib kasutaja sisse
- **Alternatiivsed vood**:
  - Valed andmed: süsteem kuvab veateate
  - AD pole saadaval: süsteem proovib lokaalset autentimist

### 1.2 Kasutajaeelistuste muutmine
- **Peategevus**: Kasutaja muudab oma keele-eelistust
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja avab eelistuste vaate
  2. Valib soovitud keele
  3. Salvestab muudatused
  4. Süsteem uuendab kasutajaliidese keelt

## 2. Tunniplaanide haldus

### 2.1 Tunniplaani loomine
- **Peategevus**: Kasutaja loob uue tunniplaani
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja alustab uue tunniplaani loomist
  2. Sisestab põhiandmed (nimi, kehtivusaeg, nädalapäevad)
  3. Lisab sündmusi (kas üksikult või mallide põhjal)
  4. Salvestab tunniplaani
- **Alternatiivsed vood**:
  - Kattuvate perioodidega tunniplaan: süsteem hoiatab kasutajat

### 2.2 Tunniplaani muutmine
- **Peategevus**: Kasutaja muudab olemasolevat tunniplaani
- **Eeltingimused**: Tunniplaan on olemas
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib tunniplaani
  2. Teeb vajalikud muudatused
  3. Salvestab muudatused
- **Alternatiivsed vood**:
  - Kattuvate perioodidega tunniplaan: süsteem hoiatab kasutajat

### 2.3 Tunniplaani sündmuse lisamine
- **Peategevus**: Kasutaja lisab tunniplaani uue sündmuse
- **Eeltingimused**: Tunniplaan on valitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib lisamise viisi (mall või üksiksündmus)
  2. Malli puhul:
     - Valib malli
     - Määrab põhisündmuse aja
  3. Üksiksündmuse puhul:
     - Sisestab nime
     - Määrab kellaaja
     - Valib helina
  4. Salvestab sündmuse
- **Alternatiivsed vood**:
  - Kattuv kellaaeg: süsteem hoiatab kasutajat

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
  4. Salvestab malli
- **Alternatiivsed vood**:
  - Sama nimega mall: süsteem hoiatab kasutajat

### 3.2 Malli muutmine
- **Peategevus**: Kasutaja muudab olemasolevat malli
- **Eeltingimused**: Mall on olemas
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib malli
  2. Teeb muudatused
  3. Salvestab muudatused
- **Järeltingimused**: Süsteem teavitab, et muudatused ei mõjuta juba kasutusel olevaid malli instantse

## 4. Helinate haldus

### 4.1 Helina lisamine
- **Peategevus**: Kasutaja lisab uue helina
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib helifaili
  2. Sisestab helina nime
  3. Testib helinat
  4. Salvestab helina
- **Alternatiivsed vood**:
  - Vale failitüüp: süsteem kuvab veateate
  - Liiga suur fail: süsteem kuvab veateate

### 4.2 Helina muutmine/kustutamine
- **Peategevus**: Kasutaja muudab või kustutab helina
- **Eeltingimused**: Helin on olemas
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja valib helina
  2. Teeb muudatused või kustutab
  3. Salvestab muudatused
- **Alternatiivsed vood**:
  - Helin on kasutusel: süsteem hoiatab kasutajat

## 5. Pühade ja vaheaegade haldus

### 5.1 Püha/vaheaja lisamine
- **Peategevus**: Kasutaja lisab uue püha või vaheaja
- **Eeltingimused**: Kasutaja on sisse logitud
- **Osalised**: Kasutaja
- **Põhivoog**:
  1. Kasutaja sisestab perioodi (algus ja lõpp)
  2. Salvestab
- **Alternatiivsed vood**:
  - Kattuv periood: süsteem hoiatab kasutajat

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
- **Alternatiivsed vood**:
  - Heliväljund pole saadaval: süsteem logib vea
  - Helifail puudub: süsteem logib vea

## Lible süsteemi märkused
1. Kõik muudatused nõuavad kasutaja autentimist
2. Süsteem logib kõik olulised tegevused
3. Kõik ajad on seadistatud kohalikus ajavööndis
4. Süsteem peab olema võimeline töötama ka võrguühenduse katkemisel