Feature: User's Email Invariants

   Rule: User's email Invariants should be always valid during creation of the value object

   Scenario: Creating a User email with invalid data
      When Trying to create a User email with invalid data
      Then The user email should not be created, because data is invalid
  