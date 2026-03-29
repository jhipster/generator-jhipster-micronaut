import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

import { getCommonMavenDefinition, getDatabaseDriverForDatabase, getImperativeMavenDefinition } from '../../internal/dependencies.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
    });
  }

  async beforeQueue() {
    await this.dependsOnBootstrap('java-simple-application');
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      loadDependencies({ application }) {
        this.loadJavaDependenciesFromGradleCatalog(
          application.javaDependencies,
          this.templatePath('../../../resources/gradle/libs.versions.toml'),
        );
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      addMicronautDependencies({ application, source }) {
        const { javaDependencies } = application;
        source.addJavaDefinitions(
          {
            dependencies: [
              { groupId: 'io.micronaut.openapi', artifactId: 'micronaut-openapi-annotations' },
              {
                groupId: 'net.logstash.logback',
                artifactId: 'logstash-logback-encoder',
                version: javaDependencies['logstash-logback-encoder'],
              },
              { groupId: 'tech.jhipster', artifactId: 'jhipster-framework', version: application.jhipsterDependenciesVersion },
              { groupId: 'org.apache.commons', artifactId: 'commons-lang3', version: javaDependencies['commons-lang3'] },
              { groupId: 'org.mockito', artifactId: 'mockito-core', scope: 'test' },
              { groupId: 'org.zalando', artifactId: 'jackson-datatype-problem', version: javaDependencies['jackson-datatype-problem'] },
              { groupId: 'org.zalando', artifactId: 'problem-violations', version: javaDependencies['problem-violations'] },
            ],
          },
          {
            condition: application.databaseTypeSql,
            dependencies: [{ groupId: 'com.h2database', artifactId: 'h2' }],
          },
        );
        if (application.buildToolMaven) {
          source.addMavenDefinition({
            properties: [{ property: 'modernizer.failOnViolations', value: 'false' }],
          });
        } else if (application.buildToolGradle) {
          source.addGradleDependencyCatalogPlugins([
            {
              id: 'io.micronaut.application',
              pluginName: 'micronaut-application',
              version: application.javaDependencies['micronaut-application'],
              addToBuild: true,
            },
            {
              id: 'com.gorylenko.gradle-git-properties',
              pluginName: 'gradle-git-properties',
              version: application.javaDependencies['gradle-git-properties'],
              addToBuild: true,
            },
            {
              id: 'com.gradleup.shadow',
              pluginName: 'shadow',
              version: application.javaDependencies.shadow,
              addToBuild: true,
            },
          ]);
          if (application.enableSwaggerCodegen) {
            source.addGradleDependencyCatalogPlugin({
              id: 'org.openapi.generator',
              pluginName: 'openapi-generator',
              version: application.javaDependencies['openapi-generator'],
              addToBuild: true,
            });
          }
        }

        if (!application.skipUserManagement) {
          source.addJavaDefinition({
            dependencies: [{ groupId: 'org.mindrot', artifactId: 'jbcrypt', version: javaDependencies.jbcrypt }],
          });
        }
      },
      sqlDependencies({ application, source }) {
        if (application.databaseTypeSql) {
          source.addMavenDefinition?.(
            getImperativeMavenDefinition({ javaDependencies: { hibernate: application.javaManagedProperties['hibernate.version'] } }),
          );
          source.addMavenDefinition?.(getCommonMavenDefinition());
        }
      },
      addDependencies({ application, source }) {
        const { javaDependencies, javaManagedProperties } = application;
        const hibernateVersion = javaManagedProperties?.['hibernate.version'];

        source.addJavaDefinitions(
          {
            versions: [{ name: 'mapstruct', version: javaDependencies?.mapstruct }],
            dependencies: [
              // Implementation
              { groupId: 'ch.qos.logback', artifactId: 'logback-classic' },
              { groupId: 'io.micrometer', artifactId: 'micrometer-registry-prometheus' },
              { groupId: 'com.fasterxml.jackson.core', artifactId: 'jackson-annotations' },
              { groupId: 'com.fasterxml.jackson.core', artifactId: 'jackson-databind' },
              { groupId: 'com.fasterxml.jackson.datatype', artifactId: 'jackson-datatype-jsr310' },
              { groupId: 'com.fasterxml.jackson.dataformat', artifactId: 'jackson-dataformat-yaml' },
              { groupId: 'io.micronaut', artifactId: 'micronaut-jackson-databind' },
              { groupId: 'io.micronaut', artifactId: 'micronaut-inject' },
              { groupId: 'io.micronaut', artifactId: 'micronaut-http-client' },
              { groupId: 'io.micronaut', artifactId: 'micronaut-http-server-netty' },
              { groupId: 'io.micronaut', artifactId: 'micronaut-management' },
              { groupId: 'io.micronaut.views', artifactId: 'micronaut-views-thymeleaf' },
              { groupId: 'io.micronaut.validation', artifactId: 'micronaut-validation' },
              { groupId: 'io.micronaut.sql', artifactId: 'micronaut-jdbc-hikari', scope: 'runtime' },
              { groupId: 'io.micronaut.jmx', artifactId: 'micronaut-jmx' },
              { groupId: 'io.micronaut.micrometer', artifactId: 'micronaut-micrometer-core' },
              { groupId: 'io.micronaut.micrometer', artifactId: 'micronaut-micrometer-registry-prometheus' },
              { groupId: 'io.micronaut.data', artifactId: 'micronaut-data-runtime' },
              {
                groupId: 'io.micronaut.data',
                artifactId: 'micronaut-data-hibernate-jpa',
                exclusions: [{ groupId: 'io.micronaut', artifactId: 'micronaut-jdbc' }],
              },
              {
                groupId: 'io.micronaut.data',
                artifactId: 'micronaut-data-jdbc',
                exclusions: [{ groupId: 'io.micronaut', artifactId: 'micronaut-jdbc' }],
              },
              { groupId: 'io.micronaut.email', artifactId: 'micronaut-email-javamail' },
              { groupId: 'io.micronaut.email', artifactId: 'micronaut-email-template' },
              { groupId: 'io.micronaut.rxjava3', artifactId: 'micronaut-rxjava3' },
              { groupId: 'io.micronaut.rxjava3', artifactId: 'micronaut-rxjava3-http-client' },
              { groupId: 'org.mapstruct', artifactId: 'mapstruct', versionRef: 'mapstruct' },
              // Runtime
              { groupId: 'org.yaml', artifactId: 'snakeyaml', scope: 'runtime' },
              { groupId: 'org.eclipse.angus', artifactId: 'angus-mail', scope: 'runtime' },
              // Provided / compileOnly
              { groupId: 'org.graalvm.nativeimage', artifactId: 'svm', scope: 'provided' },
              // Test
              { groupId: 'io.micronaut.test', artifactId: 'micronaut-test-junit5', scope: 'test' },
              { groupId: 'org.junit.jupiter', artifactId: 'junit-jupiter-engine', scope: 'test' },
              { groupId: 'org.junit.jupiter', artifactId: 'junit-jupiter-api', scope: 'test' },
              { groupId: 'org.assertj', artifactId: 'assertj-core', scope: 'test' },
            ],
          },
          {
            condition: application.databaseTypeSql,
            dependencies: [{ groupId: 'com.fasterxml.jackson.datatype', artifactId: 'jackson-datatype-hibernate6' }],
          },
          {
            condition: application.authenticationTypeJwt || application.authenticationTypeOauth2,
            dependencies: [{ groupId: 'io.micronaut.security', artifactId: 'micronaut-security-jwt' }],
          },
          {
            condition: application.authenticationTypeOauth2,
            dependencies: [{ groupId: 'io.micronaut.security', artifactId: 'micronaut-security-oauth2' }],
          },
          {
            condition: application.serviceDiscoveryType === 'eureka' || application.serviceDiscoveryType === 'consul',
            dependencies: [{ groupId: 'io.micronaut.discovery', artifactId: 'micronaut-discovery-client' }],
          },
          {
            condition: application.messageBroker === 'kafka' && !application.reactive,
            dependencies: [{ groupId: 'org.apache.kafka', artifactId: 'kafka-clients' }],
          },
          {
            condition: application.messageBroker === 'kafka' && application.reactive,
            dependencies: [{ groupId: 'io.projectreactor.kafka', artifactId: 'reactor-kafka' }],
          },
          {
            condition: application.messageBroker === 'kafka',
            dependencies: [{ groupId: 'org.testcontainers', artifactId: 'kafka', scope: 'test' }],
          },
          {
            condition: application.reactive,
            dependencies: [{ groupId: 'io.netty', artifactId: 'netty-tcnative-boringssl-static' }],
          },
          {
            condition: application.enableSwaggerCodegen,
            dependencies: [
              {
                groupId: 'org.openapitools',
                artifactId: 'jackson-databind-nullable',
                version: javaDependencies?.['jackson-databind-nullable'],
              },
            ],
          },
          {
            condition: application.databaseType === 'cassandra',
            dependencies: [
              { groupId: 'commons-codec', artifactId: 'commons-codec' },
              { groupId: 'org.lz4', artifactId: 'lz4-java' },
              { groupId: 'com.datastax.cassandra', artifactId: 'cassandra-driver-extras' },
              { groupId: 'com.datastax.cassandra', artifactId: 'cassandra-driver-mapping' },
            ],
          },
          {
            condition: application.databaseType === 'mongodb',
            dependencies: [
              { groupId: 'com.github.mongobee', artifactId: 'mongobee' },
              { groupId: 'de.flapdoodle.embed', artifactId: 'de.flapdoodle.embed.mongo', scope: 'test' },
            ],
          },
          {
            condition: application.databaseType === 'couchbase',
            dependencies: [
              { groupId: 'com.github.differentway', artifactId: 'couchmove' },
              { groupId: 'com.couchbase.client', artifactId: 'java-client' },
              { groupId: 'com.couchbase.client', artifactId: 'encryption' },
              { groupId: 'org.testcontainers', artifactId: 'couchbase', scope: 'test' },
            ],
          },
          {
            condition: application.cacheProvider !== 'no',
            dependencies: [
              { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core' },
              { groupId: 'javax.cache', artifactId: 'cache-api' },
            ],
          },
          {
            condition: application.applicationTypeGateway,
            dependencies: [
              { groupId: 'org.apache.httpcomponents', artifactId: 'httpclient' },
              { groupId: 'commons-codec', artifactId: 'commons-codec' },
              { groupId: 'com.github.vladimir-bukhtoyarov', artifactId: 'bucket4j-core' },
              { groupId: 'com.github.vladimir-bukhtoyarov', artifactId: 'bucket4j-jcache' },
            ],
          },
          {
            condition: application.cacheProvider === 'hazelcast',
            dependencies: [
              { groupId: 'com.hazelcast', artifactId: 'hazelcast' },
              { groupId: 'com.hazelcast', artifactId: 'hazelcast-spring' },
            ],
          },
          {
            condition: application.cacheProvider === 'hazelcast' && application.enableHibernateCache,
            dependencies: [{ groupId: 'com.hazelcast', artifactId: 'hazelcast-hibernate53' }],
          },
          {
            condition: application.cacheProvider === 'infinispan',
            dependencies: [
              { groupId: 'org.infinispan', artifactId: 'infinispan-hibernate-cache-v53' },
              { groupId: 'org.infinispan', artifactId: 'infinispan-spring-boot-starter-embedded' },
              { groupId: 'org.infinispan', artifactId: 'infinispan-core' },
              { groupId: 'org.infinispan', artifactId: 'infinispan-jcache' },
              {
                groupId: 'org.infinispan',
                artifactId: 'infinispan-cloud',
                exclusions: [{ groupId: 'io.undertow', artifactId: 'undertow-core' }],
              },
            ],
          },
          {
            condition: application.cacheProvider === 'memcached',
            dependencies: [
              { groupId: 'com.google.code.simple-spring-memcached', artifactId: 'spring-cache' },
              { groupId: 'com.google.code.simple-spring-memcached', artifactId: 'xmemcached-provider' },
              { groupId: 'com.googlecode.xmemcached', artifactId: 'xmemcached' },
            ],
          },
          {
            condition: application.cacheProvider === 'redis',
            dependencies: [
              { groupId: 'org.redisson', artifactId: 'redisson', version: javaDependencies?.redisson },
              { groupId: 'org.testcontainers', artifactId: 'testcontainers', scope: 'test' },
            ],
          },
          {
            condition: application.cacheProvider === 'ehcache',
            dependencies: [
              { groupId: 'org.ehcache', artifactId: 'ehcache' },
              { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-ehcache' },
            ],
          },
          {
            condition: application.cacheProvider === 'caffeine',
            dependencies: [{ groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-caffeine' }],
          },
        );

        // Gradle-specific annotation processors (handled via annotationProcessorPaths in Maven pom.xml template)
        if (application.buildToolGradle) {
          source.addGradleDependencies([
            { groupId: 'io.micronaut.validation', artifactId: 'micronaut-validation-processor', scope: 'annotationProcessor' },
            { groupId: 'io.micronaut.openapi', artifactId: 'micronaut-openapi', scope: 'annotationProcessor' },
            { groupId: 'io.micronaut', artifactId: 'micronaut-inject-java', scope: 'annotationProcessor' },
            // micronaut-data-processor is needed for both main and test annotation processing in Gradle
            { groupId: 'io.micronaut.data', artifactId: 'micronaut-data-processor', scope: 'annotationProcessor' },
            { groupId: 'io.micronaut', artifactId: 'micronaut-http-validation', scope: 'annotationProcessor' },
            {
              groupId: 'org.mapstruct',
              artifactId: 'mapstruct-processor',
              version: javaDependencies?.mapstruct,
              scope: 'annotationProcessor',
            },
            { groupId: 'io.micronaut.data', artifactId: 'micronaut-data-processor', scope: 'testAnnotationProcessor' },
            // jaxb-runtime is needed for test annotation processing always
            {
              groupId: 'org.glassfish.jaxb',
              artifactId: 'jaxb-runtime',
              version: javaDependencies?.['jaxb-runtime'],
              scope: 'testAnnotationProcessor',
            },
          ]);

          // SQL Gradle-specific dependencies (different group IDs from Maven equivalents)
          if (application.databaseTypeSql) {
            source.addGradleDependencies([
              { groupId: 'org.hibernate', artifactId: 'hibernate-core', version: hibernateVersion, scope: 'implementation' },
              { groupId: 'com.zaxxer', artifactId: 'HikariCP', scope: 'implementation' },
              {
                groupId: 'org.hibernate',
                artifactId: 'hibernate-jpamodelgen',
                version: hibernateVersion,
                scope: 'annotationProcessor',
              },
              // jaxb-runtime is also needed as annotationProcessor for SQL main sources
              {
                groupId: 'org.glassfish.jaxb',
                artifactId: 'jaxb-runtime',
                version: javaDependencies?.['jaxb-runtime'],
                scope: 'annotationProcessor',
              },
            ]);
          }

          // Gradle-specific hibernate-jcache (different group ID from Maven org.hibernate.orm)
          if (application.enableHibernateCache && ['redis', 'ehcache', 'caffeine'].includes(application.cacheProvider)) {
            source.addGradleDependency({
              groupId: 'org.hibernate',
              artifactId: 'hibernate-jcache',
              version: hibernateVersion,
              scope: 'implementation',
            });
          }

          // Gradle database drivers (handled separately for Maven in sqlDependencies via getDatabaseDriverForDatabase)
          if (application.databaseTypeSql) {
            const dbDriver = getDatabaseDriverForDatabase(application.prodDatabaseType);
            if (dbDriver?.jdbc) {
              source.addGradleDependency({ ...dbDriver.jdbc, scope: 'implementation' });
            }
          }
          if (application.devDatabaseType === 'oracle' || application.prodDatabaseType === 'oracle') {
            source.addGradleDependency({ groupId: 'com.oracle.ojdbc', artifactId: 'ojdbc8', scope: 'implementation' });
          }
        }

        // Maven database driver (handled via getDatabaseDriverForDatabase)
        if (application.buildToolMaven && application.databaseTypeSql) {
          source.addMavenDependency?.(getDatabaseDriverForDatabase(application.prodDatabaseType).jdbc);
        }
      },
    });
  }
}
