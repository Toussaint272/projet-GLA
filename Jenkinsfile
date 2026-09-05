pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    stages {
        stage('Backend - Install & Test') {
            steps {
                dir('centre-formation/backend') {
                    bat 'npm install'
                    bat 'npm test --if-present'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                dir('centre-formation/frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
    }
}