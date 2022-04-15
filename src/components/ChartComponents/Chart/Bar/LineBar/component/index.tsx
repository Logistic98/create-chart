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
import { TLineBarConfig } from '../type';

const { getRgbaString } = ColorSelect;

const CHART_ID = 'LINE_BAR';

const LineBar = (props: {
  className?: string;
  style?: CSSProperties;
  value: ComponentData.TComponentData<TLineBarConfig>;
  global: ComponentProps['global'];
}) => {
  const { className, style, value, global } = props;
  const { screenTheme, screenType } = global;

  const {
    id,
    config: { options },
  } = value;

  const {
    legend,
    series,
    xAxis,
    yAxis,
    yAxis2,
    tooltip,
    animation,
    condition,
  } = options;

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
  } = useComponent<TLineBarConfig>(
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

  const {
    s: seriesKeys,
    x: xAxisKeys,
    y: yAxisValues,
    y2: y2AxisValues,
    s2: series2Keys,
  } = useChartValueMapField(processedValue, {
    map: componentFilterMap,
    fields: {
      seriesKey: 's',
      xAxisKeyKey: 'x',
      yAxisValue: 'y',
    },
    formatMethod: (value) => {
      return value.reduce(
        (acc: any, cur: any) => {
          const { x, y, s, y2, s2 } = cur;

          if (s && !acc.s.includes(s)) acc.s.push(s);
          if (s2 && !acc.s2.includes(s2)) acc.s2.push(s2);
          if (x && !acc.x.includes(x)) acc.x.push(x);

          if (s) {
            if (!acc.y[s]) acc.y[s] = [];
            if (y !== undefined) {
              acc.y[s].push(y);
            }
          } else if (s2) {
            if (!acc.y2[s2]) acc.y2[s2] = [];
            if (y2 !== undefined) {
              acc.y2[s2].push(y2);
            }
          } else {
            if (y !== undefined) {
              acc.y._defaultValue_.push(y);
            }
            if (y2 !== undefined) {
              acc.y2._defaultValue_.push(y2);
            }
          }

          return acc;
        },
        {
          x: [],
          y: {
            _defaultValue_: [],
          },
          y2: {
            _defaultValue_: [],
          },
          s: [],
          s2: [],
        },
      );
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
    const { itemStyle, label, style, ...nextSeries } = series;
    const baseSeries = [
      {
        ...nextSeries,
        label: {
          ...label,
          color: getRgbaString(label.color),
        },
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 0,
        areaStyle: {
          color: radialGradientColor(itemStyle[0]?.line.areaColor) || 'auto',
        },
        lineStyle: {
          width: style.line.lineWidth,
          color: getRgbaString(itemStyle[0]?.line.color) || 'auto',
        },
        smooth: style.line.smooth,
        data: y2AxisValues._defaultValue_,
        emphasis: {
          focus: 'series',
        },
        animation: animation.line.animation,
        animationEasing: animation.line.animationEasing,
        animationEasingUpdate: animation.line.animationEasing,
        animationDuration: animation.bar.animationDuration,
        animationDurationUpdate: animation.line.animationDuration,
      },
      {
        ...nextSeries,
        label: {
          ...label,
          position: 'inside',
          color: getRgbaString(label.color),
        },
        type: 'bar',
        itemStyle: {
          color: radialGradientColor(itemStyle[0]?.bar.color) || 'auto',
          borderRadius: [style.bar.borderRadius, style.bar.borderRadius, 0, 0],
        },
        barWidth: style.bar.barWidth,
        data: yAxisValues._defaultValue_,
        emphasis: {
          focus: 'series',
        },
        animation: animation.bar.animation,
        animationEasing: animation.bar.animationEasing,
        animationEasingUpdate: animation.bar.animationEasing,
        animationDuration: animation.bar.animationDuration,
        animationDurationUpdate: animation.bar.animationDuration,
      },
    ];

    const realSeries = seriesKeys.length
      ? seriesKeys.reduce((acc: any, item: any, index: number) => {
          acc.push(
            {
              ...baseSeries[0],
              areaStyle: {
                color:
                  radialGradientColor(itemStyle[0]?.line.areaColor) || 'auto',
              },
              lineStyle: {
                width: style.line.lineWidth,
                color: getRgbaString(itemStyle[0]?.line.color) || 'auto',
              },
              data: y2AxisValues[series2Keys[index] || item] || [],
              name: series2Keys[index] || item,
            },
            {
              ...baseSeries[1],
              itemStyle: {
                color:
                  radialGradientColor(itemStyle[index]?.bar.color) || 'auto',
              },
              data: yAxisValues[item] || [],
              name: item,
            },
          );
          return acc;
        }, [])
      : baseSeries;

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
      ...nextYAxis
    } = yAxis;
    const {
      axisLabel: yAxis2Label,
      nameTextStyle: y2NameTextStyle,
      ...nextYAxis2
    } = yAxis2;

    const realSeries = getSeries();

    chartInstance.current?.setOption({
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
      series: realSeries,
      xAxis: [
        {
          ...nextXAxis,
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          axisLine: {
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
          type: 'value',
          axisLabel: {
            ...yAxisLabel,
            color: getRgbaString(yAxisLabel.color),
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          position: 'left',
          nameTextStyle: {
            ...yNameTextStyle,
            color: getRgbaString(yNameTextStyle.color),
          },
        },
        {
          ...nextYAxis2,
          type: 'value',
          position: 'right',
          axisLabel: {
            ...yAxis2Label,
            color: getRgbaString(yAxis2Label.color),
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          nameTextStyle: {
            ...yNameTextStyle,
            color: getRgbaString(y2NameTextStyle.color),
          },
        },
      ],
      tooltip: {
        ...nextTooltip,
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: getRgbaString(backgroundColor),
        textStyle: {
          ...tooltipTextStyle,
          color: getRgbaString(tooltipTextStyle.color),
        },
      },
    });

    screenType !== 'edit' &&
      animation.show &&
      useChartComponentTooltip(chartInstance.current!, realSeries, {
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

  useAnimationChange(chartInstance.current!, animation.bar, setOption);
  useAnimationChange(chartInstance.current!, animation.line, setOption);

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

const WrapperLineBar: typeof LineBar & {
  id: ComponentData.TComponentSelfType;
} = LineBar as any;

WrapperLineBar.id = CHART_ID;

export default WrapperLineBar;
