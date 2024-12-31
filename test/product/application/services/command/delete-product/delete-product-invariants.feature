Feature: Delete Product Invariants

   Rule: Product's Invariants should be always acomplished during deletting of product

   Scenario: Deletting a Product with an invalid reference to it
      When Trying to delete a product with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is not registered
      Then The product should not be deleted because the id "7ea54c93-562b-4c74-8b24-040add21f4c9" is not registered

   Scenario: Creating a Product with valid data
      When Trying to delete a product with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered
      Then The product should be deleted because the id "7ea54c93-562b-4c74-8b24-040add21f4c9" is registered