/**
 * @author 杨金刚
 * @date 2020/5/6 8:45
 */

import React, { PureComponent } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import { connect } from 'dva';
import { apiCheckOldPassword } from '@/services/user';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;

@connect(({ user }) => ({ user }))
@Form.create()
class ChangePassword extends PureComponent {
    checkOldPassword = (rule, value, callback) => {
        const payload = { password: value, token: getToken() };
        apiCheckOldPassword(payload)
            .then(response => {
                if (!response.data) {
                    callback('原口令不正确');
                }
                else {
                    callback();
                }
            })
            .catch(err => console.log(err));
    }

    checkNewPassword = (rule, value, callback) => {
        if (value && value.length >= 6) {
            callback();
        }
        else {
            callback('密码最少为6位！');
        }
    }

    checkIsMatch = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('newPassword')) {
            callback('两次输入的密码不匹配！');
        } else {
            callback();
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 18 }, },
        }

        const {
            modalVisible, modalCancel, dispatch,
            form: { getFieldDecorator, validateFields },
        } = this.props;

        const handlePasswordChange = () => {
            validateFields({ force: true }, (error, values) => {
                if (!error) {
                    const payload = { ...values };
                    dispatch({
                        type: 'user/changePassword',
                        payload: payload,
                    });
                    modalCancel();
                }
            });
        }

        return (
            <Modal title="修改密码"
                visible={modalVisible}
                onCancel={modalCancel}
                destroyOnClose={true}
                footer={[
                    <Button key="submit" type="primary" onClick={handlePasswordChange}>
                        更改
                    </Button>
                ]}>
                <Form>
                    <FormItem {...formItemLayout} label="原密码" hasFeedback>
                        {getFieldDecorator('oldPassword', {
                            rules: [
                                { required: true, message: '请输入原密码' },
                                { validator: this.checkOldPassword },
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                        })(<Input type="password" placeholder="请输入原密码" />)}

                    </FormItem>
                    <FormItem {...formItemLayout} label="新密码" hasFeedback>
                        {getFieldDecorator('newPassword', {
                            rules: [
                                { required: true, message: '请输入新密码' },
                                { validator: this.checkNewPassword },
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                        })(<Input type="password" placeholder="请输入新密码(最少6位,区分大小写)" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="重复新密码" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                { required: true, message: '请重复新密码' },
                                { validator: this.checkIsMatch },
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                        })(<Input type="password" placeholder="请输入新密码" />)
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default ChangePassword;