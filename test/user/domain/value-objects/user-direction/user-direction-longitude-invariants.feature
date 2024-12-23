Feature: User's Direction's Longitude Invariants

   Rule: User's directions Invariants should be always valid during creation of the value object

   Scenario: Creating a User direction's with invalid longitude
      When Trying to create a User direction's with invalid longitude
      Then The user direction's should not be created, because longitude is invalid
  