Feature: User's name Invariants

   Rule: User's name Invariants should be always valid during creation of the value object

   Scenario: Creating a User name with invalid data
      When Trying to create a User name with invalid data
      Then The user name should not be created, because data is invalid
  