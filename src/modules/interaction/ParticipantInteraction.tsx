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

const ParticipantInteraction = (): ReactElement => {
  const { memberId: participantId } = useLocalContext();

  const { data: appDatas } = hooks.useAppData<Interaction>();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { chat, exchanges } = useSettings();

  const { t } = useTranslation();

  const defaultUser: Agent = {
    id: uuidv4(),
    name: 'Default User',
    description: 'Default user description',
    type: AgentType.User,
  };

  const currentMember: Agent = {
    ...defaultUser,
    ...hooks
      .useAppContext()
      .data?.members.find((member) => member.id === participantId),
  };

  const defaultAssistant: Agent = {
    id: uuidv4(),
    name: 'Default Assistant',
    description: 'Default assistant description',
    type: AgentType.Assistant,
  };

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

  function createTemplate(): Interaction {
    const interactionBase: Interaction = { ...defaultInteraction, ...chat };
    interactionBase.exchanges.exchangesList = exchanges.exchangesList.map(
      (exchange) => ({
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

  const currentAppData = useMemo(
    () => appDatas?.find((appData) => appData.member.id === participantId),
    [appDatas, participantId],
  );

  const hasPosted = useRef(!!currentAppData);

  const [interaction, setInteraction] = useState<Interaction>(
    (currentAppData?.data as Interaction) || createTemplate(),
  );

  useEffect(() => {
    if (!hasPosted.current) {
      postAppData({ data: interaction, type: 'Interaction' });
      hasPosted.current = true;
    }
  }, [interaction, postAppData]);

  useEffect(() => {
    if (hasPosted.current && currentAppData?.id) {
      patchAppData({
        id: currentAppData.id,
        data: interaction,
      });
    }
  }, [interaction, patchAppData, currentAppData?.id]);

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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): string => {
      if (!interaction.completed) {
        // Perform actions before the component unloads
        event.preventDefault();

        // Chrome requires returnValue to be set
        // Prompt the user before leaving
        const confirmationMessage = 'Are you sure you want to leave?';

        // Chrome requires returnValue to be set
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

  const startInteraction = (): void => {
    setInteraction((prev) => ({
      ...prev,
      started: true,
      startedAt: new Date(),
    }));
  };

  const goToNextExchange = (): void => {
    setInteraction((prev) => {
      const numExchanges = prev.exchanges.exchangesList.length;
      if (prev.currentExchange === numExchanges - 1) {
        return {
          ...prev,
          completed: true,
          completedAt: new Date(),
        };
      }
      return {
        ...prev,
        currentExchange: prev.currentExchange + 1,
      };
    });
  };

  if (!interaction) {
    return <div>Interaction Not Found</div>;
  }

  const handleStartInteraction = (): void => {
    startInteraction();
  };

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
    <MessagesPane
      goToNextExchange={goToNextExchange}
      autoDismiss={
        interaction.exchanges.exchangesList[interaction.currentExchange]
          .hardLimit
      }
      currentExchange={
        interaction.exchanges.exchangesList[interaction.currentExchange]
      }
      setExchange={updateExchange}
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

export default ParticipantInteraction;
