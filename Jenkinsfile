pipeline {
  agent any
  stages {
    stage('Building') {
      agent any
      steps {
        nodejs('Angular') {
          sh '''npm install
ng build --prod'''
        }

      }
    }

  }
}