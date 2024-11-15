Feature: Books management
  As a user
  I want to manage books
  So that I can keep the library up to date

  Scenario: Successfully create a book
    Given author with ID 1 exists
    When I send a request to create a book titled "New Book" for author 1
    Then the book should be created with ID 1

  Scenario: Fail to create a book with an invalid author
    Given the system is ready
    When I send a request to create a book titled "Invalid Book" for author 999
    Then I should receive an error message "Author not found"

  Scenario: List all books
    Given the system contains books
    When I request the list of books
    Then I should see a list containing at least one book

  Scenario: No books available
    Given the system has no books
    When I request the list of books
    Then I should see an empty list
