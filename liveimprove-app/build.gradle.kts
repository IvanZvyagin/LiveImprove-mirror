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
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-redis")

    implementation("org.liquibase:liquibase-core")

    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("com.h2database:h2")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.springframework.boot:spring-boot-testcontainers")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:junit-jupiter")
}

springBoot {
    mainClass.set("com.liveimprove.LiveImproveApplication")
}
