import {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useLocalContext } from '@graasp/apps-query-client';

import { v4 as uuidv4 } from 'uuid';

import { hooks, mutations } from '@/config/queryClient';
import { START_INTERACTION_BUTTON_CY } from '@/config/selectors';
import MessagesPane from '@/modules/message/MessagesPane';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';
import Exchange from '@/types/Exchange';
import Interaction from '@/types/Interaction';

import { defaultSettingsValues, useSettings } from '../context/SettingsContext';

// Main component: ParticipantInteraction
const ParticipantInteraction = (): ReactElement => {
  // Getting the participant ID from local context
  const { memberId: participantId } = useLocalContext();

  const { data: appDatas } = hooks.useAppData<Interaction>();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { chat, exchanges } = useSettings();

  const { t } = useTranslation();

  // Define a default user as an agent
  const defaultUser: Agent = {
    id: uuidv4(),
    name: 'Default User',
    description: 'Default user description',
    type: AgentType.User,
  };

  // Define the current member as an agent, merging with the default user
  const currentMember: Agent = {
    ...defaultUser,
    ...hooks
      .useAppContext()
      // Find the member in app context data by participant ID
      .data?.members.find((member) => member.id === participantId),
  };

  // Define a default assistant as an agent
  const defaultAssistant: Agent = {
    id: uuidv4(),
    name: 'Default Assistant',
    description: 'Default assistant description',
    type: AgentType.Assistant,
  };

  // Define a default interaction object using default settings
  const defaultInteraction: Interaction = {
    ...defaultSettingsValues.chat,
    id: uuidv4(),
    currentExchange: 0,
    started: false,
    completed: false,
    participant: currentMember,
    exchanges: { exchangesList: [] },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Define a default exchange object using default settings
  const defaultExchange: Exchange = {
    ...defaultSettingsValues.exchanges.exchangesList[0],
    messages: [],
    assistant: defaultAssistant,
    started: false,
    completed: false,
    dismissed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Function to create a template interaction object
  function createTemplate(): Interaction {
    // Merge chat settings with default interaction
    const interactionBase: Interaction = { ...defaultInteraction, ...chat };
    interactionBase.exchanges.exchangesList = exchanges.exchangesList.map(
      (exchange) => ({
        // Merge default exchange with each exchange from settings
        ...defaultExchange,
        ...exchange,
        assistant: {
          ...defaultAssistant,
          ...exchange.assistant,
          type: AgentType.Assistant,
        },
      }),
    );
    return interactionBase;
  }

  // Memoize the current app data for the participant
  const currentAppData = useMemo(
    () => appDatas?.find((appData) => appData.member.id === participantId),
    [appDatas, participantId],
  );

  // Ref to track if the app data has already been posted
  const hasPosted = useRef(!!currentAppData);

  // State to manage the current interaction, either from existing data or a new template
  const [interaction, setInteraction] = useState<Interaction>(
    (currentAppData?.data as Interaction) || createTemplate(),
  );

  // Effect to post the interaction data if it hasn't been posted yet
  useEffect(() => {
    if (!hasPosted.current) {
      postAppData({ data: interaction, type: 'Interaction' });
      hasPosted.current = true;
    }
  }, [interaction, postAppData]);

  // Effect to patch the interaction data if it has been posted and current app data exists
  useEffect(() => {
    if (hasPosted.current && currentAppData?.id) {
      patchAppData({
        id: currentAppData.id,
        data: interaction,
      });
    }
  }, [interaction, patchAppData, currentAppData?.id]);

  // Callback to update a specific exchange within the interaction
  const updateExchange = useCallback((updatedExchange: Exchange): void => {
    setInteraction((prevState) => ({
      ...prevState,
      exchanges: {
        exchangesList: prevState.exchanges.exchangesList.map((exchange) =>
          exchange.id === updatedExchange.id ? updatedExchange : exchange,
        ),
      },
    }));
  }, []);

  // Effect to handle actions when the user tries to leave the page (before unload)
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): string => {
      if (!interaction.completed) {
        // If the interaction is not completed, prompt the user before leaving
        event.preventDefault();
        const confirmationMessage = 'Are you sure you want to leave?';
        // eslint-disable-next-line no-param-reassign
        event.returnValue = confirmationMessage; // For Chrome
        return confirmationMessage; // For standard browsers
      }
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [interaction.completed]);

  // Function to start the interaction
  const startInteraction = (): void => {
    setInteraction((prev) => ({
      ...prev,
      started: true,
      startedAt: new Date(),
    }));
  };

  // Function to move to the next exchange or complete the interaction
  const goToNextExchange = (): void => {
    setInteraction((prev) => {
      const numExchanges = prev.exchanges.exchangesList.length;
      if (prev.currentExchange === numExchanges - 1) {
        // If this is the last exchange, mark the interaction as completed
        return {
          ...prev,
          completed: true,
          completedAt: new Date(),
        };
      }
      return {
        ...prev,
        // Move to the next exchange
        currentExchange: prev.currentExchange + 1,
      };
    });
  };

  // Render fallback if interaction data is not available
  if (!interaction) {
    return <div>Interaction Not Found</div>;
  }

  // Handle the start of the interaction
  const handleStartInteraction = (): void => {
    startInteraction();
  };
  /*
  return (
    <MessagesPane
      goToNextExchange={() => {}}
      autoDismiss={false} // Auto-dismiss exchanges if the hard limit is reached
      currentExchange={defaultExchange}
      setExchange={(a) => {}}
      pastMessages={[]}
      participant={defaultUser}
    />
  );
*/

  // Render the start interaction button if the interaction has not started
  if (!interaction.started) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {interaction.participantInstructions && (
          <>
            <Typography
              variant="body1"
              sx={{ p: 2, pt: 4, textAlign: 'justify' }}
            >
              {interaction.participantInstructions}
            </Typography>
            <Typography
              variant="body1"
              sx={{ p: 2, pt: 4, textAlign: 'center' }}
            >
              {t('START_INTERACTION')}
            </Typography>
          </>
        )}
        <Button
          variant="contained"
          size="large"
          data-cy={START_INTERACTION_BUTTON_CY}
          sx={{ mt: 3, mx: 'auto' }}
          onClick={handleStartInteraction}
        >
          {t('START')}
        </Button>
      </Box>
    );
  }
  // Render the completed interaction message if the interaction is completed
  return interaction.completed ? (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Typography variant="body1" sx={{ p: 10, textAlign: 'center' }}>
        {interaction.participantEndText}
      </Typography>
    </Box>
  ) : (
    // Render the MessagesPane component to handle the conversation
    <MessagesPane
      goToNextExchange={goToNextExchange}
      autoDismiss={
        interaction.exchanges.exchangesList[interaction.currentExchange]
          .hardLimit
      } // Auto-dismiss exchanges if the hard limit is reached
      currentExchange={
        interaction.exchanges.exchangesList[interaction.currentExchange]
      }
      setExchange={updateExchange}
      interactionDescription={interaction.description}
      pastMessages={interaction.exchanges.exchangesList.flatMap((exchange) => {
        if (exchange.dismissed) {
          return exchange.messages;
        }
        return [];
      })}
      participant={currentMember}
    />
  );
};

// Export the ParticipantInteraction component as the default export
export default ParticipantInteraction;
