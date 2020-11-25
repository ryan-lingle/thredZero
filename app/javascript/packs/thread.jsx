import React from 'react'
import ReactDOM from 'react-dom'
import TweetEmbed from 'react-tweet-embed'
import runDragger from './drag_n_drop'

export default class Thread extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentThread: this.props.thread,
      prevThreads: [],
      currentThreadName: this.props.thread.name,
    }
    this.back = this.back.bind(this);
    this.buildBackButton = this.buildBackButton.bind(this);
    this.buildThread = this.buildThread.bind(this);
    this.handleTwee = this.handleTwee.bind(this);
    this.newThread = this.newThread.bind(this);
  }

  buildThread() {
    const tweets = this.state.currentThread.tweets.map((x, i) => {
      if (typeof x === 'object') {
        return this.handleTwee(x, i)
      } else {
        return(
          <div className="thread-wrap" key={i}>
            <div className="grabber fas fa-bars side"></div>
              <TweetEmbed id={x} key={i} options={{conversation: 'none', align: 'center' }}/>
            <div className="side"></div>
          </div>
        )
      }
    })
    return(
      <div>
        <div className="head-wrap">
          <div className='thread-thread'>
            {this.state.currentThread.header}
          </div>
        </div>
        {tweets}
      </div>
    )
  }

  handleTwee(object, key) {
    return(
      <div className="thread-wrap" key={key}>
        <div className="grabber fas fa-bars side"></div>
        <div className="thread-thread"  data-thread={JSON.stringify(object)} onClick={this.newThread} >
          {object.header}
        </div>
        <div className="side"></div>
      </div>
    )
  }

  newThread(event) {
    const thread = JSON.parse(event.target.getAttribute('data-thread'));
    this.state.prevThreads.unshift(this.state.currentThread)
    this.setState({ currentThread: thread, currentThreadName: thread.name })
  }

  buildBackButton() {
    return(
      <a className="back-btn" onClick={this.back}>
        Back to {this.state.prevThreads[0].name}
      </a>
    )
  }

  back() {
    this.setState({ currentThreadName:this.state.prevThreads[0].name, currentThread: this.state.prevThreads.shift() })
  }

  componentDidMount() {
    runDragger();
  }

  render() {
    const thread = this.buildThread();
    console.log(this.state.currentThread)
    return(
      <div className="text-center">
        <div className="tweets-title flex-title">
          <div>{this.state.prevThreads.length > 0 ? this.buildBackButton() : null }</div>
          <h1>{`< ${this.state.currentThreadName} />`}</h1>
          <div></div>
        </div>
        <div className="spacer thread-btns">
          <a href="/tweets" className="btn btn-primary navs">Back</a>
          <a href="/" className="btn btn-primary navs">Forward</a>
        </div>
        {thread}
      </div>
    )
  }
}
