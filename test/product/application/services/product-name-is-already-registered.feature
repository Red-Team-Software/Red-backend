Feature: Product Name has already registered Invariants

   Rule: Product's Invariants should be always acomplished during creation of new product

   Scenario: Creating a Product with another product having the same name registered
      When Trying to create a Product with a name that is already registered
      Then The product should not be created because the name is already registered