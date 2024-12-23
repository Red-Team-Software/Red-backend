Feature: User's balance currency Invariants

   Rule: User's balance Invariants should be always valid during creation of the value object

   Scenario: Creating a User balance with invalid currency
      When Trying to create a User balance with invalid currency
      Then The user balance should not be created, because currency is invalid
  