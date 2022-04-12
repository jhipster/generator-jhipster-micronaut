import expect from 'expect';

import { helpers, lookups } from '#test-utils';

describe('SubGenerator database-changelog of micronaut JHipster blueprint', () => {
  describe('run', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster:database-changelog')
        .withOptions({
          reproducible: true,
          defaults: true,
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
