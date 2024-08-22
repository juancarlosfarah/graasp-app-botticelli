import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
    <Stack spacing={1}>
      <Typography variant="h4">{t('SETTINGS.CHAT.DESCRIPTION')}</Typography>
      <TextField
        value={chatDescription}
        onChange={(e) => onChange({ ...chat, description: e.target.value })}
      />
      <Typography variant="h4">{t('SETTINGS.CHAT.INSTRUCTIONS')}</Typography>
      <TextField
        value={chatInstructions}
        onChange={(e) =>
          onChange({ ...chat, participant_instructions: e.target.value })
        }
      />
      <Typography variant="h4">{t('SETTINGS.CHAT.END')}</Typography>
      <TextField
        value={chatEndText}
        onChange={(e) =>
          onChange({ ...chat, participant_end_txt: e.target.value })
        }
      />
    </Stack>
  );
};

export default ChatSettings;
