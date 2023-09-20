import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { javaMainPackageTemplatesBlock } from 'generator-jhipster/generators/java/support';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      addNeedles({ source, application }) {
        /*
        if (
          (.cacheProviderEhcache ||
          (application as any).cacheProviderCaffeine ||
          (application as any).cacheProviderRedis
        ) {
          const cacheConfigurationFile = `${application.javaPackageSrcDir}config/CacheConfiguration.java`;
          const needle = `${(application as any).cacheProvider}-add-entry`;
          const useJcacheConfiguration = (application as any).cacheProviderRedis;
          const addEntryToCacheCallback = entry =>
            createNeedleCallback({
              needle,
              contentToAdd: `createCache(cm, ${entry}${useJcacheConfiguration ? ', jcacheConfiguration' : ''});`,
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
        } else {
          // Add noop
          source.addEntryToCache = () => {};
          // Add noop
          source.addEntityToCache = () => {};
        }
        */
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
                templates: ['config/CacheConfiguration.java'],
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
      customizeFiles({ source, entities, application: { cacheProvider, enableHibernateCache } }) {
        if (!enableHibernateCache || !cacheProvider) return;
        if (['ehcache', 'caffeine', 'infinispan', 'redis'].includes(cacheProvider)) {
          for (const entity of entities.filter(entity => !entity.skipServer && !entity.builtIn)) {
            const { entityAbsoluteClass } = entity;
            source.addEntityToCache?.({
              entityAbsoluteClass,
              relationships: this.relationships,
            });
          }
        }
      },
    });
  }
}
