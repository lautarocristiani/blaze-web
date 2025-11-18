# Blaze Marketplace - MVP Scenarios

## Feature: User Authentication - Login

> As a user (guest or registered),
> I want to be able to log in to my account,
> so that I can access my profile and sell items.

  Scenario: Successful user login (Happy Path)
    Given a user account exists with email "user@blaze.com" and password "ValidPass123"
    And I am on the "/auth" page on the "Login" tab
    When I fill in the "email" field with "user@blaze.com"
    And I fill in the "password" field with "ValidPass123"
    And I click the "Login" button
    Then I should be redirected to the home page ("/")
    And the header should show a user dropdown with the username

  Scenario: Login with invalid credentials
    Given I am on the "/auth" page on the "Login" tab
    When I fill in the "email" field with "user@blaze.com"
    And I fill in the "password" field with "WrongPassword"
    And I click the "Login" button
    Then I should remain on the "/auth" page
    And I should see an error message "Invalid email or password"

  Scenario: Login with empty fields
    Given I am on the "/auth" page on the "Login" tab
    When I click the "Login" button
    Then I should remain on the "/auth" page
    And I should see an error message for the "email" field
    And I should see an error message for the "password" field

## Feature: User Authentication - Sign Up

> As a new visitor,
> I want to be able to create a new account,
> so that I can become a member of the platform.

  Scenario: Successful user registration (Happy Path)
    Given I am on the "/auth" page on the "Sign Up" tab
    When I fill in all required fields (firstName, lastName, username, email, password) with valid data
    And my "password" and "confirmPassword" fields match
    And I click the "Sign Up" button
    Then the system should create a new user and profile
    And I should be logged in and redirected to the home page ("/")
    And the header should show my new username

  Scenario: Registration with an existing email
    Given a user account already exists with the email "user@blaze.com"
    And I am on the "/auth" page on the "Sign Up" tab
    When I fill in the "email" field with "user@blaze.com"
    And I fill in all other fields
    And I click the "Sign Up" button
    Then I should remain on the "/auth" page
    And I should see an error message "A user with this email already exists"

  Scenario: Registration with non-matching passwords
    Given I am on the "/auth" page on the "Sign Up" tab
    When I fill in all required fields
    And I fill in "password" with "ValidPass123"
    And I fill in "confirmPassword" with "DifferentPass456"
    And I click the "Sign Up" button
    Then I should remain on the "/auth" page
    And I should see an error message "Passwords do not match"

## Feature: Dynamic Header & Logout

> As a user,
> I want the header to reflect my authentication status,
> so that I can easily navigate to auth pages or my profile.

  Scenario: Header for a guest (unauthenticated) user
    Given I am not authenticated
    When I visit any page on the site
    Then the header should show a "Login / Sign Up" button

  Scenario: Header for a logged-in (authenticated) user
    Given I am authenticated as "johndoe"
    When I visit any page on the site
    Then the header should not show a "Login / Sign Up" button
    And the header should show a user dropdown component with the text "johndoe"

  Scenario: Successful user logout
    Given I am authenticated as "johndoe"
    When I click on the "johndoe" user dropdown in the header
    And I click the "Logout" option
    Then I should be logged out
    And I should be redirected to the home page ("/")
    And the header should now show a "Login / Sign Up" button

## Feature: User Theme Preference

> As a user,
> I want to be able to toggle between light and dark mode,
> so that I can use the app comfortably in different lighting conditions.

  Scenario: Toggle theme to dark
    Given I am on any page
    And the current theme is "light"
    When I click the theme toggle button
    Then the page theme should change to "dark"
    And the toggle button icon should show a "sun"

  Scenario: Toggle theme to light
    Given I am on any page
    And the current theme is "dark"
    When I click the theme toggle button
    Then the page theme should change to "light"
    And the toggle button icon should show a "moon"

  Scenario: Theme persists on page refresh
    Given I have set my theme to "dark"
    When I refresh the page
    Then the page theme should remain "dark"

  Scenario: Theme persists after logging out and back in
    Given I am authenticated and set my theme to "dark"
    When I log out
    And I log back in
    Then the page theme should still be "dark"

## Feature: Product Browsing (Viewing)

> As a user (guest or logged-in),
> I want to be able to browse, search, and filter products,
> so that I can find items I am interested in.

  Scenario: View products on the home page
    Given the database has several products
    When I visit the home page ("/")
    Then I should see a grid of product cards
    And each card should display a product image, title, and price

  Scenario: View a single product's details
    Given the database has a product with the title "Laptop Gamer"
    When I am on the home page
    And I click on the "Laptop Gamer" product card
    Then I should be redirected to the product's detail page (e.g., "/products/[id]")
    And I should see the "Laptop Gamer" title, image, price, description, and a "Buy" button

  Scenario: Search for a product
    Given the database has products "Laptop Gamer" and "Mouse Redragon"
    When I am on the home page
    And I fill in the search bar with "Laptop"
    And I press Enter (or click search)
    Then I should see the "Laptop Gamer" product card
    And I should not see the "Mouse Redragon" product card

  Scenario: Filter products by category
    Given the database has products in "Technology" and "Clothing" categories
    When I am on the home page
    And I click on the "Technology" category filter
    Then I should only see product cards from the "Technology" category

  Scenario: Sort products by price (low to high)
    Given the database has a "Laptop" for $1500 and a "Mouse" for $50
    When I am on the home page
    And I select "Price: Low to High" from the sort dropdown
    Then I should see the "Mouse" product card *before* the "Laptop" product card

  Scenario: Sort products by price (high to low)
    Given the database has a "Laptop" for $1500 and a "Mouse" for $50
    When I am on the home page
    And I select "Price: High to Low" from the sort dropdown
    Then I should see the "Laptop" product card *before* the "Mouse" product card

