FROM maven:3.6.3-openjdk-13-slim as BUILDER
ARG VERSION=1.0-SNAPSHOT
WORKDIR /build/
COPY pom.xml /build/
COPY src /build/src/

RUN mvn clean package
COPY target/project-${VERSION}.jar target/application.jar

FROM openjdk:13.0.7-jre-slim
WORKDIR /app/

COPY --from=BUILDER /build/target/application.jar /app/
CMD java -jar /app/application.jar