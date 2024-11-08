export const et = {
  common: {
    save: 'Salvesta',
    cancel: 'Tühista',
    delete: 'Kustuta',
    loading: 'Laadimine...',
    select: 'Vali...',
    languageChanged: '{{language}} keel on valitud',
    changeLanguage: 'Muuda keelt',
    openMenu: 'Ava menüü',
    closeMenu: 'Sulge menüü',
    close: 'Sulge',
    weekdayLong: {
      1: 'Esmaspäev',
      2: 'Teisipäev',
      3: 'Kolmapäev',
      4: 'Neljapäev',
      5: 'Reede',
      6: 'Laupäev',
      7: 'Pühapäev'
    },
    weekdayShort: {
      1: 'E',
      2: 'T',
      3: 'K',
      4: 'N',
      5: 'R',
      6: 'L',
      7: 'P'
    }
  },
  languages: {
    et: 'Eesti',
    en: 'Inglise'
  },
  nav: {
    calendar: 'Kalender',
    timetables: 'Tunniplaanid',
    templates: 'Mallid',
    sounds: 'Helinad',
    holidays: 'Pühad ja vaheajad'
  },
  auth: {
    login: 'Logi sisse',
    logout: 'Logi välja',
    loggingOut: 'Väljalogimine...',
    username: 'Kasutajanimi',
    password: 'Parool',
    authenticating: 'Autentimine...',
    verifying: 'Kasutaja kontrollimine...',
    loginSuccess: 'Edukalt sisse logitud',
    logoutSuccess: 'Edukalt välja logitud',
    sessionExpired: 'Seanss on aegunud, palun logi uuesti sisse',
    sessionExpiring: 'Seanss aegub peagi, palun logi uuesti sisse',
    invalidCredentials: 'Vale kasutajanimi või parool'
  },
  holiday: {
    title: 'Pühad ja vaheajad',
    new: 'Lisa püha või vaheaeg',
    edit: 'Muuda püha või vaheaega',
    name: 'Nimetus',
    validFrom: 'Kehtib alates',
    validUntil: 'Kehtib kuni',
    noHolidays: 'Ühtegi püha ega vaheaega pole lisatud',
    creating: 'Lisamine...',
    saving: 'Salvestamine...',
    deleting: 'Kustutamine...',
    createSuccess: 'Püha või vaheaeg on edukalt lisatud',
    updateSuccess: 'Püha või vaheaeg on edukalt uuendatud',
    deleteSuccess: 'Püha või vaheaeg on edukalt kustutatud',
    delete: 'Kustuta püha või vaheaeg',
    deleteConfirm: 'Kas oled kindel, et soovid selle püha või vaheaja kustutada?'
  },
  timetable: {
    title: 'Tunniplaanid',
    new: 'Lisa tunniplaan',
    edit: 'Muuda tunniplaani',
    name: 'Tunniplaani nimi',
    validFrom: 'Kehtib alates',
    validUntil: 'Kehtib kuni',
    validPeriod: 'Kehtivusaeg',
    weekdays: 'Nädalapäevad',
    noTimetables: 'Ühtegi tunniplaani pole lisatud',
    saving: 'Tunniplaani salvestamine...',
    validating: 'Andmete valideerimine...',
    processing: 'Andmete töötlemine...',
    deleting: 'Tunniplaani kustutamine...',
    createSuccess: 'Tunniplaan on edukalt loodud',
    updateSuccess: 'Tunniplaan on edukalt uuendatud',
    deleteSuccess: 'Tunniplaan on edukalt kustutatud',
    delete: 'Kustuta tunniplaan',
    deleteConfirm: 'Kas oled kindel, et soovid selle tunniplaani kustutada?',
    events: {
      title: 'Tunniplaani sündmused',
      new: 'Lisa sündmus',
      edit: 'Muuda sündmust',
      name: 'Sündmuse nimi',
      time: 'Kellaaeg',
      sound: 'Helin',
      template: 'Mall',
      baseEventTime: 'Põhisündmuse aeg',
      isBaseEvent: 'Põhisündmus',
      baseEvent: 'Põhi',
      noEvents: 'Ühtegi sündmust pole lisatud',
      createSuccess: 'Sündmus on edukalt lisatud',
      updateSuccess: 'Sündmus on edukalt uuendatud',
      deleteSuccess: 'Sündmus on edukalt kustutatud'
    }
  },
  template: {
    title: 'Mallid',
    new: 'Lisa mall',
    edit: 'Muuda malli',
    name: 'Malli nimi',
    description: 'Kirjeldus',
    noTemplates: 'Ühtegi malli pole lisatud',
    eventCount: '{{count}} sündmust',
    creating: 'Malli loomine...',
    saving: 'Malli salvestamine...',
    deleting: 'Malli kustutamine...',
    createSuccess: 'Mall on edukalt loodud',
    updateSuccess: 'Mall on edukalt uuendatud',
    deleteSuccess: 'Mall on edukalt kustutatud',
    delete: 'Kustuta mall',
    deleteConfirm: 'Kas oled kindel, et soovid selle malli kustutada?',
    nameExists: 'Sama nimega mall on juba olemas',
    items: {
      title: 'Sündmused',
      new: 'Lisa sündmus',
      edit: 'Muuda sündmust',
      delete: 'Kustuta sündmus',
      name: 'Sündmuse nimi',
      offset: 'Ajaline nihe',
      sound: 'Helin',
      noItems: 'Ühtegi sündmust pole lisatud',
      deleteConfirm: 'Kas oled kindel, et soovid selle sündmuse kustutada?',
      offsetHelp: 'Minutid põhisündmusest (nt. -5 = 5 minutit enne, +10 = 10 minutit pärast)',
      createSuccess: 'Sündmus on edukalt lisatud',
      updateSuccess: 'Sündmus on edukalt uuendatud',
      deleteSuccess: 'Sündmus on edukalt kustutatud'
    }
  },
  event: {
    new: 'Uus sündmus',
    edit: 'Muuda sündmust',
    name: 'Sündmuse nimi',
    time: 'Kellaaeg',
    sound: 'Helin',
    saving: 'Sündmuse salvestamine...',
    validating: 'Andmete valideerimine...',
    processing: 'Andmete töötlemine...',
    createSuccess: 'Sündmus on edukalt loodud',
    updateSuccess: 'Sündmus on edukalt uuendatud',
    deleteSuccess: 'Sündmus on edukalt kustutatud',
    deleteConfirm: 'Kas oled kindel, et soovid selle sündmuse kustutada?'
  },
  sound: {
    title: 'Helinad',
    new: 'Lisa helin',
    edit: 'Muuda helinat',
    name: 'Helina nimi',
    file: 'Helifail',
    play: 'Esita',
    pause: 'Peata',
    delete: 'Kustuta',
    noSounds: 'Ühtegi helinat pole lisatud',
    uploading: 'Helina üleslaadimine...',
    validating: 'Faili valideerimine...',
    processing: 'Faili töötlemine...',
    saving: 'Helina salvestamine...',
    deleting: 'Helina kustutamine...',
    uploadSuccess: 'Helin on edukalt üles laetud',
    updateSuccess: 'Helin on edukalt uuendatud',
    deleteSuccess: 'Helin on edukalt kustutatud',
    deleteConfirm: 'Kas oled kindel, et soovid selle helina kustutada?',
    playError: 'Helina esitamine ebaõnnestus'
  },
  validation: {
    required: 'See väli on kohustuslik',
    minLength: 'Minimaalne pikkus on {{min}} tähemärki',
    maxLength: 'Maksimaalne pikkus on {{max}} tähemärki',
    dateRange: 'Lõppkuupäev peab olema hilisem kui alguskuupäev',
    noWeekdays: 'Vali vähemalt üks nädalapäev',
    soundTooLarge: 'Helifail on liiga suur',
    invalidFileType: 'Lubatud on ainult MP3 failid',
    invalidCredentials: 'Vale kasutajanimi või parool'
  },
  errors: {
    loginFailed: 'Sisselogimine ebaõnnestus',
    logoutFailed: 'Väljalogimine ebaõnnestus',
    loadFailed: 'Andmete laadimine ebaõnnestus',
    loadSoundsFailed: 'Helinate laadimine ebaõnnestus',
    saveFailed: 'Salvestamine ebaõnnestus',
    deleteFailed: 'Kustutamine ebaõnnestus',
    uploadFailed: 'Üleslaadimine ebaõnnestus',
    networkError: 'Võrguühenduse viga',
    serverError: 'Serveri viga',
    unknownError: 'Tundmatu viga'
  }
};
