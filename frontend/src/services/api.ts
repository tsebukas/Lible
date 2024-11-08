import axios from 'axios';
import { appConfig } from '../config/app.config';
import {
  LoginRequest,
  AuthResponse,
  Sound,
  Timetable,
  TimetableEvent,
  EventTemplate,
  Holiday,
  CreateTemplateInput,
  UpdateTemplateInput,
  CreateHolidayInput
} from '../types/api';

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
    const response = await axiosInstance.get<EventTemplate[]>('/templates');
    return response.data;
  },

  getById: async (id: number): Promise<EventTemplate> => {
    const response = await axiosInstance.get<EventTemplate>(`/templates/${id}`);
    return response.data;
  },

  create: async (data: CreateTemplateInput): Promise<EventTemplate> => {
    const response = await axiosInstance.post<EventTemplate>('/templates', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTemplateInput): Promise<EventTemplate> => {
    const response = await axiosInstance.put<EventTemplate>(`/templates/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/templates/${id}`);
  }
};

// Holidays API
export const holidays = {
  getAll: async (): Promise<Holiday[]> => {
    const response = await axiosInstance.get<Holiday[]>('/holidays');
    return response.data;
  },

  getById: async (id: number): Promise<Holiday> => {
    const response = await axiosInstance.get<Holiday>(`/holidays/${id}`);
    return response.data;
  },

  create: async (data: CreateHolidayInput): Promise<Holiday> => {
    const response = await axiosInstance.post<Holiday>('/holidays', data);
    return response.data;
  },

  update: async (id: number, data: CreateHolidayInput): Promise<Holiday> => {
    const response = await axiosInstance.put<Holiday>(`/holidays/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/holidays/${id}`);
  }
};

export const sounds = {
  getAll: async (): Promise<Sound[]> => {
    const response = await axiosInstance.get<Sound[]>('/sounds');
    return response.data;
  },

  getById: async (id: number): Promise<Sound> => {
    const response = await axiosInstance.get<Sound>(`/sounds/${id}`);
    return response.data;
  },

  upload: async (data: FormData): Promise<Sound> => {
    const response = await axiosInstance.post<Sound>('/sounds', data);
    return response.data;
  },

  update: async (id: number, data: { name: string }): Promise<Sound> => {
    const response = await axiosInstance.put<Sound>(`/sounds/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/sounds/${id}`);
  }
};

export const timetables = {
  getAll: async (): Promise<Timetable[]> => {
    const response = await axiosInstance.get<Timetable[]>('/timetables');
    return response.data;
  },

  getById: async (id: number): Promise<Timetable> => {
    const response = await axiosInstance.get<Timetable>(`/timetables/${id}`);
    return response.data;
  },

  create: async (data: Omit<Timetable, 'id'>): Promise<Timetable> => {
    const response = await axiosInstance.post<Timetable>('/timetables', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Omit<Timetable, 'id'>>): Promise<Timetable> => {
    const response = await axiosInstance.put<Timetable>(`/timetables/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/timetables/${id}`);
  },

  // Tunniplaani sündmused
  getEvents: async (timetableId: number): Promise<TimetableEvent[]> => {
    const response = await axiosInstance.get<TimetableEvent[]>(`/timetables/${timetableId}/events`);
    return response.data;
  },

  createEvent: async (timetableId: number, data: Omit<TimetableEvent, 'id' | 'timetable_id'>): Promise<TimetableEvent> => {
    const response = await axiosInstance.post<TimetableEvent>(`/timetables/${timetableId}/events`, data);
    return response.data;
  },

  updateEvent: async (timetableId: number, eventId: number, data: Partial<Omit<TimetableEvent, 'id' | 'timetable_id'>>): Promise<TimetableEvent> => {
    const response = await axiosInstance.put<TimetableEvent>(`/timetables/${timetableId}/events/${eventId}`, data);
    return response.data;
  },

  deleteEvent: async (timetableId: number, eventId: number): Promise<void> => {
    await axiosInstance.delete(`/timetables/${timetableId}/events/${eventId}`);
  }
};

// Default export for axios instance
export default {
  axios: axiosInstance
};
