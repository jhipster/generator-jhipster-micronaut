import { clientApplicationTemplatesBlock } from 'generator-jhipster/generators/client/support';

export const angularFiles = {
  angularMain: [
    clientApplicationTemplatesBlock({
      relativePath: 'admin/configuration/',
      templates: ['configuration.filter.ts'],
    }),
  ],
};
