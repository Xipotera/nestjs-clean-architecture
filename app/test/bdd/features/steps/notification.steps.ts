import { Given, When, Then } from '@cucumber/cucumber';
import { CreateAuthorUseCase } from '@domain/use-cases/authors/create-author.usecase';
import { IAuthorsRepository } from '@domain/repositories/authors-repository.interface';
import { INotificationsService } from '@domain/services/notifications-service.interface';
import { Author } from '@domain/entities/author';

let createAuthorUseCase: CreateAuthorUseCase;
let mockAuthorsRepository: IAuthorsRepository;
let mockNotificationService: INotificationsService;
let response: any;
let error: any;
let logError: jest.SpyInstance;

// Step: System is ready
Given('the system is ready', () => {
  mockAuthorsRepository = {
    add: jest.fn().mockImplementation((author: Author) => {
      author.id = 1;
      return author;
    }),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  mockNotificationService = {
    sendNotification: jest.fn(),
  };

  createAuthorUseCase = new CreateAuthorUseCase(
    mockAuthorsRepository,
    mockNotificationService,
  );

  response = null;
  error = null;
});

// Step: Notification system is down
Given('the notification system is down', () => {
  mockAuthorsRepository = {
    add: jest.fn().mockImplementation((author: Author) => {
      author.id = 1;
      return author;
    }),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  mockNotificationService = {
    sendNotification: jest.fn().mockImplementation(() => {
      throw new Error('Notification system down');
    }),
  };

  createAuthorUseCase = new CreateAuthorUseCase(
    mockAuthorsRepository,
    mockNotificationService,
  );

  // Mock the logging system
  logError = jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Step: Author is created
When('an author is successfully created', async () => {
  try {
    const payload = { firstName: 'John', lastName: 'Doe' };
    response = await createAuthorUseCase.execute(payload);
  } catch (err) {
    error = err.message;
  }
});

// Step: Verify notification is sent
Then('a notification should be sent saying {string}', (message: string) => {
  expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
    message,
    'New author created',
  );
});

// Step: Verify error is logged
Then('the system should log an error', () => {
  expect(logError).toHaveBeenCalledWith('Notification system down');
});
