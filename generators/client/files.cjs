const {
  ANGULAR_DIR,
  REACT_DIR,
  CLIENT_MAIN_SRC_DIR: MAIN_SRC_DIR,
  CLIENT_TEST_SRC_DIR,
  CLIENT_WEBPACK_DIR,
} = require('generator-jhipster/generators/generator-constants');

const angularFiles = {
  angularMain: [
    {
      condition: generator => generator.clientFramework === 'angularX',
      templates: [
        /*
        {
          file: 'angular/src/main/webapp/content/images/jhipster_family_member_4.svg',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4.svg`,
        },
        {
          file: 'angular/src/main/webapp/content/images/jhipster_family_member_4_head-192.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-192.png`,
        },
        {
          file: 'angular/src/main/webapp/content/images/jhipster_family_member_4_head-256.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-256.png`,
        },
        {
          file: 'angular/src/main/webapp/content/images/jhipster_family_member_4_head-384.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-384.png`,
        },
        {
          file: 'angular/src/main/webapp/content/images/jhipster_family_member_4_head-512.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-512.png`,
        },
        {
          file: 'angular/src/main/webapp/manifest.webapp',
          renameTo: () => `${MAIN_SRC_DIR}manifest.webapp`,
        },
        {
          file: 'angular/home/home.scss',
          method: 'copy',
          renameTo: () => `${ANGULAR_DIR}home/home.scss`,
        },
        // Custom home component to show micronaut-ness
        {
          file: 'angular/home/home.component.html',
          method: 'processHtml',
          renameTo: () => `${ANGULAR_DIR}home/home.component.html`,
        },
        // Remove Spring Security comment
        {
          file: 'angular/src/main/webapp/app/core/login/login.service.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}core/login/login.service.ts`,
        },
        // profiles response returns a hyphenated key
        {
          file: 'angular/src/main/webapp/app/layouts/profiles/profile.service.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}layouts/profiles/profile.service.ts`,
        },
        // custom auth since we don't return same props expected
        {
          file: 'angular/src/main/webapp/app/core/auth/auth-jwt.service.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}core/auth/auth-jwt.service.ts`,
        },
        */
        // Admin config changes, since we store config in a flat map
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.component.html',
          method: 'processHtml',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.component.html`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.component.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.component.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.filter.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.filter.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.module.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.module.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.route.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.route.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.service.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.service.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.component.spec.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.component.spec.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/configuration/configuration.service.spec.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.service.spec.ts`,
        },
        /*
        // Admin health changes
        {
          file: 'angular/src/main/webapp/app/admin/health/health.component.html',
          method: 'processHtml',
          renameTo: () => `${ANGULAR_DIR}admin/health/health.component.html`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/health/health.component.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/health/health.component.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/health/health.service.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/health/health.service.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/health/health-modal.component.html',
          method: 'processHtml',
          renameTo: () => `${ANGULAR_DIR}admin/health/health-modal.component.html`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/health/health-modal.component.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/health/health-modal.component.ts`,
        },
        {
          file: 'angular/src/test/javascript/spec/app/admin/health/health.component.spec.ts',
          method: 'processJs',
          renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/admin/health/health.component.spec.ts`,
        },
        // Admin metric changes
        {
          file: 'angular/src/main/webapp/app/admin/metrics/metrics.component.html',
          method: 'processHtml',
          renameTo: () => `${ANGULAR_DIR}admin/metrics/metrics.component.html`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/metrics/metrics.component.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/metrics/metrics.component.ts`,
        },
        {
          file: 'angular/src/main/webapp/app/admin/metrics/metrics.service.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}admin/metrics/metrics.service.ts`,
        },
        {
          file: 'angular/src/test/javascript/spec/app/admin/metrics/metrics.service.spec.ts',
          method: 'processJs',
          renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/admin/metrics/metrics.service.spec.ts`,
        },
        // Layouts changes to override nav bar elements for admin, includes stock entities TODO remove them later?
        {
          file: 'angular/src/main/webapp/app/layouts/navbar/navbar.component.html',
          method: 'processHtml',
          renameTo: () => `${ANGULAR_DIR}layouts/navbar/navbar.component.html`,
        },
        {
          file: 'angular/src/main/webapp/app/layouts/navbar/navbar.component.ts',
          method: 'processJs',
          renameTo: () => `${ANGULAR_DIR}layouts/navbar/navbar.component.ts`,
        },
        {
          file: 'angular/webpack/webpack.dev.js',
          method: 'processJs',
          useBluePrint: true,
          renameTo: () => `${CLIENT_WEBPACK_DIR}/webpack.dev.js`,
        },
        */
      ],
    },
  ],
};

