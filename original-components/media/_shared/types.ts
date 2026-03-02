export interface SubtitleTrack {
  src: string;
  label: string;
  language: string;
  default?: boolean;
}

export interface QualityOption {
  src: string;
  label: string;
}

export interface AudioTrack {
  src: string;
  label: string;
  language?: string;
}
