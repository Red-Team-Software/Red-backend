Feature: Update Product Invariants

   Rule: Product's Invariants should be always acomplished during updating of product

   Scenario: Updating a Product with valid data
      
      When Trying to update a product with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered, name "prueba cachito", description "prueba cachito description", date "2045-01-31", stock 4, images "image 1,image 2", price 45, currency "usd", weigth 1, measurement "kg"

      Then The product should be updated with id "7ea54c93-562b-4c74-8b24-040add21f4c9", name "prueba cachito", description "prueba cachito description", date "2045-01-31", stock 4, images "image 1,image 2", price 45, currency "usd", weigth 1, measurement "kg"

   Scenario: Updating a Product with name registered
      
      When Trying to update a product with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered, name "cachito" that is already registered

      Then The product should not be updated because the name is already registered