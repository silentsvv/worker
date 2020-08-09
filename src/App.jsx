import React, { Component } from 'react';
import Search from './components/search/index.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
        <React.Fragment>
            <Search/>
        </React.Fragment>
    )
  }
}

export default App
