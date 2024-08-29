import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { ChatSettingsType } from '@/config/appSettings';

// Prop types for ChatSettings component
type PropTypes = {
  chat: ChatSettingsType;
  onChange: (newSetting: ChatSettingsType) => void;
};

// ChatSettings component to display and update chat settings
const ChatSettings: FC<PropTypes> = ({ chat, onChange }) => {
  const { t } = useTranslation();

  // Destructuring chat settings
  const {
    description: chatDescription,
    participantInstructions: chatInstructions,
    participantEndText: chatEndText,
  } = chat;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.CHAT.TITLE')}</Typography>{' '}
      <TextField
        value={chatDescription}
        label={t('SETTINGS.CHAT.DESCRIPTION')}
        multiline
        inputProps={{ maxLength: 400 }}
        onChange={(e) => onChange({ ...chat, description: e.target.value })}
      />
      <TextField
        value={chatInstructions}
        label={t('SETTINGS.CHAT.INSTRUCTIONS')}
        multiline
        inputProps={{ maxLength: 400 }}
        onChange={(e) =>
          onChange({ ...chat, participantInstructions: e.target.value })
        }
      />
      <TextField
        value={chatEndText}
        label={t('SETTINGS.CHAT.END')}
        multiline
        inputProps={{ maxLength: 400 }}
        onChange={(e) =>
          onChange({ ...chat, participantEndText: e.target.value })
        }
      />
    </Stack>
  );
};

// Exporting the component as the default export
export default ChatSettings;
