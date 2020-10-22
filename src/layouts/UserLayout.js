import React, { Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Card, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';


const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" />  2020 中国铁路哈尔滨局集团公司信息技术所
  </Fragment>
);

class UserLayout extends React.PureComponent {

  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <Card>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>DEMO--前端项目</span>
                </Link>
              </div>
            </div>
            {children}
          </Card>
        </div>
        <GlobalFooter copyright={copyright} />
      </div>
    );
  }
}

export default UserLayout;
