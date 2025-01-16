Feature: Mark Coupon as Used

  Scenario: Marking a coupon as used successfully
    When Trying to mark the coupon with id "e09771db-2657-45fb-ad39-ae6604422919" as used for user "e09771db-2657-45fb-ad39-ae6604422919"
    Then The coupon should be marked as used successfully

