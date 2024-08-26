import { FC, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, Avatar, Box, Button, Divider, IconButton } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { v4 as uuidv4 } from 'uuid';

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
  handleMoveUp: (index: number) => void;
  handleMoveDown: (index: number) => void;
  index: number;
  assistantsListLength: number;
};

const AssistantSettingsPanel: FC<PropTypesSingle> = ({
  assistant,
  onChange,
  index,
  handleRemoveAssistant,
  handleMoveUp,
  handleMoveDown,
  assistantsListLength,
}) => {
  const { t } = useTranslation();
  const {
    name: assistantName,
    description: assistantDescription,
    imageUrl: assistantImageUrl, // New field for the image URL
  } = assistant;

  return (
    <Stack spacing={1} p={2} border="1px solid #ccc" borderRadius="8px">
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          alt={assistantName}
          src={assistantImageUrl}
          sx={{ border: '1px solid #bdbdbd' }}
        >
          {assistantName.slice(0, 2)}
        </Avatar>
        <TextField
          value={assistantImageUrl || ''}
          label={t('SETTINGS.ASSISTANTS.IMAGE')}
          onChange={(e) => onChange(index, 'imageUrl', e.target.value)}
          placeholder={t('SETTINGS.ASSISTANTS.URL')}
          fullWidth
        />
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
          disabled={index === assistantsListLength - 1}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </Stack>
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
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton
          color="secondary"
          onClick={() => handleRemoveAssistant(index)}
          sx={{ width: 'auto' }}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
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
          id: uuidv4(),
          name: '',
          description: '',
          imageUrl: '',
        },
      ],
    }));
  };

  const handleRemoveAssistant = (index: number): void => {
    onChange((prev) => ({
      assistantsList: prev.assistantsList.filter((_, i) => i !== index),
    }));
  };

  const handleMoveUp = (index: number): void => {
    if (index === 0) return;
    onChange((prev) => {
      const updatedAssistants = [...prev.assistantsList];
      const [movedAssistant] = updatedAssistants.splice(index, 1);
      updatedAssistants.splice(index - 1, 0, movedAssistant);
      return { assistantsList: updatedAssistants };
    });
  };

  const handleMoveDown = (index: number): void => {
    if (index === assistants.assistantsList.length - 1) return;
    onChange((prev) => {
      const updatedAssistants = [...prev.assistantsList];
      const [movedAssistant] = updatedAssistants.splice(index, 1);
      updatedAssistants.splice(index + 1, 0, movedAssistant);
      return { assistantsList: updatedAssistants };
    });
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
          assistants.assistantsList.map((assistant, index) => (
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
                  color={`#0${assistant.id.slice(0, 5)}`} // {assistantColors[index % 3]}
                />
              }
            >
              <Typography
                px={1}
                bgcolor={`#0${assistant.id.slice(0, 5)}`} // {assistantColors[index % 3]}
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

export default AssistantsSettings;
