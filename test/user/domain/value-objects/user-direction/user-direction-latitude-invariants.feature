Feature: User's Direction's Latitude Invariants

   Rule: User's directions Invariants should be always valid during creation of the value object

   Scenario: Creating a User direction's with invalid latitude
      When Trying to create a User direction's with invalid latitude
      Then The user direction's should not be created, because latitude is invalid
  