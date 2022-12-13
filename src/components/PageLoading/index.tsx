import { CSSProperties } from 'react';
import classnames from 'classnames';
import { PageLoading } from '@ant-design/pro-layout';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { usePrimaryColor } from '@/hooks';
import styles from './index.less';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
// export default PageLoading;
const Loading = (props: { style?: CSSProperties; className?: string }) => {
  const color = usePrimaryColor();

  const { style, className } = props;

  return (
    <div className={styles['page-custom-loading-wrapper']}>
      <PacmanLoader
        style={style}
        className={classnames(styles['page-custom-loading'], className)}
        size={25}
        loading
        color={color}
      />
    </div>
  );
};

export const InternalLoading = (props: {
  style?: CSSProperties;
  className?: string;
}) => {
  const color = usePrimaryColor();

  const { style, className } = props;

  return (
    <PacmanLoader
      style={style}
      className={classnames(styles['page-custom-loading'], className)}
      size={25}
      loading
      color={color}
    />
  );
};

export default Loading;
