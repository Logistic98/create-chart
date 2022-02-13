import { useCallback } from 'react';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import IconTooltip from '@/components/IconTooltip';
import FilterDataUtil from '@/utils/Assist/FilterData';
import { connect } from 'dva';
import Title from '../NormalTitle';
import { TOnChange } from '../DefineConfig/type.d';
import { mapStateToProps, mapDispatchToProps } from './connect';

const ResponseDataTitle = (props: {
  onChange?: TOnChange;
  value: ComponentData.TComponentApiDataConfig;
  params: ComponentData.TParams[];
}) => {
  const { onChange, value, params } = props;

  const {
    request: { type },
  } = value;

  const reRequestData = useCallback(async () => {
    const result: any = await FilterDataUtil.requestData(props.value!, params);
    onChange?.({
      request: {
        value: result,
      },
    });
  }, [value, onChange, params]);

  return (
    <Title>
      数据响应结果
      {type === 'api' && (
        <IconTooltip title="重新获取数据">
          <Loading3QuartersOutlined onClick={reRequestData} />
        </IconTooltip>
      )}
    </Title>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ResponseDataTitle);