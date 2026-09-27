Feature: SpendWise Authentication API

Background:
    * url baseUrl

Scenario: Register and login a user

    * def email = 'karate' + java.util.UUID.randomUUID() + '@test.com'
    * def password = 'Karate@123'

    Given path 'auth', 'register'
    And request
    """
    {
      "name": "Karate User",
      "email": "#(email)",
      "password": "#(password)"
    }
    """
    When method post
    Then status 200

    Given path 'auth', 'login'
    And request
    """
    {
      "email": "#(email)",
      "password": "#(password)"
    }
    """
    When method post
    Then status 200
    And match response.token == '#string'