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
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {label, layout} = this.props;
    let data = this.props.data || [TITLE, DEFAULT_DATA];

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
  label: PropTypes.string.isRequired,
  layout: PropTypes.object.isRequired,
}


export default Others;

