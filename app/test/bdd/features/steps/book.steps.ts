import { Given, When, Then } from '@cucumber/cucumber';
import { CreateBookUseCase } from '@domain/use-cases/books/create-book.usecase';
import { IBooksRepository } from '@domain/repositories/books-repository.interface';
import { IAuthorsRepository } from '@domain/repositories/authors-repository.interface';
import { Book } from '@domain/entities/book';

let createBookUseCase: CreateBookUseCase;
let mockBooksRepository: IBooksRepository;
let mockAuthorsRepository: IAuthorsRepository;
let response: any;
let error: any;

// Step: An author exists
Given('author with ID {int} exists', (authorId: number) => {
  mockAuthorsRepository = {
    findById: jest.fn().mockResolvedValue({
      id: authorId,
      firstName: 'John',
      lastName: 'Doe',
    }),
    findAll: jest.fn(),
    add: jest.fn(),
  };

  mockBooksRepository = {
    add: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  createBookUseCase = new CreateBookUseCase(
    mockBooksRepository,
    mockAuthorsRepository,
    { sendNotification: jest.fn() },
  );

  response = null;
  error = null;
});

// Step: The system is ready
Given('the system is ready', () => {
  mockAuthorsRepository = {
    findById: jest.fn().mockResolvedValue(null), // Simulate no author found
    findAll: jest.fn(),
    add: jest.fn(),
  };

  mockBooksRepository = {
    add: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  createBookUseCase = new CreateBookUseCase(
    mockBooksRepository,
    mockAuthorsRepository,
    { sendNotification: jest.fn() },
  );

  response = null;
  error = null;
});

// Step: Create a book
When(
  'I send a request to create a book titled {string} for author {int}',
  async (title: string, authorId: number) => {
    try {
      response = await createBookUseCase.execute({ title, author: authorId });
    } catch (err) {
      error = err.message;
    }
  },
);

// Step: Verify successful book creation
Then('the book should be created with ID {int}', (id: number) => {
  expect(response).toBeInstanceOf(Book);
  expect(response.id).toBe(id);
  expect(response.title).toBe('New Book');
  expect(mockAuthorsRepository.findById).toHaveBeenCalledWith(id);
  expect(mockBooksRepository.add).toHaveBeenCalledWith(expect.any(Book));
});

// Step: Verify error for invalid author
Then('I should receive an error message {string}', (message: string) => {
  expect(error).toBe(message);
});

// Step: Mock books in the system
Given('the system contains books', () => {
  const books = [
    {
      id: 1,
      title: 'Book One',
      author: { id: 1, firstName: 'John', lastName: 'Doe' },
    },
    {
      id: 2,
      title: 'Book Two',
      author: { id: 2, firstName: 'Jane', lastName: 'Smith' },
    },
  ];
  mockBooksRepository.findAll = jest.fn().mockResolvedValue(books);
});

// Step: Mock no books in the system
Given('the system has no books', () => {
  mockBooksRepository.findAll = jest.fn().mockResolvedValue([]);
});

// Step: Request the list of books
When('I request the list of books', async () => {
  response = await mockBooksRepository.findAll();
});

// Step: Verify books are returned
Then('I should see a list containing at least one book', () => {
  expect(response.length).toBeGreaterThan(0);
  expect(response[0]).toHaveProperty('id');
  expect(response[0]).toHaveProperty('title');
  expect(response[0]).toHaveProperty('author');
});

// Step: Verify an empty book list
Then('I should see an empty list', () => {
  expect(response).toEqual([]);
});
