import Agent from './Agent';
import Exchange from './Exchange';

type Interaction = {
  id: number;
  description: string;
  modelInstructions: string;
  // participantInstructions: string;
  participant_instructions: string;
  // participantInstructionsOnComplete: string;
  participant_end_txt: string;
  name: string;
  currentExchange: number;
  completed: boolean;
  started: boolean;
  participant: Agent;
  exchanges: { exchanges_list: Exchange[] };
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Interaction;
