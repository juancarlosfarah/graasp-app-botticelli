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

type MessagesPaneProps = {
  currentExchange: Exchange;
  setExchange: (updatedExchange: Exchange) => void;
  pastMessages: Message[];
  participant: Agent;
  autoDismiss: boolean;
  goToNextExchange: () => void;
};

const MessagesPane = ({
  currentExchange,
  setExchange,
  pastMessages,
  participant,
  autoDismiss,
  goToNextExchange,
}: MessagesPaneProps): ReactElement => {
  //  const { mutateAsync: postAppDataAsync } = mutations.usePostAppData();
  const { mutateAsync: postChatBot } = mutations.usePostChatBot();

  const buildPrompt = (
    threadMessages: Message[],
    userMessage: Message,
  ): Array<ChatBotMessage> => {
    const finalPrompt = [
      {
        role: ChatbotRole.System,
        content: `${currentExchange.chatbotInstructions} The current principal questions is: ${currentExchange.participantCue}`,
      },
    ];

    threadMessages.forEach((msg) => {
      const msgRole =
        msg.sender.type === AgentType.Assistant
          ? ChatbotRole.Assistant
          : ChatbotRole.User;
      finalPrompt.push({ role: msgRole, content: msg.content });
    });

    // add the last user's message in the prompt
    finalPrompt.push({ role: ChatbotRole.User, content: userMessage.content });

    return finalPrompt;
  };

  const [status, setStatus] = useState<Status>(Status.Idle);
  const [msgs, setMessages] = useState<Message[]>(currentExchange.messages);
  const [sentMessageCount, setSentMessageCount] = useState<number>(
    currentExchange.messages.length,
  );

  useEffect(() => {
    const defaultMessages: Message[] = [
      {
        id: `${currentExchange.id}`,
        content: currentExchange.participantCue,
        sender: currentExchange.assistant,
      },
    ];
    setMessages((m) => _.uniqBy([...m, ...defaultMessages], 'id'));
    setExchange({ ...currentExchange, messages: msgs });
  }, [currentExchange, msgs, setExchange]);

  function handlePostChatbot(newMessage: Message): void {
    // respond
    const prompt = [
      // initial settings
      // ...
      // this function requests the prompt as the first argument in string format
      // we can not use it in this context as we are using a JSON prompt.
      // if we simplify the prompt in the future we will be able to remove the line above
      // and this function solely
      ...buildPrompt(msgs, newMessage),
    ];

    postChatBot(prompt)
      .then((chatBotRes) => {
        // actionData.content = chatBotRes.completion;
        const response = {
          id: uuidv4(),
          content: chatBotRes.completion,
          sender: currentExchange.assistant,
        };

        setMessages((m) => [...m, response]);
      })
      .finally(() => {
        // set status back to idle
        setStatus(Status.Idle);
      });
  }

  const saveNewMessage = ({ content }: { content: string }): void => {
    setStatus(Status.Loading);
    const newMessage: Message = {
      id: uuidv4(),
      content,
      sender: participant,
    };

    const updatedMessages = [...msgs, newMessage];
    setMessages(updatedMessages);
    setSentMessageCount((c) => c + 1);

    if (sentMessageCount + 1 > currentExchange.nbFollowUpQuestions) {
      const newExchange = { ...currentExchange };
      newExchange.completed = true;
      newExchange.completedAt = newExchange.completedAt || new Date();
      if (autoDismiss) {
        newExchange.dismissed = true;
        newExchange.dismissedAt = new Date();
        setExchange({ ...newExchange, messages: updatedMessages });
        setStatus(Status.Idle);
        setSentMessageCount(0);
        setMessages([]);
        goToNextExchange();
      } else {
        setExchange({ ...newExchange, messages: updatedMessages });
        handlePostChatbot(newMessage);
      }
    } else {
      handlePostChatbot(newMessage);
    }
  };

  useEffect((): void => {
    const startExchange = (): void => {
      const updatedExchange = { ...currentExchange };
      updatedExchange.started = true;
      updatedExchange.startedAt = new Date();
      setExchange(updatedExchange);
    };
    // do not start if this is readonly
    if (currentExchange && !currentExchange.started) {
      startExchange();
    }
  }, [currentExchange, setExchange]);

  if (!currentExchange) {
    return <>Exchange Not Found</>;
  }

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
          exchange={currentExchange}
          goToNextExchange={goToNextExchange}
          setExchange={setExchange}
          onSubmit={saveNewMessage}
          setMessages={setMessages}
        />
      )}
    </Paper>
  );
};

export default MessagesPane;
