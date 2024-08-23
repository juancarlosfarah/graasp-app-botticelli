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

enum Tabs {
  ASSISTANT_VIEW = 'ASSISTANT_VIEW',
  CHAT_VIEW = 'CHAT_VIEW',
  EXCHANGES_VIEW = 'EXCHANGES_VIEW',
}

const AllSettings: FC<Record<string, never>> = () => {
  const {
    assistants: assistantsSavedState,
    chat: chatSavedState,
    exchanges: exchangesSavedState,
    saveSettings,
  } = useSettings();

  const [assistants, setAssistants] =
    useState<AssistantsSettingsType>(assistantsSavedState);
  const [chat, setChat] = useState<ChatSettingsType>(chatSavedState);
  const [exchanges, setExchanges] =
    useState<ExchangesSettingsType>(exchangesSavedState);

  useEffect(() => setAssistants(assistantsSavedState), [assistantsSavedState]);
  useEffect(() => setChat(chatSavedState), [chatSavedState]);
  useEffect(() => setExchanges(exchangesSavedState), [exchangesSavedState]);

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(Tabs.ASSISTANT_VIEW);

  return (
    <TabContext value={activeTab}>
      <TabList
        textColor="secondary"
        indicatorColor="secondary"
        onChange={(_, newTab: Tabs) => setActiveTab(newTab)}
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
      <TabPanel value={Tabs.ASSISTANT_VIEW}>
        <Stack spacing={2}>
          <AssistantsSettingsComponent
            assistants={assistants}
            onChange={setAssistants}
          />
          <Box>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() => saveSettings('assistants', assistants)}
              disabled={useMemo(
                () =>
                  isEqual(assistantsSavedState, assistants) ||
                  assistants.assistantsList.length === 0,
                [assistants, assistantsSavedState],
              )}
            >
              {t('SETTINGS.SAVE_BTN')}
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
                () => isEqual(chatSavedState, chat),
                [chat, chatSavedState],
              )}
            >
              {t('SETTINGS.SAVE_BTN')}
            </Button>
          </Box>
        </Stack>
      </TabPanel>
      <TabPanel value={Tabs.EXCHANGES_VIEW}>
        <Stack spacing={2}>
          <ExchangesSettingsComponent
            exchanges={exchanges}
            onChange={setExchanges}
          />
          <Box>
            <Button
              startIcon={<SaveIcon />}
              variant="contained"
              onClick={() => saveSettings('exchanges', exchanges)}
              disabled={useMemo(
                () =>
                  isEqual(exchangesSavedState, exchanges) ||
                  exchanges.exchangesList.length === 0,
                [exchanges, exchangesSavedState],
              )}
            >
              {t('SETTINGS.SAVE_BTN')}
            </Button>
          </Box>
        </Stack>
      </TabPanel>
    </TabContext>
  );
  /*
  return (
    <Stack spacing={2}>
      <Typography variant="h3">{t('SETTINGS.TITLE')}</Typography>
      <ChatSettingsComponent
        chat={chat}
        onChange={(newSetting: ChatSettingsType) => {
          setChat(newSetting);
        }}
      />
      <ExchangesSettingsComponent
        exchanges={exchanges}
        onChange={setExchanges}
      />
      <Box>
        <Button
          startIcon={<SaveIcon />}
          variant="contained"
          onClick={saveAllSettings}
          disabled={disableSave}
        >
          {t('SETTINGS.SAVE_BTN')}
        </Button>
      </Box>
    </Stack>
  );
  */
};

export default AllSettings;
