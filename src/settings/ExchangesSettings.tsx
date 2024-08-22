import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button, IconButton, Switch } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ExchangesSettingsType } from '@/config/appSettings';
import AgentType from '@/types/AgentType';

type PropTypesSingle = {
  exchange: ExchangesSettingsType['exchanges_list'][number];
  onChange: (
    index: number,
    field: keyof ExchangesSettingsType['exchanges_list'][number],
    value: string | number | boolean,
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
    assistant: chatAssistant,
    description: exchangeDescription,
    chatbot_instructions: exchangeInstructions,
    participant_cue: exchangeCue,
    nb_follow_up_questions: exchangeFollowUpQuestions,
    hard_limit: exchangeLimit,
  } = exchange;
  return (
    <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <Typography variant="h4">
        {t('SETTINGS.EXCHANGES.DESCRIPTION')}
      </Typography>
      <TextField
        value={exchangeDescription}
        onChange={(e) => onChange(index, 'description', e.target.value)}
      />
      <Typography variant="h4">
        {t('SETTINGS.EXCHANGES.INSTRUCTIONS')}
      </Typography>
      <TextField
        value={exchangeInstructions}
        onChange={(e) =>
          onChange(index, 'chatbot_instructions', e.target.value)
        }
      />
      <Typography variant="h4">{t('SETTINGS.EXCHANGES.CUE')}</Typography>
      <TextField
        value={exchangeCue}
        onChange={(e) => onChange(index, 'participant_cue', e.target.value)}
      />
      <Typography variant="h4">
        {t('SETTINGS.EXCHANGES.FOLLOW_UP_QUESTIONS')}
      </Typography>
      <TextField
        value={exchangeFollowUpQuestions}
        type="number"
        onChange={(e) =>
          onChange(
            index,
            'nb_follow_up_questions',
            parseInt(e.target.value, 10),
          )
        }
      />
      <Typography variant="h4">
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
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

type PropTypesList = {
  exchanges: ExchangesSettingsType;
  setExchanges: (value: SetStateAction<ExchangesSettingsType>) => void;
};

const ExchangeSettings: FC<PropTypesList> = ({ exchanges, setExchanges }) => {
  const { t } = useTranslation();

  const handleAddExchange = (): void => {
    setExchanges((prev) => ({
      exchanges_list: [
        ...prev.exchanges_list,
        {
          assistant: {
            id: '1',
            name: 'Interviewer',
            description: 'Assistant Description',
            type: AgentType.Assistant,
          },
          description: '',
          chatbot_instructions: '',
          participant_cue: '',
          nb_follow_up_questions: 0,
          hard_limit: false,
        },
      ],
    }));
  };

  const handleRemoveExchange = (index: number): void => {
    setExchanges((prev) => ({
      exchanges_list: prev.exchanges_list.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    index: number,
    field: keyof ExchangesSettingsType['exchanges_list'][number],
    value: string | number | boolean,
  ): void => {
    const updatedExchanges = exchanges.exchanges_list.map((exchange, i) =>
      i === index ? { ...exchange, [field]: value } : exchange,
    );

    setExchanges({ exchanges_list: updatedExchanges });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h3">{t('SETTINGS.EXCHANGES.TITLE')}</Typography>
      {exchanges.exchanges_list.map((exchange, index) => (
        <ExchangeSettingsPanel
          key={index}
          exchange={exchange}
          onChange={handleChange}
          index={index}
          handleRemoveExchange={handleRemoveExchange}
        />
      ))}
      <Button variant="contained" onClick={handleAddExchange} fullWidth>
        +
      </Button>
    </Stack>
  );
};

export default ExchangeSettings;
