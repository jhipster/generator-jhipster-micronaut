import { clientSrcTemplatesBlock } from 'generator-jhipster/generators/client/support';

export const commonFiles = {
  layoutFiles: [
    clientSrcTemplatesBlock({
      transform: false,
      relativePath: 'content/images/',
      templates: [
        'jhipster_family_member_4.svg',
        'jhipster_family_member_4_head-192.png',
        'jhipster_family_member_4_head-256.png',
        'jhipster_family_member_4_head-384.png',
        'jhipster_family_member_4.svg',
        'jhipster_family_member_4.svg',
        'jhipster_family_member_4_head-512.png',
      ],
    }),
  ],
};
