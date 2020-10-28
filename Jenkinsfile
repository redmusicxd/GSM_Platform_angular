pipeline {
  agent any
  stages {
    stage('Building') {
      agent any
      steps {
        nodejs('Angular') {
          sh 'npm ci'
          sh 'npm run build'
        }

      }
    }

  }
}