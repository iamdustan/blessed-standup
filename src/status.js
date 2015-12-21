
import React, {Component, PropTypes} from 'react';
import screen from './screen';

const styles = {
  box: {
    border: {type: 'line', fg: 'yellow'},
    hover: {
      border: {type: 'line', fg: 'red'}
    },
  }
};

class Status extends Component {
  constructor(props, context) {
    super(props, context);

    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onKeyPress = this._onKeyPress.bind(this);
    this.state = {value: props.placeholder};
  }


  componentDidMount() {
    this.refs.field.key(['shift-tab', 'tab'], (ch, event) => {
      if (this.props.changeFocus) {
        this.props.changeFocus(ch, event);
        return false;
      }
    });
  }

  _onKeyPress(value, event) {
    /*
    if (event.name === 'backspace') {
      this.setState({value: this.state.value.slice(0, this.state.value.length - 1)});
    } else {
      this.setState({value: this.state.value + value});
    }
    */
  }

  _onBlur() {
    const value = this.refs.field.getValue().trim();
    if (!value || value === this.props.placeholder) {
      this.setState({value: this.props.placeholder});
    }

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  _onFocus() {
    if (this.state.value === this.props.placeholder) {
      this.setState({value: ''});
    }
    this.refs.field.readInput(() => {
      this.setState({value: this.refs.field.getValue().trim()});
    });
  }

  render() {
    const {label, layout} = this.props;

    return (
      <form
        ref="element"
        class={styles.box}
        width="50%"
        {...layout}
        label={label}
        clickable={true}
      >
        <textarea
          ref="field"
          input={true}
          mouse={true}
          keys={true}
          vi={true}
          name="status"
          value={this.state.value}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          onKeypress={this._onKeyPress}
        />
      </form>
    );
  }
}

Status.defaultProps = {
  placeholder: 'What did you do?',
};

Status.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string.isRequired,
  layout: PropTypes.object.isRequired,
}


export default Status;

