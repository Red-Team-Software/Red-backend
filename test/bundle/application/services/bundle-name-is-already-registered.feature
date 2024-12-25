Feature: Bundle Name has already registered Invariants

   Rule: Bundle's Invariants should be always acomplished during creation of new bundle

   Scenario: Creating a Bundle with another bundle having the same name registered
      When Trying to create a Bundle with a name that is already registered
      Then The bundle should not be created because the name is already registered