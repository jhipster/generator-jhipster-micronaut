import { clientApplicationTemplatesBlock } from 'generator-jhipster/generators/client/support';

export const angularFiles = {
  angularMain: [
    clientApplicationTemplatesBlock({
      relativePath: 'admin/configuration/',
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
    }),
  ],
};
