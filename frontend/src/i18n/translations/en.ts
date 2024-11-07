export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    loading: 'Loading...',
    select: 'Select...',
    languageChanged: '{{language}} language selected',
    changeLanguage: 'Change language',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    close: 'Close',
    weekdayLong: {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
      7: 'Sunday'
    },
    weekdayShort: {
      1: 'M',
      2: 'T',
      3: 'W',
      4: 'T',
      5: 'F',
      6: 'S',
      7: 'S'
    }
  },
  languages: {
    et: 'Estonian',
    en: 'English'
  },
  nav: {
    calendar: 'Calendar',
    timetables: 'Timetables',
    templates: 'Templates',
    sounds: 'Sounds',
    holidays: 'Holidays'
  },
  auth: {
    login: 'Log in',
    logout: 'Log out',
    loggingOut: 'Logging out...',
    username: 'Username',
    password: 'Password',
    authenticating: 'Authenticating...',
    verifying: 'Verifying credentials...',
    loginSuccess: 'Successfully logged in',
    logoutSuccess: 'Successfully logged out',
    sessionExpired: 'Session expired, please log in again',
    sessionExpiring: 'Session expiring soon, please log in again',
    invalidCredentials: 'Invalid username or password'
  },
  holiday: {
    title: 'Holidays',
    new: 'Add Holiday',
    edit: 'Edit Holiday',
    name: 'Name',
    validFrom: 'Valid From',
    validUntil: 'Valid Until',
    noHolidays: 'No holidays added',
    creating: 'Creating holiday...',
    saving: 'Saving holiday...',
    deleting: 'Deleting holiday...',
    createSuccess: 'Holiday successfully created',
    updateSuccess: 'Holiday successfully updated',
    deleteSuccess: 'Holiday successfully deleted',
    delete: 'Delete holiday',
    deleteConfirm: 'Are you sure you want to delete this holiday?'
  },
  timetable: {
    new: 'New Timetable',
    edit: 'Edit Timetable',
    name: 'Timetable Name',
    validFrom: 'Valid From',
    validUntil: 'Valid Until',
    weekdays: 'Weekdays',
    saving: 'Saving timetable...',
    validating: 'Validating data...',
    processing: 'Processing data...',
    createSuccess: 'Timetable successfully created',
    updateSuccess: 'Timetable successfully updated',
    deleteSuccess: 'Timetable successfully deleted',
    deleteConfirm: 'Are you sure you want to delete this timetable?'
  },
  template: {
    title: 'Templates',
    new: 'Add Template',
    edit: 'Edit Template',
    name: 'Template Name',
    description: 'Description',
    noTemplates: 'No templates added',
    eventCount: '{{count}} events',
    creating: 'Creating template...',
    saving: 'Saving template...',
    deleting: 'Deleting template...',
    createSuccess: 'Template successfully created',
    updateSuccess: 'Template successfully updated',
    deleteSuccess: 'Template successfully deleted',
    delete: 'Delete template',
    deleteConfirm: 'Are you sure you want to delete this template?',
    nameExists: 'A template with this name already exists',
    items: {
      title: 'Events',
      new: 'Add Event',
      edit: 'Edit Event',
      delete: 'Delete Event',
      name: 'Event Name',
      offset: 'Time Offset',
      sound: 'Sound',
      noItems: 'No events added',
      deleteConfirm: 'Are you sure you want to delete this event?',
      offsetHelp: 'Minutes from base event (e.g., -5 = 5 minutes before, +10 = 10 minutes after)',
      createSuccess: 'Event successfully added',
      updateSuccess: 'Event successfully updated',
      deleteSuccess: 'Event successfully deleted'
    }
  },
  event: {
    new: 'New Event',
    edit: 'Edit Event',
    name: 'Event Name',
    time: 'Time',
    sound: 'Sound',
    saving: 'Saving event...',
    validating: 'Validating data...',
    processing: 'Processing data...',
    createSuccess: 'Event successfully created',
    updateSuccess: 'Event successfully updated',
    deleteSuccess: 'Event successfully deleted',
    deleteConfirm: 'Are you sure you want to delete this event?'
  },
  sound: {
    title: 'Sounds',
    new: 'Add Sound',
    edit: 'Edit Sound',
    name: 'Sound Name',
    file: 'Sound File',
    play: 'Play',
    pause: 'Pause',
    delete: 'Delete',
    noSounds: 'No sounds added',
    uploading: 'Uploading sound...',
    validating: 'Validating file...',
    processing: 'Processing file...',
    saving: 'Saving sound...',
    deleting: 'Deleting sound...',
    uploadSuccess: 'Sound successfully uploaded',
    updateSuccess: 'Sound successfully updated',
    deleteSuccess: 'Sound successfully deleted',
    deleteConfirm: 'Are you sure you want to delete this sound?',
    playError: 'Failed to play sound'
  },
  validation: {
    required: 'This field is required',
    minLength: 'Minimum length is {{min}} characters',
    maxLength: 'Maximum length is {{max}} characters',
    dateRange: 'End date must be later than start date',
    noWeekdays: 'Select at least one weekday',
    soundTooLarge: 'Sound file is too large',
    invalidFileType: 'Only MP3 files are allowed',
    invalidCredentials: 'Invalid username or password'
  },
  errors: {
    loginFailed: 'Login failed',
    logoutFailed: 'Logout failed',
    loadFailed: 'Failed to load data',
    loadSoundsFailed: 'Failed to load sounds',
    saveFailed: 'Failed to save',
    deleteFailed: 'Failed to delete',
    uploadFailed: 'Failed to upload',
    networkError: 'Network error',
    serverError: 'Server error',
    unknownError: 'Unknown error'
  }
};
