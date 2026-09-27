package com.spendwise.backend.karate;

import com.intuit.karate.junit5.Karate;

class KarateTest {

    @Karate.Test
    Karate testAuth() {
        return Karate.run("auth").relativeTo(getClass());
    }
}