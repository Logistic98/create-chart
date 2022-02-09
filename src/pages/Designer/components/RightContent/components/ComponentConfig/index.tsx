import { ReactNode, useCallback, useMemo } from 'react';
import {
  CodeOutlined,
  ControlOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import IconTooltip from '@/components/IconTooltip';
import { getComponent } from '@/utils/Assist/Component';
import ConfigList from '../Common/Structure/ConfigList';
import BaseConfig from '../Common/BaseConfig';
import DataConfig from '../Common/DataConfig';
import InterActiveConfig from '../Common/InterActiveConfig';
import ConfigWrapper, { ConfigItem } from '../Common/ConfigWrapper';
import styles from './index.less';

const ComponentConfig = (props: {
  options?: ReactNode;
  id: string;
  components: ComponentData.TComponentData[];
}) => {
  const { options, id, components } = props;

  const onBack = useCallback(() => {}, []);

  const hasBack = useMemo(() => {
    const component: ComponentData.TComponentData = getComponent(
      id,
      components,
    );
    return !!component?.parent;
  }, [components, id]);

  return (
    <div className={styles['design-config-component']}>
      <ConfigWrapper hasBack={hasBack} onBack={onBack} tabCounter={3}>
        <ConfigItem
          tab={
            <IconTooltip title="配置">
              <ProjectOutlined />
            </IconTooltip>
          }
          key="1"
        >
          <ConfigList>
            <BaseConfig id={id} />
            <ConfigList level={1}>{options}</ConfigList>
          </ConfigList>
        </ConfigItem>
        <ConfigItem
          tab={
            <IconTooltip title="数据">
              <CodeOutlined />
            </IconTooltip>
          }
          key="2"
        >
          <DataConfig />
        </ConfigItem>
        <ConfigItem
          tab={
            <IconTooltip title="交互">
              <ControlOutlined />
            </IconTooltip>
          }
          key="3"
        >
          <InterActiveConfig />
        </ConfigItem>
      </ConfigWrapper>
    </div>
  );
};

export default ComponentConfig;
