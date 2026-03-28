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
          source.addMavenDependency?.(getDatabaseDriverForDatabase(application.prodDatabaseType).jdbc);
        }
      },
      addGradleDependencies({ application, source }) {
        if (!application.buildToolGradle) return;
        const { javaDependencies, javaManagedProperties } = application;
        const hibernateVersion = javaManagedProperties?.['hibernate.version'];

        source.addGradleDependencies([
          // Annotation processors
          { groupId: 'io.micronaut.validation', artifactId: 'micronaut-validation-processor', scope: 'annotationProcessor' },
          { groupId: 'io.micronaut.openapi', artifactId: 'micronaut-openapi', scope: 'annotationProcessor' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-inject-java', scope: 'annotationProcessor' },
          { groupId: 'io.micronaut.data', artifactId: 'micronaut-data-processor', scope: 'annotationProcessor' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-http-validation', scope: 'annotationProcessor' },
          {
            groupId: 'org.mapstruct',
            artifactId: 'mapstruct-processor',
            version: javaDependencies?.mapstruct,
            scope: 'annotationProcessor',
          },
          // Implementation
          { groupId: 'ch.qos.logback', artifactId: 'logback-classic', scope: 'implementation' },
          { groupId: 'io.micrometer', artifactId: 'micrometer-registry-prometheus', scope: 'implementation' },
          { groupId: 'com.fasterxml.jackson.core', artifactId: 'jackson-annotations', scope: 'implementation' },
          { groupId: 'com.fasterxml.jackson.core', artifactId: 'jackson-databind', scope: 'implementation' },
          { groupId: 'com.fasterxml.jackson.datatype', artifactId: 'jackson-datatype-jsr310', scope: 'implementation' },
          { groupId: 'com.fasterxml.jackson.dataformat', artifactId: 'jackson-dataformat-yaml', scope: 'implementation' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-jackson-databind', scope: 'implementation' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-inject', scope: 'implementation' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-http-client', scope: 'implementation' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-http-server-netty', scope: 'implementation' },
          { groupId: 'io.micronaut', artifactId: 'micronaut-management', scope: 'implementation' },
          { groupId: 'io.micronaut.security', artifactId: 'micronaut-security-jwt', scope: 'implementation' },
          { groupId: 'io.micronaut.views', artifactId: 'micronaut-views-thymeleaf', scope: 'implementation' },
          { groupId: 'io.micronaut.validation', artifactId: 'micronaut-validation', scope: 'implementation' },
          { groupId: 'io.micronaut.sql', artifactId: 'micronaut-jdbc-hikari', scope: 'implementation' },
          { groupId: 'io.micronaut.jmx', artifactId: 'micronaut-jmx', scope: 'implementation' },
          { groupId: 'io.micronaut.micrometer', artifactId: 'micronaut-micrometer-core', scope: 'implementation' },
          { groupId: 'io.micronaut.micrometer', artifactId: 'micronaut-micrometer-registry-prometheus', scope: 'implementation' },
          { groupId: 'io.micronaut.data', artifactId: 'micronaut-data-runtime', scope: 'implementation' },
          {
            groupId: 'io.micronaut.data',
            artifactId: 'micronaut-data-hibernate-jpa',
            scope: 'implementation',
            closure: ["    exclude group: 'io.micronaut', module: 'micronaut-jdbc'"],
          },
          {
            groupId: 'io.micronaut.data',
            artifactId: 'micronaut-data-jdbc',
            scope: 'implementation',
            closure: ["    exclude group: 'io.micronaut', module: 'micronaut-jdbc'"],
          },
          { groupId: 'io.micronaut.email', artifactId: 'micronaut-email-javamail', scope: 'implementation' },
          { groupId: 'io.micronaut.email', artifactId: 'micronaut-email-template', scope: 'implementation' },
          { groupId: 'io.micronaut.rxjava3', artifactId: 'micronaut-rxjava3', scope: 'implementation' },
          { groupId: 'io.micronaut.rxjava3', artifactId: 'micronaut-rxjava3-http-client', scope: 'implementation' },
          { groupId: 'org.mapstruct', artifactId: 'mapstruct', version: javaDependencies?.mapstruct, scope: 'implementation' },
          // Runtime
          { groupId: 'org.yaml', artifactId: 'snakeyaml', scope: 'runtimeOnly' },
          { groupId: 'org.eclipse.angus', artifactId: 'angus-mail', scope: 'runtimeOnly' },
          // CompileOnly
          { groupId: 'org.graalvm.nativeimage', artifactId: 'svm', scope: 'compileOnly' },
          // Test annotation processors
          { groupId: 'io.micronaut.data', artifactId: 'micronaut-data-processor', scope: 'testAnnotationProcessor' },
          {
            groupId: 'org.glassfish.jaxb',
            artifactId: 'jaxb-runtime',
            version: javaDependencies?.['jaxb-runtime'],
            scope: 'testAnnotationProcessor',
          },
          // Test implementation
          { groupId: 'io.micronaut.test', artifactId: 'micronaut-test-junit5', scope: 'testImplementation' },
          { groupId: 'org.junit.jupiter', artifactId: 'junit-jupiter-engine', scope: 'testImplementation' },
          { groupId: 'org.junit.jupiter', artifactId: 'junit-jupiter-api', scope: 'testImplementation' },
          { groupId: 'org.assertj', artifactId: 'assertj-core', scope: 'testImplementation' },
          {
            groupId: 'com.tngtech.archunit',
            artifactId: 'archunit-junit5-api',
            version: javaDependencies?.['archunit-junit5'],
            scope: 'testImplementation',
          },
          // Test runtime
          {
            groupId: 'com.tngtech.archunit',
            artifactId: 'archunit-junit5-engine',
            version: javaDependencies?.['archunit-junit5'],
            scope: 'testRuntimeOnly',
          },
        ]);

        if (application.databaseTypeSql) {
          source.addGradleDependencies([
            {
              groupId: 'com.fasterxml.jackson.datatype',
              artifactId: 'jackson-datatype-hibernate6',
              scope: 'implementation',
            },
            { groupId: 'org.hibernate', artifactId: 'hibernate-core', version: hibernateVersion, scope: 'implementation' },
            { groupId: 'com.zaxxer', artifactId: 'HikariCP', scope: 'implementation' },
            {
              groupId: 'org.hibernate',
              artifactId: 'hibernate-jpamodelgen',
              version: hibernateVersion,
              scope: 'annotationProcessor',
            },
            {
              groupId: 'org.glassfish.jaxb',
              artifactId: 'jaxb-runtime',
              version: javaDependencies?.['jaxb-runtime'],
              scope: 'annotationProcessor',
            },
          ]);
        }

        if (application.applicationTypeGateway) {
          source.addGradleDependencies([
            { groupId: 'org.apache.httpcomponents', artifactId: 'httpclient', scope: 'implementation' },
            { groupId: 'commons-codec', artifactId: 'commons-codec', scope: 'implementation' },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core', scope: 'implementation' },
            { groupId: 'javax.cache', artifactId: 'cache-api', scope: 'implementation' },
            { groupId: 'com.github.vladimir-bukhtoyarov', artifactId: 'bucket4j-core', scope: 'implementation' },
            { groupId: 'com.github.vladimir-bukhtoyarov', artifactId: 'bucket4j-jcache', scope: 'implementation' },
          ]);
        }

        if (application.cacheProvider === 'hazelcast') {
          source.addGradleDependencies([
            { groupId: 'com.hazelcast', artifactId: 'hazelcast', scope: 'implementation' },
            { groupId: 'com.hazelcast', artifactId: 'hazelcast-spring', scope: 'implementation' },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core', scope: 'implementation' },
            { groupId: 'javax.cache', artifactId: 'cache-api', scope: 'implementation' },
          ]);
          if (application.enableHibernateCache) {
            source.addGradleDependency({ groupId: 'com.hazelcast', artifactId: 'hazelcast-hibernate53', scope: 'implementation' });
          }
        }

        if (application.cacheProvider === 'infinispan') {
          source.addGradleDependencies([
            { groupId: 'org.infinispan', artifactId: 'infinispan-hibernate-cache-v53', scope: 'implementation' },
            { groupId: 'org.infinispan', artifactId: 'infinispan-spring-boot-starter-embedded', scope: 'implementation' },
            { groupId: 'org.infinispan', artifactId: 'infinispan-core', scope: 'implementation' },
            { groupId: 'org.infinispan', artifactId: 'infinispan-jcache', scope: 'implementation' },
            {
              groupId: 'org.infinispan',
              artifactId: 'infinispan-cloud',
              scope: 'implementation',
              closure: ["    exclude module: 'undertow-core'"],
            },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core', scope: 'implementation' },
            { groupId: 'javax.cache', artifactId: 'cache-api', scope: 'implementation' },
          ]);
        }

        if (application.cacheProvider === 'memcached') {
          source.addGradleDependencies([
            { groupId: 'com.google.code.simple-spring-memcached', artifactId: 'spring-cache', scope: 'implementation' },
            { groupId: 'com.google.code.simple-spring-memcached', artifactId: 'xmemcached-provider', scope: 'implementation' },
            { groupId: 'com.googlecode.xmemcached', artifactId: 'xmemcached', scope: 'implementation' },
          ]);
        }

        if (application.cacheProvider === 'redis') {
          source.addGradleDependencies([
            { groupId: 'org.redisson', artifactId: 'redisson', scope: 'implementation' },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core', scope: 'implementation' },
            { groupId: 'javax.cache', artifactId: 'cache-api', scope: 'implementation' },
            { groupId: 'org.testcontainers', artifactId: 'testcontainers', scope: 'testImplementation' },
          ]);
          if (application.enableHibernateCache) {
            source.addGradleDependency({
              groupId: 'org.hibernate',
              artifactId: 'hibernate-jcache',
              version: hibernateVersion,
              scope: 'implementation',
            });
          }
        }

        if (application.cacheProvider === 'ehcache') {
          source.addGradleDependencies([
            { groupId: 'org.ehcache', artifactId: 'ehcache', scope: 'implementation' },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-ehcache', scope: 'implementation' },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core', scope: 'implementation' },
            { groupId: 'javax.cache', artifactId: 'cache-api', scope: 'implementation' },
          ]);
          if (application.enableHibernateCache) {
            source.addGradleDependency({
              groupId: 'org.hibernate',
              artifactId: 'hibernate-jcache',
              version: hibernateVersion,
              scope: 'implementation',
            });
          }
        }

        if (application.cacheProvider === 'caffeine') {
          source.addGradleDependencies([
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-caffeine', scope: 'implementation' },
            { groupId: 'io.micronaut.cache', artifactId: 'micronaut-cache-core', scope: 'implementation' },
            { groupId: 'javax.cache', artifactId: 'cache-api', scope: 'implementation' },
          ]);
          if (application.enableHibernateCache) {
            source.addGradleDependency({ groupId: 'org.hibernate', artifactId: 'hibernate-jcache', scope: 'implementation' });
          }
        }

        if (application.authenticationTypeOauth2) {
          source.addGradleDependency({
            groupId: 'io.micronaut.security',
            artifactId: 'micronaut-security-oauth2',
            scope: 'implementation',
          });
        }

        if (application.serviceDiscoveryType === 'eureka' || application.serviceDiscoveryType === 'consul') {
          source.addGradleDependency({
            groupId: 'io.micronaut.discovery',
            artifactId: 'micronaut-discovery-client',
            scope: 'implementation',
          });
        }

        if (application.messageBroker === 'kafka') {
          if (!application.reactive) {
            source.addGradleDependency({ groupId: 'org.apache.kafka', artifactId: 'kafka-clients', scope: 'implementation' });
          } else {
            source.addGradleDependency({ groupId: 'io.projectreactor.kafka', artifactId: 'reactor-kafka', scope: 'implementation' });
          }
          source.addGradleDependency({ groupId: 'org.testcontainers', artifactId: 'kafka', scope: 'testImplementation' });
        }

        if (application.reactive) {
          source.addGradleDependency({ groupId: 'io.netty', artifactId: 'netty-tcnative-boringssl-static', scope: 'implementation' });
        }

        if (application.databaseType === 'cassandra') {
          source.addGradleDependencies([
            { groupId: 'commons-codec', artifactId: 'commons-codec', scope: 'implementation' },
            { groupId: 'org.lz4', artifactId: 'lz4-java', scope: 'implementation' },
            { groupId: 'com.datastax.cassandra', artifactId: 'cassandra-driver-extras', scope: 'implementation' },
            { groupId: 'com.datastax.cassandra', artifactId: 'cassandra-driver-mapping', scope: 'implementation' },
          ]);
        }

        if (application.enableSwaggerCodegen) {
          source.addGradleDependency({
            groupId: 'org.openapitools',
            artifactId: 'jackson-databind-nullable',
            version: javaDependencies?.['jackson-databind-nullable'],
            scope: 'implementation',
          });
        }

        if (application.databaseType === 'mongodb') {
          source.addGradleDependencies([
            { groupId: 'com.github.mongobee', artifactId: 'mongobee', scope: 'implementation' },
            { groupId: 'de.flapdoodle.embed', artifactId: 'de.flapdoodle.embed.mongo', scope: 'testImplementation' },
          ]);
        }

        if (application.databaseType === 'couchbase') {
          source.addGradleDependencies([
            { groupId: 'com.github.differentway', artifactId: 'couchmove', scope: 'implementation' },
            { groupId: 'com.couchbase.client', artifactId: 'java-client', scope: 'implementation' },
            { groupId: 'com.couchbase.client', artifactId: 'encryption', scope: 'implementation' },
            { groupId: 'org.testcontainers', artifactId: 'couchbase', scope: 'testImplementation' },
          ]);
        }

        if (application.prodDatabaseType === 'mysql') {
          source.addGradleDependency({ groupId: 'mysql', artifactId: 'mysql-connector-java', scope: 'implementation' });
        }
        if (application.prodDatabaseType === 'postgresql') {
          source.addGradleDependency({ groupId: 'org.postgresql', artifactId: 'postgresql', scope: 'implementation' });
        }
        if (application.prodDatabaseType === 'mariadb') {
          source.addGradleDependency({ groupId: 'org.mariadb.jdbc', artifactId: 'mariadb-java-client', scope: 'implementation' });
        }
        if (application.prodDatabaseType === 'mssql') {
          source.addGradleDependency({ groupId: 'com.microsoft.sqlserver', artifactId: 'mssql-jdbc', scope: 'implementation' });
        }
        if (application.devDatabaseType === 'oracle' || application.prodDatabaseType === 'oracle') {
          source.addGradleDependency({ groupId: 'com.oracle.ojdbc', artifactId: 'ojdbc8', scope: 'implementation' });
        }
      },
    });
  }
}
