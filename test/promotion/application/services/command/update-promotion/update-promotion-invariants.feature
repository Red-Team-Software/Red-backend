Feature: Update Promotion Invariants

   Rule: Promotion's Invariants should be always acomplished during updating of promotion

   Scenario: Updating a Promotion with valid data
      
      When Trying to update a promotion with id "7ea54c93-562b-4c74-8b24-040add21f4c9" that is registered, name "prueba promocion 2024", description "prueba description promocion 2024", state "avaleable", discount 4, products "7ea54c93-562b-4c74-8b24-040add21f4c9" "7ea54c93-562b-4c74-8b24-040add21f4c8", bundles "7ea54c93-562b-4c74-8b24-040add21f4c1" "7ea54c93-562b-4c74-8b24-040add21f4c0", and category "7ea54c93-562b-4c74-8b24-040add21f4c3"

      Then The promotion should be updated of the id "7ea54c93-562b-4c74-8b24-040add21f4c9"