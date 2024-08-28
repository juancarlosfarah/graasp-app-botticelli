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

// Main component function: MessageInput
const MessageInput = ({
  exchange,
  onSubmit,
  setExchange,
  goToNextExchange,
  setMessages,
}: MessageInputProps): ReactElement => {
  // State to manage the value of the textarea input
  const [textAreaValue, setTextAreaValue] = useState('');

  // Ref to get direct access to the textarea DOM element
  const textAreaRef = useRef<HTMLDivElement>(null);

  // Hook for internationalization (i18n) translation
  const { t } = useTranslation();

  // Function to dismiss the current exchange
  function dismissExchange(): void {
    // Clear all messages
    setMessages([]);

    // Mark the exchange as dismissed and update the dismissed timestamp
    const updatedExchange = { ...exchange };
    updatedExchange.dismissed = true;
    updatedExchange.dismissedAt = new Date();

    // Update the exchange state with the dismissed exchange
    setExchange(updatedExchange);

    // Proceed to the next exchange
    goToNextExchange();
  }

  // Function to focus on the textarea input
  const focusOnTextArea = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.focus();
    }
  };

  // Function to remove focus from the textarea input
  const blurTextArea = (): void => {
    const textareaElement = textAreaRef?.current?.querySelector('textarea');
    if (textareaElement) {
      textareaElement.blur();
    }
  };

  // Effect to focus on the textarea whenever the component renders
  useEffect(() => {
    focusOnTextArea();
  });

  // Function to handle the send button click
  const handleClick = (): void => {
    if (textAreaValue.trim() !== '') {
      // Trigger the onSubmit callback with the input content
      onSubmit({ content: textAreaValue });

      // Clear the textarea input
      setTextAreaValue('');

      // Refocus and then blur the textarea input
      focusOnTextArea();
      blurTextArea();
    }
  };

  // Function to handle the dismiss button click
  const handleDismiss = (): void => {
    dismissExchange();
  };

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <FormControl sx={{ width: '100%' }}>
        <Textarea
          placeholder={t('MESSAGE_BOX.INSERT_HERE')} // Placeholder text, internationalized
          aria-label="Message" // Accessibility label
          ref={textAreaRef} // Attach the ref to the textarea
          onChange={(e): void => {
            setTextAreaValue(e.target.value); // Update the textarea value on change
          }}
          size="small"
          multiline // Allow multiline input
          value={textAreaValue} // Controlled input value
          minRows={3} // Minimum number of rows for the textarea
          maxRows={10} // Maximum number of rows for the textarea
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
              {exchange.completed && ( // Conditionally render the "Done" button if exchange is completed
                <Button
                  size="small"
                  color="success"
                  endIcon={<CheckIcon />} // Success icon
                  sx={{ alignSelf: 'center', borderRadius: 'sm' }}
                  onClick={handleDismiss} // Handle dismiss action
                >
                  {t('MESSAGE_BOX.DONE')}
                </Button>
              )}
              <Button
                size="small"
                color="primary"
                sx={{ ml: 1, alignSelf: 'center', borderRadius: 'sm' }}
                endIcon={<SendRoundedIcon />} // Send icon
                onClick={handleClick} // Handle send action
              >
                {t('MESSAGE_BOX.SEND')}
              </Button>
            </Stack>
          }
          onKeyDown={(event): void => {
            if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
              handleClick(); // Submit the message on "Ctrl+Enter" or "Cmd+Enter"
            }
          }}
          sx={{
            '& textarea:first-of-type': {
              minHeight: 72, // Set minimum height for the textarea
            },
          }}
        />
      </FormControl>
    </Box>
  );
};

export default MessageInput;
