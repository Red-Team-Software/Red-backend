Feature: User's phone Invariants

   Rule: User's phone Invariants should be always valid during creation of the value object

   Scenario: Creating a User phone with invalid data
      When Trying to create a User phone with invalid data
      Then The user phone should not be created, because data is invalid
  