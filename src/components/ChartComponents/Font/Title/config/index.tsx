import { Component } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import Select from '@/components/ChartComponents/Common/Select';
import ComponentOptionConfig, {
  Tab,
} from '@/components/ChartComponents/Common/ComponentOptionConfig';
import ConfigList from '@/components/ChartComponents/Common/Structure/ConfigList';
import { SingleCollapse as Collapse } from '@/components/ChartComponents/Common/Collapse';
import SingleDefineSelect from '@/components/ChartComponents/Common/SingleDefineSelect';
import IconTooltip from '@/components/IconTooltip';
import FullForm from '@/components/ChartComponents/Common/Structure/FullForm';
import { FontConfigList } from '@/components/ChartComponents/Common/FontConfig';
import OrientSelect from '@/components/ChartComponents/Common/OrientSelect';
import TextAlignConfig from '@/components/ChartComponents/Common/TextAlignConfig';
import ConditionConfig from './Condition';
import { TTitleConfig } from '../type';

const { Item } = ConfigList;
class Config extends Component<
  ComponentData.ComponentConfigProps<TTitleConfig>
> {
  onKeyChange = (key: keyof TTitleConfig, value: any) => {
    this.props.onChange({
      config: {
        options: {
          [key]: value,
        },
      },
    });
  };

  render() {
    const { value } = this.props;
    const {
      config: {
        options: { textStyle, align, orient, animation, condition },
      },
    } = value;

    return (
      <ComponentOptionConfig
        items={[
          {
            label: <Tab>样式</Tab>,
            children: (
              <ConfigList level={1}>
                <Collapse
                  child={{
                    header: '文字样式',
                    key: 'textStyle',
                  }}
                >
                  <FontConfigList
                    value={textStyle}
                    onChange={this.onKeyChange.bind(null, 'textStyle')}
                  />
                </Collapse>
                <TextAlignConfig
                  value={align}
                  onChange={this.onKeyChange.bind(this, 'align')}
                />
                <Item label="文字方向">
                  <OrientSelect
                    value={orient === 'lr' ? 'horizontal' : 'vertical'}
                    onChange={(value) => {
                      this.onKeyChange(
                        'orient',
                        value === 'vertical' ? 'vertical-lr' : 'lr',
                      );
                    }}
                  />
                </Item>
              </ConfigList>
            ),
            key: '1',
          },
          {
            label: <Tab>动画</Tab>,
            children: (
              <ConfigList level={1}>
                <Collapse
                  child={{
                    header: '动画',
                    key: 'animation',
                    visibleRender: true,
                    value: animation.show,
                    onChange: (value) => {
                      this.onKeyChange('animation', {
                        show: value,
                      });
                    },
                  }}
                  parent={{
                    activeKey: ['animation'],
                  }}
                >
                  <Item
                    label="动画"
                    placeholder={
                      <IconTooltip
                        title={
                          <>
                            动画名称可以参考
                            <a
                              className="underline-anime underline-anime-color-white"
                              target="_blank"
                              href="https://animate.style/"
                            >
                              这里
                            </a>
                          </>
                        }
                      >
                        <InfoCircleOutlined />
                      </IconTooltip>
                    }
                  >
                    <FullForm>
                      <SingleDefineSelect
                        value={animation.value}
                        onChange={(value) => {
                          this.onKeyChange('animation', {
                            value: value || '',
                          });
                        }}
                        options={[
                          'animate__bounce',
                          'animate__flash',
                          'animate__rubberBand',
                          'animate__heartBeat',
                          'animate__wobble',
                          'animate__pulse',
                          'animate__backInDown',
                          'animate__backInRight',
                          'animate__bounceIn',
                          'animate__fadeInDown',
                        ].map((item) => ({ label: item, value: item }))}
                      />
                    </FullForm>
                  </Item>
                  <Item label="速度">
                    <Select
                      className="w-100"
                      value={animation.speed}
                      onChange={(value) => {
                        this.onKeyChange('animation', {
                          speed: value,
                        });
                      }}
                      options={[
                        {
                          label: '正常',
                          value: '',
                        },
                        {
                          label: '慢',
                          value: 'animate__slow',
                        },
                        {
                          label: '很慢',
                          value: 'animate__slower',
                        },
                        {
                          label: '快',
                          value: 'animate__fast',
                        },
                        {
                          label: '很快',
                          value: 'animate__faster',
                        },
                      ]}
                    />
                  </Item>
                  <Item label="延迟">
                    <Select
                      className="w-100"
                      value={animation.delay}
                      onChange={(value) => {
                        this.onKeyChange('animation', {
                          delay: value,
                        });
                      }}
                      options={[
                        {
                          label: '不延迟',
                          value: '',
                        },
                        {
                          label: '延迟2秒',
                          value: 'animate__delay-2s',
                        },
                        {
                          label: '延迟3秒',
                          value: 'animate__delay-3s',
                        },
                        {
                          label: '延迟4秒',
                          value: 'animate__delay-4s',
                        },
                        {
                          label: '延迟5秒',
                          value: 'animate__delay-5s',
                        },
                      ]}
                    />
                  </Item>
                  <Item label="重复">
                    <Select
                      className="w-100"
                      value={animation.repeat}
                      onChange={(value) => {
                        this.onKeyChange('animation', {
                          repeat: value,
                        });
                      }}
                      options={[
                        {
                          label: '重复一次',
                          value: 'animate__repeat-1',
                        },
                        {
                          label: '重复两次',
                          value: 'animate__repeat-2',
                        },
                        {
                          label: '重复三次',
                          value: 'animate__repeat-3',
                        },
                        {
                          label: '无限重复',
                          value: 'animate__infinite',
                        },
                      ]}
                    />
                  </Item>
                </Collapse>
              </ConfigList>
            ),
            key: '2',
          },
          {
            label: <Tab>条件</Tab>,
            children: (
              <ConfigList level={1}>
                <ConditionConfig
                  value={condition}
                  onChange={this.onKeyChange.bind(null, 'condition')}
                />
              </ConfigList>
            ),
            key: '3',
          },
        ]}
      />
    );
  }
}

export default Config;
