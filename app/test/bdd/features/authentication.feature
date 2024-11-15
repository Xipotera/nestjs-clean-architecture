Feature: Authentication
  As a user
  I want to access protected resources
  So that I can manage my data securely

  Scenario: Access a resource with a valid token
    Given I have a valid token
    When I request a protected resource
    Then I should receive the resource

  Scenario: Access a resource with an invalid token
    Given I have an invalid token
    When I request a protected resource
    Then I should receive an error message "Unauthorized"
