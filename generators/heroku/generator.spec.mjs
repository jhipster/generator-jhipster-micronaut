import expect from 'expect';

import { helpers, lookups } from '#test-utils';

describe('SubGenerator heroku of micronaut JHipster blueprint', () => {
  describe('run', () => {
    let result;
    before(async function () {
      result = await helpers
        .create('jhipster:heroku')
        .withOptions({
          reproducible: true,
          defaults: true,
          blueprint: 'micronaut',
          baseName: 'jhipster',
        })
        .withLookups(lookups)
        .run();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });
});
