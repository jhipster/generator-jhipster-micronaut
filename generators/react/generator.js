import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeReactForMicronaut({ application: { authenticationTypeJwt, clientSrcDir } }) {
        // health api
        this.editFile(`${clientSrcDir}app/modules/administration/health/health.tsx`, content =>
          content.replaceAll('components', 'details'),
        );

        // active-profiles api
        this.editFile(`${clientSrcDir}app/shared/reducers/application-profile.ts`, content =>
          content.replaceAll('.activeProfiles', "['active-profiles']"),
        );
        this.editFile(`${clientSrcDir}app/shared/reducers/application-profile.spec.ts`, content =>
          content.replaceAll('activeProfiles', "['active-profiles']"),
        );
        this.editFile(`${clientSrcDir}app/modules/administration/administration.reducer.spec.ts`, content =>
          content.replaceAll('activeProfiles', "['active-profiles']"),
        );

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile(`${clientSrcDir}app/shared/reducers/authentication.spec.ts`, content =>
            content.replaceAll("headers: { authorization: 'Bearer ", "data: { access_token: '"),
          );
          this.editFile(`${clientSrcDir}app/shared/reducers/authentication.ts`, content =>
            content
              .replace('const bearerToken = response?.headers?.authorization;', 'const jwt = response?.data?.access_token;')
              .replace("bearerToken && bearerToken.slice(0, 7) === 'Bearer '", 'jwt')
              .replace('const jwt = bearerToken.slice(7, bearerToken.length);', ''),
          );
        }
      },
    });
  }
}
