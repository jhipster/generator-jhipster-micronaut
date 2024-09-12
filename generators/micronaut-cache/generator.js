import { GENERATOR_BOOTSTRAP_APPLICATION } from 'generator-jhipster/generators';
import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { createNeedleCallback } from 'generator-jhipster/generators/base/support';
import { javaMainPackageTemplatesBlock } from 'generator-jhipster/generators/java/support';
import { getCacheProviderMavenDefinition, getCacheProviderGradleDefinition } from './internal/dependencies.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });
  }

  async beforeQueue() {
    await this.dependsOnJHipster(GENERATOR_BOOTSTRAP_APPLICATION);
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      addNeedles({ source, application }) {
        if (application.cacheProviderEhcache || application.cacheProviderCaffeine || application.cacheProviderRedis) {
          const cacheConfigurationFile = `${application.javaPackageSrcDir}config/CacheConfiguration.java`;
          const needle = `${application.cacheProvider}-add-entry`;
          const addEntryToCacheCallback = entry =>
            createNeedleCallback({
              needle,
              contentToAdd: `createCache(cm, ${entry});`,
            });

          source.addEntryToCache = ({ entry }) => this.editFile(cacheConfigurationFile, addEntryToCacheCallback(entry));
          source.addEntityToCache = ({ entityAbsoluteClass, relationships }) => {
            const entry = `${entityAbsoluteClass}.class.getName()`;
            this.editFile(
              cacheConfigurationFile,
              addEntryToCacheCallback(entry),
              ...(relationships ?? [])
                .filter(rel => rel.collection)
                .map(rel => addEntryToCacheCallback(`${entry} + ".${rel.propertyName}"`)),
            );
          };
        }
      },
    });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          sections: {
            files: [
              {
                ...javaMainPackageTemplatesBlock(),
                templates: [data => `config/CacheConfiguration${data.cacheProviderHazelcast ? '_hazelcast' : ''}.java`],
              },
            ],
          },
          context: application,
        });
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingTaskGroup({
      addDependencies({ application, source }) {
        
        if(application.buildToolMaven){
          const definition = getCacheProviderMavenDefinition(application.cacheProvider, application.javaDependencies);

          source.addMavenDefinition?.(definition.base);
          if (application.enableHibernateCache && definition.hibernateCache) {
            source.addMavenDefinition?.(definition.hibernateCache);
          }
        }else if(application.buildToolGradle){
          const definition = getCacheProviderGradleDefinition(application.cacheProvider, application.javaDependencies);

          if(definition){
            source.addGradleDependencies?.(definition.base.dependencies);
            if (application.enableHibernateCache && definition.hibernateCache) {
              source.addGradleDependencies?.(definition.hibernateCache.dependencies);
            }
          }
        }
      },
      customizeFiles({ source, entities, application: { cacheProvider, enableHibernateCache } }) {
        if (!enableHibernateCache || !cacheProvider) return;
        if (['ehcache', 'caffeine', 'infinispan', 'redis'].includes(cacheProvider)) {
          for (const entity of entities.filter(entity => !entity.skipServer && !entity.builtIn)) {
            const { entityAbsoluteClass } = entity;
            source.addEntityToCache?.({
              entityAbsoluteClass,
              relationships: entity.relationships,
            });
          }
        }
      },
    });
  }
}
