import { ReactElement, useEffect, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

import { ChatBotMessage, ChatbotRole } from '@graasp/sdk';

import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { mutations } from '@/config/queryClient';
import Agent from '@/types/Agent';
import AgentType from '@/types/AgentType';
import Exchange from '@/types/Exchange';
import { Message } from '@/types/Message';
import Status from '@/types/Status';

import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessageLoader from './MessageLoader';

// Props type definition for MessagesPane component
type MessagesPaneProps = {
  currentExchange: Exchange;
  setExchange: (updatedExchange: Exchange) => void;
  pastMessages: Message[];
  participant: Agent;
  autoDismiss: boolean;
  goToNextExchange: () => void;
};

// Main component function: MessagesPane
const MessagesPane = ({
  currentExchange,
  setExchange,
  pastMessages,
  participant,
  autoDismiss,
  goToNextExchange,
}: MessagesPaneProps): ReactElement => {
  // Hook to post chat messages asynchronously using mutation
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();

  // Function to build the prompt for the chatbot based on past messages and user input
  const buildPrompt = (
    threadMessages: Message[],
    userMessage: Message,
  ): Array<ChatBotMessage> => {
    const finalPrompt = [
      {
        role: ChatbotRole.System,
        content: `${currentExchange.chatbotInstructions} The current principal question is: ${currentExchange.participantCue}`,
      },
    ];

    // Loop through threadMessages to add them to the prompt
    threadMessages.forEach((msg) => {
      const msgRole =
        msg.sender.type === AgentType.Assistant
          ? ChatbotRole.Assistant
          : ChatbotRole.User;
      finalPrompt.push({ role: msgRole, content: msg.content });
    });

    // Add the last user message to the prompt
    finalPrompt.push({ role: ChatbotRole.User, content: userMessage.content });

    return finalPrompt;
  };

  // State to manage the current status of the component (idle or loading)
  const [status, setStatus] = useState<Status>(Status.Idle);

  // State to manage the list of messages within the current exchange
  const [msgs, setMessages] = useState<Message[]>(currentExchange.messages);

  // State to keep track of the number of messages sent in the current exchange
  const [sentMessageCount, setSentMessageCount] = useState<number>(
    currentExchange.messages.length,
  );

  // Function to dismiss the current exchange
  function dismissExchange(): void {
    setMessages([]);

    // Mark the exchange as dismissed and update the dismissed timestamp
    const updatedExchange = { ...currentExchange };
    updatedExchange.dismissed = true;
    updatedExchange.dismissedAt = new Date();

    setExchange(updatedExchange);
    setSentMessageCount(0);

    goToNextExchange();
  }

  // Effect to initialize the message list when the component mounts or currentExchange changes
  useEffect(() => {
    const defaultMessages: Message[] = [
      {
        id: `${currentExchange.id}`,
        content: currentExchange.participantCue,
        sender: currentExchange.assistant,
      },
    ];
    // Add unique messages to the list
    setMessages((m) => _.uniqBy([...m, ...defaultMessages], 'id'));

    // Update the exchange with the new messages list
    setExchange({ ...currentExchange, messages: msgs });
    // eslint-disable-next-line no-console
    console.log('SET');
  }, [currentExchange, msgs, setExchange]);

  // Function to handle posting a new message to the chatbot and receiving a response
  function handlePostChatbot(newMessage: Message): void {
    // Build the prompt for the chatbot using the existing messages and the new message
    const prompt = [...buildPrompt(msgs, newMessage)];

    // Send the prompt to the chatbot API and handle the response
    postChatBot(prompt)
      .then((chatBotRes) => {
        const response = {
          id: uuidv4(),
          content: chatBotRes.completion,
          sender: currentExchange.assistant,
        };

        // Add the chatbot's response to the list of messages
        setMessages((m) => [...m, response]);
      })
      .finally(() => {
        // Reset the status back to idle after the chatbot responds
        setStatus(Status.Idle);
      });
  }

  // Function to save a new user message and handle chatbot response logic
  const saveNewMessage = ({ content }: { content: string }): void => {
    setStatus(Status.Loading);

    // Create a new message object with the user's input
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: participant,
    };

    // Update the messages state with the new message
    const updatedMessages = [...msgs, newMessage];
    setMessages(updatedMessages);

    // Increment the count of sent messages
    setSentMessageCount((c) => c + 1);

    // Check if the exchange should be completed based on the number of follow-up questions
    if (sentMessageCount + 1 > currentExchange.nbFollowUpQuestions) {
      const newExchange = { ...currentExchange };
      newExchange.completed = true;
      newExchange.completedAt = newExchange.completedAt || new Date();

      if (autoDismiss) {
        // Auto-dismiss the exchange if autoDismiss is true
        newExchange.dismissed = true;
        newExchange.dismissedAt = new Date();
        setExchange({ ...newExchange, messages: updatedMessages });
        setStatus(Status.Idle);
        setSentMessageCount(0);
        setMessages([]);
        goToNextExchange();
      } else {
        // Otherwise, just update the exchange and handle chatbot response
        setExchange({ ...newExchange, messages: updatedMessages });
        handlePostChatbot(newMessage);
      }
    } else {
      // If not completed, continue with the chatbot response
      handlePostChatbot(newMessage);
    }
  };

  // Effect to start the exchange when the component mounts or currentExchange changes
  useEffect((): void => {
    const startExchange = (): void => {
      const updatedExchange = { ...currentExchange };
      updatedExchange.started = true;
      updatedExchange.startedAt = new Date();
      setExchange(updatedExchange);
    };

    // Start the exchange only if it hasn't been started and is not read-only
    if (currentExchange && !currentExchange.started) {
      startExchange();
    }
  }, [currentExchange, setExchange]);

  // Render a fallback if no current exchange is available
  if (!currentExchange) {
    return <>Exchange Not Found</>;
  }

  // Determine whether to show participant instructions after completing the exchange
  const showParticipantInstructionsOnComplete =
    currentExchange.completed &&
    currentExchange.participantInstructionsOnComplete;

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} justifyContent="flex-end">
          {[...pastMessages, ...msgs].map((message: Message, index: number) => {
            const isYou = message?.sender?.id === participant.id;

            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                flexDirection={isYou ? 'row-reverse' : 'row'}
              >
                {!isYou && (
                  <AvatarWithStatus
                    src={currentExchange.assistant.imageUrl}
                    sx={{ bgcolor: '#5050d2' }}
                  >
                    {currentExchange.assistant.name.slice(0, 2) || '🤖'}
                  </AvatarWithStatus>
                )}
                <ChatBubble
                  variant={isYou ? 'sent' : 'received'}
                  content={message.content}
                  sender={message.sender}
                />
              </Stack>
            );
          })}

          {status === Status.Loading && (
            <Box sx={{ maxWidth: '60%', minWidth: 'auto' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 0.25 }}
              >
                <MessageLoader />
              </Stack>
            </Box>
          )}

          {showParticipantInstructionsOnComplete && (
            <Alert variant="filled" color="success">
              {currentExchange.participantInstructionsOnComplete}
            </Alert>
          )}
        </Stack>
      </Box>
      {!currentExchange.dismissed && (
        <MessageInput
          dismissExchange={() => dismissExchange()}
          onSubmit={saveNewMessage}
          exchangeCompleted={currentExchange.completed}
        />
      )}
    </Paper>
  );
};

export default MessagesPane;
