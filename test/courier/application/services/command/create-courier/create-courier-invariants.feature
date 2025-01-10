Feature: Create Courier Invariants

   Rule: Courier's Invariants should be always acomplished during creation of new courier

   Scenario: Creating a Courier with valid data
      When Trying to create a courier with name "Gabriel"
      Then The courier "Gabriel" is sucsessfully registered

   # TODO
   # Scenario: Creating a Courier with another courier having the same name registered
   #    When Trying to create a Courier with name "Gabriel" that is registered
   #    Then The courier should not be created because the name "Gabriel" is already registered