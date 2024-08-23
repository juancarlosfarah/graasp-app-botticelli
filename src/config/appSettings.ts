import Agent from '@/types/Agent';

type AssistantSettings = Omit<Agent, 'type'>;

export type AssistantsSettingsType = {
  assistantsList: AssistantSettings[];
};

export type ChatSettingsType = {
  description: string;
  participant_instructions: string;
  participant_end_txt: string;
};

export type ExchangeSettings = {
  assistant: AssistantSettings;
  description: string;
  chatbot_instructions: string;
  participant_cue: string;
  nb_follow_up_questions: number;
  hard_limit: boolean;
};

export type ExchangesSettingsType = { exchanges_list: ExchangeSettings[] };
