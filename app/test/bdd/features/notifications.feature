Feature: Notifications
  As a system
  I want to notify users of changes
  So that they are informed about updates

  Scenario: Notify user on successful creation
    Given the system is ready
    When an author is successfully created
    Then a notification should be sent saying "Author created"

  Scenario: Fail to send notification on system error
    Given the notification system is down
    When an author is successfully created
    Then the system should log an error
