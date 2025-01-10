Feature: Delete Bundle Invariants

   Rule: Bundle's Invariants should be always acomplished during deletting of bundle

   Scenario: Deletting a Bundle with invalid bundle id registered
      When Trying to delete a Bundle with bundle id "7ea54c93-562b-4c74-8b24-040add21f4c1"
      Then The bundle should not be deleted because the bundle "7ea54c93-562b-4c74-8b24-040add21f4c1", is not registered

   Scenario: Deletting a Bundle with valid data
      When Trying to delete a Bundle with valid id "7ea54c93-562b-4c74-8b24-040add21f4c1", that is registered
      Then The bundle "7ea54c93-562b-4c74-8b24-040add21f4c1" should be deleted successfully