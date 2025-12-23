export type Sender = 'user' | 'bot';

// Ensure these match the dictionary keys in geminiServices.ts exactly
export type Topic = 'sleep' | 'exercise' | 'food' | 'habits';

// These subtypes are used for the logic engine (even if simulated)
export type Subtype = 'BIOLOGY' | 'ENVIRONMENT' | 'CONSISTENCY' | 'EMOTIONAL' | 'COGNITIVE';
export type NeedCategory = 'HIGH' | 'MODERATE' | 'LOW';

export interface MenuOption {
  text: string;
  value: string;
  // Included to support the cognitive load/scoring logic in App.tsx
  needScore: number;
  subtype: Subtype;
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  options?: MenuOption[];
}

// These interfaces are available if you want to strictly type the data repository later,
// but they are not strictly required for the app to run right now.
export interface Question {
  text: string;
  options: MenuOption[];
}

export interface TopicFlow {
  questions: Question[];
  recommendations: Record<NeedCategory, Record<Subtype, string>>;
}

export type DialogueData = Record<Topic, TopicFlow>;
