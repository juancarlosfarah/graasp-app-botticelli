import { Context, PermissionLevel } from '@graasp/sdk';

import {
  DISMISS_BUTTON_CY,
  MESSAGE_CY,
  MESSAGE_INPUT_CY, // MESSAGE_LOADER_CY,
  MESSAGE_PANE_CY,
  PLAYER_VIEW_CY,
  SEND_BUTTON_CY,
  START_INTERACTION_BUTTON_CY,
  buildDataCy,
} from '@/config/selectors';

describe('Player View', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    cy.visit('/');
  });

  it('should open PlayerView', () => {
    cy.get(buildDataCy(PLAYER_VIEW_CY)).should('be.visible');
  });

  it('App', () => {
    cy.get(buildDataCy(START_INTERACTION_BUTTON_CY)).should(
      'contain.text',
      `Start`,
    );
  });
});

describe('MessagesPane Component', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    // Assume that the application is running and can be reached at this URL
    cy.visit('/'); // Update with the correct path if different
    cy.get(buildDataCy(START_INTERACTION_BUTTON_CY)).click();
  });

  it('should render the MessagesPane with initial messages', () => {
    cy.get(buildDataCy(MESSAGE_PANE_CY)).should('exist');
    cy.get(buildDataCy(MESSAGE_CY)).should('have.length.greaterThan', 0);
  });

  it('should allow sending a new message and display it in the chat', () => {
    // Enter a message in the input field
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('div')
      .find('textarea')
      .first()
      .type('Hello, chatbot!{ctrl+enter}');

    // Check if the new message appears
    cy.get(buildDataCy(MESSAGE_CY))
      .should('exist')
      .and('be.visible')
      .last()
      .and('contain.text', 'Hello, chatbot!');
  });
  /*
  it('should handle chatbot response correctly', () => {
    // Send a message
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('div')
      .find('textarea')
      .first()
      .type('Hello, chatbot!{ctrl+enter}');

    // Wait for the chatbot's response
    cy.get(buildDataCy(MESSAGE_LOADER_CY)).should('not.exist'); // Loader should disappear

    // Check if the chatbot's response is displayed
    cy.get(buildDataCy(MESSAGE_CY))
      .last()
      .should('not.contain.text', 'Hello, chatbot!') // Make sure it's not the user's message
      .and('not.have.class', 'sent'); // Should be a received message
  });
  */
});

describe('MessageInput Component', () => {
  beforeEach(() => {
    cy.setUpApi(
      {},
      {
        context: Context.Player,
        permission: PermissionLevel.Write,
      },
    );
    // Navigate to the component view
    cy.visit('/'); // Adjust based on the actual route of the MessageInput component
    cy.get(buildDataCy(START_INTERACTION_BUTTON_CY)).click();
  });
  /*
  it('should display placeholder text in the textarea', () => {
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first()
      .should('have.attr', 'placeholder', 'Insert your message here...');
  });
*/
  it('should render the input field and buttons', () => {
    cy.get(buildDataCy(MESSAGE_INPUT_CY)).should('exist');
    cy.get(buildDataCy(SEND_BUTTON_CY)).should('exist');
  });

  it('should focus on the input field automatically when the component loads', () => {
    // Ensure the element exists before asserting focus
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first() // Safely call first() after confirming element existence
      .should('be.focused');
  });

  it('should send a message when the send button is clicked', () => {
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first()
      .type('Test message');
    cy.get(buildDataCy(SEND_BUTTON_CY)).click();

    // Verify that the message was sent (using an example check that should match your implementation)
    cy.get(buildDataCy(MESSAGE_CY)).should('contain.text', 'Test message');
  });

  it('should send a message when pressing Ctrl+Enter', () => {
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first()
      .type('Ctrl+Enter test{ctrl+enter}');

    // Check that the message appears in the chat
    cy.get(buildDataCy(MESSAGE_CY)).should('contain.text', 'Ctrl+Enter test');
  });

  it('should clear the input field after sending a message', () => {
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first()
      .type('Clear input test{ctrl+enter}');
    cy.get(buildDataCy(MESSAGE_INPUT_CY)).should('have.value', '');
  });

  it('should dismiss the exchange when the done button is clicked', () => {
    // Enter a message in the input field
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first()
      .type('Hello, chatbot!{ctrl+enter}');

    // Assuming the exchange is completed
    cy.get(buildDataCy(DISMISS_BUTTON_CY)).click();

    // Check that the exchange is dismissed
    cy.get(buildDataCy(MESSAGE_PANE_CY)).should('not.exist');
  });

  it('should not send an empty message', () => {
    cy.get(buildDataCy(MESSAGE_INPUT_CY))
      .find('textarea')
      .first()
      .type('{ctrl+enter}'); // Send empty message
    cy.get(buildDataCy(MESSAGE_CY)).should('have.length', 0); // Check no new messages
  });
});
