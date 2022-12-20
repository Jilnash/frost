FROM openjdk:13
COPY target/frost.war frost.war
ENTRYPOINT ["java","-jar","/frost.war"]