Feature: Delete Category Invariants

  Scenario: Deleting a category with valid data
    When Trying to delete a category with valid id "e09771db-2657-45fb-ad39-ae6604422919"
    Then The category should be deleted with id "e09771db-2657-45fb-ad39-ae6604422919"

  Scenario: Deleting a category with invalid reference
    When Trying to delete a category with id "7ea54c93-562b-4c74-8b24-040add21f4c9"
    Then The category should not be deleted because the id "7ea54c93-562b-4c74-8b24-040add21f4c9" is not registered
