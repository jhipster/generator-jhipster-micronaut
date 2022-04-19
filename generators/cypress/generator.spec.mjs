import expect from 'expect';

import { helpers, lookups } from '#test-utils';

describe('SubGenerator cypress of micronaut JHipster blueprint', () => {
  describe('run', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster:cypress')
        .withOptions({
          reproducible: true,
          defaults: true,
          blueprint: 'micronaut',
          baseName: 'jhipster',
          localConfig: {
            testFrameworks: ['cypress'],
          },
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });
});
