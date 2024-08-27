import Agent from './Agent';
import { Message } from './Message';

type Exchange = {
  id: string;
  name: string;
  description: string;
  // instructions: string;
  chatbotInstructions: string;
  participantInstructionsOnComplete: string;
  // cue: string;
  participantCue: string;
  messages: Message[];
  // assistant: Agent;
  assistant: Agent;
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
