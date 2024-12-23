Feature: Wallet's id Invariants

   Rule: Wallet's id Invariants should be always valid during creation of the value object

   Scenario: Creating a Wallet id with invalid data
      When Trying to create a Wallet id with invalid data
      Then The Wallet id should not be created, because data is invalid
  