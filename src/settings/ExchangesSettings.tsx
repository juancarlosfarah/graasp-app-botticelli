import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ExchangesSettingsType } from '@/config/appSettings';
import { useSettings } from '@/modules/context/SettingsContext';
import Agent from '@/types/Agent';

type PropTypesSingle = {
  exchange: ExchangesSettingsType['exchanges_list'][number];
  onChange: (
    index: number,
    field: keyof ExchangesSettingsType['exchanges_list'][number],
    value: string | number | boolean | Omit<Agent, 'type'>,
  ) => void;
  handleRemoveExchange: (index: number) => void;
  index: number;
};

const ExchangeSettingsPanel: FC<PropTypesSingle> = ({
  exchange,
  onChange,
  index,
  handleRemoveExchange,
}) => {
  const { t } = useTranslation();
  const {
    assistant: exchangeAssistant,
    description: exchangeDescription,
    chatbot_instructions: exchangeInstructions,
    participant_cue: exchangeCue,
    nb_follow_up_questions: exchangeFollowUpQuestions,
    hard_limit: exchangeLimit,
  } = exchange;

  const { assistants } = useSettings();

  return (
    <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <TextField
        value={exchangeDescription}
        label={t('SETTINGS.EXCHANGES.DESCRIPTION')}
        multiline
        onChange={(e) => onChange(index, 'description', e.target.value)}
      />

      <TextField
        value={exchangeInstructions}
        label={t('SETTINGS.EXCHANGES.INSTRUCTIONS')}
        multiline
        onChange={(e) =>
          onChange(index, 'chatbot_instructions', e.target.value)
        }
      />
      <TextField
        value={exchangeCue}
        label={t('SETTINGS.EXCHANGES.CUE')}
        multiline
        onChange={(e) => onChange(index, 'participant_cue', e.target.value)}
      />
      {/*
      <FormControl>
        <InputLabel id="assistant-select-label" sx={{ bgcolor: 'white' }}>
          {t('SETTINGS.EXCHANGES.ASSISTANT')}
        </InputLabel>
        <Select
          labelId="assistant-select-label"
          value="string"
          label={t('SETTINGS.EXCHANGES.ASSISTANT')}
          onChange={(e) => onChange(index, 'assistant', e.target.value)}
        >
          <MenuItem value="opt1">opt1</MenuItem>
          <MenuItem value="opt2">opt2</MenuItem>
          <MenuItem value="opt3">opt3</MenuItem>
        </Select>
      </FormControl>
      */}
      <FormControl>
        <InputLabel>{t('SETTINGS.EXCHANGES.ASSISTANT')}</InputLabel>
        <Select
          value={exchangeAssistant.id}
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
              {assistant.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        value={exchangeFollowUpQuestions}
        type="number"
        label={t('SETTINGS.EXCHANGES.FOLLOW_UP_QUESTIONS')}
        onChange={(e) =>
          onChange(
            index,
            'nb_follow_up_questions',
            parseInt(e.target.value, 10),
          )
        }
      />
      <Typography variant="h6">
        {t('SETTINGS.EXCHANGES.DISABLE_HARD_LIMIT')}
      </Typography>
      <Switch
        checked={exchangeLimit}
        onChange={(e) => onChange(index, 'hard_limit', e.target.checked)}
      />
      <IconButton
        color="secondary"
        onClick={() => {
          handleRemoveExchange(index);
        }}
        sx={{ alignSelf: 'center', width: 'auto' }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

type PropTypesList = {
  exchanges: ExchangesSettingsType;
  onChange: (value: SetStateAction<ExchangesSettingsType>) => void;
};

const ExchangeSettings: FC<PropTypesList> = ({ exchanges, onChange }) => {
  const { t } = useTranslation();

  const handleAddExchange = (): void => {
    onChange((prev) => ({
      exchanges_list: [
        ...prev.exchanges_list,
        {
          assistant: {
            id: '1',
            name: 'Interviewer',
            description: 'Assistant Description',
          },
          description: '',
          chatbot_instructions: '',
          participant_cue: '',
          nb_follow_up_questions: NaN,
          hard_limit: false,
        },
      ],
    }));
  };

  const handleRemoveExchange = (index: number): void => {
    onChange((prev) => ({
      exchanges_list: prev.exchanges_list.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    index: number,
    field: keyof ExchangesSettingsType['exchanges_list'][number],
    value: string | number | boolean | Omit<Agent, 'type'>,
  ): void => {
    const updatedExchanges = exchanges.exchanges_list.map((exchange, i) =>
      i === index ? { ...exchange, [field]: value } : exchange,
    );

    onChange({ exchanges_list: updatedExchanges });
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
        {exchanges.exchanges_list.length === 0 ? (
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
          exchanges.exchanges_list.map((exchange, index) => (
            <Stack
              key={index}
              justifyContent="space-around"
              direction="row"
              spacing={2}
              alignItems="center"
              divider={<Divider orientation="vertical" flexItem />}
            >
              <Typography sx={{ flex: '0 0 5%' }}>{index + 1}</Typography>
              <Box sx={{ flex: '1' }}>
                <ExchangeSettingsPanel
                  exchange={exchange}
                  onChange={handleChange}
                  index={index}
                  handleRemoveExchange={handleRemoveExchange}
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

export default ExchangeSettings;
