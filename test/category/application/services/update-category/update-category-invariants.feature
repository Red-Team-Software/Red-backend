Feature: Update Category Invariants

   Rule: Category's Invariants should always be accomplished during updating of a category

   Scenario: Updating a category with valid data
      
      When Trying to update a category with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered, name "Updated Category", image "http://image-123.jpg", products "e09771db-2657-45fb-ad39-ae6604422919", bundles "e09771db-2657-45fb-ad39-ae6604422919"

      Then The category should be updated with id "7ea54c93-562b-4c74-8b24-040add21f4c9", name "Updated Category", image "image", products "product1", bundles "bundles1"

   Scenario: Updating a category with name already registered
      
      When Trying to update a category entity with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered, name "Registered Category" that is already registered

      Then The category should not be updated because the name is already registered
