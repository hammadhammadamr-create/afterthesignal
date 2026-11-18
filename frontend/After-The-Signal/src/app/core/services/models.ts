export type World = 'moon' | 'mars';
export type Accent = 'cyan' | 'mars';
export type Lang = 'en' | 'es' | 'fr' | 'ar';
export type Theme = 'dark' | 'white';
export type AgeMode = 'cadet' | 'all' | 'telemetry';
export type FilterMode = 'featured' | 'all' | World;
export type Dictionary = Record<string, string>;

export type TimelineEventType =
  'launch' | 'landing' | 'deployment' | 'discovery' | 'milestone' | 'communication' | 'end';
export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: TimelineEventType;
}

export interface Artifact {
  id: string;
  world: World;
  featured: boolean;
  name: string;
  title: string;
  place: string;
  kicker: string;
  period: string;
  summary: string;
  code: string;
  coords: string;
  years: string;
  signal: string;
  img: string;
  subtitle: string;
  discoveries: string;
  ending: string;
  legacy: string;
  timeline: TimelineEvent[];
  source?: string;
}

export const FILTER_RULES: Record<FilterMode, (a: Artifact) => boolean> = {
  featured: (a) => a.featured,
  all: () => true,
  moon: (a) => a.world === 'moon',
  mars: (a) => a.world === 'mars',
};
