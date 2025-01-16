Feature: Create Cupon Invariants

  Rule: Cupon's Invariants should always be accomplished during creation of a new cupon

  Scenario: Creating a Coupon with another coupon having the same name registered
    When Trying to create a coupon with name "cachito" that is already registered
    Then The coupon should not be created because the name "cahito" is already registered
  
  Scenario: Creating a Coupon with valid data
    When Trying to create a coupon with name "BlackFriday"
    Then The coupon "BlackFriday" should be created successfully