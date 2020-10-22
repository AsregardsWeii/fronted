/**
 * @author 杨金刚
 * @date 2020/4/24 8:05
 */

import React, { PureComponent } from 'react';
import { Button, Col, Card, Checkbox, Divider, Form, Icon, Input, Row, Modal, Select } from 'antd';
import { connect } from 'dva';
import { apiCheckDept, apiCheckDescription } from '@/services/dept';
import { getToken } from '@/utils/authority';

const FormItem = Form.Item;

@connect(({ dept }) => ({ dept }))
@Form.create()
class DeptEditor extends PureComponent {

    // 检查部门名称可用
    checkDept = (rule, value, callback) => {
        const payload = { dept: value, token: getToken() };
        apiCheckDept(payload)
            .then(response => {
                if (response.data) {
                    callback('已经存在该部门');
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
            dept: { deptList, editingDeptId, },
        } = this.props;

        const deptOption = deptList.map(d => <Option key={d.id} value={d.id}>{d.dept}</Option>)

        const validate = () => {
            validateFields({ force: true }, (error, values) => {
                if (!error) {
                    const payload = { ...values };
                    if (editType === "edit") {
                        dispatch({
                            type: 'dept/updateDept',
                            payload: { ...values, id: editingDeptId },
                        });
                    } else {
                        dispatch({
                            type: 'dept/addDept',
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
                    <FormItem {...formItemLayout} label="部门名称" hasFeedback>
                        {getFieldDecorator('dept', {
                            initialValue: formValues.dept,
                            rules: [
                                { required: true, message: '部门名称为必填项' },
                                { validator: this.checkDept },
                            ],
                            validateTrigger: 'onBlur',
                            validateFirst: true,
                        })(<Input placeholder="请输入部门名称" />)}

                    </FormItem>
                    <FormItem {...formItemLayout} label="上级部门" hasFeedback>
                        {getFieldDecorator('parentDeptId', {
                            initialValue: formValues.parentDeptId,
                            rules: [
                                { required: true, message: '上级部门为必填项' },
                            ],
                        })(<Select placeholder="请选择上级部门"
                            style={{ width: '100%' }}
                        >
                            {deptOption}
                        </Select>)
                        }
                    </FormItem>
                </Form>
            </Modal>
        );

    }
}

export default DeptEditor;