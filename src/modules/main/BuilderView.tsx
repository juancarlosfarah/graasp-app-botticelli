import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import SaveIcon from '@mui/icons-material/Save';
import { Box, Button, Stack, Typography } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';

import isEqual from 'lodash/isequal';

import { ChatSettingsType, ExchangesSettingsType } from '@/config/appSettings';
import { hooks, mutations } from '@/config/queryClient';
import { BUILDER_VIEW_CY } from '@/config/selectors';

import ChatSettingsComponent from '../../settings/ChatSettings';
import ExchangesSettingsComponent from '../../settings/ExchangesSettings';
import { useSettings } from '../context/SettingsContext';

const AppSettingsDisplay = (): JSX.Element => {
  const { data: appSettings } = hooks.useAppSettings();
  return (
    <Box p={2}>
      <Typography>App Setting</Typography>
      {appSettings ? (
        <pre>{JSON.stringify(appSettings, null, 2)}</pre>
      ) : (
        <Typography>Loading</Typography>
      )}
    </Box>
  );
};

const AppActionsDisplay = (): JSX.Element => {
  const { data: appActions } = hooks.useAppActions();
  return (
    <Box p={2}>
      <Typography>App Actions</Typography>
      {appActions ? (
        <pre>{JSON.stringify(appActions, null, 2)}</pre>
      ) : (
        <Typography>Loading</Typography>
      )}
    </Box>
  );
};

const BuilderView = (): JSX.Element => {
  const { permission } = useLocalContext();
  const { data: appDatas } = hooks.useAppData();
  const { mutate: postAppData } = mutations.usePostAppData();
  const { mutate: postAppAction } = mutations.usePostAppAction();
  const { mutate: patchAppData } = mutations.usePatchAppData();
  const { mutate: deleteAppData } = mutations.useDeleteAppData();
  const { mutate: postAppSetting } = mutations.usePostAppSetting();

  const { t } = useTranslation();

  const {
    chat: chatSavedState,
    exchanges: exchangesSavedState,
    saveSettings,
  } = useSettings();

  const [chat, setChat] = useState<ChatSettingsType>(chatSavedState);
  const [exchanges, setExchanges] =
    useState<ExchangesSettingsType>(exchangesSavedState);

  const saveAllSettings = (): void => {
    saveSettings('chat', chat);
    saveSettings('exchanges', exchanges);
  };

  useEffect(() => setChat(chatSavedState), [chatSavedState]);
  useEffect(() => setExchanges(exchangesSavedState), [exchangesSavedState]);

  const disableSave = useMemo(
    () =>
      isEqual(chatSavedState, chat) && isEqual(exchangesSavedState, exchanges),
    [chat, chatSavedState, exchanges, exchangesSavedState],
  );

  return (
    <div data-cy={BUILDER_VIEW_CY}>
      Builder as {permission}
      <Stack direction="column" spacing={2}>
        <Stack direction="row" justifyContent="center" spacing={1}>
          <Button
            variant="outlined"
            onClick={() =>
              postAppAction({ data: { content: 'hello' }, type: 'an-action' })
            }
          >
            Post new App Action
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              postAppData({ data: { content: 'hello' }, type: 'a-type' })
            }
          >
            Post new App Data
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              postAppSetting({ data: { content: 'hello' }, name: 'setting' })
            }
          >
            Post new App Setting
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              const data = appDatas?.at(-1);
              patchAppData({
                id: data?.id || '',
                data: { content: `${data?.data.content}-` },
              });
            }}
          >
            Patch last App Data
          </Button>
          <Button
            variant="outlined"
            onClick={() => deleteAppData({ id: appDatas?.at(-1)?.id || '' })}
          >
            Delete last App Data
          </Button>
        </Stack>
        <Box p={2}>
          <Stack spacing={2}>
            <Typography variant="h2">{t('SETTINGS.TITLE')}</Typography>
            <ChatSettingsComponent
              chat={chat}
              onChange={(newSetting: ChatSettingsType) => {
                setChat(newSetting);
              }}
            />
            <ExchangesSettingsComponent
              exchanges={exchanges}
              setExchanges={setExchanges}
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
        </Box>
        <Box p={2}>
          <Typography>App Data</Typography>
          <pre>{JSON.stringify(appDatas, null, 2)}</pre>
        </Box>
        <AppSettingsDisplay />
        <AppActionsDisplay />
      </Stack>
    </div>
  );
};
export default BuilderView;
