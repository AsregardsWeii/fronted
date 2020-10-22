import React, { PureComponent } from 'react';
import { Alert, Button, Card, Col, Divider, Dropdown, Icon, Input, Menu, Row, Select, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DeptEditor from './components/DeptEditor';

const { Search } = Input;

@connect(({ user, dept, loading }) => ({
    currentUser: user.currentUser,
    dept,
    loading: loading.models.dept,
}))
class DeptPage extends PureComponent {

    state = {
        modalVisible: false,
        formValues: {},
        modalTitle: '',
        editType: 'insert',
    };

    columns = [
        {
            key: 'id',
            title: '序号',
            dataIndex: 'id',
        },
        {
            key: 'name',
            title: '姓名',
            dataIndex: 'name',
        },
        {
            key: 'unit',
            title: '单位',
            dataIndex: 'unit',
        },
        {
            key: 'title',
            title: '职务',
            dataIndex: 'title',
        },
        {
            key: 'idCard',
            title: '身份证号',
            dataIndex: 'idCard',
        },
        {
            key: 'punishmentTime',
            title: '处分决定时间',
            dataIndex: 'punishmentTime',
        },
        {
            key: 'level',
            title: '标识',
            dataIndex: 'level',
        },
        {
            key: 'punishmentParty',
            title: '党纪处分',
            dataIndex: 'punishmentParty',
        },
        {
            key: 'punishmentPartyEffect',
            title: '影响期',
            dataIndex: 'punishmentPartyEffect',
        },
        {
            key: 'catalog',
            title: '违反纪律种类',
            dataIndex: 'catalog',
        },
        {
            key: 'creator',
            title: '创建人',
            dataIndex: 'creator',
        },

    ];

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'dept/fetchDepts',
        });
    }

    handleSearch = (value) => {
        const { dispatch } = this.props;
        if (value) {
            dispatch({
                type: 'dept/serachDeptsByKeyword',
                payload: value,
            });
        } else {
            dispatch({
                type: 'dept/fetchDepts',
            });
        }
    }

    handleDelete = (key) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dept/deleteDept',
            payload: key,
        });
    }

    handleBatchDelete = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dept/batchDeleteDept',
        });
    }

    handleExpExcel = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dept/expDeptToExcel',
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
            type: 'dept/saveSelectChangeDept',
            payload: { selectedRowKeys },
        })
    }

    handleClearSeleced = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'dept/savaClearSelectedRowKeys',
        })
    }

    handleAddDeptModalVisiable = () => {
        this.setState({
            modalVisible: true,
            modalTitle: '新建部门',
            editType: 'insert',
        });
    }

    handleEditDeptModalVisiable = (record) => {
        this.setState({
            modalVisible: true,
            modalTitle: '编辑部门',
            editType: 'edit',
            formValues: record,
        });

        const { dispatch } = this.props;
        dispatch({
            type: 'dept/savaChangeEditingDeptId',
            payload: record.id,
        })
    }

    render() {
        const {
            dept: { deptList, selectedRowKeys, },
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
                    <Popconfirm title="你确定要删除选定的部门吗？"
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
                                onClick={this.handleAddDeptModalVisiable}>新建</Button>
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
                            dataSource={deptList}
                            columns={this.columns}
                            rowSelection={rowSelection}
                            pagination={{ pageSize: 10 }} />
                    </Row>
                </Card>
                <DeptEditor
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

export default DeptPage;