## Feature: Product Management (Selling)

> As a registered user,
> I want to be able to list my items for sale,
> so that I can earn money on the platform.

  Scenario: Guest user cannot access the "Sell" page
    Given I am not authenticated
    When I try to navigate to the "/sell" page
    Then I should be redirected to the "/auth" page
    And I should see a message "You must be logged in to sell"

  Scenario: Logged-in user successfully creates a new product (Happy Path)
    Given I am authenticated as "johndoe"
    And I am on the "/sell" page
    When I fill in "Product Title" with "Teclado Mecánico RGB"
    And I fill in "Price" with "85.00"
    And I fill in "Description" with "Teclado con switches blue"
    And I select "Technology" as the category
    And I upload a product image
    And I click the "Publish Product" button
    Then I should be redirected to my new product's detail page
    And I should see "Teclado Mecánico RGB" and "$85.00"

  Scenario: User fails to create a product with missing data
    Given I am authenticated
    And I am on the "/sell" page
    When I fill in "Product Title" with "Teclado"
    And I click the "Publish Product" button
    Then I should remain on the "/sell" page
    And I should see an error message "Price is required"
    And I should see an error message "Description is required"

  Scenario: User updates their own product
    Given I am authenticated as "johndoe"
    And I have a product named "Teclado"
    When I go to my "Teclado" product page
    And I click the "Edit" button
    And I change the "Price" from "85.00" to "75.00"
    And I click "Save Changes"
    Then I should be redirected to the product's detail page
    And I should see the new price "$75.00"

  Scenario: User cannot edit another user's product
    Given I am authenticated as "johndoe"
    And another user "janedoe" has a product named "Mouse Gamer"
    When I visit the "Mouse Gamer" product page
    Then I should not see an "Edit" button

## Feature: Simulated Purchase Flow (Buying)

> As a logged-in user,
> I want to be able to purchase an item using a simulated payment,
> so that the core marketplace loop is complete.

  Scenario: Guest user attempts to buy
    Given a product "Laptop Gamer" exists
    When I am a guest user on the "Laptop Gamer" detail page
    And I click the "Buy" button
    Then I should be redirected to the "/auth" page
    And I should see a message "Please log in to purchase"

  Scenario: Logged-in user successfully "buys" a product
    Given I am authenticated as "johndoe"
    And a product "Laptop Gamer" exists
    When I am on the "Laptop Gamer" detail page
    And I click the "Buy" button
    Then I should be redirected to the Stripe Checkout page
    And I fill in Stripe's test card details (e.g., 4242...4242)
    And I complete the Stripe payment
    Then I should be redirected back to the Blaze site, to a "/payment/success" page
    And I should see a "Thank you for your purchase!" message
    And a new "Order" should be created in the database for "johndoe" and "Laptop Gamer"

  Scenario: User cancels a payment
    Given I am authenticated
    And I am on the Stripe Checkout page
    When I click the "Back" or "Cancel" button on the Stripe page
    Then I should be redirected back to the product's detail page (or a "/payment/canceled" page)
    And no "Order" should be created in the database

## Feature: User Dashboard

> As a logged-in user,
> I want to have a dashboard,
> so that I can see the items I've bought and the items I'm selling.

  Scenario: View items I am selling
    Given I am authenticated as "johndoe"
    And I have published 3 products for sale
    When I navigate to my "/profile/dashboard" page
    And I click the "My For Sale" tab
    Then I should see the 3 products I am selling
    And I should see options to "Edit" or "Delete" them

  Scenario: View items I have purchased
    Given I am authenticated as "johndoe"
    And I have successfully purchased 2 products
    When I navigate to my "/profile/dashboard" page
    And I click the "My Purchases" tab
    Then I should see the 2 products I have bought
    And I should see the purchase price and date

## Feature: User Profile Management

> As a logged-in user,
> I want to be able to update my profile information,
> so that other users see my correct details and I can personalize my experience.

  Scenario: User views their profile
    Given I am authenticated as "johndoe"
    When I navigate to the "/profile" page
    Then I should see a form
    And I should see my "johndoe" username pre-filled in the form
    And I should see my "john@doe.com" email pre-filled (or other profile data)

  Scenario: User successfully updates profile details
    Given I am on the "/profile" page
    When I change the "username" field to "johndoe_new"
    And I fill in my "bio" with "I sell tech products"
    And I click the "Save profile" button
    Then I should see a message "Profile updated"
    And if I refresh the page, I should see "johndoe_new" in the form

  Scenario: User successfully uploads a new avatar
    Given I am on the "/profile" page
    When I select a new "avatar.jpg" image
    And I click the "Save profile" button
    Then I should see my new "avatar.jpg" as the preview image

  Scenario: User successfully removes avatar
    Given I am on the "/profile" page and I have an avatar
    When I click the "Remove avatar" button
    And I click the "Save profile" button
    Then I should see the default placeholder avatar