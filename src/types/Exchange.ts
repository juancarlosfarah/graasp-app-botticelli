import Agent from './Agent';
import { Message } from './Message';
import Trigger from './Trigger';

type Exchange = {
  id: number;
  name: string;
  description: string;
  // instructions: string;
  chatbot_instructions: string;
  participantInstructionsOnComplete: string;
  // cue: string;
  participant_cue: string;
  order: number;
  messages: Message[];
  // assistant: Agent;
  assistant: Agent;
  triggers: Trigger[];
  started: boolean;
  completed: boolean;
  dismissed: boolean;
  // softLimit: number;
  nb_follow_up_questions: number;
  // hardLimit: number;
  hard_limit: boolean;
  startedAt?: Date;
  completedAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Exchange;
