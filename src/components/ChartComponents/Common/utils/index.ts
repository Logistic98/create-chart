import { RadialGradient, LinearGradient } from '@/utils/Assist/EchartsLoader';
import ColorSelect from '@/components/ColorSelect';

const { getRgbaString } = ColorSelect;

export function radialGradientColor(value: ComponentData.TGradientColorConfig) {
  if (!value) return false;
  const { start, end, radialPosition, linearPosition, type } = value;
  const commonStepColor = [
    {
      offset: 0,
      color: getRgbaString(start),
    },
    {
      offset: 1,
      color: getRgbaString(end),
    },
  ];

  if (type === 'radial') {
    return RadialGradient(
      radialPosition.x,
      radialPosition.y,
      radialPosition.r,
      commonStepColor,
    );
  }

  return LinearGradient(
    linearPosition.startX,
    linearPosition.startY,
    linearPosition.endX,
    linearPosition.endY,
    commonStepColor,
  );
}

export function boxShadow(value: ComponentData.TBoxShadow) {
  if (!value) return false;
  const { hShadow, vShadow, blur, spread, color } = value;
  return `${hShadow}px ${vShadow}px ${blur}px ${spread}px ${getRgbaString(
    color,
  )}`;
}
