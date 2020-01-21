import './index.less';

import React from 'react';
import { observer } from 'mobx-react';

import Input from '../../components/input/index';

// import AddDialog from './add/add';
import store from './index.store';

@observer
class User extends React.Component {
    render(): React.ReactNode {
        return (
            <div className="user">
                <Input
                    value={store.search}
                    onChange={store.onChange}
                    prependedIcon="icon-search"
                    placeholder={'搜索用户'}
                />
            </div>
        );
    }
}

export default User;
