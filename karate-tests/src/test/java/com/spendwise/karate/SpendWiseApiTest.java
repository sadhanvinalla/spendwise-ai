package com.spendwise.karate;

import com.intuit.karate.junit5.Karate;

class SpendWiseApiTest {

    @Karate.Test
    Karate apiSmokeTest() {
        return Karate.run("spendwise").relativeTo(getClass());
    }
}
