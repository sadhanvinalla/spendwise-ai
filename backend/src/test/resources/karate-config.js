function fn() {
    var config = {
        baseUrl: karate.properties['baseUrl'] || 'http://localhost:8080/api'
    };

    return config;
}