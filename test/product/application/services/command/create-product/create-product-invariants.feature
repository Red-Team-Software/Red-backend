Feature: Create Product Invariants

   Rule: Product's Invariants should be always acomplished during creation of new product

   Scenario: Creating a Product with another product having the same name registered
      When Trying to create a product with name "cachito" that is already registered
      Then The product should not be created because the name "cahito" is already registered

   Scenario: Creating a Product with valid data
      When Trying to create a Bundle with name "cachito" 
      Then The product "cachito" should be created successfully