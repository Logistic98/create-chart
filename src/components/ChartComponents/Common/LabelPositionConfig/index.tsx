import Select from '../Select';
import ConfigList from '../Structure/ConfigList';
import FullForm from '../Structure/FullForm';

const { Item } = ConfigList;

const POSITION_MAP = [
  {
    label: '上',
    value: 'top',
  },
  {
    label: '下',
    value: 'bottom',
  },
  {
    label: '左',
    value: 'left',
  },
  {
    label: '右',
    value: 'right',
  },
  {
    label: '内部',
    value: 'inside',
  },
  {
    label: '外部',
    value: 'outside',
  },
  {
    label: '内上',
    value: 'insideTop',
  },
  {
    label: '内下',
    value: 'insideBottom',
  },
];

const LabelPositionConfig = (props: {
  value: ComponentData.ComponentLabelPosition;
  onChange: (value: ComponentData.ComponentLabelPosition) => void;
  level?: any;
}) => {
  const { value, onChange, level } = props;

  return (
    <Item label="位置" labelProps={{ level }}>
      <FullForm>
        <Select
          value={value}
          onChange={onChange as any}
          className="w-100"
          options={POSITION_MAP}
        />
      </FullForm>
    </Item>
  );
};

export default LabelPositionConfig;
