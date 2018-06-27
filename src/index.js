import React, { Component } from 'react';
import PropTypes from 'prop-types';
import script from 'scriptjs';

// load remote component and return it when ready
// display current children while loading 
class ReactComponentLoader extends Component {
  state = {
    Component: null,
    error: null
  }

  componentDidMount() {
    // expose React for UMD build
    window.React = React;
    // async load of remote UMD component
    script(this.props.url, () => {
      var target = window[this.props.name];

      if (target) {

        console.log(target);

        if(target.__esModule) {
          target = target.default;
        }

        // loaded OK
        this.setState({
          error: null,
          Component: target
        });
      } else {
        // loaded fail
        this.setState({
          error: `Cannot load component ${this.props.name} at ${this.props.url}`,
          Component: null
        });
      }
    });
  }

  render() {
    if (this.state.Component) {
      return <this.state.Component {...this.props.props || {} } />;
    } else if (this.state.error) {
      return <div>{ this.state.error }</div>;
    } else {
      return this.props.children;
    }
  }
}

ReactComponentLoader.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  props: PropTypes.object
}

export default ReactComponentLoader;