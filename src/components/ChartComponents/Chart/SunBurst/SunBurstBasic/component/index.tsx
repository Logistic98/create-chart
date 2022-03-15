import { CSSProperties, useEffect, useRef } from 'react';
import { init } from 'echarts';
import { uniqueId, merge } from 'lodash';
import { useUpdateEffect, useDeepCompareEffect } from 'ahooks';
import {
  useComponent,
  useChartComponentResize,
  useChartValueMapField,
  useComponentResize,
  useAnimationChange,
} from '@/components/ChartComponents/Common/Component/hook';
import { ComponentProps } from '@/components/ChartComponents/Common/Component/type';
import ColorSelect from '@/components/ColorSelect';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import { TSunBurstBasicConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'SUN_BURST_BASIC';

const SunBurstBasic = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TSunBurstBasicConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;
  const { screenTheme } = global;

  const {
    config: { options },
  } = value;

  const { series, tooltip, animation } = options;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const chartInstance = useRef<echarts.ECharts>();
  const requestRef = useRef<TFetchFragmentRef>(null);
  const isFirst = useRef<boolean>(true);

  useComponentResize(value, () => {
    chartInstance?.current?.resize();
  });

  const {
    request,
    syncInteractiveAction,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
  } = useComponent<TSunBurstBasicConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const { value: realValue } = useChartValueMapField(processedValue, {
    map: componentFilterMap,
    fields: {
      seriesKey: '',
      xAxisKeyKey: 'name',
      yAxisValue: 'value',
    },
    deep: true,
  });

  const onClick = (params: any) => {
    const { name, data } = params;
    syncInteractiveAction('click', {
      name: name,
      value: data,
    });
  };

  const initChart = () => {
    const chart = init(
      document.querySelector(`#${chartId.current!}`)!,
      screenTheme,
      {
        renderer: 'canvas',
      },
    );
    chartInstance.current = chart;

    setOption();
  };

  const getSeries = () => {
    const { radius, label, center, ...nextSeries } = series;
    const { animation: show, animationDuration, animationEasing } = animation;

    const baseSeries = {
      ...nextSeries,
      radius: radius + '%',
      center: center.map((item) => `${item}%`),
      label: {
        ...label,
        color: getRgbaString(label.color),
      },
      type: 'sunburst',
      data: realValue,
      animation: show,
      animationEasing,
      animationEasingUpdate: animationEasing,
      animationDuration,
      animationDurationUpdate: animationDuration,
    };

    return baseSeries;
  };

  const setOption = () => {
    const {
      backgroundColor,
      textStyle: tooltipTextStyle,
      ...nextTooltip
    } = tooltip;

    const series = getSeries();

    chartInstance.current?.setOption(
      {
        grid: {
          show: false,
        },
        series,
        tooltip: {
          ...nextTooltip,
          trigger: 'item',
          backgroundColor: getRgbaString(backgroundColor),
          textStyle: {
            ...tooltipTextStyle,
            color: getRgbaString(tooltipTextStyle.color),
          },
        },
      },
      true,
    );
  };

  useChartComponentResize(chartInstance.current!);

  useEffect(() => {
    initChart();
    return () => {
      chartInstance.current?.dispose();
    };
  }, [screenTheme]);

  useEffect(() => {
    chartInstance.current?.off('click');
    chartInstance.current?.on('click', onClick);
  }, [syncInteractiveAction]);

  // 数据发生变化时
  useDeepCompareEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
    } else {
      setOption();
      chartInstance.current?.resize();
    }
  }, [processedValue]);

  // 配置发生变化时
  useUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [options]);

  useAnimationChange(chartInstance.current!, animation, setOption);

  return (
    <>
      <div
        className={className}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
        )}
        id={chartId.current}
      ></div>
      <FetchFragment
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        componentFilter={componentFilter}
      />
    </>
  );
};

const WrapperSunBurstBasic: typeof SunBurstBasic & {
  id: ComponentData.TComponentSelfType;
} = SunBurstBasic as any;

WrapperSunBurstBasic.id = CHART_ID;

export default WrapperSunBurstBasic;