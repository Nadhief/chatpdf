node {
    def app
    def imageTag


    stage('Clone repository') {
        checkout scm
    }

    stage('Build image') {
        imageTag = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
        app = docker.build("coofis/chatalizer", "--build-arg VITE_API_BASE_URL=https://red.247go.biz/chat/personal_v2 --build-arg BUILD_DATE=\$(date -u +'%Y%m%d%H%M%S') -f Dockerfile .")
    }

    stage('Test image') {
        /* Ideally, we would run a test framework against our image.
         * For this example, we're using a Volkswagen-type approach ;-) */

        app.inside {
            sh 'echo "Tests passed"'
        }
    }

    stage('Push image') {
        /* Finally, we'll push the image with two tags:
         * First, the incremental build number from Jenkins
         * Second, the 'latest' tag.
         * Pushing multiple tags is cheap, as all the layers are reused. */
        docker.withRegistry('https://img.armsolusi.com', 'img-armsolusi-cred') {
            app.push("${imageTag}")
            app.push("latest")
        }
    }

}
