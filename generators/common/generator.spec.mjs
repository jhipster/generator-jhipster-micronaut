import expect from 'expect';

import { helpers, lookups } from '#test-utils';

describe('SubGenerator common of micronaut JHipster blueprint', () => {
  describe('run', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster:common')
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
