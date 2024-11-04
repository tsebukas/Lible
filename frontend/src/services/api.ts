import axios from 'axios';
import { AuthResponse, User, Timetable, EventTemplate, Sound, Holiday } from '../types/api';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor lisab JWT tokeni päistesse
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper funktsioon URLSearchParams jaoks
const encodeFormData = (data: Record<string, string>) => {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
};

// Autentimisteenused
export const auth = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const formData = encodeFormData({
      username,
      password,
      grant_type: 'password'
    });
    
    const response = await api.post<AuthResponse>('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/users/me');
    return response.data;
  }
};

// Tunniplaanide teenused
export const timetables = {
  async getAll(): Promise<Timetable[]> {
    const response = await api.get<Timetable[]>('/timetables');
    return response.data;
  },

  async getById(id: number): Promise<Timetable> {
    const response = await api.get<Timetable>(`/timetables/${id}`);
    return response.data;
  },

  async create(data: Omit<Timetable, 'id' | 'user_id'>): Promise<Timetable> {
    const response = await api.post<Timetable>('/timetables', data);
    return response.data;
  }
};

// Mallide teenused
export const templates = {
  async getAll(): Promise<EventTemplate[]> {
    const response = await api.get<EventTemplate[]>('/templates');
    return response.data;
  },

  async create(data: Omit<EventTemplate, 'id'>): Promise<EventTemplate> {
    const response = await api.post<EventTemplate>('/templates', data);
    return response.data;
  }
};

// Helinate teenused
export const sounds = {
  async getAll(): Promise<Sound[]> {
    const response = await api.get<Sound[]>('/sounds');
    return response.data;
  },

  async upload(formData: FormData): Promise<Sound> {
    const response = await api.post<Sound>('/sounds', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/sounds/${id}`);
  }
};

// Pühade teenused
export const holidays = {
  async getAll(): Promise<Holiday[]> {
    const response = await api.get<Holiday[]>('/holidays');
    return response.data;
  },

  async create(data: Omit<Holiday, 'id'>): Promise<Holiday> {
    const response = await api.post<Holiday>('/holidays', data);
    return response.data;
  }
};

export default api;
