Feature: Create Bundle Invariants

   Rule: Bundle's Invariants should be always acomplished during creation of new bundle

   Scenario: Creating a Bundle with another bundle having the same name registered
      When Trying to create a Bundle with name "comida china" that is already registered
      Then The bundle should not be created because the name "comida china" is already registered

   Scenario: Creating a Bundle with invalid products id registered
      When Trying to create a Bundle with product id "7ea54c93-562b-4c74-8b24-040add21f4c4", "7ea54c93-562b-4c74-8b24-040add21f4c9" that is not registered
      Then The bundle should not be created because the product "7ea54c93-562b-4c74-8b24-040add21f4c4", is not registered

   Scenario: Creating a Bundle with valid data
      When Trying to create a Bundle with name "comida asiatica" and product ids "7ea54c93-562b-4c74-8b24-040add21f4c1", "7ea54c93-562b-4c74-8b24-040add21f4c2" that are registered
      Then The bundle "comida asiatica" with product ids "7ea54c93-562b-4c74-8b24-040add21f4c1", "7ea54c93-562b-4c74-8b24-040add21f4c2" should be created successfully