export interface User {
  id: number;
  username: string;
  language: string;
  is_local_auth: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
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

export interface Sound {
  id: number;
  name: string;
  filename: string;
}

export interface Holiday {
  id: number;
  name: string;
  valid_from: string;
  valid_until: string;
}
