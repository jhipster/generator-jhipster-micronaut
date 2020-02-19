const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const ANGULAR_DIR = jhipsterConstants.ANGULAR_DIR;
const REACT_DIR = jhipsterConstants.REACT_DIR;

const CLIENT_TEST_SRC_DIR = jhipsterConstants.CLIENT_TEST_SRC_DIR;

const clientFiles = {
    angularMain: [
        {
            condition: generator => generator.clientFramework === 'angularX',
            templates: [
                // Custom home component to show micronaut-ness
                {
                    file: 'angular/home/home.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}home/home.component.html`
                },
                // custom auth since we don't return same props expected
                {
                    file: 'angular/src/main/webapp/app/core/auth/auth-jwt.service.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}core/auth/auth-jwt.service.ts`
                },
                // Admin config changes, since we store config in a flat map
                {
                    file: 'angular/src/main/webapp/app/admin/configuration/configuration.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.component.html`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/configuration/configuration.component.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.component.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/configuration/configuration.filter.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.filter.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/configuration/configuration.module.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.module.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/configuration/configuration.route.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.route.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/configuration/configuration.service.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/configuration/configuration.service.ts`
                },
                {
                    file: 'angular/src/test/javascript/spec/app/admin/configuration/configuration.component.spec.ts',
                    method: 'processJs',
                    renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/admin/configuration/configuration.component.spec.ts`
                },
                {
                    file: 'angular/src/test/javascript/spec/app/admin/configuration/configuration.service.spec.ts',
                    method: 'processJs',
                    renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/admin/configuration/configuration.service.spec.ts`
                },
                // Admin health changes
                {
                    file: 'angular/src/main/webapp/app/admin/health/health.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}admin/health/health.component.html`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/health/health.component.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/health/health.component.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/health/health.service.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/health/health.service.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/health/health-modal.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}admin/health/health-modal.component.html`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/health/health-modal.component.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/health/health-modal.component.ts`
                },
                {
                    file: 'angular/src/test/javascript/spec/app/admin/health/health.component.spec.ts',
                    method: 'processJs',
                    renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/admin/health/health.component.spec.ts`
                },
                // Admin metric changes
                {
                    file: 'angular/src/main/webapp/app/admin/metrics/metrics.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}admin/metrics/metrics.component.html`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/metrics/metrics.component.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/metrics/metrics.component.ts`
                },
                {
                    file: 'angular/src/main/webapp/app/admin/metrics/metrics.service.ts',
                    method: 'processJs',
                    renameTo: () => `${ANGULAR_DIR}admin/metrics/metrics.service.ts`
                },
                {
                    file: 'angular/src/test/javascript/spec/app/admin/metrics/metrics.service.spec.ts',
                    method: 'processJs',
                    renameTo: () => `${CLIENT_TEST_SRC_DIR}spec/app/admin/metrics/metrics.service.spec.ts`
                },
                // Layouts changes to override nav bar elements for admin, includes stock entities TODO remove them later?
                {
                    file: 'angular/src/main/webapp/app/layouts/navbar/navbar.component.html',
                    method: 'processHtml',
                    renameTo: () => `${ANGULAR_DIR}layouts/navbar/navbar.component.html`
                }
            ]
        }
    ],
    reactMain: [
        {
            condition: generator => generator.clientFramework === 'react',
            templates: [
                {
                    file: 'react/home/home.tsx',
                    method: 'processJsx',
                    renameTo: () => `${REACT_DIR}modules/home/home.tsx`
                }
            ]
        }
    ]
};

function writeFiles() {
    return {
        overrideFiles() {
            this.writeFilesToDisk(clientFiles, this, false);
        }
    };
}

module.exports = {
    writeFiles
};
