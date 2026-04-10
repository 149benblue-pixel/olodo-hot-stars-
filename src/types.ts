export type Position = 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Striker';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  photoUrl: string;
  stats: {
    matchesPlayed: number;
    goals: number;
    assists: number;
    rating: number;
  };
  contact?: string;
}

export interface Official {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  contact?: string;
}

export interface Match {
  id: string;
  opponent: string;
  date: string;
  time?: string;
  venue?: string;
  competition: string;
  status: 'played' | 'upcoming';
  score?: {
    home: number;
    away: number;
  };
  isHome: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  category: 'Match Result' | 'Announcement' | 'Tournament' | 'Notice';
}

export interface TeamStats {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  averageRating: number;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: 'Match' | 'Training' | 'Celebrations';
  date: string;
}
