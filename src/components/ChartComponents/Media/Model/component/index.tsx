import { useMemo, useRef, useCallback, useState, useEffect } from 'react';
import { uniqueId, merge, noop } from 'lodash';
import classnames from 'classnames';
import GridLoader from 'react-spinners/GridLoader';
import { useUpdateEffect } from 'ahooks';
import { useComponent } from '@/components/ChartComponents/Common/Component/hook';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import { usePrimaryColor } from '@/hooks';
import FilterDataUtil from '@/utils/Assist/FilterData';
import { DEFAULT_THREE_D_MODEL_URL } from '@/utils/constants';
import { TModelConfig } from '../type';
import { CHART_ID } from '../id';
import styles from './index.less';

const getDomain = (url: string) => {
  try {
    return new URL(url).origin;
  } catch (err) {
    return '';
  }
};

const BASE_DOMAIN = getDomain(DEFAULT_THREE_D_MODEL_URL);

const ModelBasic = (
  props: ComponentData.CommonComponentProps<TModelConfig>,
) => {
  const { className, style, value, global, children, wrapper: Wrapper } = props;

  const [pageLoading, setPageLoading] = useState<boolean>(true);

  const color = usePrimaryColor();

  const {
    id,
    config: {
      options,
      style: { border },
    },
  } = value;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const requestRef = useRef<TFetchFragmentRef>(null);
  const iframeRef = useRef<any>();

  const {
    request,
    syncInteractiveAction,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
  } = useComponent<TModelConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const onIframeLoad = useCallback((e) => {
    setPageLoading(false);
  }, []);

  const onIframeError = useCallback(() => {
    setPageLoading(false);
  }, []);

  const finalValue = useMemo(() => {
    return FilterDataUtil.getFieldMapValue(processedValue, {
      map: componentFilterMap,
    });
  }, [processedValue, componentFilterMap]);

  const onClick = useCallback(() => {
    syncInteractiveAction('click', {
      value: finalValue.value,
    });
  }, [syncInteractiveAction, finalValue]);

  const componentClassName = useMemo(() => {
    return classnames(className, styles['component-media-model']);
  }, [className]);

  const initIFrame = (options: any) => {
    if (pageLoading) return;
    const iframe = window.frames[chartId.current as any];
    const sendData = {
      ...options,
    };

    iframe.postMessage(
      JSON.stringify({
        id: chartId.current,
        value: sendData,
      }),
      BASE_DOMAIN,
    );
  };

  const onMessage = (e: any) => {
    try {
      const { data, origin } = e;
      const objectValue = JSON.parse(data);
      const { id, ...nextValues } = objectValue;
      if (id !== chartId.current) return;
      if (BASE_DOMAIN !== getDomain(origin)) return;
      // syncInteractiveAction('message', nextValues);
    } catch (err) {}
  };

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  useUpdateEffect(() => {
    if (pageLoading) return;
    initIFrame({
      ...options,
      value: finalValue.value,
    });
  }, [options, finalValue.value, pageLoading]);

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
        )}
        id={chartId.current}
        onClick={onClick}
      >
        <Wrapper border={border}>
          {children}
          {pageLoading && (
            <div className={styles['component-media-model-loading']}>
              <GridLoader loading color={color} />
            </div>
          )}
          <iframe
            name={chartId.current}
            src={DEFAULT_THREE_D_MODEL_URL}
            style={{
              display: pageLoading ? 'none' : 'block',
            }}
            onLoad={onIframeLoad}
            onError={onIframeError}
            ref={iframeRef}
            frameBorder="0"
          />
        </Wrapper>
      </div>
      <FetchFragment
        id={id}
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        reCondition={noop}
        componentFilter={componentFilter}
        componentCondition={{
          value: [],
          initialState: 'visible',
        }}
      />
    </>
  );
};

const WrapperModelBasic: typeof ModelBasic & {
  id: ComponentData.TComponentSelfType;
} = ModelBasic as any;

WrapperModelBasic.id = CHART_ID;

export default WrapperModelBasic;
