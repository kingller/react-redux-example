import './index.less';

import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

export type InputProps = {
    /** 输入框内容 */
    value?: string | number;
    /** 输入框前缀缩略图 */
    thumb?: string;
    /** 输入框内容改变时的回调 */
    onChange?: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
    /** input 的 name 属性 */
    name?: string;
    /** 按下回车键时的回调 */
    onEnter?: (e?: React.KeyboardEvent<HTMLInputElement>) => void;
    /** 输入框获得焦点时的回调 */
    onFocus?: (e?: React.FocusEvent<HTMLInputElement>) => void;
    /** 输入框失去焦点时的回调 */
    onBlur?: (e?: React.FocusEvent<HTMLInputElement>) => void;
    /** 输入框前缀图标 */
    prependedIcon?: React.ReactNode;
    /** 输入框后缀图标 */
    appendedIcon?: React.ReactNode;
    /** 点击输入框后缀图标时的回调 */
    appendedClick?: (e?: React.MouseEvent) => void;
    /** 点击输入框后缀图标鼠标按键被按下时的回调 */
    appendedMouseDown?: (e?: React.MouseEvent) => void;
    /** 输入框类型 */
    type?: string;
    /** 是否设置为只读 */
    readOnly?: boolean;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否自动获得焦点 */
    autoFocus?: boolean;
    transform?: (value: string) => string;
    setCursorPosition?: (inputEl: React.ReactNode) => void;
    /** 自动填充 */
    autoComplete?: string;
    /** placeholder */
    placeholder?: string;
    /** Input元素 */
    saveInput?: (node: HTMLInputElement) => void;
    className?: string;
    style?: React.CSSProperties;
};

export class Input extends React.PureComponent<InputProps> {
    static defaultProps = {
        value: '',
        type: 'text',
        onChange: _.noop,
        onFocus: _.noop,
        onBlur: _.noop,
        onEnter: _.noop,
        readOnly: false,
        autoFocus: false,
        setCursorPosition: _.noop,
        transform: _.identity,
    };

    inputEl: HTMLInputElement;
    saveInput = (node: HTMLInputElement): void => {
        this.inputEl = node;
        const { saveInput } = this.props;
        saveInput && saveInput(node);
    };

    componentDidMount(): void {
        if (this.props.autoFocus && !this.props.readOnly && !this.props.disabled) {
            this.inputEl.focus();
        }
    }
    componentDidUpdate(): void {
        //设置光标位置
        if (this.props.setCursorPosition) {
            this.props.setCursorPosition(this.inputEl);
        }
    }

    onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string = this.props.transform((e.target as HTMLInputElement).value || '');
        // 如果转换以后，value没有变化，则不需要触发change事件
        if (value === this.props.value) return;
        this.props.onChange(value, e);
    };

    onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            this.props.onEnter(e);
        }
    };

    render(): React.ReactNode {
        let {
            value,
            thumb,
            placeholder,
            prependedIcon,
            appendedIcon,
            appendedClick,
            appendedMouseDown,
            readOnly,
            disabled,
            onChange,
            onEnter,
            onFocus,
            onBlur,
            type,
            autoFocus,
            name,
            children,
            transform,
            setCursorPosition,
            autoComplete,
            className,
            style,
            saveInput,
            ...props
        } = this.props;
        const clazz = classnames('pdr-form-input', className, {
            'icon-prepended': !thumb && prependedIcon,
            'icon-appended': appendedIcon,
            'with-thumb': thumb,
        });
        //自动将 null 或 undefined 改成空字符串
        value = _.isNil(value) ? '' : value;
        if (prependedIcon && _.isString(prependedIcon)) {
            prependedIcon = <span className={`${prependedIcon}`} />;
        }
        if (appendedIcon && _.isString(appendedIcon)) {
            appendedIcon = <span className={`${appendedIcon}`} />;
        }

        const inputProps = { name: '', autoComplete };
        if (name) {
            inputProps.name = name;
        }
        if (autoComplete) {
            inputProps.autoComplete = autoComplete;
        }

        return (
            <div className={clazz} style={style}>
                <If condition={!thumb && !!prependedIcon}>
                    <div key="prepended-icon" className="prepended-icon">
                        {prependedIcon}
                    </div>
                </If>
                <input
                    type={type}
                    value={value}
                    readOnly={readOnly}
                    disabled={disabled}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    {...props}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress}
                    {...inputProps}
                    ref={this.saveInput}
                />
                <If condition={!!appendedIcon}>
                    <div
                        key="appended-icon"
                        className={classnames('appended-icon', {
                            clickable: !!appendedClick,
                        })}
                        onMouseDown={appendedMouseDown}
                        onClick={appendedClick}>
                        {appendedIcon}
                    </div>
                </If>
                <If condition={thumb !== undefined}>
                    <img key="thumb" src={thumb} />
                </If>
                {children}
            </div>
        );
    }
}

export default Input;
