// General View Selectors
export const PLAYER_VIEW_CY = 'player-view';
export const BUILDER_VIEW_CY = 'builder-view';
export const ANALYTICS_VIEW_CY = 'analytics-view';

// Button Selectors
export const ADD_EXCHANGE_BUTTON_CY = 'add-exchange-button';
export const DELETE_EXCHANGE_BUTTON_CY = 'delete-exchange-button';
export const ADD_ASSISTANT_BUTTON_CY = 'add-exchange-button';
export const DELETE_ASSISTANT_BUTTON_CY = 'delete-exchange-button';
export const MOVE_UP_BUTTON_CY = 'move-up-button';
export const MOVE_DOWN_BUTTON_CY = 'move-down-button';
export const ASSISTANT_SAVE_BUTTON_CY = 'save-setting-button';
export const CHAT_SAVE_BUTTON_CY = 'save-setting-button';
export const EXPORT_ALL_BUTTON_CY = 'export-all-button';
export const START_INTERACTION_BUTTON_CY = 'start-interaction-button';
export const SEND_BUTTON_CY = 'send-button';
export const DISMISS_BUTTON_CY = 'dismiss-button';

// Assistant Panel and Input Selectors
export const ASSISTANT_SETTINGS_TITLE_CY = 'assistant-settings-title';
export const NO_ASSISTANTS_ALERT_CY = 'no-assistants-alert';
export const ASSISTANT_PANEL_CY = 'assistant-panel';
export const ASSISTANT_IMAGE_URL_CY = 'assistant-image-url';
export const ASSISTANT_AVATAR_ICON_CY = 'assistant-avatar-icon';
export const ASSISTANT_NAME_INPUT_CY = 'assistant-name-input';
export const ASSISTANT_DESCRIPTION_INPUT_CY = 'exchange-description-input';

// Chat Settings and Input Selectors
export const CHAT_SETTINGS_TITLE_CY = 'chat-settings-title';
export const CHAT_NAME_INPUT_CY = 'chat-name-input';
export const CHAT_DESCRIPTION_INPUT_CY = 'chat-description-input';
export const CHAT_INSTRUCTIONS_INPUT_CY = 'chat-instructions-input';
export const MESSAGE_MEMORY_SWITCH_CY = 'message-memory-switch';

// Exchange Panel and Input Selectors
export const EXCHANGE_SETTINGS_TITLE_CY = 'exchange-settings-title';
export const NO_EXCHANGES_ALERT_CY = 'no-exchanges-alert';
export const EXCHANGE_PANEL_CY = 'exchange-panel';
export const EXCHANGE_NAME_INPUT_CY = 'exchange-name-input';
export const EXCHANGE_DESCRIPTION_INPUT_CY = 'exchange-description-input';
export const FOLLOW_UP_QUESTIONS_INPUT_CY = 'follow-up-questions-input';
export const INSTRUCTIONS_INPUT_CY = 'instructions-input';
export const ON_COMPLETE_INSTRUCTIONS_INPUT_CY =
  'on-complete-instructions-input';
export const HARD_LIMIT_SWITCH_CY = 'hard-limit-switch';
export const ASSISTANT_SELECT_CY = 'assistant-select';
export const ASSISTANT_OPTION_CY = 'assistant-option';

// Conversations View
export const CONVERSATIONS_VIEW_TITLE_CY = 'conversations-view-title';

// Participant Interaction and Input Selectors
export const MESSAGE_PANE_CY = 'message-pane';
export const MESSAGE_CY = 'message';
export const MESSAGE_INPUT_CY = 'message-input';
export const MESSAGE_LOADER_CY = 'message-loader';

// Utility function to create data-cy selectors
export const buildDataCy = (selector: string): string =>
  `[data-cy=${selector}]`;
