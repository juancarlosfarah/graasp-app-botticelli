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
  const { memberId: participantId } = useLocalContext(); // Getting the participant ID from local context

  const { data: appDatas } = hooks.useAppData<Interaction>(); // Fetching app data (interactions) using a custom hook
  const { mutate: postAppData } = mutations.usePostAppData(); // Mutation function for posting new app data
  const { mutate: patchAppData } = mutations.usePatchAppData(); // Mutation function for patching existing app data
  const { chat, exchanges } = useSettings(); // Getting chat and exchanges settings using a custom hook

  const { t } = useTranslation(); // Translation function from 'react-i18next'

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
      .data?.members.find((member) => member.id === participantId), // Find the member in app context data by participant ID
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
    const interactionBase: Interaction = { ...defaultInteraction, ...chat }; // Merge chat settings with default interaction
    interactionBase.exchanges.exchangesList = exchanges.exchangesList.map(
      (exchange) => ({
        ...defaultExchange, // Merge default exchange with each exchange from settings
        ...exchange,
        assistant: {
          ...defaultAssistant,
          ...exchange.assistant,
          type: AgentType.Assistant, // Ensure the assistant type is set
        },
      }),
    );
    return interactionBase; // Return the complete interaction object
  }

  // Memoize the current app data for the participant
  const currentAppData = useMemo(
    () => appDatas?.find((appData) => appData.member.id === participantId),
    [appDatas, participantId],
  );

  const hasPosted = useRef(!!currentAppData); // Ref to track if the app data has already been posted

  // State to manage the current interaction, either from existing data or a new template
  const [interaction, setInteraction] = useState<Interaction>(
    (currentAppData?.data as Interaction) || createTemplate(),
  );

  // Effect to post the interaction data if it hasn't been posted yet
  useEffect(() => {
    if (!hasPosted.current) {
      postAppData({ data: interaction, type: 'Interaction' }); // Post the interaction data
      hasPosted.current = true; // Mark as posted
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
    window.addEventListener('beforeunload', handleBeforeUnload); // Add event listener for before unload
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload); // Cleanup the event listener
    };
  }, [interaction.completed]);

  // Function to start the interaction
  const startInteraction = (): void => {
    setInteraction((prev) => ({
      ...prev,
      started: true,
      startedAt: new Date(), // Set the start time
    }));
  };

  // Function to move to the next exchange or complete the interaction
  const goToNextExchange = (): void => {
    setInteraction((prev) => {
      const numExchanges = prev.exchanges.exchangesList.length; // Get the total number of exchanges
      if (prev.currentExchange === numExchanges - 1) {
        // If this is the last exchange, mark the interaction as completed
        return {
          ...prev,
          completed: true,
          completedAt: new Date(), // Set the completion time
        };
      }
      return {
        ...prev,
        currentExchange: prev.currentExchange + 1, // Move to the next exchange
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
      goToNextExchange={goToNextExchange} // Function to move to the next exchange
      autoDismiss={
        interaction.exchanges.exchangesList[interaction.currentExchange]
          .hardLimit
      } // Auto-dismiss exchanges if the hard limit is reached
      currentExchange={
        interaction.exchanges.exchangesList[interaction.currentExchange]
      } // Current exchange being handled
      setExchange={updateExchange} // Function to update an exchange
      pastMessages={interaction.exchanges.exchangesList.flatMap((exchange) => {
        if (exchange.dismissed) {
          return exchange.messages; // Collect messages from dismissed exchanges
        }
        return [];
      })}
      participant={currentMember} // Participant data for the interaction
    />
  );
};

export default ParticipantInteraction; // Export the ParticipantInteraction component as the default export
