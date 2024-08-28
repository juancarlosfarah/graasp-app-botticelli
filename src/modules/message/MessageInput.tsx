import { ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CheckIcon from '@mui/icons-material/CheckRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Textarea from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

import Exchange from '@/types/Exchange';
import { Message } from '@/types/Message';

export type MessageInputProps = {
  exchange: Exchange;
  onSubmit: ({ content }: { content: string }) => void;
  setExchange: (exchange: Exchange) => void;
  goToNextExchange: () => void;
  setMessages: (msgs: Message[]) => void;
};

const MessageInput = ({
  exchange,
  onSubmit,
  setExchange,
  goToNextExchange,
  setMessages,
}: MessageInputProps): ReactElement => {
  const [textAreaValue, setTextAreaValue] = useState('');

  const textAreaRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  function dismissExchange(): void {
    setMessages([]);
    const updatedExchange = { ...exchange };
    updatedExchange.dismissed = true;
    updatedExchange.dismissedAt = new Date();
    setExchange(updatedExchange);
    goToNextExchange();
  }

  const focusOnTextArea = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  const blurTextArea = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.blur();
    }
  };

  useEffect(() => {
    focusOnTextArea();
  });

  const handleClick = (): void => {
    if (textAreaValue.trim() !== '') {
      onSubmit({ content: textAreaValue });
      setTextAreaValue('');

      // focus on the text area
      focusOnTextArea();
      // blur text area
      blurTextArea();
    }
  };

  const handleDismiss = (): void => {
    dismissExchange();
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl sx={{ width: '100%' }}>
        <Textarea
          placeholder={t('MESSAGE_BOX.INSERT_HERE')}
          aria-label="Message"
          ref={textAreaRef}
          onChange={(e): void => {
            setTextAreaValue(e.target.value);
          }}
          size="small"
          multiline
          value={textAreaValue}
          minRows={3}
          maxRows={10}
          endAdornment={
            <Stack
              direction="row"
              justifyContent="end"
              alignItems="center"
              flexGrow={1}
              sx={{
                py: 1,
                px: 1,
              }}
            >
              {exchange.completed && (
                <Button
                  size="small"
                  color="success"
                  endIcon={<CheckIcon />}
                  sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                  onClick={handleDismiss}
                >
                  {t('MESSAGE_BOX.DONE')}
                </Button>
              )}
              <Button
                size="small"
                color="primary"
                sx={{ ml: 1, alignSelf: 'center', borderRadius: 'sm' }}
                endIcon={<SendRoundedIcon />}
                onClick={handleClick}
              >
                {t('MESSAGE_BOX.SEND')}
              </Button>
            </Stack>
          }
          onKeyDown={(event): void => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick();
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72,
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

export default MessageInput;
