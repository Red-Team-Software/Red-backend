Feature: User's Direction's Name Invariants

   Rule: User's directions Invariants should be always valid during creation of the value object

   Scenario: Creating a User direction's with invalid name
      When Trying to create a User direction's with invalid name
      Then The user direction's should not be created, because name is invalid
  