pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'spendwise'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh 'mvn -B test'
                }
            }
        }

        stage('AI Service Tests') {
            steps {
                dir('ai-service') {
                    sh 'python -m pytest -q'
                }
            }
        }

        stage('Frontend Test & Build') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm test -- --watchAll=false --passWithNoTests'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Containers') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Start Integration Stack') {
            steps {
                sh 'docker compose up -d postgres ai-service backend'
                sh 'sleep 20'
            }
        }

        stage('Karate API Tests') {
            steps {
                dir('karate-tests') {
                    sh 'mvn -B test -DbaseUrl=http://localhost:8080'
                }
            }
        }
    }

    post {
        always {
            sh 'docker compose down || true'
        }
    }
}
