import { useMemo, useRef, useCallback } from 'react';
import { Carousel } from 'antd';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import {
  useComponent,
  useCondition,
} from '@/components/ChartComponents/Common/Component/hook';
import { useClipPath } from '@/hooks';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import FilterDataUtil from '@/utils/Assist/FilterData';
import { TCarouselConfig } from '../type';
import styles from './index.less';

const CHART_ID = 'CAROUSEL';

const CarouselBasic = (
  props: ComponentData.CommonComponentProps<TCarouselConfig>,
) => {
  const { className, style, value, global, children, wrapper: Wrapper } = props;
  const { screenType } = global;

  const {
    config: {
      options,
      style: { height, border },
    },
    id,
  } = value;
  const { dot, speed, autoplay, fade, condition, pauseOnHover, clipPath } =
    options;

  const clipPathStyle = useClipPath(clipPath);

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const requestRef = useRef<TFetchFragmentRef>(null);

  const {
    request,
    syncInteractiveAction,
    linkageMethod,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
    onCondition,
  } = useComponent<TCarouselConfig>(
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
  } = useCondition(onCondition, screenType);

  const finalValue = useMemo(() => {
    return FilterDataUtil.getFieldMapValue(processedValue, {
      map: componentFilterMap,
    });
  }, [processedValue, componentFilterMap]);

  const onClick = useCallback(
    (value) => {
      syncInteractiveAction('click', value);
      linkageMethod('click-item', value);
    },
    [syncInteractiveAction],
  );

  const componentClassName = useMemo(() => {
    return classnames(
      className,
      styles['component-media-carousel'],
      conditionClassName,
    );
  }, [className, conditionClassName]);

  const imageList = useMemo(() => {
    return finalValue.map((item: any, index: number) => {
      const { value, name } = item;
      return (
        <div key={name || index}>
          <img
            src={value}
            onClick={onClick.bind(null, item)}
            style={{
              height: height - 4,
              width: '100%',
            }}
          />
        </div>
      );
    });
  }, [finalValue, onClick, height]);

  return (
    <>
      <div
        className={componentClassName}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
          clipPathStyle,
          conditionStyle,
        )}
        id={chartId.current}
      >
        <Wrapper border={border}>
          {children}
          <Carousel
            autoplay={autoplay}
            dots={dot.show}
            dotPosition={dot.position}
            speed={speed}
            fade={fade}
            style={{
              width: '100%',
              height: '100%',
            }}
            pauseOnFocus={pauseOnHover}
          >
            {imageList}
          </Carousel>
        </Wrapper>
      </div>
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

const WrapperCarousel: typeof CarouselBasic & {
  id: ComponentData.TComponentSelfType;
} = CarouselBasic as any;

WrapperCarousel.id = CHART_ID;

export default WrapperCarousel;
