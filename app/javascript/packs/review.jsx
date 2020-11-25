import React from 'react'
import ReactDOM from 'react-dom'
import Logo from 'images/logo.png'
import Thread from './thread'
const Review = (props) => {
  return(
    <div className="main">
      <Thread thread={props.thread} />
    </div>
  )
}

const container = document.querySelector('#target');
const thread = JSON.parse(container.getAttribute('data-thread'))
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Review thread={thread} />,
    container
  )
})
