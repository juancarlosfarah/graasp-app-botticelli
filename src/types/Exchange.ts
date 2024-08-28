import Agent from './Agent';
import { Message } from './Message';

type Exchange = {
  id: string;
  name: string;
  description: string;
  chatbotInstructions: string;
  participantInstructionsOnComplete: string;
  participantCue: string;
  messages: Message[];
  assistant: Agent;
  started: boolean;
  completed: boolean;
  dismissed: boolean;
  nbFollowUpQuestions: number;
  hardLimit: boolean;
  startedAt?: Date;
  completedAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Exchange;
