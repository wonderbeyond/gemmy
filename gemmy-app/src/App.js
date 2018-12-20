import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {GemmyClient, GEMMY_BASE_URL} from './lib/gemmy';
import {randomInt} from './lib/utils';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {hitGem: ''}

    let gm = new GemmyClient()
    gm.fetchIndex().then(indexData => {
      console.log('New index data:', indexData)
      let hitNum = randomInt(1, indexData.total_count)  // starts from 1
      let pageNum = Math.ceil(hitNum / indexData.pagination.size)
      let inPageOffset = hitNum % indexData.pagination.size
      console.log(`Hit gem#${hitNum}, at page#${pageNum} line#${inPageOffset}`)
      fetch(`${GEMMY_BASE_URL}/gems/${pageNum}`).then(resp => {
        resp.text().then(text => {
          let lines = text.split('\n')
          let hitGem = lines[inPageOffset - 1]
          console.log('GEM:', hitGem);
          this.setState({
            hitGem: hitGem
          });
        })
      })
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {this.state.hitGem || "It's comming..."}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </header>
      </div>
    );
  }
}

export default App;
