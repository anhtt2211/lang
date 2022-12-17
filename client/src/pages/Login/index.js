import Icon, { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Divider, Form, Input, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { getAuth } from 'redux/actions/auth';
import { authState$ } from 'redux/selectors';
import logo from '../../assets/images/logo.png';
import facebook from '../../assets/svg/facebook.svg';
import google from '../../assets/svg/google.svg';
import styles from './index.module.less';
import { Link } from 'react-router-dom';

const bcrypt = require('bcryptjs');

const hash = text => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(text, salt);
  return hash;
};
const Login = () => {
  let history = useHistory();
  const dispatch = useDispatch();
  const auth = useSelector(authState$);

  const login = values => {
    setLoading(true);
    let data = {
      username: values.username,
      password: values.password,
    };
    dispatch(getAuth.getAuthRequest(data));
  };
  useEffect(() => {
    if (auth) {
      if (auth.data) {
        if (auth.data.accessToken) {
          localStorage.setItem('accessToken', auth.data.accessToken);
          localStorage.setItem('refreshToken', auth.data.refreshToken);
          localStorage.setItem('idUser', auth.data.idUser);
          history.push('/admin');
        } else {
          setLoading(false);
          handleFailed(auth.data.message);
        }
      }
    }
  }, [auth]);

  let noticeFailed = () => {
    handleFailed('Please fill in all input fields!');
  };
  const handleFailed = message => {
    setFailedMessage(message);

    setIsFailed('1');
    setTimeout(function () {
      setIsFailed('0');
    }, 5000);
  };

  const [loading, setLoading] = useState(false);
  const [isFailed, setIsFailed] = useState('0');
  const [failedMessage, setFailedMessage] = useState('');
  const [form] = Form.useForm();
  return (
    <div className={styles.content}>
      <div className={styles.container}>
        <Row justify="center">
          <Col xs={20} sm={20} md={12} lg={12}>
            <Card>
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ textAlign: 'center' }}>
                  <img src={logo} style={{ height: '5rem' }} />
                  <p>Welcom to Lanspire!</p>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={20} lg={20}>
                    <div style={{ opacity: `${isFailed}` }}>
                      <Alert message={failedMessage} type="error" showIcon />
                    </div>
                    <Form
                      id="login-form"
                      layout="vertical"
                      onFinish={login}
                      onFinishFailed={noticeFailed}
                      form={form}
                      initialValues={{
                        remember: true,
                      }}>
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input
                          placeholder="Username"
                          prefix={<UserOutlined style={{ color: '#3e79f7' }} />}></Input>
                      </Form.Item>
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          { required: true, message: 'Please input your password!' },
                          { min: 6, message: 'Password must be minimum 6 characters.' },
                        ]}>
                        <Input.Password
                          placeholder="Password"
                          prefix={<LockTwoTone />}></Input.Password>
                      </Form.Item>
                      <Form.Item>
                        <Link to={`./forgot-password`}>
                          <Button className={styles['btn-forgot']} type="link">
                            Forgot password?
                          </Button>
                        </Link>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          size="large"
                          type="primary"
                          block="true"
                          htmlType="submit"
                          loading={loading}>
                          Sign In
                        </Button>
                      </Form.Item>
                    </Form>
                    {/* <div>
                      <Divider className={styles.divider}>or connect with</Divider>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button style={{ marginRight: '0.5rem' }}>
                          <Icon
                            component={() => <img className={styles['mini-icon']} src={google} />}
                          />
                          Google
                        </Button>
                        <Button>
                          <Icon
                            component={() => <img className={styles['mini-icon']} src={facebook} />}
                          />
                          Facebook
                        </Button>
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Login;
