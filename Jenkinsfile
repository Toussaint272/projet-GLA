pipeline {
    agent any

    tools {
        nodejs 'node18'
    }

    stages {
        stage('Analyse de Qualite & Lint') {
            steps {
                echo '=== Verification de la qualite du code ==='
                dir('backend') {
                    bat 'npm run lint --if-present'
                }
                dir('frontend') {
                    bat 'npm run lint --if-present'
                }
            }
        }

        stage('Backend - Install & Test') {
            steps {
                echo '=== Traitement du Backend ==='
                dir('backend') {
                    bat 'npm install'
                    bat 'npm test --if-present'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                echo '=== Traitement du Frontend ==='
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Archivage des Artefacts') {
            steps {
                echo '=== Sauvegarde du dossier dist Frontend ==='
                archiveArtifacts artifacts: 'frontend/dist/**', allowEmptyArchive: false
            }
        }

        stage('Deploiement Automatique (PM2)') {
            steps {
                echo '=== Redemarrage de l application via PM2 ==='
                bat 'pm2 startOrReload ecosystem.config.js'
                bat 'pm2 save'
            }
        }
    }

    post {
        success {
            echo 'Build, tests, archivage et deploiement PM2 termines avec succes !'
        }
        failure {
            echo 'Echec de la compilation, des tests ou du deploiement.'
        }
    }
}