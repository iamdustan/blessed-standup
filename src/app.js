import React, {Component} from 'react';
import Login from './login';
import Yellowbox from 'yellowbox-react/lib/blessed';
import StatusForm from './status-form';
import Others from './others';
import api from './api';
import {exec} from 'child_process';

const TODAY = new Date();

const style = {
  closeButton: {
    top: 0, right: 0,
    width: 1, height: 1,
    bg: 'red',
    fg: '#000',
  },
};

class App extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      authentication: null,
      data: null
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.props.screen.on('resize', this.forceUpdate);

    const MAX_LENGTH = 20;
    const trim = s => s.length > MAX_LENGTH ? `${s.slice(0, MAX_LENGTH - 3)}...` : s;
    api.on('load', (data) => {
      this.setState({data});
    });

    api.on('change', (data) => {
      this.setState({data});
    });
  }

  componentWillUnmount() {
    this.props.screen.off('resize', this.forceUpdate);
  }

  componentDidMount() {
    const {screen} = this.props;
    screen.focusNext();
  };

  handleFocus(ch, event) {
    if (event.name === 'tab') {
      const {screen} = this.props;
      if (event.shift) {
        screen.focusPrevious();
      } else {
        screen.focusNext();
      }
    }
  }

  handleSubmit(fields) {
    exec('git config user.name', function (err, stdout) {
      api.set(stdout.trim(), fields);
    });
  }

  render() {
    const {height, width} = this.props.screen;
    let app;
    if (!this.state.authentication) {
      app = (
        <Login
          width={width}
          height={height}
          onAuthenticate={(credentials) => {
            this.setState({authentication: credentials});
            api.load(credentials, (err, data) => {
              if (err) throw err;
            });
          }}
        />
      );
    } else {
      const STATUS_FORM_HEIGHT = 3;
      app = (
        <element>
          <StatusForm
            changeFocus={this.handleFocus}
            onSubmit={this.handleSubmit}
            layout={{top: 0, height: STATUS_FORM_HEIGHT, width}}
          />
          <Others
            layout={{
              top: STATUS_FORM_HEIGHT,
              height: height - STATUS_FORM_HEIGHT,
              width,
            }}
            data={this.state.data}
          />
        </element>
      );
    }

    return (
      <element>
        {app}
        <Yellowbox layout={{top: height - Math.floor(height * 0.2), height: Math.floor(height * 0.2) }} />
        <box class={style.closeButton} clickable={true} onClick={() => process.exit(0)}>×</box>
      </element>
    );
  }
}

export default App;

