Feature: SpendWise API smoke test

  Background:
    * url baseUrl
    * def email = 'karate-' + java.util.UUID.randomUUID() + '@example.com'
    * def password = 'Password123!'
    * def name = 'Karate Test User'

  Scenario: Register, login and use protected APIs
    Given path 'api/auth/register'
    And request
      """
      {
        "name": "#(name)",
        "email": "#(email)",
        "password": "#(password)"
      }
      """
    When method post
    Then status 200

    Given path 'api/auth/login'
    And request
      """
      {
        "email": "#(email)",
        "password": "#(password)"
      }
      """
    When method post
    Then status 200
    * def token = response.token
    * header Authorization = 'Bearer ' + token

    Given path 'api/transactions'
    And request
      """
      {
        "type": "EXPENSE",
        "category": "FOOD",
        "amount": 250,
        "description": "Karate lunch",
        "transactionDate": "2026-09-26"
      }
      """
    When method post
    Then status 200
    And match response.category == 'FOOD'

    Given path 'api/budgets'
    And request
      """
      {
        "month": "2026-09",
        "limitAmount": 5000
      }
      """
    When method post
    Then status 200

    Given path 'api/dashboard'
    And param month = '2026-09'
    When method get
    Then status 200
    And match response.budgetLimit == 5000

    Given path 'api/insights'
    And param month = '2026-09'
    When method get
    Then status 200
    And match response.status == 'success'
    And match response.totalExpense == 250
