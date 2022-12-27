import { CSSProperties, useMemo, useRef, useCallback, useEffect } from 'react';
import { uniqueId, merge, get } from 'lodash';
import classnames from 'classnames';
import { useUpdateEffect } from 'ahooks';
import { useComponent } from '@/components/ChartComponents/Common/Component/hook';
import FetchFragment, {
  TFetchFragmentRef,
} from '@/components/ChartComponents/Common/FetchFragment';
import FilterDataUtil from '@/utils/Assist/FilterData';
import { getDvaGlobalModelData } from '@/utils/Assist/Component';
import VariableStringUtil from '@/utils/Assist/VariableString';
import { TIFrameConfig } from '../type';
import { CHART_ID } from '../id';
import styles from './index.less';

const IframeBasic = (
  props: ComponentData.CommonComponentProps<TIFrameConfig>,
) => {
  const { className, style, value, global, children, wrapper: Wrapper } = props;
  const {
    id,
    config: {
      options: { scrolling, scale, pointEvent, relationParams },
      style: { border },
    },
  } = value;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const requestRef = useRef<TFetchFragmentRef>(null);
  const chartLoaded = useRef<boolean>(false);

  const {
    request,
    getValue,
    requestUrl,
    componentFilter,
    value: processedValue = [],
    componentFilterMap,
    syncInteractiveAction,
  } = useComponent<TIFrameConfig>(
    {
      component: value,
      global,
    },
    requestRef,
  );

  const finalValue = useMemo(() => {
    return FilterDataUtil.getFieldMapValue(processedValue, {
      map: componentFilterMap,
    });
  }, [processedValue, componentFilterMap]);

  const getDomain = (url: string) => {
    try {
      return new URL(url).origin;
    } catch (err) {
      return '';
    }
  };

  const onLoad = useCallback(() => {
    chartLoaded.current = true;
    initIFrame(finalValue.value);
  }, [finalValue]);

  const reParams = useCallback(
    (targetParams: ComponentData.TParams, newValue: any) => {
      if (!finalValue.value) return;
      const iframe = window.frames[chartId.current as any];
      const domain = getDomain(finalValue.value);
      if (!domain) return;
      iframe.postMessage(
        JSON.stringify({
          value: [{ key: targetParams.variable, value: newValue }],
          id: chartId.current,
        }),
        domain,
      );
    },
    [finalValue],
  );

  const initIFrame = (value: any) => {
    if (!value || !chartLoaded.current) return;
    const data = getDvaGlobalModelData();
    const params: ComponentData.TParams[] =
      get(data, 'screenData.config.attr.params') || [];
    const constants: ComponentData.TConstants[] =
      get(data, 'screenData.config.attr.constants') || [];
    const iframe = window.frames[chartId.current as any];
    const domain = getDomain(finalValue.value);
    if (!domain) return;
    const allParams = VariableStringUtil.getAllGlobalParams4Array(
      params,
      constants,
    );
    const sendData = relationParams
      .map((param) => {
        const target = allParams.find((item) => item.id === param);
        if (!target) return null;
        return {
          key: target.key,
          value: target.value,
        };
      })
      .filter(Boolean);

    iframe.postMessage(
      JSON.stringify({
        id: chartId.current,
        value: sendData,
      }),
      domain,
    );
  };

  const onMessage = (e: any) => {
    try {
      const { data, origin } = e;
      if (!finalValue.value) return;
      const objectValue = JSON.parse(data);
      const { id, ...nextValues } = objectValue;
      if (id !== chartId.current) return;
      if (getDomain(finalValue.value) !== getDomain(origin)) return;
      syncInteractiveAction('message', nextValues);
    } catch (err) {}
  };

  useUpdateEffect(() => {
    initIFrame(finalValue.value);
  }, [finalValue.value]);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, [finalValue.value]);

  return (
    <>
      <div
        className={classnames(className, styles['component-other-iframe'])}
        style={merge(
          {
            width: '100%',
            height: '100%',
          },
          style,
        )}
        id={chartId.current}
      >
        <div
          className="w-100 h-100"
          style={merge(
            {
              transform: `scale(${scale})`,
            },
            pointEvent
              ? {}
              : ({
                  pointerEvents: 'none',
                } as CSSProperties),
          )}
        >
          <Wrapper border={border}>
            {children}
            <iframe
              src={finalValue.value}
              name={chartId.current}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling={scrolling}
              onLoad={onLoad}
              style={
                pointEvent
                  ? {}
                  : ({
                      pointerEvents: 'none',
                    } as CSSProperties)
              }
            />
          </Wrapper>
        </div>
      </div>
      <FetchFragment
        id={id}
        url={requestUrl}
        ref={requestRef}
        reFetchData={request}
        reGetValue={getValue}
        reParams={reParams}
        componentFilter={componentFilter}
        componentParams={relationParams}
      />
    </>
  );
};

const WrapperIframeBasic: typeof IframeBasic & {
  id: ComponentData.TComponentSelfType;
} = IframeBasic as any;

WrapperIframeBasic.id = CHART_ID;

export default WrapperIframeBasic;
