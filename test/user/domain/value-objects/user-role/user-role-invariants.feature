Feature: User's role Invariants

   Rule: User's role Invariants should be always valid during creation of the value object

   Scenario: Creating a User role with invalid data
      When Trying to create a User role with invalid data
      Then The user role should not be created, because data is invalid
  