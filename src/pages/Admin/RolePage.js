import React, { PureComponent } from 'react';
import { Alert, Button, Card, Col, Divider, Dropdown, Icon, Input, Menu, Row, Select, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import RoleEditor from './components/RoleEditor';

const { Search } = Input;

@connect(({ user, role, loading }) => ({
    currentUser: user.currentUser,
    role,
    loading: loading.models.role,
}))
class RolePage extends PureComponent {

    state = {
        modalVisible: false,
        formValues: {},
        modalTitle: '',
        editType: 'insert',
    };

    columns = [
        {
            key: 'rownum',
            title: '序号',
            align: 'center',
            width: 70,
            render: (text, record, index) => `${index + 1}`
        },
        {
            key: 'role',
            title: '角色',
            dataIndex: 'role',
        },
        {
            key: 'description',
            title: '详细信息',
            dataIndex: 'description',
        },
        {
            key: 'opr',
            title: '操作',
            width: 100,
            render: (text, record) => (
                <span>
                    <a onClick={() => this.handleEditRoleModalVisiable(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm title="你确定要删除该角色吗？"
                        onConfirm={() => this.handleDelete(record.key)}
                        okText="确定" cancelText="否">
                        <a>删除</a>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/fetchRoles',
        });
    }

    handleSearch = (value) => {
        const { dispatch } = this.props;
        if (value) {
            dispatch({
                type: 'role/serachRolesByKeyword',
                payload: value,
            });
        } else {
            dispatch({
                type: 'role/fetchRoles',
            });
        }
    }

    handleDelete = (key) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/deleteRole',
            payload: key,
        });
    }

    handleBatchDelete = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/batchDeleteRole',
        });
    }

    handleExpExcel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/expRoleToExcel',
        });
    }

    handleModalCancel = () => {
        this.setState({
            modalVisible: false,
        });
    }


    onSelectChange = (selectedRowKeys) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/saveSelectChangeRole',
            payload: { selectedRowKeys },
        })
    }

    handleClearSeleced = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/savaClearSelectedRowKeys',
        })
    }

    handleAddRoleModalVisiable = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '新建角色',
            editType: 'insert',
        });
    }

    handleEditRoleModalVisiable = (record) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑角色',
            editType: 'edit',
            formValues: record,
        });

        const { dispatch } = this.props;
        dispatch({
            type: 'role/savaChangeEditingRoleId',
            payload: record.id,
        })
    }

    render() {
        const {
            role: { roleList, selectedRowKeys, },
        } = this.props;

        const { modalVisible, modalTitle, editType, formValues }
            = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        }

        const menu = (
            <Menu>
                <Menu.Item key="1" disabled={selectedRowKeys.length === 0}>
                    <Popconfirm title="你确定要删除选定的角色吗？"
                        onConfirm={() => this.handleBatchDelete()}
                        okText="确定" cancelText="否">
                        <Icon type="delete" />
                        批量删除
                    </Popconfirm>
                </Menu.Item>
                <Menu.Item key="2" onClick={() => this.handleExpExcel()}>
                    <Icon type="file-excel" />
                    导出Excel
                </Menu.Item>
            </Menu>
        );

        const moreOprs = (
            <Dropdown overlay={menu}>
                <Button>
                    更多操作
                    <Icon type="down" />
                </Button>
            </Dropdown>
        );

        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <Row gutter={2}>
                        <Col span={12}>
                            <Button type="primary" icon="plus" style={{ marginRight: 5 }}
                                onClick={this.handleAddRoleModalVisiable}>新建</Button>
                            <Search placeholder="模糊查询"
                                allowClear={true}
                                style={{ width: 200 }}
                                onSearch={this.handleSearch}
                            >
                            </Search>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            {moreOprs}
                        </Col>
                    </Row>
                    <Row>
                        <Divider />
                    </Row>
                    <Row>
                        {selectedRowKeys.length > 0 &&
                            (<Alert message={`已选择${selectedRowKeys.length}项`} showIcon closeText="清除选择" afterClose={this.handleClearSeleced} />)
                        }
                    </Row>
                    <Row>
                        <Table bordered={true}
                            size="middle"
                            dataSource={roleList}
                            columns={this.columns}
                            rowSelection={rowSelection}
                            pagination={{ pageSize: 10 }} />
                    </Row>
                </Card>
                <RoleEditor
                    modalVisible={modalVisible}
                    modalTitle={modalTitle}
                    editType={editType}
                    formValues={formValues}
                    modalCancel={this.handleModalCancel}
                />
            </PageHeaderWrapper>
        );
    }
}

export default RolePage;