import { CSSProperties, useMemo } from 'react';
import { merge } from 'lodash';

export const useComponentStyle: (
  value: ComponentData.TComponentData,
  options: {
    isSelect: boolean;
    style: CSSProperties;
    scale: number;
  },
) => CSSProperties = (value, options) => {
  const {
    config: {
      style: componentStyle,
      attr: { visible, lock },
    },
  } = value;
  const { isSelect, style, scale } = options;

  const styles = useMemo(() => {
    const { rotate, width, height, left, top, zIndex, ...nextComponentStyle } =
      componentStyle;
    return merge(
      {},
      nextComponentStyle,
      {
        transform: `rotate(${rotate}deg)`,
        display: visible ? 'inline-block' : 'none',
        borderWidth: (1 / scale) * 100,
        zIndex: isSelect ? 4 : zIndex,
        pointerEvents: lock ? 'none' : 'unset',
      },
      style,
    );
  }, [componentStyle, style, visible, scale, isSelect, lock]);

  return styles;
};

export const useComponentChildrenStyle: (
  value: ComponentData.TComponentData,
  options: {
    isOuter: boolean;
  },
) => CSSProperties = (value, options) => {
  const {
    config: {
      style: componentStyle,
      attr: { scaleX = 1, scaleY = 1 },
    },
  } = value;
  const { isOuter } = options;

  const styles = useMemo(() => {
    const { width, height, opacity, rotate, left, top } = componentStyle;
    const position: any = {};
    if (!isOuter) {
      position.left = left;
      position.top = top;
    }
    return {
      width: width / scaleX,
      height: height / scaleY,
      // width: '100%',
      // height: '100%',
      transform: `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
      opacity: opacity,
      ...position,
    };
  }, [componentStyle, scaleX, scaleY, isOuter]);

  return styles;
};