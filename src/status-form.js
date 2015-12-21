import React, {Component, PropTypes} from 'react';
import Status from './status';

const style = {
  submitButton: {
    top: 0, right: 0, height: 3,
    bold: true,
    border: {
      type: 'line',
      fg: 'blue',
    },
    fg: '#fff',
  }
};

class StatusForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      yesterday: '',
      today: '',
      blockers: '',
    };

    this._onSubmit = this._onSubmit.bind(this);
  }

  _onSubmit() {
    this.props.onSubmit(this.state);
  }

  onChange(key, value) {
    // TODO: use setState without destroying children
    this.state[key] = value;
    // this.setState({[key]: value});
  }

  render() {
    const {changeFocus, layout} = this.props;
    const BUTTON_WIDTH = 6;
    const SEGMENT_WIDTH = Math.floor((layout.width - BUTTON_WIDTH) / 3);

    return (
      <element>
        <Status
          changeFocus={changeFocus}
          label="Yesterday"
          onChange={this.onChange.bind(this, 'yesterday')}
          layout={Object.assign({left: 0, width: SEGMENT_WIDTH}, layout)}
        />
        <Status
          changeFocus={changeFocus}
          label="Today"
          onChange={this.onChange.bind(this, 'today')}
          layout={Object.assign({left: SEGMENT_WIDTH * 1, width: SEGMENT_WIDTH}, layout)}
        />
        <Status
          changeFocus={changeFocus}
          label="Blockers?"
          placeholder="What's holding you down?"
          onChange={this.onChange.bind(this, 'blockers')}
          layout={Object.assign({left: SEGMENT_WIDTH * 2, width: SEGMENT_WIDTH}, layout)}
        />
        <box
          changeFocus={changeFocus}
          class={style.submitButton}
          clickable={true}
          onClick={this._onSubmit}
          left={SEGMENT_WIDTH * 3}
          width={BUTTON_WIDTH}>
          Send
        </box>
      </element>
    );
  }
}

StatusForm.propTypes = {
  layout: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default StatusForm;

