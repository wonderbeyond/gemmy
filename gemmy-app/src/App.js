import React, {Component} from 'react';
import logo from './cat.svg';
import './App.css';

import snarkdown from 'snarkdown';
import {GemmyClient} from 'gemmy-client';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitGem: ''
    }
  }
  async componentDidMount() {
    let gmc = new GemmyClient()
    let hitGem = await gmc.randomGet()
    this.setState({hitGem: hitGem});
  }
  render() {
    return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p dangerouslySetInnerHTML={{__html: snarkdown(this.state.hitGem.content || "Mew~")}}>
        </p>
        <p className="credit-info">
          Powered by <a className="App-link" href="https://github.com/wonderbeyond/gemmy" rel="noopener noreferrer">wonderbeyond/gemmy</a>
        </p>
      </header>
    </div>);
  }
}

export default App;
