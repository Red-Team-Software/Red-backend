Feature: User's balance amount Invariants

   Rule: User's balance Invariants should be always valid during creation of the value object

   Scenario: Creating a User balance with invalid amount
      When Trying to create a User balance with invalid amount
      Then The user balance should not be created, because amount is invalid
  