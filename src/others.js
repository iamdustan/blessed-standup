import React, {Component, PropTypes} from 'react';

const styles = {
  box: {
    border: {type: 'line', fg: 'yellow'},
    hover: {
      border: {type: 'line', fg: 'red'}
    },
  }
};

const TITLE = ['Date', 'Human', 'Yesterday', 'Today', 'Blockers'];
const DEFAULT_DATA = ['Loading...', 'Loading...', 'Loading...', 'Loading...', 'Loading...'];

class Others extends Component {
  render() {
    const {label, layout} = this.props;
    let data = this.props.data || [TITLE, DEFAULT_DATA];
    data = data.map(d => d.slice(1)); // slice off the date display for now

    return (
      <table
        class={styles.box}
        {...layout}
        data={data}
      />
    );
  }
}

Others.propTypes = {
  label: PropTypes.string,
  layout: PropTypes.object.isRequired,
}


export default Others;

