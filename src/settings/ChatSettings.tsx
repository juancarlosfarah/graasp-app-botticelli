import { ChangeEvent, FC } from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import InfoBadge from '@mui/icons-material/Info';
import { Switch, Tooltip, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { ChatSettingsType } from '@/config/appSettings';
import { MAX_TEXT_INPUT_CHARS } from '@/config/config';
import {
  CHAT_DESCRIPTION_INPUT_CY,
  CHAT_INSTRUCTIONS_INPUT_CY,
  CHAT_NAME_INPUT_CY,
  CHAT_SETTINGS_TITLE_CY,
  MESSAGE_MEMORY_SWITCH_CY,
} from '@/config/selectors';

// Prop types for ChatSettings component
type PropTypes = {
  chat: ChatSettingsType;
  onChange: (newSetting: ChatSettingsType) => void;
};

// ChatSettings component to display and update chat settings
const ChatSettings: FC<PropTypes> = ({ chat, onChange }) => {
  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  // Destructuring chat settings
  const {
    name: chatName,
    description: chatDescription,
    participantInstructions: chatInstructions,
    participantEndText: chatEndText,
    sendAllToChatbot: chatSendAll,
  }: ChatSettingsType = chat;

  return (
    <Stack spacing={2}>
      <Typography variant="h5" data-cy={CHAT_SETTINGS_TITLE_CY}>
        {t('SETTINGS.CHAT.TITLE')}
      </Typography>
      <TextField
        value={chatName}
        label={t('SETTINGS.CHAT.NAME')}
        inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
        onChange={(
          e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void => onChange({ ...chat, name: e.target.value })}
        data-cy={CHAT_NAME_INPUT_CY}
      />
      <TextField
        value={chatDescription}
        label={t('SETTINGS.CHAT.DESCRIPTION')}
        multiline
        inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
        onChange={(
          e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void => onChange({ ...chat, description: e.target.value })}
        data-cy={CHAT_DESCRIPTION_INPUT_CY}
      />
      <TextField
        value={chatInstructions}
        label={t('SETTINGS.CHAT.INSTRUCTIONS')}
        multiline
        inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
        onChange={(
          e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void =>
          onChange({ ...chat, participantInstructions: e.target.value })
        }
        data-cy={CHAT_INSTRUCTIONS_INPUT_CY}
      />
      <TextField
        value={chatEndText}
        label={t('SETTINGS.CHAT.END')}
        multiline
        inputProps={{ maxLength: MAX_TEXT_INPUT_CHARS }}
        onChange={(
          e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void => onChange({ ...chat, participantEndText: e.target.value })}
      />
      <Typography variant="h6">
        {t('SETTINGS.CHAT.SEND_ALL')}
        {'   '}
        <Tooltip title={t('SETTINGS.CHAT.SEND_ALL_INFO')}>
          <InfoBadge />
        </Tooltip>
      </Typography>
      <Switch
        checked={chatSendAll}
        onChange={(e: ChangeEvent<HTMLInputElement>): void =>
          onChange({ ...chat, sendAllToChatbot: e.target.checked })
        }
        data-cy={MESSAGE_MEMORY_SWITCH_CY}
      />
    </Stack>
  );
};

// Exporting the component as the default export
export default ChatSettings;
