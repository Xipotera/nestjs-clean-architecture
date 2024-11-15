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

// Step: Initialize the system
Given('the system is ready', () => {
  mockAuthorsRepository = {
    add: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
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

// Step: Create an author
When(
  'I send a request to create an author with {string} and {string}',
  async (firstName: string, lastName: string) => {
    try {
      response = await createAuthorUseCase.execute({ firstName, lastName });
    } catch (err) {
      error = err.message;
    }
  },
);

// Step: Verify the author creation
Then('the author should be created with ID {int}', (id: number) => {
  expect(response).toBeInstanceOf(Author);
  expect(response.id).toBe(id);
  expect(mockAuthorsRepository.add).toHaveBeenCalledWith({
    firstName: response.firstName,
    lastName: response.lastName,
  });
  expect(mockNotificationService.sendNotification).toHaveBeenCalledWith(
    `Author ${response.firstName} ${response.lastName} has been created with id ${response.id}`,
    'New author created',
  );
});

// Step: Attempt to create an author without a name
When('I send a request to create an author with no name', async () => {
  try {
    response = await createAuthorUseCase.execute({
      firstName: '',
      lastName: '',
    });
  } catch (err) {
    error = err.message;
  }
});

// Step: Verify error message for invalid author creation
Then('I should receive an error message {string}', (message: string) => {
  expect(error).toBe(message);
});

// Step: Mock a list of authors
Given('the system contains authors', () => {
  const authors = [
    { id: 1, firstName: 'John', lastName: 'Doe' },
    { id: 2, firstName: 'Jane', lastName: 'Smith' },
  ];
  mockAuthorsRepository.findAll = jest.fn().mockResolvedValue(authors);
});

// Step: Mock an empty list of authors
Given('the system has no authors', () => {
  mockAuthorsRepository.findAll = jest.fn().mockResolvedValue([]);
});

// Step: Request the list of authors
When('I request the list of authors', async () => {
  response = await mockAuthorsRepository.findAll();
});

// Step: Verify that authors are returned
Then('I should see a list containing at least one author', () => {
  expect(response.length).toBeGreaterThan(0);
  expect(response[0]).toHaveProperty('id');
  expect(response[0]).toHaveProperty('firstName');
  expect(response[0]).toHaveProperty('lastName');
});

// Step: Verify an empty list
Then('I should see an empty list', () => {
  expect(response).toEqual([]);
});
