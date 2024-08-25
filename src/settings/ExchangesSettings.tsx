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

import { ExchangesSettingsType } from '@/config/appSettings';
import { useSettings } from '@/modules/context/SettingsContext';
import Agent from '@/types/Agent';

type PropTypesSingle = {
  exchange: ExchangesSettingsType['exchangesList'][number];
  onChange: (
    index: number,
    field: keyof ExchangesSettingsType['exchangesList'][number],
    value: string | number | boolean | Omit<Agent, 'type'>,
  ) => void;
  handleRemoveExchange: (index: number) => void;
  handleMoveUp: (index: number) => void; // New handler for moving up
  handleMoveDown: (index: number) => void; // New handler for moving down
  index: number;
  exchangesListLength: number; // Add the length of exchangesList as a prop
};

const ExchangeSettingsPanel: FC<PropTypesSingle> = ({
  exchange,
  onChange,
  index,
  handleRemoveExchange,
  handleMoveUp,
  handleMoveDown,
  exchangesListLength, // Use the length prop
}) => {
  const { t } = useTranslation();
  const {
    assistant: exchangeAssistant,
    description: exchangeDescription,
    chatbotInstructions: exchangeInstructions,
    participantCue: exchangeCue,
    nbFollowUpQuestions: exchangeFollowUpQuestions,
    hardLimit: exchangeLimit,
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
        onChange={(e) => onChange(index, 'chatbotInstructions', e.target.value)}
      />
      <TextField
        value={exchangeCue}
        label={t('SETTINGS.EXCHANGES.CUE')}
        multiline
        onChange={(e) => onChange(index, 'participantCue', e.target.value)}
      />
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={exchangeAssistant.imageUrl}>
          {exchangeAssistant.name.slice(0, 2)}
        </Avatar>
        <FormControl fullWidth>
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
        value={exchangeFollowUpQuestions}
        type="number"
        label={t('SETTINGS.EXCHANGES.FOLLOW_UP_QUESTIONS')}
        onChange={(e) =>
          onChange(index, 'nbFollowUpQuestions', parseInt(e.target.value, 10))
        }
      />
      <Typography variant="h6">
        {t('SETTINGS.EXCHANGES.DISABLE_hardLimit')}
        {'   '}
        <Tooltip title={t('SETTINGS.EXCHANGES.HARD_LIMIT_INFO')}>
          <InfoBadge />
        </Tooltip>
      </Typography>
      <Switch
        checked={exchangeLimit}
        onChange={(e) => onChange(index, 'hardLimit', e.target.checked)}
      />
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton
          color="primary"
          onClick={() => handleMoveUp(index)}
          disabled={index === 0}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => handleMoveDown(index)}
          disabled={index === exchangesListLength - 1}
        >
          <ArrowDownwardIcon />
        </IconButton>
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
      exchangesList: [
        ...prev.exchangesList,
        {
          assistant: {
            id: '1',
            name: 'Interviewer',
            description: 'Assistant Description',
          },
          description: '',
          chatbotInstructions: '',
          participantCue: '',
          nbFollowUpQuestions: NaN,
          hardLimit: false,
        },
      ],
    }));
  };

  const handleRemoveExchange = (index: number): void => {
    onChange((prev) => ({
      exchangesList: prev.exchangesList.filter((_, i) => i !== index),
    }));
  };

  const handleMoveUp = (index: number): void => {
    if (index === 0) return;
    onChange((prev) => {
      const updatedExchanges = [...prev.exchangesList];
      const [movedExchange] = updatedExchanges.splice(index, 1);
      updatedExchanges.splice(index - 1, 0, movedExchange);
      return { exchangesList: updatedExchanges };
    });
  };

  const handleMoveDown = (index: number): void => {
    if (index === exchanges.exchangesList.length - 1) return;
    onChange((prev) => {
      const updatedExchanges = [...prev.exchangesList];
      const [movedExchange] = updatedExchanges.splice(index, 1);
      updatedExchanges.splice(index + 1, 0, movedExchange);
      return { exchangesList: updatedExchanges };
    });
  };

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
          exchanges.exchangesList.map((exchange, index) => {
            const exchangeColors: string[] = ['#5050d2', '#d29650', '#50d250'];
            return (
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
                    color={exchangeColors[index % 3]}
                  />
                }
              >
                <Typography
                  px={1}
                  bgcolor={exchangeColors[index % 3]}
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
            );
          })
        )}
        <Button variant="contained" onClick={handleAddExchange}>
          +
        </Button>
      </Stack>
    </Stack>
  );
};

export default ExchangeSettings;
