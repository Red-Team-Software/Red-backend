Feature: User's wallet Invariants

   Rule: Uses's wallet Invariants should be always valid during creation of the entity

   Scenario: Creating a Wallet with invalid data
      When Trying to create a wallet with invalid data
      Then The wallet should not be created
  