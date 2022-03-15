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
import { TPictorialBarBasicConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'PICTORIAL_BAR_BASIC';

const PictorialBar = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TPictorialBarBasicConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;
  const { screenTheme } = global;

  const {
    config: { options },
  } = value;

  const { series, xAxis, yAxis, tooltip, animation } = options;

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
  } = useComponent<TPictorialBarBasicConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const { xAxisKeys, yAxisValues } = useChartValueMapField(processedValue, {
    map: componentFilterMap,
    fields: {
      seriesKey: '',
      xAxisKeyKey: 'name',
      yAxisValue: 'value',
    },
  });

  const onClick = (params: any) => {
    const { seriesName, name, data } = params;
    syncInteractiveAction('click', {
      x: name,
      y: data,
      s: seriesName,
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
    const { spirit, symbolColor, symbol, ...nextSeries } = series;
    const { max } = xAxis;
    const { animation: show, animationDuration, animationEasing } = animation;
    const realSymbol = spirit.show ? 'image://' + spirit.value : symbol;
    const data = yAxisValues._defaultValue_;

    const baseSeries = {
      ...nextSeries,
      symbol: realSymbol,
      type: 'pictorialBar',
      itemStyle: {
        color: getRgbaString(symbolColor),
      },
      symbolClip: true,
      data,
      symbolBoundingData: max,
      animation: show,
      animationEasing,
      animationEasingUpdate: animationEasing,
      animationDuration,
      animationDurationUpdate: animationDuration,
      z: 10,
    };

    const realSeries = [
      baseSeries,
      {
        // full data
        ...nextSeries,
        symbol: realSymbol,
        type: 'pictorialBar',
        data,
        itemStyle: {
          opacity: 0.2,
          color: getRgbaString(symbolColor),
        },
        symbolColor: getRgbaString(symbolColor),
        symbolRepeat: 'fixed',
        animationDuration: 0,
        symbolBoundingData: max,
        z: 5,
      },
    ];

    return realSeries;
  };

  const setOption = () => {
    const {
      backgroundColor,
      textStyle: tooltipTextStyle,
      ...nextTooltip
    } = tooltip;
    const {
      axisLabel: xAxisLabel,
      nameTextStyle: xNameTextStyle,
      ...nextXAxis
    } = xAxis;
    const {
      axisLabel: yAxisLabel,
      nameTextStyle: yNameTextStyle,
      ...nextYAxis
    } = yAxis;
    const series = getSeries();

    chartInstance.current?.setOption({
      grid: {
        show: false,
      },
      series,
      xAxis: [
        {
          ...nextXAxis,
          splitLine: {
            show: false,
          },
          axisLabel: {
            ...xAxisLabel,
            color: getRgbaString(xAxisLabel.color),
          },
          nameTextStyle: {
            ...xNameTextStyle,
            color: getRgbaString(xNameTextStyle.color),
          },
        },
      ],
      yAxis: [
        {
          ...nextYAxis,
          inverse: true,
          data: xAxisKeys,
          splitLine: {
            show: false,
          },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            ...yAxisLabel,
            color: getRgbaString(yAxisLabel.color),
          },
          nameTextStyle: {
            ...yNameTextStyle,
            color: getRgbaString(yNameTextStyle.color),
          },
        },
      ],
      tooltip: {
        ...nextTooltip,
        backgroundColor: getRgbaString(backgroundColor),
        textStyle: {
          ...tooltipTextStyle,
          color: getRgbaString(tooltipTextStyle.color),
        },
      },
    });
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

const WrapperPictorialBarBasic: typeof PictorialBar & {
  id: ComponentData.TComponentSelfType;
} = PictorialBar as any;

WrapperPictorialBarBasic.id = CHART_ID;

export default WrapperPictorialBarBasic;