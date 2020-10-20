pipeline {
  agent any
  stages {
    stage('Building') {
      agent any
      steps {
        nodejs('Angular') {
          sh 'npm install'
          sh 'ng build'
        }

      }
    }

  }
}