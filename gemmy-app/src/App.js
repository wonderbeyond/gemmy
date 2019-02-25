import React, {Component} from 'react';
import logo from './cat.svg';
import './App.css';

import {GemmyClient, GEM2Html} from './lib/gemmy';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitGem: ''
    }
  }
  async componentDidMount() {
    let gm = new GemmyClient()
    let hitGem = await gm.randomGet()
    this.setState({hitGem: hitGem});
  }
  render() {
    return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p dangerouslySetInnerHTML={{__html: GEM2Html(this.state.hitGem) || "喵~"}}>
        </p>
        <p className="credit-info">
          Powered by <a className="App-link" href="https://github.com/wonderbeyond/gemmy" rel="noopener noreferrer">wonderbeyond/gemmy</a>
        </p>
      </header>
    </div>);
  }
}

export default App;
