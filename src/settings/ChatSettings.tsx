import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { ChatSettingsType } from '@/config/appSettings';

// Prop types for ChatSettings component
type PropTypes = {
  chat: ChatSettingsType; // Current chat settings
  onChange: (newSetting: ChatSettingsType) => void; // Function to handle chat settings changes
};

// ChatSettings component to display and update chat settings
const ChatSettings: FC<PropTypes> = ({ chat, onChange }) => {
  const { t } = useTranslation(); // Translation hook
  const {
    description: chatDescription,
    participantInstructions: chatInstructions,
    participantEndText: chatEndText,
  } = chat; // Destructuring chat settings

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.CHAT.TITLE')}</Typography>{' '}
      {/* Title for chat settings */}
      <TextField
        value={chatDescription} // Displaying chat description
        label={t('SETTINGS.CHAT.DESCRIPTION')} // Label for description field
        multiline
        inputProps={{ maxLength: 400 }} // Max length for description
        onChange={(e) => onChange({ ...chat, description: e.target.value })} // Handling description change
      />
      <TextField
        value={chatInstructions} // Displaying participant instructions
        label={t('SETTINGS.CHAT.INSTRUCTIONS')} // Label for instructions field
        multiline
        inputProps={{ maxLength: 400 }} // Max length for instructions
        onChange={(e) =>
          onChange({ ...chat, participantInstructions: e.target.value })
        } // Handling instructions change
      />
      <TextField
        value={chatEndText} // Displaying end text
        label={t('SETTINGS.CHAT.END')} // Label for end text field
        multiline
        inputProps={{ maxLength: 400 }} // Max length for end text
        onChange={(e) =>
          onChange({ ...chat, participantEndText: e.target.value })
        } // Handling end text change
      />
    </Stack>
  );
};

export default ChatSettings; // Exporting the component as the default export
