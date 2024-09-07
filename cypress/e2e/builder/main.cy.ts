/*
import { Context, PermissionLevel } from '@graasp/sdk';

import {
  ADD_ASSISTANT_BUTTON_CY,
  ADD_EXCHANGE_BUTTON_CY,
  ASSISTANT_AVATAR_ICON_CY,
  ASSISTANT_DESCRIPTION_INPUT_CY,
  ASSISTANT_IMAGE_URL_CY,
  ASSISTANT_NAME_INPUT_CY,
  ASSISTANT_OPTION_CY,
  ASSISTANT_PANEL_CY,
  ASSISTANT_SAVE_BUTTON_CY,
  ASSISTANT_SELECT_CY,
  ASSISTANT_SETTINGS_TITLE_CY,
  BUILDER_VIEW_CY,
  CHAT_DESCRIPTION_INPUT_CY,
  CHAT_INSTRUCTIONS_INPUT_CY,
  CHAT_NAME_INPUT_CY,
  CHAT_SAVE_BUTTON_CY,
  CHAT_SETTINGS_TITLE_CY,
  CONVERSATIONS_VIEW_TITLE_CY,
  DELETE_ASSISTANT_BUTTON_CY,
  DELETE_EXCHANGE_BUTTON_CY,
  EXCHANGE_DESCRIPTION_INPUT_CY,
  EXCHANGE_NAME_INPUT_CY,
  EXCHANGE_PANEL_CY,
  EXCHANGE_SETTINGS_TITLE_CY,
  EXPORT_ALL_BUTTON_CY,
  FOLLOW_UP_QUESTIONS_INPUT_CY,
  HARD_LIMIT_SWITCH_CY,
  INSTRUCTIONS_INPUT_CY,
  MESSAGE_MEMORY_SWITCH_CY,
  MOVE_DOWN_BUTTON_CY,
  MOVE_UP_BUTTON_CY,
  NO_ASSISTANTS_ALERT_CY,
  NO_EXCHANGES_ALERT_CY,
  ON_COMPLETE_INSTRUCTIONS_INPUT_CY,
  buildDataCy,
} from '../../../src/config/selectors';

describe('BuilderView', () => {
  before(() => {
    // Set up API and permissions
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Read,
      },
    );
    // Visit the page where the AssistantSettings component is rendered
    cy.visit('/');
  });

  it('should open BuilderView', () => {
    cy.get(buildDataCy(BUILDER_VIEW_CY)).should('be.visible');
  });
});

describe('AssistantSettings Component', () => {
  beforeEach(() => {
    // Set up API and permissions
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Read,
      },
    );
    // Visit the page where the AssistantSettings component is rendered
    cy.visit('/');
  });

  it('should display the title of the assistant settings section', () => {
    cy.get(buildDataCy(ASSISTANT_SETTINGS_TITLE_CY))
      .should('be.visible')
      .and('contain.text', 'Assistants Settings');
  });

  it('should add a new assistant when the "Create New Assistant" button is clicked', () => {
    // Arrange
    cy.get(buildDataCy(ADD_EXCHANGE_BUTTON_CY)).click();

    // Act & Assert
    cy.get(buildDataCy(ASSISTANT_PANEL_CY))
      .should('have.length', 2)
      .first()
      .within(() => {
        cy.get(buildDataCy(ASSISTANT_NAME_INPUT_CY)).and('be.visible');
        cy.get(buildDataCy(ASSISTANT_DESCRIPTION_INPUT_CY)).and('be.visible');
      });
  });

  it('should edit an assistant name and save the changes', () => {
    const newName = 'New Assistant Name';

    // Act
    cy.get(buildDataCy(ASSISTANT_NAME_INPUT_CY))
      .find('textarea')
      .first()
      .type(newName);

    // Assert
    cy.get(buildDataCy(ASSISTANT_NAME_INPUT_CY))
      .find('textarea')
      .first()
      .should('have.value', newName);
  });

  it('should move an assistant up and down in the list', () => {
    // Arrange
    cy.get(buildDataCy(ADD_ASSISTANT_BUTTON_CY)).click(); // Add an assistant

    // Act - Move the second assistant up
    cy.get(buildDataCy(MOVE_UP_BUTTON_CY)).last().click();

    // Assert
    cy.get(buildDataCy(ASSISTANT_PANEL_CY)).first().should('contain.text', '1');

    // Act - Move the first assistant down
    cy.get(buildDataCy(MOVE_DOWN_BUTTON_CY)).first().click();

    // Assert
    cy.get(buildDataCy(ASSISTANT_PANEL_CY)).last().should('contain.text', '2');
  });

  it('should delete an assistant from the list', () => {
    // Act
    cy.get(buildDataCy(DELETE_ASSISTANT_BUTTON_CY)).click();

    // Assert
    cy.get(buildDataCy(NO_ASSISTANTS_ALERT_CY))
      .should('be.visible')
      .and('contain.text', 'Please create at least one assistant.');
  });

  it('should scroll to the last added assistant when a new one is added', () => {
    // Arrange - Add three assistants
    cy.get(buildDataCy(ADD_ASSISTANT_BUTTON_CY)).click();
    cy.get(buildDataCy(ADD_ASSISTANT_BUTTON_CY)).click();
    cy.get(buildDataCy(ADD_ASSISTANT_BUTTON_CY)).click();

    // Act & Assert
    cy.get(buildDataCy(ASSISTANT_PANEL_CY)).last().scrollIntoView();
    cy.get(buildDataCy(ASSISTANT_PANEL_CY)).last().should('be.visible');
  });

  it('should change avatar icon when image url is entered', () => {
    // Act
    const newImageUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjCAi49B8ABNgCcmJOeMAAAAAASUVORK5CYII=';
    cy.get(buildDataCy(ASSISTANT_IMAGE_URL_CY)).find('input').type(newImageUrl);

    // Assert
    cy.get(buildDataCy(ASSISTANT_AVATAR_ICON_CY))
      .find('img')
      .should('exist')
      .and(
        'have.attr',
        'src',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjCAi49B8ABNgCcmJOeMAAAAAASUVORK5CYII=',
      );
  });
  it('should save changes to assistant description', () => {
    // Act
    const newDescription = 'Updated description';
    cy.get(buildDataCy(ASSISTANT_DESCRIPTION_INPUT_CY))
      .find('textarea')
      .first()
      .type(newDescription);

    // Assert
    cy.get(buildDataCy(ASSISTANT_DESCRIPTION_INPUT_CY))
      .find('textarea')
      .first()
      .should('have.value', newDescription);
  });
});

describe('ChatSettings Component', () => {
  beforeEach(() => {
    // Set up API and permissions
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Read,
      },
    );
    // Visit the page where the ChatSettings component is rendered
    cy.visit('/');
    cy.get(buildDataCy(CHAT_SETTINGS_TITLE_CY)).click();
  });

  it('should display the title of the assistant settings section', () => {
    cy.get(buildDataCy(CHAT_SETTINGS_TITLE_CY))
      .should('be.visible')
      .and('contain.text', 'Chat Settings');
  });

  it('should edit interaction name and save the changes', () => {
    const newName = 'New Interaction Name';

    // Act
    cy.get(buildDataCy(CHAT_NAME_INPUT_CY)).find('input').type(newName);

    // Assert
    cy.get(buildDataCy(CHAT_NAME_INPUT_CY))
      .find('input')
      .should('have.value', newName);
  });

  it('should save changes to chat description', () => {
    // Act
    const newDescription = 'Updated description';
    cy.get(buildDataCy(CHAT_DESCRIPTION_INPUT_CY))
      .find('textarea')
      .first()
      .type(newDescription);

    // Assert
    cy.get(buildDataCy(CHAT_DESCRIPTION_INPUT_CY))
      .find('textarea')
      .first()
      .should('have.value', newDescription);
  });

  it('should toggle the message memory switch and update the save button', () => {
    // Act
    cy.get(buildDataCy(MESSAGE_MEMORY_SWITCH_CY)).click();

    // Assert
    cy.get(buildDataCy(CHAT_SAVE_BUTTON_CY)).should(
      'not.have.attr',
      'disabled',
    );

    // Act - Toggle back
    cy.get(buildDataCy(MESSAGE_MEMORY_SWITCH_CY)).click();

    // Assert - Now it should not be disabled
    cy.get(buildDataCy(CHAT_SAVE_BUTTON_CY)).should('have.attr', 'disabled');
  });

  it('should save changes to participant instructions', () => {
    // Act
    const newInstructions = 'Updated instructions';
    cy.get(buildDataCy(CHAT_INSTRUCTIONS_INPUT_CY))
      .find('textarea')
      .first()
      .type(newInstructions);

    // Assert
    cy.get(buildDataCy(CHAT_INSTRUCTIONS_INPUT_CY))
      .find('textarea')
      .first()
      .should('have.value', newInstructions);
  });
});

describe('ExchangeSettings Component', () => {
  beforeEach(() => {
    // Set up API and permissions
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Read,
      },
    );
    // Visit the page where the ExchangeSettings component is rendered
    cy.visit('/');
    cy.get(buildDataCy(EXCHANGE_SETTINGS_TITLE_CY)).click();
  });

  it('should display the title of the exchange settings section', () => {
    cy.get(buildDataCy(EXCHANGE_SETTINGS_TITLE_CY))
      .should('be.visible')
      .and('contain.text', 'Exchanges Settings');
  });

  it('should add a new exchange when the "+" button is clicked', () => {
    // Arrange
    cy.get(buildDataCy(ADD_EXCHANGE_BUTTON_CY)).click();

    // Act & Assert
    cy.get(buildDataCy(EXCHANGE_PANEL_CY))
      .should('have.length', 2)
      .first()
      .within(() => {
        cy.get(buildDataCy(EXCHANGE_NAME_INPUT_CY)).and('be.visible');
        cy.get(buildDataCy(EXCHANGE_DESCRIPTION_INPUT_CY)).and('be.visible');
      });
  });

  it('should edit an exchange name and save the changes', () => {
    const newName = 'New Exchange Name';

    // Act
    cy.get(buildDataCy(EXCHANGE_NAME_INPUT_CY)).find('input').type(newName);

    // Assert
    cy.get(buildDataCy(EXCHANGE_NAME_INPUT_CY))
      .find('input')
      .should('have.value', newName);
  });

  it('should move an exchange up and down in the list', () => {
    // Arrange
    cy.get(buildDataCy(ADD_EXCHANGE_BUTTON_CY)).click(); // Add an exchange

    // Act - Move the second exchange up
    cy.get(buildDataCy(MOVE_UP_BUTTON_CY)).last().click();

    // Assert
    cy.get(buildDataCy(EXCHANGE_PANEL_CY)).first().should('contain.text', '1');

    // Act - Move the first exchange down
    cy.get(buildDataCy(MOVE_DOWN_BUTTON_CY)).first().click();

    // Assert
    cy.get(buildDataCy(EXCHANGE_PANEL_CY)).last().should('contain.text', '2');
  });

  it('should delete an exchange from the list', () => {
    // Act
    cy.get(buildDataCy(DELETE_EXCHANGE_BUTTON_CY)).click();

    // Assert
    cy.get(buildDataCy(NO_EXCHANGES_ALERT_CY))
      .should('be.visible')
      .and('contain.text', 'Please create at least one exchange.');
  });

  it('should change the assistant of an exchange', () => {
    // Arrange
    cy.get(buildDataCy(ASSISTANT_SETTINGS_TITLE_CY)).click();
    cy.get(buildDataCy(ASSISTANT_NAME_INPUT_CY)).click();
    cy.get(buildDataCy(ASSISTANT_NAME_INPUT_CY))
      .find('textarea')
      .first()
      .type('Assistant 1');
    cy.get(buildDataCy(ASSISTANT_SAVE_BUTTON_CY)).click();

    cy.get(buildDataCy(EXCHANGE_SETTINGS_TITLE_CY)).click();

    // Act
    cy.get(buildDataCy(ASSISTANT_SELECT_CY)).click();
    cy.get(buildDataCy(ASSISTANT_OPTION_CY)).first().click();

    // Assert
    cy.get(buildDataCy(ASSISTANT_SELECT_CY)).should(
      'contain.text',
      'Assistant 1',
    );
  });

  it('should display follow-up question input validation', () => {
    // Act - Enter invalid data
    cy.get(buildDataCy(FOLLOW_UP_QUESTIONS_INPUT_CY)).find('input').clear();
    cy.get(buildDataCy(FOLLOW_UP_QUESTIONS_INPUT_CY)).find('input').type('1.5');

    // Assert - Ensure it is capped at the max allowed value
    cy.get(buildDataCy(FOLLOW_UP_QUESTIONS_INPUT_CY))
      .find('input')
      .should('have.value', 1);
  });

  it('should toggle the hard limit switch and update related fields', () => {
    // Act
    cy.get(buildDataCy(HARD_LIMIT_SWITCH_CY)).click();

    // Assert
    cy.get(buildDataCy(ON_COMPLETE_INSTRUCTIONS_INPUT_CY)).should('not.exist'); // Input should be hidden when hard limit is on

    // Act - Toggle back
    cy.get(buildDataCy(HARD_LIMIT_SWITCH_CY)).click();

    // Assert - Now it should be visible
    cy.get(buildDataCy(ON_COMPLETE_INSTRUCTIONS_INPUT_CY)).should('be.visible');
  });

  it('should scroll to the last added exchange when a new one is added', () => {
    // Arrange - Add three exchanges
    cy.get(buildDataCy(ADD_EXCHANGE_BUTTON_CY)).click();
    cy.get(buildDataCy(ADD_EXCHANGE_BUTTON_CY)).click();
    cy.get(buildDataCy(ADD_EXCHANGE_BUTTON_CY)).click();

    // Act & Assert
    cy.get(buildDataCy(EXCHANGE_PANEL_CY)).last().scrollIntoView();
    cy.get(buildDataCy(EXCHANGE_PANEL_CY)).last().should('be.visible');
  });

  it('should save changes to exchange instructions', () => {
    // Act
    const newInstructions = 'Updated instructions';
    cy.get(buildDataCy(INSTRUCTIONS_INPUT_CY))
      .find('textarea')
      .first()
      .type(newInstructions);

    // Assert
    cy.get(buildDataCy(INSTRUCTIONS_INPUT_CY))
      .find('textarea')
      .should('have.value', newInstructions);
  });
});

describe('ConversationsView Component', () => {
  beforeEach(() => {
    // Set up API and permissions
    cy.setUpApi(
      {},
      {
        context: Context.Builder,
        permission: PermissionLevel.Read,
      },
    );
    // Visit the page where the ChatSettings component is rendered
    cy.visit('/');
    cy.get(buildDataCy(CONVERSATIONS_VIEW_TITLE_CY)).click();
  });

  it('should display the title of the conversations view section', () => {
    cy.get(buildDataCy(CONVERSATIONS_VIEW_TITLE_CY))
      .should('be.visible')
      .and('contain.text', 'View Conversations');
  });

  it('should verify that the "export all" button is initially disabled', () => {
    // Assert
    cy.get(buildDataCy(EXPORT_ALL_BUTTON_CY)).should('have.attr', 'disabled');
  });
});
*/
