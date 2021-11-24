pipeline {
    agent any
    
    tools {nodejs "NodeInstall"}
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }
    }
}