import { beforeAll, describe, expect, it } from 'vitest';

import { helpers, lookups } from '#test-utils';

const SUB_GENERATOR = 'common';
const BLUEPRINT_NAMESPACE = `jhipster:${SUB_GENERATOR}`;

describe('SubGenerator common of micronaut JHipster blueprint', () => {
  describe('run', () => {
    let result;
    beforeAll(async function () {
      result = await helpers
        .create(BLUEPRINT_NAMESPACE)
        .withOptions({
          reproducible: true,
          defaults: true,
          baseName: 'jhipster',
          ignoreNeedlesError: true,
          blueprint: 'micronaut',
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });
});
