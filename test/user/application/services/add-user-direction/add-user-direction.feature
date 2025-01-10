Feature: User's Already Has maximun directions Invariants

   Rule: Uses's Invariants should be always acomplished during creation of new directions

   Scenario: User has maximun directions
      When Trying to create a User with one more direction, when he already has the 6 directions
      Then The user should not be created because it already has maximun directions
