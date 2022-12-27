import { useMemo, useRef, useState } from 'react';
import { uniqueId, merge } from 'lodash';
import classnames from 'classnames';
import { useComponent } from '@/components/ChartComponents/Common/Component/hook';
import ColorSelect from '@/components/ColorSelect';
import { TInputConfig } from '../type';
import { CHART_ID } from '../id';
import styles from './index.less';

const { getRgbaString } = ColorSelect;

const Input = (props: ComponentData.CommonComponentProps<TInputConfig>) => {
  const { className, style, value, global, children, wrapper: Wrapper } = props;

  const {
    config: {
      options,
      style: { border: outBorder },
    },
  } = value;
  const {
    border,
    backgroundColor,
    textStyle,
    borderRadius,
    placeholder,
    search,
  } = options;

  const chartId = useRef<string>(uniqueId(CHART_ID));
  const [inputValue, setInputValue] = useState<string>('');

  const { syncInteractiveAction } = useComponent<TInputConfig>(
    {
      component: value,
      global,
    },
    {
      current: {},
    } as any,
  );

  const onChange = () => {
    if (!inputValue) return;
    syncInteractiveAction('change', {
      value: inputValue,
    });
  };

  const componentClassName = useMemo(() => {
    return classnames(
      'dis-flex',
      className,
      styles['component-interactive-input'],
    );
  }, [className]);

  return (
    <>
      <div
        className={componentClassName}
        style={merge(
          {
            width: '100%',
            height: '100%',
            // @ts-ignore
            '--placeholder-color': getRgbaString(placeholder.color),
          },
          style,
        )}
        id={chartId.current}
      >
        <Wrapper border={outBorder}>
          {children}
          <div className="dis-flex w-100 h-100">
            <input
              value={inputValue}
              placeholder={placeholder.value}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
              className={styles['component-interactive-input-main']}
              style={{
                ...textStyle,
                ...(search.show
                  ? {
                      borderTopLeftRadius: borderRadius,
                      borderBottomLeftRadius: borderRadius,
                    }
                  : {
                      borderRadius,
                    }),
                color: getRgbaString(textStyle.color),
                border: `${border.width}px ${border.type} ${getRgbaString(
                  border.color,
                )}`,
                borderRightWidth: 0,
                backgroundColor: getRgbaString(backgroundColor),
                // @ts-ignore
                '--placeholder-color': getRgbaString(placeholder.color),
                // width: `calc( 100% - ${search.show ? search.width : 0}px - ${
                //   border.width * 2
                // }px )`,
                // ? 1.17 更改为百分比
                width: `${
                  100 -
                  (search.show ? Math.min(100, Math.max(search.width, 0)) : 0)
                }%`,
              }}
            />
            {search.show && (
              <div
                className={styles['component-interactive-input-button']}
                style={{
                  width: search.width + '%',
                }}
              >
                <button
                  className={
                    styles['component-interactive-input-button-content']
                  }
                  onClick={onChange}
                  style={{
                    ...search.textStyle,
                    color: getRgbaString(search.textStyle.color),
                    backgroundColor: getRgbaString(search.backgroundColor),
                    borderTopRightRadius: borderRadius,
                    borderBottomRightRadius: borderRadius,
                  }}
                >
                  {search.value}
                </button>
              </div>
            )}
          </div>
        </Wrapper>
      </div>
    </>
  );
};

const WrapperInput: typeof Input & {
  id: ComponentData.TComponentSelfType;
} = Input as any;

WrapperInput.id = CHART_ID;

export default WrapperInput;
