import axios from 'axios';
import { appConfig } from '../config/app.config';

const API_URL = appConfig.api.baseUrl;

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Axios interceptor autentimise jaoks
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(appConfig.auth.tokenKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth tüübid
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string | null;
  user: {
    id: number;
    username: string;
    language: string;
  };
}

// Mallide loomise/muutmise tüübid
export interface CreateTemplateItemInput {
  event_name: string;
  offset_minutes: number;
  sound_id: number;
}

export interface CreateTemplateInput {
  name: string;
  description: string | null;
  items: CreateTemplateItemInput[];
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string | null;
  items?: CreateTemplateItemInput[];
}

// Põhitüübid
export interface Sound {
  id: number;
  name: string;
  filename: string;
}

export interface Timetable {
  id: number;
  name: string;
  valid_from: string;
  valid_until: string | null;
  weekdays: number;
}

export interface TimetableEvent {
  id: number;
  timetable_id: number;
  event_name: string;
  event_time: string;
  sound_id: number;
  template_instance_id: number | null;
  is_template_base: boolean;
}

export interface EventTemplate {
  id: number;
  name: string;
  description: string | null;
  items: EventTemplateItem[];
}

export interface EventTemplateItem {
  id: number;
  template_id: number;
  offset_minutes: number;
  event_name: string;
  sound_id: number;
}

// Auth API
export const auth = {
  login: async (data: LoginRequest) => {
    return axiosInstance.post<AuthResponse>('/auth/login', data);
  },

  logout: async () => {
    return axiosInstance.post('/auth/logout');
  },

  refresh: async (data: { refreshToken: string }) => {
    return axiosInstance.post<AuthResponse>('/auth/refresh', data);
  },

  check: async () => {
    return axiosInstance.get('/auth/check');
  }
};

// Templates API
export const templates = {
  getAll: async (): Promise<EventTemplate[]> => {
    const response = await fetch(`${API_URL}/templates`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  },

  getById: async (id: number): Promise<EventTemplate> => {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch template');
    return response.json();
  },

  create: async (data: CreateTemplateInput): Promise<EventTemplate> => {
    const response = await fetch(`${API_URL}/templates`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  },

  update: async (id: number, data: UpdateTemplateInput): Promise<EventTemplate> => {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/templates/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete template');
  }
};

// API päringud
const getAuthHeaders = () => {
  const token = localStorage.getItem(appConfig.auth.tokenKey);
  return token ? { 'Authorization': `Bearer ${token}` } : undefined;
};

export const sounds = {
  getAll: async (): Promise<Sound[]> => {
    const response = await fetch(`${API_URL}/sounds`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch sounds');
    return response.json();
  },

  getById: async (id: number): Promise<Sound> => {
    const response = await fetch(`${API_URL}/sounds/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch sound');
    return response.json();
  },

  upload: async (data: FormData): Promise<Sound> => {
    const response = await fetch(`${API_URL}/sounds`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: data
    });
    if (!response.ok) throw new Error('Failed to upload sound');
    return response.json();
  },

  update: async (id: number, data: { name: string }): Promise<Sound> => {
    const response = await fetch(`${API_URL}/sounds/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update sound');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/sounds/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete sound');
  }
};

export const timetables = {
  getAll: async (): Promise<Timetable[]> => {
    const response = await fetch(`${API_URL}/timetables`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch timetables');
    return response.json();
  },

  getById: async (id: number): Promise<Timetable> => {
    const response = await fetch(`${API_URL}/timetables/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch timetable');
    return response.json();
  },

  create: async (data: Omit<Timetable, 'id'>): Promise<Timetable> => {
    const response = await fetch(`${API_URL}/timetables`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create timetable');
    return response.json();
  },

  update: async (id: number, data: Partial<Omit<Timetable, 'id'>>): Promise<Timetable> => {
    const response = await fetch(`${API_URL}/timetables/${id}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update timetable');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/timetables/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete timetable');
  },

  // Tunniplaani sündmused
  getEvents: async (timetableId: number): Promise<TimetableEvent[]> => {
    const response = await fetch(`${API_URL}/timetables/${timetableId}/events`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch timetable events');
    return response.json();
  },

  createEvent: async (timetableId: number, data: Omit<TimetableEvent, 'id' | 'timetable_id'>): Promise<TimetableEvent> => {
    const response = await fetch(`${API_URL}/timetables/${timetableId}/events`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create timetable event');
    return response.json();
  },

  updateEvent: async (timetableId: number, eventId: number, data: Partial<Omit<TimetableEvent, 'id' | 'timetable_id'>>): Promise<TimetableEvent> => {
    const response = await fetch(`${API_URL}/timetables/${timetableId}/events/${eventId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update timetable event');
    return response.json();
  },

  deleteEvent: async (timetableId: number, eventId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/timetables/${timetableId}/events/${eventId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete timetable event');
  }
};

// Default export for axios instance
export default {
  axios: axiosInstance
};
