import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Box, Button, Divider, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AssistantsSettingsType } from '@/config/appSettings';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';

type PropTypesSingle = {
  assistant: AssistantsSettingsType['assistantsList'][number];
  onChange: (
    index: number,
    field: keyof AssistantsSettingsType['assistantsList'][number],
    value: string,
  ) => void;
  handleRemoveAssistant: (index: number) => void;
  index: number;
};

const AssistantSettingsPanel: FC<PropTypesSingle> = ({
  assistant,
  onChange,
  index,
  handleRemoveAssistant,
}) => {
  const { t } = useTranslation();
  const {
    id: assistantId,
    name: assistantName,
    description: assistantDescription,
  } = assistant;
  return (
    <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <TextField
        value={assistantId}
        label={t('SETTINGS.ASSISTANTS.ID')}
        multiline
        onChange={(e) => onChange(index, 'id', e.target.value)}
      />
      <TextField
        value={assistantName}
        label={t('SETTINGS.ASSISTANTS.NAME')}
        multiline
        onChange={(e) => onChange(index, 'name', e.target.value)}
      />
      <TextField
        value={assistantDescription}
        label={t('SETTINGS.ASSISTANTS.DESCRIPTION')}
        multiline
        onChange={(e) => onChange(index, 'description', e.target.value)}
      />
      <IconButton
        color="secondary"
        onClick={() => {
          handleRemoveAssistant(index);
        }}
        sx={{ alignSelf: 'center', width: 'auto' }}
      >
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

type PropTypesList = {
  assistants: AssistantsSettingsType;
  onChange: (value: SetStateAction<AssistantsSettingsType>) => void;
};

const AssistantsSettings: FC<PropTypesList> = ({ assistants, onChange }) => {
  const { t } = useTranslation();
  const handleAddAssistant = (): void => {
    onChange((prev) => ({
      assistantsList: [
        ...prev.assistantsList,
        {
          id: '',
          name: '',
          description: '',
        },
      ],
    }));
  };

  const handleRemoveAssistant = (index: number): void => {
    onChange((prev) => ({
      assistantsList: prev.assistantsList.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    index: number,
    field: keyof AssistantsSettingsType['assistantsList'][number],
    value: string | number | boolean | (Agent & { type: AgentType.Assistant }),
  ): void => {
    const updatedAssistants = assistants.assistantsList.map((assistant, i) =>
      i === index ? { ...assistant, [field]: value } : assistant,
    );

    onChange({ assistantsList: updatedAssistants });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.ASSISTANTS.TITLE')}</Typography>
      <Stack
        spacing={1}
        py={2}
        px={20}
        border="1px solid #ccc"
        borderRadius="8px"
      >
        {assistants.assistantsList.length === 0 ? (
          <Alert
            severity="warning"
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {t('SETTINGS.ASSISTANTS.CREATE')}
          </Alert>
        ) : (
          assistants.assistantsList.map((assistant, index) => {
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
                  <AssistantSettingsPanel
                    assistant={assistant}
                    onChange={handleChange}
                    index={index}
                    handleRemoveAssistant={handleRemoveAssistant}
                  />
                </Box>
              </Stack>
            );
          })
        )}
        <Button variant="contained" onClick={handleAddAssistant}>
          {t('SETTINGS.ASSISTANTS.ADD')}
        </Button>
      </Stack>
    </Stack>
  );

  /*
  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('SETTINGS.EXCHANGES.TITLE')}</Typography>
      <Box
        sx={{ maxHeight: '80vh', overflowY: 'auto' }}
        py={2}
        px={20}
        border="1px solid #ccc"
        borderRadius="8px"
      >
        <Stack spacing={1}>
          {assistants.assistantsList.length === 0 ? (
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
            assistants.assistantsList.map((assistant, index) => (
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
                  <AssistantSettingsPanel
                    assistant={assistant}
                    onChange={handleChange}
                    index={index}
                    handleRemoveAssistant={handleRemoveAssistant}
                  />
                </Box>
              </Stack>
            ))
          )}

          <Button variant="contained" onClick={handleAddAssistant}>
            +
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
  */
};

export default AssistantsSettings;
