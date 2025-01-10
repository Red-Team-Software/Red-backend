Feature: Promotion Name has already registered Invariants

   Rule: Promotion's Invariants should be always acomplished during creation of new promotion

   Scenario: Creating a Bundle with another promotion having the same name registered
      When Trying to create a promotion with a name that is already registered
      Then The promotion should not be created because the name is already registered