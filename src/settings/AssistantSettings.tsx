import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { v4 as uuidv4 } from 'uuid';

import { AssistantsSettingsType } from '@/config/appSettings';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';

// Prop types for individual assistant settings panel
type PropTypesSingle = {
  assistant: AssistantsSettingsType['assistantsList'][number]; // Single assistant type
  onChange: (
    index: number,
    field: keyof AssistantsSettingsType['assistantsList'][number],
    value: string,
  ) => void; // Function to handle changes in assistant settings
  handleRemoveAssistant: (index: number) => void; // Function to remove an assistant
  handleMoveUp: (index: number) => void; // Function to move assistant up
  handleMoveDown: (index: number) => void; // Function to move assistant down
  index: number; // Index of the assistant in the list
  assistantsListLength: number; // Total number of assistants in the list
};

// Component for individual assistant settings panel
const AssistantSettingsPanel: FC<PropTypesSingle> = ({
  assistant,
  onChange,
  index,
  handleRemoveAssistant,
  handleMoveUp,
  handleMoveDown,
  assistantsListLength,
}) => {
  const { t } = useTranslation(); // Translation hook
  const {
    name: assistantName,
    description: assistantDescription,
    imageUrl: assistantImageUrl,
  } = assistant; // Destructuring assistant properties

  const panelColor: string = `#0${assistant.id.slice(0, 5)}`; // Generating a unique color for the assistant panel based on its ID

  return (
    <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={assistantImageUrl} sx={{ border: '1px solid #bdbdbd' }}>
          {assistantName.slice(0, 2)}{' '}
        </Avatar>
        <TextField
          value={assistantImageUrl || ''} // Displaying the image URL
          label={t('SETTINGS.ASSISTANTS.IMAGE')} // Label for image URL input field
          onChange={(e) => onChange(index, 'imageUrl', e.target.value)} // Handling change in image URL
          placeholder={t('SETTINGS.ASSISTANTS.URL')} // Placeholder text
          fullWidth // Input field takes full width
        />
        <IconButton
          sx={{ color: panelColor }}
          onClick={() => handleMoveUp(index)}
          disabled={index === 0} // Disabled if the assistant is at the top
        >
          <Tooltip title={t('SETTINGS.UP')}>
            <ArrowUpwardIcon />
          </Tooltip>
        </IconButton>
        <IconButton
          sx={{ color: panelColor }}
          onClick={() => handleMoveDown(index)}
          disabled={index === assistantsListLength - 1} // Disabled if the assistant is at the bottom
        >
          <Tooltip title={t('SETTINGS.DOWN')}>
            <ArrowDownwardIcon />
          </Tooltip>
        </IconButton>
      </Stack>
      <TextField
        value={assistantName} // Displaying the assistant's name
        label={t('SETTINGS.ASSISTANTS.NAME')} // Label for name input field
        multiline // Allows multiple lines of text
        inputProps={{ maxLength: 400 }} // Maximum length of the name
        onChange={(e) => onChange(index, 'name', e.target.value)} // Handling change in name
      />
      {/* Text field for assistant's description */}
      <TextField
        value={assistantDescription} // Displaying the assistant's description
        label={t('SETTINGS.ASSISTANTS.DESCRIPTION')} // Label for description input field
        multiline // Allows multiple lines of text
        inputProps={{ maxLength: 400 }} // Maximum length of the description
        onChange={(e) => onChange(index, 'description', e.target.value)} // Handling change in description
      />
      {/* Stack for delete button */}
      <Stack direction="row" justifyContent="center">
        <IconButton
          color="secondary"
          onClick={() => handleRemoveAssistant(index)} // Handling removal of assistant
          sx={{ width: 'auto' }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

// Prop types for the main assistants settings component
type PropTypesList = {
  assistants: AssistantsSettingsType; // Type for the assistants settings
  onChange: (value: SetStateAction<AssistantsSettingsType>) => void; // Function to handle changes in the assistants list
};

// Main component for managing assistants settings
const AssistantsSettings: FC<PropTypesList> = ({ assistants, onChange }) => {
  const { t } = useTranslation(); // Translation hook

  // Function to add a new assistant to the list
  const handleAddAssistant = (): void => {
    onChange((prev) => ({
      assistantsList: [
        ...prev.assistantsList, // Spreading existing assistants
        {
          id: uuidv4(), // Generating a unique ID for the new assistant
          name: '', // Default name
          description: '', // Default description
          imageUrl: '', // Default image URL
        },
      ],
    }));
  };

  // Function to remove an assistant from the list
  const handleRemoveAssistant = (index: number): void => {
    onChange((prev) => ({
      assistantsList: prev.assistantsList.filter((_, i) => i !== index), // Removing the assistant at the specified index
    }));
  };

  // Function to move an assistant up in the list
  const handleMoveUp = (index: number): void => {
    if (index === 0) return; // If the assistant is at the top, do nothing
    onChange((prev) => {
      const updatedAssistants = [...prev.assistantsList]; // Creating a copy of the assistants list
      const [movedAssistant] = updatedAssistants.splice(index, 1); // Removing the assistant from the current position
      updatedAssistants.splice(index - 1, 0, movedAssistant); // Inserting the assistant one position up
      return { assistantsList: updatedAssistants }; // Updating the state with the new order
    });
  };

  // Function to move an assistant down in the list
  const handleMoveDown = (index: number): void => {
    if (index === assistants.assistantsList.length - 1) return; // If the assistant is at the bottom, do nothing
    onChange((prev) => {
      const updatedAssistants = [...prev.assistantsList]; // Creating a copy of the assistants list
      const [movedAssistant] = updatedAssistants.splice(index, 1); // Removing the assistant from the current position
      updatedAssistants.splice(index + 1, 0, movedAssistant); // Inserting the assistant one position down
      return { assistantsList: updatedAssistants }; // Updating the state with the new order
    });
  };

  // Function to handle changes in the assistant's fields (name, description, image URL)
  const handleChange = (
    index: number,
    field: keyof AssistantsSettingsType['assistantsList'][number],
    value: string | number | boolean | (Agent & { type: AgentType.Assistant }),
  ): void => {
    const updatedAssistants = assistants.assistantsList.map(
      (assistant, i) =>
        i === index ? { ...assistant, [field]: value } : assistant, // Updating the specified field of the assistant at the specified index
    );

    onChange({ assistantsList: updatedAssistants }); // Updating the state with the new list
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.ASSISTANTS.TITLE')}</Typography>{' '}
      {/* Title for the assistants settings */}
      <Stack
        spacing={1}
        py={2}
        px={20}
        border="1px solid #ccc"
        borderRadius="8px"
      >
        {/* Alert message when no assistants are present */}
        {assistants.assistantsList.length === 0 ? (
          <Alert
            severity="warning"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t('SETTINGS.ASSISTANTS.CREATE')}{' '}
            {/* Message prompting user to create a new assistant */}
          </Alert>
        ) : (
          // Mapping over the list of assistants and rendering a settings panel for each
          assistants.assistantsList.map((assistant, index) => (
            <Stack
              key={index} // Unique key for each assistant
              justifyContent="space-around"
              direction="row"
              spacing={2}
              alignItems="center"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  color={`#0${assistant.id.slice(0, 5)}`} // Unique color for each assistant's divider
                />
              }
            >
              {/* Displaying the assistant's index */}
              <Typography
                px={1}
                bgcolor={`#0${assistant.id.slice(0, 5)}`}
                flex="0 0 fit-content"
                color="white"
                borderRadius="50%"
                textAlign="center"
              >
                {index + 1}
              </Typography>
              <Box sx={{ flex: '1' }}>
                {/* Rendering the assistant settings panel */}
                <AssistantSettingsPanel
                  assistant={assistant}
                  onChange={handleChange}
                  index={index}
                  handleRemoveAssistant={handleRemoveAssistant}
                  handleMoveUp={handleMoveUp}
                  handleMoveDown={handleMoveDown}
                  assistantsListLength={assistants.assistantsList.length}
                />
              </Box>
            </Stack>
          ))
        )}
        <Button variant="contained" onClick={handleAddAssistant}>
          {t('SETTINGS.ASSISTANTS.ADD')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default AssistantsSettings; // Exporting the component as the default export
