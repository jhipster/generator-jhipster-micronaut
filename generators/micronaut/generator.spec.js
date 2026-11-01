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
        })
        .withJHipsterGenerators()
        .withConfiguredBlueprint()
        .withBlueprintConfig();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should fallback to cache tag in JHipsterMetricsEndpoint', () => {
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = counter.getId().getTag("cache");',
      );
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = gauge.getId().getTag("cache");',
      );
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
        })
        .withJHipsterGenerators()
        .withConfiguredBlueprint()
        .withBlueprintConfig();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should fallback to cache tag in JHipsterMetricsEndpoint', () => {
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = counter.getId().getTag("cache");',
      );
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = gauge.getId().getTag("cache");',
      );
    });
  });

  describe('with gradle build tool', () => {
    beforeAll(async function () {
      await helpers
        .run(BLUEPRINT_NAMESPACE)
        .withJHipsterConfig({
          buildTool: 'gradle',
        })
        .withOptions({
          ignoreNeedlesError: true,
        })
        .withJHipsterGenerators()
        .withConfiguredBlueprint()
        .withBlueprintConfig();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should fallback to cache tag in JHipsterMetricsEndpoint', () => {
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = counter.getId().getTag("cache");',
      );
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = gauge.getId().getTag("cache");',
      );
    });
  });

  describe('with maven build tool', () => {
    beforeAll(async function () {
      await helpers
        .run(BLUEPRINT_NAMESPACE)
        .withJHipsterConfig({
          buildTool: 'maven',
        })
        .withOptions({
          ignoreNeedlesError: true,
        })
        .withJHipsterGenerators()
        .withConfiguredBlueprint()
        .withBlueprintConfig();
    });

    it('should succeed', () => {
      expect(result.getStateSnapshot()).toMatchSnapshot();
    });

    it('should fallback to cache tag in JHipsterMetricsEndpoint', () => {
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = counter.getId().getTag("cache");',
      );
      result.assertFileContent(
        'src/main/java/com/mycompany/myapp/config/metric/JHipsterMetricsEndpoint.java',
        'name = gauge.getId().getTag("cache");',
      );
    });
  });
});
