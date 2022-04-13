import { CSSProperties, useEffect, useRef } from 'react';
import { init } from 'echarts';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import { useDeepUpdateEffect } from '@/hooks';
import {
  useComponent,
  useChartComponentResize,
  useChartValueMapField,
  useComponentResize,
  useAnimationChange,
  useCondition,
  useChartComponentTooltip,
} from '@/components/ChartComponents/Common/Component/hook';
import { radialGradientColor } from '@/components/ChartComponents/Common/utils';
import { ComponentProps } from '@/components/ChartComponents/Common/Component/type';
import ColorSelect from '@/components/ColorSelect';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import { TRadialLineConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'RADIAL_LINE';

const RadialLine = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TRadialLineConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;
  const { screenTheme, screenType } = global;

  const {
    id,
    config: { options },
  } = value;

  const { legend, series, xAxis, yAxis, tooltip, animation, condition } =
    options;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const chartInstance = useRef<echarts.ECharts>();
  const requestRef = useRef<TFetchFragmentRef>(null);

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
    onCondition,
  } = useComponent<TRadialLineConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const {
    onCondition: propsOnCondition,
    style: conditionStyle,
    className: conditionClassName,
  } = useCondition(onCondition);

  const { seriesKeys, xAxisKeys, yAxisValues } = useChartValueMapField(
    processedValue,
    {
      map: componentFilterMap,
      fields: {
        seriesKey: 's',
        xAxisKeyKey: 'x',
        yAxisValue: 'y',
      },
    },
  );

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
    const { itemStyle, label, areaStyle, lineStyle, ...nextSeries } = series;
    const { animation: show, animationDuration, animationEasing } = animation;
    const { decal, color, ...nextItemStyle } = itemStyle;

    const baseSeries = {
      ...nextSeries,
      ...(decal[0] || {}),
      smoothMonotone: 'x',
      label: {
        ...label,
        color: getRgbaString(label.color),
      },
      type: 'line',
      itemStyle: {
        ...nextItemStyle,
        color: getRgbaString(color[0]),
      },
      areaStyle: {
        color: getRgbaString(areaStyle.color[0]) || 'transparent',
      },
      lineStyle: {
        ...(lineStyle[0] || {}),
        color: radialGradientColor(lineStyle[0]?.color),
      },
      data: yAxisValues._defaultValue_,
      animation: show,
      animationEasing,
      animationEasingUpdate: animationEasing,
      animationDuration,
      animationDurationUpdate: animationDuration,
    };

    const realSeries = seriesKeys.length
      ? seriesKeys.map((item: any, index: number) => {
          return {
            ...baseSeries,
            ...(decal[index] || {}),
            itemStyle: {
              ...nextItemStyle,
              color: getRgbaString(itemStyle.color[index]),
            },
            areaStyle: {
              color: getRgbaString(areaStyle.color[index]) || 'transparent',
            },
            lineStyle: {
              ...(lineStyle[index] || {}),
              color: radialGradientColor(lineStyle[index]?.color),
            },
            data: yAxisValues[item] || [],
            name: item,
          };
        })
      : [baseSeries];

    return realSeries;
  };

  const setOption = () => {
    const { textStyle: legendTextStyle, ...nextLegend } = legend;
    const {
      backgroundColor,
      textStyle: tooltipTextStyle,
      animation,
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
      splitLine,
      ...nextYAxis
    } = yAxis;
    const series = getSeries();

    chartInstance.current?.setOption(
      {
        grid: {
          show: false,
        },
        legend: {
          ...nextLegend,
          data: seriesKeys,
          textStyle: {
            ...legendTextStyle,
            color: getRgbaString(legendTextStyle.color),
          },
        },
        series,
        xAxis: [
          {
            ...nextXAxis,
            splitLine: {
              show: false,
            },
            data: xAxisKeys,
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
            splitLine: {
              ...splitLine,
              lineStyle: {
                ...splitLine.lineStyle,
                color: getRgbaString(splitLine.lineStyle.color),
              },
            },
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
          axisPointer: {
            type: 'shadow',
          },
          backgroundColor: getRgbaString(backgroundColor),
          textStyle: {
            ...tooltipTextStyle,
            color: getRgbaString(tooltipTextStyle.color),
          },
        },
      },
      true,
    );
    screenType !== 'edit' &&
      animation.show &&
      useChartComponentTooltip(chartInstance.current!, series, {
        interval: animation.speed,
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
  useDeepUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [processedValue]);

  // 配置发生变化时
  useDeepUpdateEffect(() => {
    setOption();
    chartInstance.current?.resize();
  }, [options]);

  useAnimationChange(chartInstance.current!, animation, setOption);

  return (
    <>
      <div
        className={classnames(className, conditionClassName)}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
          conditionStyle,
        )}
        id={chartId.current}
      ></div>
      <FetchFragment
        id={id}
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        reCondition={propsOnCondition}
        componentFilter={componentFilter}
        componentCondition={condition}
      />
    </>
  );
};

const WrapperRadialLine: typeof RadialLine & {
  id: ComponentData.TComponentSelfType;
} = RadialLine as any;

WrapperRadialLine.id = CHART_ID;

export default WrapperRadialLine;