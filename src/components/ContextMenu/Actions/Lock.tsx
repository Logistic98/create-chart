import { useCallback, useMemo } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { useIdPathMap } from '@/hooks';
import useChildren from './useChildren';
import { CommonActionType } from './type';

const LockAction = (props: CommonActionType) => {
  const {
    value,
    path,
    setComponent,
    components,
    select,
    onClick,
    childrenType,
    disabled,
  } = props;
  const {
    id,
    config: {
      attr: { lock },
    },
  } = value;

  const isLock = useMemo(() => {
    // * 选中多个的情况下，统一显示锁定
    return lock && select.length === 1;
  }, [lock, select]);

  const title = useMemo(() => {
    return isLock ? '取消锁定' : '锁定';
  }, [isLock]);

  const handleClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      if (isLock) {
        setComponent({
          value: {
            config: {
              attr: {
                lock: false,
              },
            },
          },
          id,
          path,
          action: 'update',
        });
      } else {
        const idPathMap = useIdPathMap();

        const updateComponent = select.reduce<
          ComponentMethod.SetComponentMethodParamsData[]
        >((acc, cur) => {
          const target = idPathMap[cur];
          if (target) {
            const { path, id } = target;
            acc.push({
              path,
              id,
              action: 'update',
              value: {
                config: {
                  attr: {
                    lock: true,
                  },
                },
              },
            });
          }
          return acc;
        }, []);

        setComponent(updateComponent);
      }
      onClick();
    },
    [isLock, id, path, components, select, onClick],
  );

  const children = useChildren(childrenType, {
    title,
    icon: <LockOutlined />,
    key: 'lock',
    onClick: handleClick,
    disabled,
    checked: isLock,
  });

  return children;
};

export default LockAction;
