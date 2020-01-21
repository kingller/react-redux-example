import _ from 'lodash';
import { action, observable } from 'mobx';

class UserTableStore {
    @observable
    search = '';

    @action
    onChange = (search: string): void => {
        this.search = search;
    };
}

export default new UserTableStore();
