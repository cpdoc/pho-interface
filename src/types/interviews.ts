export interface InterviewIndex {
  [key: string]: {
    uuid: string;
    label: string;
  }
}

export interface InterviewData {
  uuid: string;
  published_at: string;
  file_size: number | null;
  corpus: {
    id: number;
    name: string;
    description: string;
    url: string;
  };
  language: string;
  summary: string;
  thumbnail_url: string;
  title: string;
  url: string;
  media_url: string;
  duration: string;
  views: string;
  likes: string;
  shares: string | null;
  comments: string;
  description: string;
  type: 'video' | 'audio' | 'text';
  source: string;
  transcription?: string;
}

export async function loadInterviewData(uuid: string): Promise<InterviewData> {
  try {
    const response = await fetch(`/data/${uuid}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading interview data:', error);
    throw error;
  }
}
