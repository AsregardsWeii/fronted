/**
 * @author 杨金刚
 * @date 2020/4/24 8:05
 */

import React, { PureComponent } from 'react';
import { Button, Col, Card, Checkbox, Divider, Form, Icon, Input, Row, Modal, Select } from 'antd';
import { connect } from 'dva';
import { apiCheckRole, apiCheckDescription } from '@/services/role';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;

@connect(({ role }) => ({ role }))
@Form.create()
class RoleEditor extends PureComponent {

    // 检查角色名称可用
    checkRole = (rule, value, callback) => {
        const payload = { role: value, token: getToken() };
        apiCheckRole(payload)
            .then(response => {
                if (response.data) {
                    callback('已经存在该角色');
                }
                else {
                    callback();
                }
            })
            .catch(err => console.log(err));
    };

    render() {
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 4 }, },
            wrapperCol: { xs: { span: 24 }, sm: { span: 20 }, },
        }

        const {
            formValues, modalTitle, modalVisible, modalCancel,
            editType, dispatch, 
            form: { getFieldDecorator, validateFields, getFieldValue },
            role: { roleList, editingRoleId, },
        } = this.props;

        const roleOption = roleList.map(d => <Option key={d.id} value={d.id}>{d.role}</Option>)

        const validate = () => {
            validateFields({ force: true }, (error, values) => {
                if (!error) {
                    const payload = { ...values };
                    if (editType === "edit") {
                        dispatch({
                            type: 'role/updateRole',
                            payload: { ...values, id: editingRoleId },
                        });
                    } else {
                        dispatch({
                            type: 'role/addRole',
                            payload,
                        });
                    }
                    modalCancel();
                }
            });
        }

        return (
            <Modal title={modalTitle}
                visible={modalVisible}
                onCancel={modalCancel}
                destroyOnClose={true}
                footer={[
                    <Button key="submit" type="primary" onClick={validate}>
                        保存
                    </Button>
                ]}>
                <Form>
                    <FormItem {...formItemLayout} label="角色名称" hasFeedback>
                        {getFieldDecorator('role', {
                            initialValue: formValues.role,
                            rules: [
                                { required: true, message: '角色名称为必填项' },
                                { validator: this.checkRole },
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                        })(<Input placeholder="请输入角色名称" />)}

                    </FormItem>
                    <FormItem {...formItemLayout} label="详细信息" hasFeedback>
                        {getFieldDecorator('Description', {
                            initialValue: formValues.parentRoleId,
                            rules: [
                                { required: true, message: '详细信息为必填项' },
                            ],
                        })
                        (<Input placeholder="请填写详细信息"
                            style={{ width: '100%' }}
                        >
                            {/* {roleOption} */}
                        </Input>)
                        }
                    </FormItem>
                </Form>
            </Modal>
        );

    }
}

export default RoleEditor;