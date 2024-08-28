import { UUID } from '@graasp/sdk';

import Agent from './Agent';
import Exchange from './Exchange';

type Interaction = {
  id: UUID;
  description: string;
  modelInstructions: string;
  participantInstructions: string;
  participantEndText: string;
  name: string;
  currentExchange: number;
  completed: boolean;
  started: boolean;
  participant: Agent;
  exchanges: { exchangesList: Exchange[] };
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export default Interaction;
