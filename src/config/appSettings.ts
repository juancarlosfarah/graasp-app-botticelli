import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';

export type ChatSettingsType = {
  description: string;
  participant_instructions: string;
  participant_end_txt: string;
};

export type ExchangeSettings = {
  assistant: Agent & { type: AgentType.Assistant };
  description: string;
  chatbot_instructions: string;
  participant_cue: string;
  nb_follow_up_questions: number;
  hard_limit: boolean;
};

export type ExchangesSettingsType = { exchanges_list: ExchangeSettings[] };
