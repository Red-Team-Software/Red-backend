Feature: User's Already Has maximun directions Invariants

   Rule: Uses's Invariants should be always acomplished during creation of new directions

   Scenario: Creating a User with maximun directions
      When Trying to create a User with one more direction
      Then The user should not be created because it already has maximun directions
