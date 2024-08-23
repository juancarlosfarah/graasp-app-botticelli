import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { ChatSettingsType } from '@/config/appSettings';

type PropTypes = {
  chat: ChatSettingsType;
  onChange: (newSetting: ChatSettingsType) => void;
};

const ChatSettings: FC<PropTypes> = ({ chat, onChange }) => {
  const { t } = useTranslation();
  const {
    description: chatDescription,
    participant_instructions: chatInstructions,
    participant_end_txt: chatEndText,
  } = chat;
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.CHAT.TITLE')}</Typography>

      <TextField
        value={chatDescription}
        label={t('SETTINGS.CHAT.DESCRIPTION')}
        onChange={(e) => onChange({ ...chat, description: e.target.value })}
      />
      <TextField
        value={chatInstructions}
        label={t('SETTINGS.CHAT.INSTRUCTIONS')}
        onChange={(e) =>
          onChange({ ...chat, participant_instructions: e.target.value })
        }
      />
      <TextField
        value={chatEndText}
        label={t('SETTINGS.CHAT.END')}
        onChange={(e) =>
          onChange({ ...chat, participant_end_txt: e.target.value })
        }
      />
    </Stack>
  );
};

export default ChatSettings;
