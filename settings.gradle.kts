plugins {
    id("org.gradle.toolchains.foojay-resolver-convention") version "0.10.0"
}

rootProject.name = "liveimprove"

include(
    "liveimprove-app",
    "liveimprove-common",
    "liveimprove-domain",
    "liveimprove-auth",
    "liveimprove-goals",
    "liveimprove-habits",
    "liveimprove-tasks",
    "liveimprove-calendar",
    "liveimprove-interviews",
    "liveimprove-analytics",
    "liveimprove-notification",
    "liveimprove-infrastructure"
)