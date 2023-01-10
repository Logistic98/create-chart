import { useCallback } from 'react';
import { CopyOutlined } from '@ant-design/icons';
import { get } from 'lodash';
import { Message } from '@/components/RequestMessage';
import LocalConfigInstance, { LocalConfig } from '@/utils/Assist/LocalConfig';
import ClipboardComponent from '@/utils/Assist/ClipboardComponent';
import { getDvaGlobalModelData } from '@/utils/Assist/Component';
import useChildren from './useChildren';
import { CommonActionType } from './type';

const _clone = async (
  select: string[],
  setClipboard: (value: ComponentClipboard.LocalClipboardType) => void,
) => {
  const result =
    (await LocalConfigInstance.getItem(
      LocalConfig.CONFIG_KEY_CROSS_CLIPBOARD,
    )) || {};

  if (result.errMsg) throw new Error(result.errMsg as string);

  const storageClipboard =
    result.value as ComponentClipboard.StorageClipboardType;

  const timestamps = Date.now();
  const id = get(getDvaGlobalModelData(), 'screenData._id');

  if (typeof storageClipboard?.show !== 'boolean' || storageClipboard.show) {
    await LocalConfigInstance.setItem(LocalConfig.CONFIG_KEY_CROSS_CLIPBOARD, {
      ...storageClipboard,
      show: true,
      timestamps,
      value: ClipboardComponent.geComponentsBySelect(select),
      screenId: id,
    });
  }

  setClipboard({
    timestamps,
    value: select,
  });

  return true;
};

const cloneMessage: Message = new Message(_clone);

export const clone = async (
  select: string[],
  setClipboard: (value: ComponentClipboard.LocalClipboardType) => void,
) => {
  await cloneMessage.createMessage(
    {
      loading: {
        content: '拷贝中...',
      },
      success: {
        content: '拷贝成功',
      },
      error: {
        content: '拷贝失败',
      },
    },
    select,
    setClipboard,
  );
};

const CloneAction = (props: CommonActionType) => {
  const { select, setClipboard, onClick, childrenType, disabled } = props;

  const handleClick = useCallback(
    (e: any) => {
      e?.stopPropagation();
      clone(select, setClipboard);
      onClick?.();
    },
    [setClipboard, select, onClick],
  );

  const children = useChildren(childrenType, {
    title: '拷贝',
    icon: <CopyOutlined />,
    key: 'clone',
    onClick: handleClick,
    disabled,
  });

  return children;
};

export default CloneAction;
