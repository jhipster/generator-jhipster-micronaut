import { TEMPLATES_WEBAPP_SOURCES_DIR } from 'generator-jhipster';

export const angularFiles = {
  angularMain: [
    {
      path: `${TEMPLATES_WEBAPP_SOURCES_DIR}app/admin/configuration/`,
      templates: [
        'configuration.component.html',
        'configuration.component.ts',
        'configuration.filter.ts',
        'configuration.module.ts',
        'configuration.route.ts',
        'configuration.service.ts',
        'configuration.component.spec.ts',
        'configuration.service.spec.ts',
      ],
    },
  ],
};
