import { Form, ItemGroup, Markdown } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { ToyBrick } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FORM_STYLE } from '@/const/layoutTokens';
import { transformPluginSettings } from '@/features/PluginSettings';
import PluginSettingRender from '@/features/PluginSettings/PluginSettingRender';
import { pluginHelpers, usePluginStore } from '@/store/plugin';

import { useStore } from '../store';

const useStyles = createStyles(({ css, token }) => ({
  md: css`
    p {
      color: ${token.colorTextDescription};
    }
  `,
}));

const PluginSettings = memo(() => {
  const { t } = useTranslation('setting');
  const { styles } = useStyles();

  const [plugins] = useStore((s) => [s.config.plugins || [], !!s.config.plugins]);

  const [useFetchPluginList, updatePluginSettings] = usePluginStore((s) => [
    s.useFetchPluginList,
    s.updatePluginSettings,
  ]);

  const pluginManifestMap = usePluginStore((s) => s.pluginManifestMap, isEqual);
  const pluginsSettings = usePluginStore((s) => s.pluginsSettings, isEqual);
  const { data } = useFetchPluginList();

  const pluginsConfig = !data
    ? []
    : (plugins
        .map((identifier) => {
          const item = data.plugins.find((i) => i.identifier === identifier);

          if (!item) return null;
          const manifest = pluginManifestMap[identifier];

          if (!manifest?.settings) return null;

          return {
            children: transformPluginSettings(manifest.settings).map((item) => ({
              ...item,
              children: (
                <PluginSettingRender
                  defaultValue={pluginsSettings[identifier]?.[item.name]}
                  format={item.format}
                  onChange={(value) => {
                    updatePluginSettings(identifier, { [item.name]: value });
                  }}
                  type={item.type as any}
                />
              ),
              desc: item.desc && <Markdown className={styles.md}>{item.desc}</Markdown>,
            })),
            icon: ToyBrick,
            title: t('settingPlugin.config', { id: pluginHelpers.getPluginTitle(item.meta) }),
          };
        })
        .filter(Boolean) as unknown as ItemGroup[]);

  return <Form items={pluginsConfig} {...FORM_STYLE} />;
});

export default PluginSettings;
