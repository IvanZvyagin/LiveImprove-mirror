# syntax=docker/dockerfile:1.7

# ---------- build ----------
FROM eclipse-temurin:25-jdk AS build

WORKDIR /workspace

COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
RUN chmod +x ./gradlew && ./gradlew --version --no-daemon

COPY . .

RUN ./gradlew :liveimprove-app:bootJar --no-daemon -x test \
    && rm -f liveimprove-app/build/libs/*-plain.jar

# ---------- runtime ----------
FROM eclipse-temurin:25-jre

# В базовом образе wget мог быть удалён после установки JDK — ставим явно.
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends wget; \
    rm -rf /var/lib/apt/lists/*; \
    wget --version; \
    groupadd --system app; \
    useradd --system --gid app --home-dir /app --shell /usr/sbin/nologin app

WORKDIR /app
COPY --from=build /workspace/liveimprove-app/build/libs/*.jar /app/app.jar

USER app
EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
HEALTHCHECK --interval=10s --timeout=3s --start-period=40s --retries=5 \
    CMD wget -qO- http://localhost:8080/actuator/health | grep -q '"status":"UP"' || exit 1

ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]
