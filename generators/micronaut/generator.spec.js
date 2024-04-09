import { beforeAll, describe, expect, it } from 'vitest';

import { defaultHelpers as helpers, result } from 'generator-jhipster/testing';

const BLUEPRINT_NAMESPACE = `jhipster-micronaut:micronaut`;

describe('SubGenerator server of micronaut JHipster blueprint', () => {
  describe('run', () => {
    beforeAll(async function () {
      await helpers
        .run(BLUEPRINT_NAMESPACE)
        .withJHipsterConfig()
        .withOptions({
          ignoreNeedlesError: true,
          blueprint: 'micronaut',
        })
        .withJHipsterLookup()
        .withParentBlueprintLookup();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });

  describe('with some entities', () => {
    beforeAll(async function () {
      await helpers
        .run(BLUEPRINT_NAMESPACE)
        .withJHipsterConfig(
          {
            creationTimestamp: 1596513172471,
          },
          [
            {
              name: 'Entity',
              dto: 'mapstruct',
              fields: [
                {
                  fieldName: 'name',
                  fieldType: 'String',
                },
              ],
            },
          ],
        )
        .withOptions({
          reproducible: true,
          ignoreNeedlesError: true,
          blueprint: 'micronaut',
        })
        .withJHipsterLookup()
        .withParentBlueprintLookup();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });
});
