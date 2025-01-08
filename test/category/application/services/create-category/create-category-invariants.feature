Feature: Create Category

  Scenario: Trying to create a category with a name that already exists
    When Trying to create a category with name "Food" that is already registered
    Then The category should not be created because the name "Food" is already registered

  Scenario: Trying to create a category with valid data
    When Trying to create a category with name "Deserts"
    Then The category should be created with the name "Deserts"
