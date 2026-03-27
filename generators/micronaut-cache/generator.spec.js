import { beforeAll, describe, expect, it } from 'vitest';

import { defaultHelpers as helpers, result } from 'generator-jhipster/testing';

const SUB_GENERATOR = 'micronaut-cache';
const SUB_GENERATOR_NAMESPACE = `jhipster-micronaut:${SUB_GENERATOR}`;

describe('SubGenerator micronaut-cache of micronaut JHipster blueprint', () => {
  describe('run', () => {
    beforeAll(async function () {
      await helpers
        .run(SUB_GENERATOR_NAMESPACE)
        .withJHipsterConfig()
        .withOptions({
          ignoreNeedlesError: true,
        })
        .withJHipsterLookup()
        .withParentBlueprintLookup();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });
  });

  describe('run with hazelcast cache provider', () => {
    beforeAll(async function () {
      await helpers
        .run(SUB_GENERATOR_NAMESPACE)
        .withJHipsterConfig({
          cacheProvider: 'hazelcast',
        })
        .withOptions({
          ignoreNeedlesError: true,
        })
        .withJHipsterLookup()
        .withParentBlueprintLookup();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should generate CacheConfiguration with hazelcast imports', () => {
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/CacheConfiguration.java',
        'com.hazelcast.config.Config',
      );
    });

    it('should generate hazelcast needle comment', () => {
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/CacheConfiguration.java',
        'jhipster-needle-hazelcast-add-entry',
      );
    });
  });
});
