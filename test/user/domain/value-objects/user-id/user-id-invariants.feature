Feature: User's id Invariants

   Rule: User's id Invariants should be always valid during creation of the value object

   Scenario: Creating a User id with invalid data
      When Trying to create a User id with invalid data
      Then The user id should not be created, because data is invalid
  