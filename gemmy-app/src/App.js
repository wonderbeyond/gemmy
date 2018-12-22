import React, {Component} from 'react';
// import logo from './logo.svg';
import logo from './cat.svg';
import './App.css';

import {GemmyClient, GEMMY_BASE_URL} from './lib/gemmy';
import {randomInt} from './lib/utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hitGem: ''
    }

    let gm = new GemmyClient()
    gm.fetchIndex().then(indexData => {
      console.debug('Got index data:', indexData)
      let hitNum = randomInt(1, indexData.total_count) // starts from 1
      let pageNum = Math.ceil(hitNum / indexData.pagination.size)
      let inPageOffset = (hitNum % indexData.pagination.size) - 1 // start from 0
      if (inPageOffset == -1) {
        inPageOffset = indexData.pagination.size - 1
      }
      console.debug(`Hit gem#${hitNum}, at page#${pageNum} line#${inPageOffset + 1}`)
      fetch(`${GEMMY_BASE_URL}/gems/${pageNum}`).then(resp => {
        resp.text().then(text => {
          let lines = text.split('\n')
          let hitGem = lines[inPageOffset]
          console.debug('GEM:', hitGem);
          this.setState({hitGem: hitGem});
        })
      })
    })
  }
  render() {
    return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          {this.state.hitGem || "喵~"}
        </p>
        <p className="credit-info">
          Powered by <a className="App-link" href="https://github.com/wonderbeyond/gemmy" rel="noopener noreferrer">wonderbeyond/gemmy</a>
        </p>
      </header>
    </div>);
  }
}

export default App;
