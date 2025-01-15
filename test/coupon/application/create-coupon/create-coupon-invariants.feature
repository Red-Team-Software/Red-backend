Feature: Create Cupon Invariants

  Rule: Cupon's Invariants should always be accomplished during creation of a new cupon

  Scenario: Creating a Cupon with another cupon having the same name registered
    When Trying to create a cupon with name "BlackFriday" that is already registered
    Then The cupon should not be created because the name "BlackFriday" is already registered

  Scenario: Creating a Cupon with valid data
    When Trying to create a cupon with name "SummerSale" and code "SS2025"
    Then The cupon "SummerSale" should be created successfully
