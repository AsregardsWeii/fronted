/**
 * @author 杨金刚
 * @date 2020/4/20 15:55
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import moment from 'moment';
import { Alert, Button, Icon, DatePicker, Input, Form, Row, Col } from 'antd';
import {clearLocalStorage } from '@/utils/authority';
import { apiHost } from '@/constants/adminConstants'
import styles from './Login.less';

const FormItem = Form.Item;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
  };

  componentDidMount() {
    clearLocalStorage();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { type } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
          },
        });
      }
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting, login: { jobDate }, form: { getFieldDecorator } } = this.props;
    const { type, autoLogin } = this.state;

    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>

          {login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <FormItem>
            {this.props.form.getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ],
            })(<Input size='large' prefix={<Icon type="user" className={styles.prefixIcon} />} placeholder='用户名' />)
            }
          </FormItem>
          <FormItem>
            {this.props.form.getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入口令!',
                },
              ],
            })(<Input size='large' type='password' prefix={<Icon type="lock" className={styles.prefixIcon} />} placeholder='口令' />)
            }
          </FormItem>

          <FormItem>
            <Row gutter={8}>
              <Col span={24}>
                <Button size="large" className={styles.submit} style={{width:'100%'}} type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="app.login.login" />
                </Button>
              </Col>
            </Row>
          </FormItem>

        </Form>
       
      </div>
    );
  }
}

export default Form.create()(LoginPage);
