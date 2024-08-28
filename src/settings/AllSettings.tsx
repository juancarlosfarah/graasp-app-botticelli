import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ExchangesViewIcon from '@mui/icons-material/Chat';
import SaveIcon from '@mui/icons-material/Save';
import ChatViewIcon from '@mui/icons-material/SettingsApplications';
import AssistantViewIcon from '@mui/icons-material/SmartToy';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Stack, Tab } from '@mui/material';

import { isEqual } from 'lodash';

import {
  AssistantsSettingsType,
  ChatSettingsType,
  ExchangesSettingsType,
} from '@/config/appSettings';
import { useSettings } from '@/modules/context/SettingsContext';

import AssistantsSettingsComponent from './AssistantSettings';
import ChatSettingsComponent from './ChatSettings';
import ExchangesSettingsComponent from './ExchangesSettings';

// Enum to manage tab values
enum Tabs {
  ASSISTANT_VIEW = 'ASSISTANT_VIEW',
  CHAT_VIEW = 'CHAT_VIEW',
  EXCHANGES_VIEW = 'EXCHANGES_VIEW',
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

  // State to manage the active tab, initially set to the Assistant view
  const [activeTab, setActiveTab] = useState(Tabs.ASSISTANT_VIEW);

  return (
    <TabContext value={activeTab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab: Tabs) => setActiveTab(newTab)} // Update the active tab when a new tab is selected
        centered
      >
        <Tab
          value={Tabs.ASSISTANT_VIEW}
          label={t('SETTINGS.EXCHANGES.ASSISTANT')} // Label for the tab
          icon={<AssistantViewIcon />} // Icon for the tab
          iconPosition="start" // Position of the icon relative to the label
        />
        <Tab
          value={Tabs.CHAT_VIEW}
          label={t('SETTINGS.CHAT.TITLE')} // Label for the tab
          icon={<ChatViewIcon />} // Icon for the tab
          iconPosition="start" // Position of the icon relative to the label
        />
        <Tab
          value={Tabs.EXCHANGES_VIEW}
          label={t('SETTINGS.EXCHANGES.TITLE')} // Label for the tab
          icon={<ExchangesViewIcon />} // Icon for the tab
          iconPosition="start" // Position of the icon relative to the label
        />
      </TabList>
      <TabPanel value={Tabs.ASSISTANT_VIEW}>
        <Stack spacing={2}>
          <AssistantsSettingsComponent
            assistants={assistants} // Passing current assistant settings
            onChange={setAssistants} // Function to update the assistant settings
          />
          <Box>
            <Button
              startIcon={<SaveIcon />} // Icon for the button
              variant="contained" // Button style
              onClick={() => saveSettings('assistants', assistants)} // Function to save the settings
              disabled={useMemo(
                () =>
                  isEqual(assistantsSavedState, assistants) || // Disable if settings have not changed or list is empty
                  assistants.assistantsList.length === 0,
                [assistants, assistantsSavedState], // Dependencies for useMemo
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
              startIcon={<SaveIcon />} // Icon for the button
              variant="contained" // Button style
              onClick={() => saveSettings('chat', chat)} // Function to save the settings
              disabled={useMemo(
                () => isEqual(chatSavedState, chat), // Disable if settings have not changed
                [chat, chatSavedState], // Dependencies for useMemo
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
            onChange={setExchanges} // Function to update the exchanges settings
          />
          <Box>
            <Button
              startIcon={<SaveIcon />} // Icon for the button
              variant="contained" // Button style
              onClick={() => saveSettings('exchanges', exchanges)} // Function to save the settings
              disabled={useMemo(
                () =>
                  isEqual(exchangesSavedState, exchanges) || // Disable if settings have not changed or list is empty
                  exchanges.exchangesList.length === 0,
                [exchanges, exchangesSavedState], // Dependencies for useMemo
              )}
            >
              {t('SETTINGS.SAVE_BTN')}{' '}
            </Button>
          </Box>
        </Stack>
      </TabPanel>
    </TabContext>
  );
};

export default AllSettings; // Export the AllSettings component as the default export
