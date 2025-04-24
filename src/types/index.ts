export interface VideoFile {
  name: string;
  type: string;
  size: number;
  url: string;
  lastPlayed: string;
}

export type WindowSize = 'small' | 'medium' | 'large' | 'xl' | 'default';