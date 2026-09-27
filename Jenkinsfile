pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'spendwise-ai-backend'
        FRONTEND_IMAGE = 'spendwise-ai-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/sadhanvinalla/spendwise-ai.git'
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh 'mvn clean test'
                }
            }
        }

        stage('Frontend Tests') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'CI=true npm test -- --watchAll=false'
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh 'docker build -t ${BACKEND_IMAGE}:latest ./backend'
            }
        }

        stage('Start Backend for Karate') {
            steps {
                sh 'docker compose -p spendwise-ci -f docker-compose.ci.yml up -d --wait'
                sh 'sleep 10'
            }
        }

        stage('Karate API Tests') {
            steps {
                dir('backend') {
                    sh 'mvn test -Dtest=KarateTest -DbaseUrl=http://host.docker.internal:18080/api'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh 'docker build --build-arg REACT_APP_API_BASE_URL=/api -t ${FRONTEND_IMAGE}:latest ./frontend'
            }
        }

        stage('Verify Docker Images') {
            steps {
                sh 'docker image inspect ${BACKEND_IMAGE}:latest'
                sh 'docker image inspect ${FRONTEND_IMAGE}:latest'
            }
        }
    }

    post {
        always {
            sh 'docker compose -p spendwise-ci -f docker-compose.ci.yml down -v --remove-orphans || true'
        }

        success {
            echo 'SpendWise CI pipeline completed successfully!'
        }

        failure {
            echo 'SpendWise CI pipeline failed. Check the stage logs.'
        }
    }
}