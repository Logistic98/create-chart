import { omit } from 'lodash';
import { mergeWithoutArray } from '@/utils';
import {
  BASIC_DEFAULT_CONFIG,
  BASIC_DEFAULT_DATA_CONFIG,
  BASIC_DEFAULT_INTERACTIVE_CONFIG,
  DEFAULT_LEGEND_CONFIG,
  DEFAULT_X_AXIS_CONFIG,
  DEFAULT_Y_AXIS_CONFIG,
  DEFAULT_TOOLTIP_CONFIG,
  DEFAULT_FONT_CONFIG,
} from '../../../Common/Constants/defaultConfig';
import { TBarBasicConfig } from './type';

const CUSTOM_CONFIG: ComponentData.TInternalComponentConfig<TBarBasicConfig> = {
  interactive: {
    base: [
      {
        type: 'click',
        name: '当点击项时',
        show: false,
        fields: [
          {
            key: 'x',
            variable: '',
            description: 'x轴',
          },
          {
            key: 'y',
            variable: '',
            description: 'y轴',
          },
          {
            key: 's',
            variable: '',
            description: '系列',
          },
        ],
      },
    ],
  },
  data: {
    request: {
      value: [],
    },
    filter: {
      map: [
        {
          field: 'x',
          map: '',
          description: 'x轴',
          id: 'x',
          type: 'string',
        },
        {
          field: 'y',
          map: '',
          description: 'y轴',
          id: 'y',
          type: 'number',
        },
        {
          field: 's',
          map: '',
          description: '系列',
          id: 's',
          type: 'string',
        },
      ],
    },
  },
  options: {
    legend: omit(DEFAULT_LEGEND_CONFIG, 'type'),
    xAxis: DEFAULT_X_AXIS_CONFIG,
    yAxis: DEFAULT_Y_AXIS_CONFIG,
    tooltip: DEFAULT_TOOLTIP_CONFIG,
    series: {
      showBackground: false,
      backgroundStyle: {
        color: {
          r: 180,
          g: 180,
          b: 180,
          a: 0.2,
        },
      },
      label: {
        show: false,
        position: 'inside',
        rotate: 0,
        ...DEFAULT_FONT_CONFIG,
        color: {
          r: 255,
          g: 255,
          b: 255,
        },
      },
      itemStyle: {
        color: {
          r: 255,
          g: 255,
          b: 255,
        },
        decal: {
          symbol: 'rect',
          symbolSize: 1,
        },
      },
      barGap: 30,
      barWidth: 'auto',
    },
  },
};

const DefaultConfig: ComponentData.TComponentData<TBarBasicConfig> =
  mergeWithoutArray(
    {},
    BASIC_DEFAULT_DATA_CONFIG,
    BASIC_DEFAULT_INTERACTIVE_CONFIG,
    BASIC_DEFAULT_CONFIG,
    CUSTOM_CONFIG,
  );

export default DefaultConfig;