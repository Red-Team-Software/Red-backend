Feature: User's Already Exist Invariants

   Rule: Uses's Invariants should be always valid during creation of User

   Scenario: Creating a User with email already exist
      When Trying to create a User with an email that already exist
      Then The user should not be created
