import Agent from '@/types/Agent';

type AssistantSettings = Omit<Agent, 'type'>;

export type AssistantsSettingsType = {
  assistantsList: AssistantSettings[];
};

export type ChatSettingsType = {
  description: string;
  participantInstructions: string;
  participantEndText: string;
};

export type ExchangeSettings = {
  assistant: AssistantSettings;
  description: string;
  chatbotInstructions: string;
  participantCue: string;
  nbFollowUpQuestions: number;
  hardLimit: boolean;
};

export type ExchangesSettingsType = { exchangesList: ExchangeSettings[] };
