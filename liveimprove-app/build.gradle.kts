plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":liveimprove-common"))
    implementation(project(":liveimprove-domain"))
    implementation(project(":liveimprove-auth"))
    implementation(project(":liveimprove-goals"))
    implementation(project(":liveimprove-habits"))
    implementation(project(":liveimprove-tasks"))
    implementation(project(":liveimprove-calendar"))
    implementation(project(":liveimprove-interviews"))
    implementation(project(":liveimprove-analytics"))
    implementation(project(":liveimprove-notification"))
    implementation(project(":liveimprove-infrastructure"))

    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    implementation("org.liquibase:liquibase-core")
    runtimeOnly("org.postgresql:postgresql")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")

    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:junit-jupiter")
}