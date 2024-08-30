import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConversationsViewIcon from '@mui/icons-material/Chat';
import ExchangesViewIcon from '@mui/icons-material/ChatBubble';
import SaveIcon from '@mui/icons-material/Save';
import ChatViewIcon from '@mui/icons-material/SettingsApplications';
import AssistantViewIcon from '@mui/icons-material/SmartToy';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Stack, Tab } from '@mui/material';

import { Member } from '@graasp/sdk';

import { isEqual } from 'lodash';

import {
  AssistantsSettingsType,
  ChatSettingsType,
  ExchangesSettingsType,
} from '@/config/appSettings';
import { useSettings } from '@/modules/context/SettingsContext';
import Conversations from '@/results/ConversationsView';

import AssistantsSettingsComponent from './AssistantSettings';
import ChatSettingsComponent from './ChatSettings';
import ExchangesSettingsComponent from './ExchangesSettings';

// Enum to manage tab values
enum Tabs {
  ASSISTANT_VIEW = 'ASSISTANT_VIEW',
  CHAT_VIEW = 'CHAT_VIEW',
  EXCHANGES_VIEW = 'EXCHANGES_VIEW',
  CONVERSATIONS_VIEW = 'CONVERSATIONS_VIEW',
}

// Main component: AllSettings
const AllSettings: FC<Record<string, never>> = () => {
  // Destructuring saved settings and save function from the custom useSettings hook
  const {
    assistants: assistantsSavedState,
    chat: chatSavedState,
    exchanges: exchangesSavedState,
    saveSettings,
  } = useSettings();

  // State to manage the current values of assistants, chat, and exchanges settings
  const [assistants, setAssistants] =
    useState<AssistantsSettingsType>(assistantsSavedState);
  const [chat, setChat] = useState<ChatSettingsType>(chatSavedState);
  const [exchanges, setExchanges] =
    useState<ExchangesSettingsType>(exchangesSavedState);

  useEffect(() => setAssistants(assistantsSavedState), [assistantsSavedState]);
  useEffect(() => setChat(chatSavedState), [chatSavedState]);
  useEffect(() => setExchanges(exchangesSavedState), [exchangesSavedState]);

  // Hook for translations
  const { t } = useTranslation();

  const placeholderMember: Member = {
    id: '',
    name: t('CONVERSATIONS.PLACEHOLDER'),
    email: '',
  };

  const [checkedOutMember, setCheckedOutMember] =
    useState<Member>(placeholderMember);

  // State to manage the active tab, initially set to the Assistant view
  const [activeTab, setActiveTab] = useState(Tabs.ASSISTANT_VIEW);

  return (
    <TabContext value={activeTab}>
      <Stack direction="row" justifyContent="space-evenly">
        <TabList
          textColor="secondary"
          indicatorColor="secondary"
          onChange={(_, newTab: Tabs) => setActiveTab(newTab)} // Update the active tab when a new tab is selected
          centered
        >
          <Tab
            value={Tabs.ASSISTANT_VIEW}
            label={t('SETTINGS.EXCHANGES.ASSISTANT')}
            icon={<AssistantViewIcon />}
            iconPosition="start"
          />
          <Tab
            value={Tabs.CHAT_VIEW}
            label={t('SETTINGS.CHAT.TITLE')}
            icon={<ChatViewIcon />}
            iconPosition="start"
          />
          <Tab
            value={Tabs.EXCHANGES_VIEW}
            label={t('SETTINGS.EXCHANGES.TITLE')}
            icon={<ExchangesViewIcon />}
            iconPosition="start"
          />
        </TabList>
        <TabList
          textColor="primary"
          indicatorColor="primary"
          onChange={(_, newTab: Tabs) => setActiveTab(newTab)} // Update the active tab when a new tab is selected
          centered
        >
          <Tab
            value={Tabs.CONVERSATIONS_VIEW}
            label={t('CONVERSATIONS.TITLE')}
            icon={<ConversationsViewIcon />}
            iconPosition="start"
          />
        </TabList>
      </Stack>
      <TabPanel value={Tabs.ASSISTANT_VIEW}>
        <Stack spacing={2}>
          <AssistantsSettingsComponent
            assistants={assistants} // Passing current assistant settings
            onChange={setAssistants}
          />
          <Box>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() => saveSettings('assistants', assistants)}
              disabled={useMemo(
                () =>
                  // Disable if settings have not changed or list is empty
                  isEqual(assistantsSavedState, assistants) ||
                  assistants.assistantsList.length === 0,
                [assistants, assistantsSavedState],
              )}
            >
              {t('SETTINGS.SAVE_BTN')}{' '}
            </Button>
          </Box>
        </Stack>
      </TabPanel>
      <TabPanel value={Tabs.CHAT_VIEW}>
        <Stack spacing={2}>
          <ChatSettingsComponent chat={chat} onChange={setChat} />
          <Box>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() => saveSettings('chat', chat)}
              disabled={useMemo(
                // Disable if settings have not changed
                () => isEqual(chatSavedState, chat),
                [chat, chatSavedState],
              )}
            >
              {t('SETTINGS.SAVE_BTN')}{' '}
            </Button>
          </Box>
        </Stack>
      </TabPanel>
      <TabPanel value={Tabs.EXCHANGES_VIEW}>
        <Stack spacing={2}>
          <ExchangesSettingsComponent
            exchanges={exchanges} // Passing current exchanges settings
            onChange={setExchanges}
          />
          <Box>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() => saveSettings('exchanges', exchanges)}
              disabled={useMemo(
                () =>
                  // Disable if settings have not changed or list is empty
                  isEqual(exchangesSavedState, exchanges) ||
                  exchanges.exchangesList.length === 0,
                [exchanges, exchangesSavedState],
              )}
            >
              {t('SETTINGS.SAVE_BTN')}{' '}
            </Button>
          </Box>
        </Stack>
      </TabPanel>
      <TabPanel value={Tabs.CONVERSATIONS_VIEW}>
        <Conversations
          checkedOutMember={checkedOutMember}
          setCheckedOutMember={setCheckedOutMember}
        />
      </TabPanel>
    </TabContext>
  );
};

// Export the AllSettings component as the default export
export default AllSettings;
