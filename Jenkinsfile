pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    stages {
        stage('Backend - Install & Test') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'npm test --if-present'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
    }
}