Feature: Authors management
  As a user
  I want to manage authors
  So that I can keep the system up to date

  Scenario: Successfully create a new author
    Given the system is ready
    When I send a request to create an author with "John" and "Doe"
    Then the author should be created with ID 1

  Scenario: Fail to create an author without a name
    Given the system is ready
    When I send a request to create an author with no name
    Then I should receive an error message "Author not created"

  Scenario: List all authors
    Given the system contains authors
    When I request the list of authors
    Then I should see a list containing at least one author

  Scenario: No authors available
    Given the system has no authors
    When I request the list of authors
    Then I should see an empty list
