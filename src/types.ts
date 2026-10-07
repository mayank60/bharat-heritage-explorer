export interface State {
  id: string;
  name: string;
  hindi_name: string;
  capital: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast' | 'Islands';
  overview: string;
  culture_desc: string;
  festivals_desc: string;
  food_desc: string;
  languages_desc: string;
  art_crafts_desc: string;
  lat: number;
  lng: number;
  banner_url: string;
  items_count?: number;
}

export interface Category {
  id: string;
  name: string;
  hindi_name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface HeritageItem {
  id: string;
  state_id: string;
  category_id: string;
  title: string;
  hindi_title?: string;
  summary: string;
  hindi_summary?: string;
  history: string;
  culture: string;
  image_url: string;
  gallery?: string[];
  video_url: string; // YouTube embed URL or ID
  lat: number;
  lng: number;
  unesco_flag: boolean;
  period: 'Ancient' | 'Medieval' | 'Mughal' | 'Colonial' | 'Modern';
  timings: string;
  best_time: string;
  location_name: string;
  distance_km?: number;
  is_community?: boolean;
  created_at?: string;
}

export interface Food {
  id: string;
  state_id: string;
  name: string;
  hindi_name?: string;
  description: string;
  hindi_description?: string;
  image_url?: string;
  dietary_type: 'Vegetarian' | 'Non-Vegetarian' | 'Sweet / Dessert' | 'Beverage';
}

export interface Language {
  id: string;
  state_id: string;
  name: string;
  hindi_name?: string;
  script: string;
  speakers_count: string;
  greeting: string;
}

export interface Festival {
  id: string;
  state_id: string;
  name: string;
  hindi_name?: string;
  month_or_season: string;
  significance: string;
  hindi_significance?: string;
  celebration_style: string;
  hindi_celebration_style?: string;
}

export interface Tradition {
  id: string;
  state_id: string;
  name: string;
  hindi_name?: string;
  type: string;
  origin: string;
  significance: string;
  performance_or_attire: string;
}

export interface Craft {
  id: string;
  state_id: string;
  name: string;
  hindi_name?: string;
  gi_tag: boolean;
  craft_type: string;
  materials: string;
  description: string;
}

export interface SavedItem {
  id: string;
  item_id: string;
  user_session_id: string;
  created_at: string;
  item?: HeritageItem;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  state_name: string;
  type: 'heritage' | 'state';
  unesco: boolean;
}

export interface UserSession {
  id: string;
  name: string;
  login_time: string;
  last_active?: string;
  role?: string;
}

export interface MonumentPhoto {
  id: string;
  monument_id: string;
  image_url: string;
  caption?: string;
  contributor_name: string;
  created_at: string;
  verified?: boolean;
}

export interface AdminVisitorRecord {
  id: string;
  passId?: string;
  name: string;
  role?: string;
  platform?: string;
  login_time: string;
  lastActive?: string;
  isLive?: boolean;
}

