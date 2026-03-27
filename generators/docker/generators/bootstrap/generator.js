import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { getJdbcUrl } from 'generator-jhipster/generators/spring-boot/generators/data-relational/support';
import { mutateData } from 'generator-jhipster/utils';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,

      sbsBlueprint: true,
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      customizeDockerServices({ application }) {
        application.dockerServices.push('app');
      },
    });
  }

  get [BaseApplicationGenerator.POST_PREPARING]() {
    return this.asPostPreparingTaskGroup({
      dockerEnvironment({ application }) {
        const {
          dockerApplicationEnvironment,
          databaseTypeSql,
          prodDatabaseType,
          prodDatabaseTypeMysql,
          prodDatabaseTypeMariadb,
          baseName,
        } = application;

        mutateData(dockerApplicationEnvironment, {
          _JAVA_OPTIONS: '-Xmx512m -Xms256m',
          MICRONAUT_ENVIRONMENTS: 'prod',
        });
        if (databaseTypeSql) {
          const databaseName = prodDatabaseTypeMysql || prodDatabaseTypeMariadb ? baseName.toLowerCase() : baseName;
          const jdbcUrl = getJdbcUrl(prodDatabaseType, {
            hostname: prodDatabaseType,
            databaseName,
          });

          mutateData(dockerApplicationEnvironment, {
            JDBC_URL: jdbcUrl,
            JDBC_USERNAME: application.prodDatabaseUsername,
            JDBC_PASSWORD: application.prodDatabasePassword,
          });
        }
        if (application.authenticationTypeOauth2) {
          const clientId = application.applicationTypeMicroservice ? 'internal' : 'web_app';
          mutateData(dockerApplicationEnvironment, {
            MICRONAUT_SECURITY_OAUTH2_CLIENTS_OIDC_OPENID_ISSUER: 'http://keycloak:9080/realms/jhipster',
            MICRONAUT_SECURITY_OAUTH2_CLIENTS_OIDC_CLIENT_ID: clientId,
            MICRONAUT_SECURITY_OAUTH2_CLIENTS_OIDC_CLIENT_SECRET: clientId,
          });
        }
      },
    });
  }
}