const reactFiles = {
  reactMain: [
    {
      condition: generator => generator.clientFramework === 'react',
      templates: [
        {
          file: 'react/src/main/webapp/content/images/jhipster_family_member_4.svg',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4.svg`,
        },
        {
          file: 'react/src/main/webapp/content/images/jhipster_family_member_4_head-192.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-192.png`,
        },
        {
          file: 'react/src/main/webapp/content/images/jhipster_family_member_4_head-256.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-256.png`,
        },
        {
          file: 'react/src/main/webapp/content/images/jhipster_family_member_4_head-384.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-384.png`,
        },
        {
          file: 'react/src/main/webapp/content/images/jhipster_family_member_4_head-512.png',
          method: 'copy',
          renameTo: () => `${MAIN_SRC_DIR}content/images/jhipster_family_member_4_head-512.png`,
        },
        {
          file: 'react/src/main/webapp/manifest.webapp',
          renameTo: () => `${MAIN_SRC_DIR}manifest.webapp`,
        },
        {
          file: 'react/home/home.scss',
          method: 'copy',
          renameTo: () => `${REACT_DIR}modules/home/home.scss`,
        },
        {
          file: 'react/home/home.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}modules/home/home.tsx`,
        },
        // custom auth since we don't return same props expected
        {
          file: 'react/src/main/webapp/app/shared/reducers/authentication.ts',
          method: 'processJs',
          renameTo: () => `${REACT_DIR}shared/reducers/authentication.ts`,
        },
        // profiles response returns a hyphenated key
        {
          file: 'react/src/main/webapp/app/shared/reducers/application-profile.ts',
          method: 'processJs',
          renameTo: () => `${REACT_DIR}shared/reducers/application-profile.ts`,
        },
        // Remove database menu item (unsupported)
        {
          file: 'react/src/main/webapp/app/shared/layout/menus/admin.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}shared/layout/menus/admin.tsx`,
        },
        // Remove database menu item (unsupported)
        {
          file: 'react/src/main/webapp/app/shared/layout/header/header.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}shared/layout/header/header.tsx`,
        },
        // Support Micronaut info/configuration endpoint
        {
          file: 'react/src/main/webapp/app/modules/administration/configuration/configuration.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}modules/administration/configuration/configuration.tsx`,
        },
        // Support Micronaut health endpoint
        {
          file: 'react/src/main/webapp/app/modules/administration/health/health.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}modules/administration/health/health.tsx`,
        },
        {
          file: 'react/src/main/webapp/app/modules/administration/health/health-modal.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}modules/administration/health/health-modal.tsx`,
        },
        {
          file: 'react/src/main/webapp/app/modules/login/logout.tsx',
          method: 'processJsx',
          renameTo: () => `${REACT_DIR}modules/login/logout.tsx`,
        },
        {
          file: 'react/src/test/javascript/spec/app/modules/administration/administration.reducer.spec.ts',
          method: 'processJs',
          renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/modules/administration/administration.reducer.spec.ts`,
        },
        {
          file: 'react/src/test/javascript/spec/app/shared/reducers/application-profile.spec.ts',
          method: 'processJs',
          renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/shared/reducers/application-profile.spec.ts`,
        },
        {
          file: 'react/src/test/javascript/spec/app/shared/reducers/authentication.spec.ts',
          method: 'processJs',
          renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/shared/reducers/authentication.spec.ts`,
        },
        {
          file: 'react/webpack/webpack.dev.js',
          method: 'processJs',
          useBluePrint: true,
          renameTo: () => `${CLIENT_WEBPACK_DIR}/webpack.dev.js`,
        },
      ],
    },
    {
      condition: generator => generator.protractorTests && generator.clientFramework === 'react',
      templates: [
        {
          file: 'react/src/test/javascript/e2e/modules/administration/administration.spec.ts',
          method: 'processJs',
          renameTo: () => `${CLIENT_TEST_SRC_DIR}e2e/modules/administration/administration.spec.ts`,
        },
      ],
    },
  ],
};

module.exports = {
  angularFiles,
  reactFiles,
};
