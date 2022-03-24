import { useCallback, useMemo, useState } from 'react';
import { connect } from 'dva';
import { Button, message } from 'antd';
import { Email, Password, Captcha, CommonBackground } from '../Login';
import { mapStateToProps, mapDispatchToProps } from './connect';

const Forget = (props: { forger: (value: any) => any }) => {
  const { forger } = props;

  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [captcha, setCaptcha] = useState<string>('');
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const handleForget = useCallback(async () => {
    if (!password) {
      return message.info('请输入密码');
    }
    if (!email) {
      return message.info('请输入邮箱');
    }
    if (!captcha) {
      return message.info('请输入验证码');
    }

    setFetchLoading(true);
    try {
      await forger({ password, captcha, email });
    } catch (err) {
      message.info('提交错误');
    } finally {
      setFetchLoading(false);
    }
  }, [password, forger, email, captcha]);

  const action = useMemo(() => {
    return (
      <Button
        style={{ marginTop: 4 }}
        loading={fetchLoading}
        type="primary"
        block
        onClick={handleForget}
      >
        提交
      </Button>
    );
  }, [handleForget]);

  return (
    <CommonBackground title="Welcome" subTitle="忘记密码🐲" action={action}>
      <Email value={email} onChange={setEmail} />
      <Captcha
        email={email}
        value={captcha}
        onChange={setCaptcha}
        status="forget"
      />
      <Password value={password} onChange={setPassword} />
    </CommonBackground>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Forget);