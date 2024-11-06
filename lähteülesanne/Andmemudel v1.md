# Lible - koolikella süsteemi andmemudel v1

## Dokumendi ajalugu
- 2024-03-11: v1 esialgne versioon
  - Põhitabelite ja seoste defineerimine
  - Mallide süsteemi lisamine
  - Kasutajate keelevaliku tugi
- 2024-03-07: v1.1
  - Lisatud name väli Holiday tabelisse

## Ülevaade
Lible on veebipõhine koolikella süsteem, mis võimaldab hallata ja automaatselt juhtida kellade helistamist vastavalt seadistatud tunniplaanidele. Käesolev dokument kirjeldab süsteemi andmemudelit.

## Tabelid ja seosed

### User (Kasutaja)
- **id**: integer PK
- **username**: string
- **password_hash**: string (ainult lokaalse autentimise puhul)
- **is_local_auth**: boolean
- **language**: string
- Seosed:
  - Haldab tunniplaane (1:N seos Timetable)

### Timetable (Tunniplaan)
- **id**: integer PK
- **name**: string
- **valid_from**: date
- **valid_until**: date (NULL lubatud)
- **weekdays**: integer (bitmask)
- Seosed:
  - Sisaldab sündmusi (1:N seos TimetableEvent)

### EventTemplate (Sündmuse mall)
- **id**: integer PK
- **name**: string
- **description**: string
- Seosed:
  - Sisaldab malli sündmusi (1:N seos EventTemplateItem)

### EventTemplateItem (Malli sündmus)
- **id**: integer PK
- **template_id**: integer FK
- **offset_minutes**: integer
- **event_name**: string
- **sound_id**: integer FK
- Seosed:
  - Kuulub malli (N:1 seos EventTemplate)
  - Kasutab helifaili (N:1 seos Sound)

### TimetableEvent (Tunniplaani sündmus)
- **id**: integer PK
- **timetable_id**: integer FK
- **event_name**: string
- **event_time**: time
- **sound_id**: integer FK
- **template_instance_id**: integer (NULL kui pole mallist)
- **is_template_base**: boolean (True kui on malli põhisündmus)
- Seosed:
  - Kuulub tunniplaani (N:1 seos Timetable)
  - Kasutab helifaili (N:1 seos Sound)
  - Võib põhineda mallil (N:1 seos EventTemplate)

### Sound (Helifail)
- **id**: integer PK
- **name**: string
- **filename**: string
- Seosed:
  - Kasutatakse sündmustes (1:N seos TimetableEvent)
  - Kasutatakse malli sündmustes (1:N seos EventTemplateItem)

### Holiday (Pühad ja vaheajad)
- **id**: integer PK
- **name**: string (Püha või vaheaja nimetus)
- **valid_from**: date
- **valid_until**: date
- Seosed:
  - Eraldiseisev tabel, otsesed seosed puuduvad

## Märkused
1. Nädalapäevad hoitakse bitmask formaadis (1-64)
2. Mallipõhised sündmused grupeeritakse template_instance_id abil
3. Põhisündmus (is_template_base=true) on see, mille ajast arvutatakse teiste sündmuste ajad
4. Helifailid on seotud nii otseste sündmuste kui mallide sündmustega

## Tehniline info
- Andmebaas: SQLite
- ORM: SQLAlchemy
- Tabelite nimed on inglise keeles, järgides SQLAlchemy konventsioone
- Primaarvõtmed on INTEGER tüüpi
- Välisvõtmed viitavad alati primaarvõtmetele
- Bitmaskid on realiseeritud INTEGER tüüpi väljadena
