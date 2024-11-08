// API seaded
interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

// Autentimise seaded
interface AuthConfig {
  tokenKey: string;
  refreshTokenKey: string;
  tokenExpireMinutes: number;
  tokenExpiryWarning: number; // millisekundites
}

// Valideerimise seaded
interface ValidationConfig {
  minNameLength: number;
  maxNameLength: number;
  maxDescriptionLength: number;
}

// Üleslaadimise seaded
interface UploadConfig {
  maxFileSize: number;
  allowedSoundTypes: string[];
}

// Toast teadete seaded
interface ToastConfig {
  duration: {
    success: number;
    error: number;
    warning: number;
    info: number;
  };
  maxToasts: number;
  position: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
  animation: {
    enter: number;
    exit: number;
  };
}

// Kalendri seaded
interface CalendarConfig {
  defaultView: 'month' | 'week' | 'day';
  firstDayOfWeek: number;
  workDays: number[];
}

// Tunniplaani seaded
interface TimetableConfig {
  maxEventsPerDay: number;
  defaultEventDuration: number;
  defaultBreakDuration: number;
}

// Helinate seaded
interface SoundsConfig {
  maxVolume: number;
  fadeInDuration: number;
  fadeOutDuration: number;
}

// UI seaded
interface UiConfig {
  theme: {
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
    };
    animation: {
      fast: string;
      normal: string;
      slow: string;
    };
    zIndex: {
      modal: number;
      toast: number;
      dropdown: number;
      header: number;
    };
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

// i18n seaded
interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  supportedLanguages: string[];
}

// Rakenduse seadete tüüp
export interface AppConfig {
  api: ApiConfig;
  auth: AuthConfig;
  validation: ValidationConfig;
  upload: UploadConfig;
  toast: ToastConfig;
  calendar: CalendarConfig;
  timetable: TimetableConfig;
  sounds: SoundsConfig;
  ui: UiConfig;
  i18n: I18nConfig;
}

// Rakenduse seaded
export const appConfig: AppConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
  },
  auth: {
    tokenKey: 'lible_token',
    refreshTokenKey: 'lible_refresh_token',
    tokenExpireMinutes: 60,
    tokenExpiryWarning: 5 * 60 * 1000, // 5 minutit millisekundites
  },
  validation: {
    minNameLength: 2,
    maxNameLength: 100,
    maxDescriptionLength: 500,
  },
  upload: {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    allowedSoundTypes: ['audio/mpeg'],
  },
  toast: {
    duration: {
      success: 1,
      error: 5000,
      warning: 4000,
      info: 3000,
    },
    maxToasts: 1,
    position: {
      vertical: 'top',
      horizontal: 'right',
    },
    animation: {
      enter: 200,
      exit: 150,
    },
  },
  calendar: {
    defaultView: 'month',
    firstDayOfWeek: 1, // Esmaspäev
    workDays: [1, 2, 3, 4, 5], // E-R
  },
  timetable: {
    maxEventsPerDay: 20,
    defaultEventDuration: 45, // minutit
    defaultBreakDuration: 10, // minutit
  },
  sounds: {
    maxVolume: 1.0,
    fadeInDuration: 500, // millisekundit
    fadeOutDuration: 500, // millisekundit
  },
  ui: {
    theme: {
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      animation: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
      },
      zIndex: {
        modal: 50,
        toast: 100,
        dropdown: 40,
        header: 30,
      },
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  i18n: {
    defaultLanguage: 'et',
    fallbackLanguage: 'en',
    supportedLanguages: ['et', 'en'],
  },
};

export default appConfig;
