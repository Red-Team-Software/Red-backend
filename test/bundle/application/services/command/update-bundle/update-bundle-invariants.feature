Feature: Update Bundle Invariants

   Rule: Bundle's Invariants should be always acomplished during updating of bundle

   Scenario: Updating a Bundle with valid data
      
      When Trying to update a bundle with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered, name "prueba bundle comida china 2025", description "prueba description comida china 2024", caducity date "2025-04-13", stock 10, images "image-1,image-2", price 5, currency "usd", weight 30, measurement "kg", and products with id "7ea54c93-562b-4c74-8b24-040add21f4c3" "e09771db-2657-45fb-ad39-ae6604422919"

      Then The bundle should be updated with id "7ea54c93-562b-4c74-8b24-040add21f4c9", name "prueba bundle comida china 2025", description "prueba description comida china 2024", caducity date "2025-04-13", stock 10, images "image-1,image-2", price 5, currency "usd", weight 30, measurement "kg", and products with id "7ea54c93-562b-4c74-8b24-040add21f4c3" "e09771db-2657-45fb-ad39-ae6604422919"