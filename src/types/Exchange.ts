import Agent from './Agent';
import { Message } from './Message';
import Trigger from './Trigger';

type Exchange = {
  id: number;
  name: string;
  description: string;
  // instructions: string;
  chatbotInstructions: string;
  participantInstructionsOnComplete: string;
  // cue: string;
  participantCue: string;
  order: number;
  messages: Message[];
  // assistant: Agent;
  assistant: Agent;
  triggers: Trigger[];
  started: boolean;
  completed: boolean;
  dismissed: boolean;
  // softLimit: number;
  nbFollowUpQuestions: number;
  // hardLimit: number;
  hardLimit: boolean;
  startedAt?: Date;
  completedAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Exchange;
