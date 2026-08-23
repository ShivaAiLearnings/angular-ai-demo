pipeline {
    agent any
    
    tools {
        nodejs 'Node16'
    }

    environment {
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    stages {
        stage('PR Checks: AI Review') {
            when { 
                changeRequest() 
            }
            steps {
                echo 'Checking out PR code...'
                checkout scm
                
                echo 'Installing dependencies...'
                sh 'npm ci'
                
                echo 'Running Air-Gapped AI Review via local Docker...'
                sh '''
                docker run --rm \
                  -e CONFIG.MODEL="gemini/gemini-3.6-flash" \
                  -e CONFIG.FALLBACK_MODELS=\'["gemini/gemini-3.6-flash"]\' \
                  -e GEMINI_API_KEY="${GEMINI_API_KEY}" \
                  -e GITHUB.USER_TOKEN="${GITHUB_TOKEN}" \
                  pragent/pr-agent:latest --pr_url="${CHANGE_URL}" review
                '''
            }
        }

        stage('Compile & Deploy to SIT') {
            when { 
                branch 'SIT' 
            }
            steps {
                echo 'Code merged to SIT. Compiling application...'
                checkout scm
                
                echo 'Installing npm packages...'
                sh 'npm ci'
                
                echo 'Building the application...'
                sh 'npm run build'
                
                echo 'Saving build output for JFrog...'
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }
    }
}
