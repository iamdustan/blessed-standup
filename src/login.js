import React, {PropTypes, Component} from 'react';
import path from 'path';
import open from 'open';
import googleAuth from 'google-auth-library';
import * as cache from './utils/cache';

let config;
try {
  config = require(path.join(process.cwd(), '.blessedstanduprc'));
} catch(e) {
  throw new Error(
    'blessed-standup requires a `.blessedstanduprc` file containing a Google ' +
    'OAuth `CLIENT_ID` and `CLIENT_SECRET`.'
  );
}


const PERMISSION_SCOPE = 'https://spreadsheets.google.com/feeds';

const OAuth2Client = new googleAuth().OAuth2;
const client = new OAuth2Client(
  config.CLIENT_ID,
  config.CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob'
);

const url = client.generateAuthUrl({
  access_type: 'offline',
  scope: PERMISSION_SCOPE
});

class Login extends Component {
  constructor(props, context) {
    super(props, context);

    this._onFocus = this._onFocus.bind(this);
    this._login = this._login.bind(this);
  }

  _onFocus() {
    this.refs.field.readInput(() => {
      this._login();
      // this.setState({value: this.refs.field.getValue().trim()});
    });
  }

  componentDidMount() {
    const cachedCreds = cache.get('token');
    if (cachedCreds) {

      setTimeout(() => {
        this.props.onAuthenticate(cachedCreds);
      }, 500)
    }
  }

  _login() {
    if (!this.refs.field) {
      // TODO: when caching token why does this still succeed?
      return;
    }

    const code = this.refs.field.getValue();
    if (!code) {
      console.warn('invalid access code');
      return 
    }

    client.getToken(code, (err, token) => {
      if (err) {
        console.warn('invalid access code');
        return;
      }
      const creds = {
        client_id: config.CLIENT_ID,
        client_secret: config.CLIENT_SECRET,
        refresh_token: token.refresh_token
      };
      cache.set('token', creds);

      this.props.onAuthenticate(creds);
    });
  }

  render() {
    const {width, height} = this.props;
    const WIDTH = Math.floor(width / 2);
    const LEFT = Math.floor(width / 4);

    const LOGIN = "Log in"
    return (
      <element>
        <text 
          left={Math.floor((width - LOGIN.length) / 2)}
          top={2}>
          {LOGIN}
          </text>
        <box
          class={styles.container}
          top={6}
          width={WIDTH}
          left={LEFT}
        >
          Navigate to:
          <box
            left={13}
            clickable={true}
            onClick={() => open(url)}>
            {url}
          </box>
        </box>
        <form
          ref="element"
          top={10}
          width={WIDTH}
          left={LEFT}
          class={styles.box}
          label="OAuth Token"
          clickable={true}
          onSubmit={this._login}
        >
          <textarea
            ref="field"
            input={true}
            mouse={true}
            keys={true}
            vi={true}
            name=""
            onFocus={this._onFocus}
          />
          <button
            left={WIDTH - LOGIN.length - 3}
            mouse={true}
            onPress={this._login}>
            Log in
          </button>
        </form>
      </element>
    );
  }
}

export default Login;

const styles = {
  container: {
    border: {type: 'line', fg: 'white'},
    height: 5,
  },
  box: {
    border: {type: 'line', fg: 'yellow'},
    height: 3,
  }
};

