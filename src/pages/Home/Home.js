
import React, { PureComponent, Fragment } from 'react';
import { Alert, AutoComplete, Button, Col, Card, Divider, Dropdown, Form, Icon, Input, Menu, Row, Select, Table, Popconfirm } from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';



export default class Home extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <PageHeaderWrapper >
        <Card bordered={false}>
          <div style={{height: 300}}>

          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

