# Feature: Create Order Invariants

#    Rule: Order's Invariants should be always acomplished during creation of new order

#    Scenario: Creating a Order with valid data
#       When Trying to create a order with valid data
#       Then The order should be created sucsessfully

#    Scenario: Creating a Order with payment method not registered
#       When Trying to create a order with payment method "7ea54c93-562b-4c74-8b24-040add21f4c1" that is not registered
#       Then The order should not be created sucsessfully because the payment method "7ea54c93-562b-4c74-8b24-040add21f4c1" is not registered

#    Scenario: Creating a Order with product not registered
#       When Trying to create a order with product "7ea54c93-562b-4c74-8b24-040add21f4c1" that is not registered
#       Then The order should not be created sucsessfully because the product "7ea54c93-562b-4c74-8b24-040add21f4c1" is not registered

#    #TODO
#    # Scenario: Creating a Order with bundle not registered
#    #    When Trying to create a order with bundle "7ea54c93-562b-4c74-8b24-040add21f4c1" that is not registered
#    #    Then The order should not be created sucsessfully because the bundle "7ea54c93-562b-4c74-8b24-040add21f4c1" is not registered