pipeline {
    agent any

    // Supprimez le bloc tools si Node.js est déjà configuré dans le PATH Windows
    tools {
        nodejs 'node18'
    }

    stages {
        stage('Backend - Install & Test') {
            steps {
                echo '=== Traitement du Backend ==='
                dir('backend') { // Adaptez le nom du dossier si nécessaire
                    bat 'npm install'
                    bat 'npm test --if-present'
                }
            }
        }

        stage('Frontend - Install & Build') {
            steps {
                echo '=== Traitement du Frontend ==='
                dir('frontend') { // Adaptez le nom du dossier si nécessaire
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }
    }

    post {
        success {
            echo 'Build et tests terminés avec succès !'
        }
        failure {
            echo 'Échec de la compilation ou des tests.'
        }
    }
}