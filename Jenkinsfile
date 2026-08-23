pipeline {
    agent any
    
    // Kept from your original setup: uses Jenkins Node.js plugin
    tools {
        nodejs 'Node16' // Ensures node/npm commands work inside Jenkins
    }

    environment {
        // Stored securely inside Jenkins Credentials Manager
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')
        GEMINI_API_KEY = credentials('GEMINI_API_KEY')
    }

    stages {
        
        // =================================================================
        // STAGE 1: PR GATEKEEPER (Runs ONLY when a PR is opened)
        // =================================================================
        stage('PR Checks: Linting & AI Review') {
            when { 
                changeRequest() 
            }
            steps {
                echo 'Checking out PR code...'
                checkout scm
                
                echo 'Running strict ESLint checks...'
                sh 'npm ci'
                sh 'npm run lint'
                
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

        // =================================================================
        // STAGE 2: BUILD & DEPLOY (Runs ONLY after PR is merged to SIT)
        // =================================================================
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
                // Kept from your original setup
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution finished.'
            cleanWs()
        }
    }
}