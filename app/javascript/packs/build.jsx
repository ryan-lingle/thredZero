import React from 'react'
import ReactDOM from 'react-dom'
import TweetsContainer from './tweets_container'
import Twee from './twee'
import Logo from 'images/logo.png'
const Build = (props) => {
  return(
    <div className="main">
      <div className="twee-stuff">
        <div className="title-wrapper text-center">
          <div className="title">
            <h1>The</h1>
            <img src={Logo} style={{width: 120}}/>
            <h1>Twee</h1>
          </div>
        </div>
        <div className="twee-container root">
          <Twee name="ROOT"/>
        </div>
      </div>
      <div className="tweets-stuff">
        <TweetsContainer tweets={props.tweets} />
      </div>
    </div>
  )
}

window.tweeSchema = {
  ROOT: {
    parent: null,
    header: "ROOT",
    children: []
  }
};

const container = document.querySelector('#target');
const tweets = JSON.parse(container.getAttribute('data-tweets'))
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Build tweets={tweets} />,
    container
  )
})
