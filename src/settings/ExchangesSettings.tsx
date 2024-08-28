import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoBadge from '@mui/icons-material/Info';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tooltip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { v4 as uuidv4 } from 'uuid';

import { ExchangesSettingsType } from '@/config/appSettings';
import { useSettings } from '@/modules/context/SettingsContext';
import Agent from '@/types/Agent';

// Prop types for ExchangeSettingsPanel component
type PropTypesSingle = {
  exchange: ExchangesSettingsType['exchangesList'][number]; // Individual exchange settings
  onChange: (
    index: number,
    field: keyof ExchangesSettingsType['exchangesList'][number],
    value: string | number | boolean | Omit<Agent, 'type'>, // Value type to update
  ) => void;
  handleRemoveExchange: (index: number) => void; // Function to handle removal of an exchange
  handleMoveUp: (index: number) => void; // Function to move an exchange up
  handleMoveDown: (index: number) => void; // Function to move an exchange down
  index: number; // Index of the exchange
  exchangesListLength: number; // Total number of exchanges in the list
};

// ExchangeSettingsPanel component to display and edit individual exchange settings
const ExchangeSettingsPanel: FC<PropTypesSingle> = ({
  exchange,
  onChange,
  index,
  handleRemoveExchange,
  handleMoveUp,
  handleMoveDown,
  exchangesListLength,
}) => {
  const { t } = useTranslation(); // Translation hook
  const {
    assistant: exchangeAssistant,
    description: exchangeDescription,
    chatbotInstructions: exchangeInstructions,
    participantCue: exchangeCue,
    participantInstructionsOnComplete: exchangeOnComplete,
    nbFollowUpQuestions: exchangeFollowUpQuestions,
    hardLimit: exchangeLimit,
  } = exchange; // Destructuring exchange settings

  const panelColor: string = `#0${exchange.id.slice(0, 5)}`; // Color based on exchange ID

  const { assistants } = useSettings(); // Getting assistants from settings context

  return (
    <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          value={exchangeDescription} // Displaying description
          label={t('SETTINGS.EXCHANGES.DESCRIPTION')} // Label for description field
          multiline
          inputProps={{ maxLength: 400 }} // Max length for description
          fullWidth
          onChange={(e) => onChange(index, 'description', e.target.value)} // Handling description change
        />
        <IconButton
          sx={{ color: panelColor }}
          onClick={() => handleMoveUp(index)} // Move up button
          disabled={index === 0} // Disable if already at the top
        >
          <Tooltip title={t('SETTINGS.UP')}>
            <ArrowUpwardIcon />
          </Tooltip>
        </IconButton>
        <IconButton
          sx={{ color: panelColor }}
          onClick={() => handleMoveDown(index)} // Move down button
          disabled={index === exchangesListLength - 1} // Disable if already at the bottom
        >
          <Tooltip title={t('SETTINGS.DOWN')}>
            <ArrowDownwardIcon />
          </Tooltip>
        </IconButton>
      </Stack>
      <TextField
        value={exchangeInstructions} // Displaying chatbot instructions
        label={t('SETTINGS.EXCHANGES.INSTRUCTIONS')} // Label for instructions field
        multiline
        inputProps={{ maxLength: 400 }} // Max length for instructions
        onChange={(e) => onChange(index, 'chatbotInstructions', e.target.value)} // Handling instructions change
      />
      <TextField
        value={exchangeCue} // Displaying participant cue
        label={t('SETTINGS.EXCHANGES.CUE')} // Label for cue field
        multiline
        inputProps={{ maxLength: 400 }} // Max length for cue
        onChange={(e) => onChange(index, 'participantCue', e.target.value)} // Handling cue change
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={exchangeAssistant.imageUrl}>
          {exchangeAssistant.name.slice(0, 2)}
        </Avatar>
        <FormControl fullWidth>
          <InputLabel>{t('SETTINGS.EXCHANGES.ASSISTANT')}</InputLabel>
          <Select
            value={exchangeAssistant.id} // Displaying selected assistant
            renderValue={(selectedId) =>
              assistants.assistantsList.find(
                (assistant) => assistant.id === selectedId,
              )?.name || selectedId
            }
            label={t('SETTINGS.EXCHANGES.ASSISTANT')}
            onChange={(e) =>
              onChange(
                index,
                'assistant',
                assistants.assistantsList.find(
                  (assistant) => assistant.id === e.target.value,
                ) || exchangeAssistant,
              )
            }
          >
            {assistants.assistantsList.map((assistant, nb) => (
              <MenuItem key={nb} value={assistant.id}>
                <Avatar src={assistant.imageUrl} sx={{ mx: '1%' }}>
                  {assistant.name.slice(0, 2)}
                </Avatar>
                {assistant ? (
                  assistant.name || assistant.id
                ) : (
                  <Alert
                    severity="warning"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {t('SETTINGS.EXCHANGES.CREATE_ASSISTANT')}
                  </Alert>
                )}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <TextField
        value={exchangeFollowUpQuestions} // Displaying follow-up questions number
        type="number"
        inputProps={{ min: 0, max: 400 }} // Min and max values for follow-up questions
        label={t('SETTINGS.EXCHANGES.FOLLOW_UP_QUESTIONS')}
        onChange={(e) =>
          onChange(
            index,
            'nbFollowUpQuestions',
            parseInt(e.target.value, 10) || 0,
          )
        }
      />
      <Typography variant="h6">
        {t('SETTINGS.EXCHANGES.DISABLE_HARD_LIMIT')}
        {'   '}
        <Tooltip title={t('SETTINGS.EXCHANGES.HARD_LIMIT_INFO')}>
          <InfoBadge />
        </Tooltip>
      </Typography>
      <Switch
        checked={exchangeLimit} // Switch for enabling/disabling hard limit
        onChange={(e) => onChange(index, 'hardLimit', e.target.checked)} // Handling switch change
      />
      {exchangeLimit && (
        <TextField
          value={exchangeOnComplete} // Displaying instructions on completion
          label={t('SETTINGS.EXCHANGES.ON_COMPLETE')}
          placeholder={t('SETTINGS.EXCHANGES.ON_COMPLETE_HELPER')}
          inputProps={{ maxLength: 400 }} // Max length for instructions on complete
          onChange={(e) =>
            onChange(index, 'participantInstructionsOnComplete', e.target.value)
          }
        />
      )}
      <Stack direction="row" justifyContent="center">
        <IconButton
          color="secondary"
          onClick={() => {
            handleRemoveExchange(index); // Handle removing exchange
          }}
          sx={{ alignSelf: 'center', width: 'auto' }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
};

// Prop types for ExchangeSettings component
type PropTypesList = {
  exchanges: ExchangesSettingsType; // List of exchanges settings
  onChange: (value: SetStateAction<ExchangesSettingsType>) => void; // Function to handle changes to exchanges settings
};

// ExchangeSettings component to manage a list of exchanges
const ExchangeSettings: FC<PropTypesList> = ({ exchanges, onChange }) => {
  const { t } = useTranslation(); // Translation hook

  // Add a new exchange to the list
  const handleAddExchange = (): void => {
    onChange((prev) => ({
      exchangesList: [
        ...prev.exchangesList,
        {
          id: uuidv4(), // Generate a new unique ID
          assistant: {
            id: '',
            name: '',
            description: '',
          },
          description: '',
          chatbotInstructions: '',
          participantCue: '',
          participantInstructionsOnComplete: '',
          nbFollowUpQuestions: 0,
          hardLimit: false,
        },
      ],
    }));
  };

  // Remove an exchange from the list
  const handleRemoveExchange = (index: number): void => {
    onChange((prev) => ({
      exchangesList: prev.exchangesList.filter((_, i) => i !== index),
    }));
  };

  // Move an exchange up in the list
  const handleMoveUp = (index: number): void => {
    if (index === 0) return; // Do nothing if already at the top
    onChange((prev) => {
      const updatedExchanges = [...prev.exchangesList];
      const [movedExchange] = updatedExchanges.splice(index, 1);
      updatedExchanges.splice(index - 1, 0, movedExchange);
      return { exchangesList: updatedExchanges };
    });
  };

  // Move an exchange down in the list
  const handleMoveDown = (index: number): void => {
    if (index === exchanges.exchangesList.length - 1) return; // Do nothing if already at the bottom
    onChange((prev) => {
      const updatedExchanges = [...prev.exchangesList];
      const [movedExchange] = updatedExchanges.splice(index, 1);
      updatedExchanges.splice(index + 1, 0, movedExchange);
      return { exchangesList: updatedExchanges };
    });
  };

  // Handle changes to exchange settings
  const handleChange = (
    index: number,
    field: keyof ExchangesSettingsType['exchangesList'][number],
    value: string | number | boolean | Omit<Agent, 'type'>,
  ): void => {
    const updatedExchanges = exchanges.exchangesList.map((exchange, i) =>
      i === index ? { ...exchange, [field]: value } : exchange,
    );

    onChange({ exchangesList: updatedExchanges });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.EXCHANGES.TITLE')}</Typography>
      <Stack
        spacing={1}
        py={2}
        px={20}
        border="1px solid #ccc"
        borderRadius="8px"
      >
        {exchanges.exchangesList.length === 0 ? (
          <Alert
            severity="warning"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t('SETTINGS.EXCHANGES.CREATE')}
          </Alert>
        ) : (
          exchanges.exchangesList.map((exchange, index) => (
            <Stack
              key={index}
              justifyContent="space-around"
              direction="row"
              spacing={2}
              alignItems="center"
              divider={
                <Divider
                  orientation="vertical"
                  flexItem
                  color={`#0${exchange.id.slice(0, 5)}`} // Color for divider based on exchange ID
                />
              }
            >
              <Typography
                px={1}
                bgcolor={`#0${exchange.id.slice(0, 5)}`} // Background color based on exchange ID
                flex="0 0 fit-content"
                color="white"
                borderRadius="50%"
                textAlign="center"
              >
                {index + 1}
              </Typography>
              <Box sx={{ flex: '1' }}>
                <ExchangeSettingsPanel
                  exchange={exchange}
                  onChange={handleChange}
                  index={index}
                  handleRemoveExchange={handleRemoveExchange}
                  handleMoveUp={handleMoveUp}
                  handleMoveDown={handleMoveDown}
                  exchangesListLength={exchanges.exchangesList.length} // Pass the length
                />
              </Box>
            </Stack>
          ))
        )}
        <Button variant="contained" onClick={handleAddExchange}>
          +
        </Button>
      </Stack>
    </Stack>
  );
};

export default ExchangeSettings; // Exporting the component as the default export
