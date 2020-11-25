import React from 'react'
import ReactDOM from 'react-dom'
import TweetEmbed from 'react-tweet-embed'
import Selector from './selector'

export default class TweetsContainer extends React.Component {
  constructor(props) {
    super(props)
    this.buildTweets = this.buildTweets.bind(this)
    this.replies = this.replies.bind(this)
    this.addTweets = this.addTweets.bind(this)
    this.pushNewTweets = this.pushNewTweets.bind(this)
    this.hideTweet = this.hideTweet.bind(this)
    this.handleThread = this.handleThread.bind(this)
    this.handleSelectorChange = this.handleSelectorChange.bind(this);
    this.buildHiddenForm = this.buildHiddenForm.bind(this);
    this.lastTweetId = this.props.tweets[this.props.tweets.length - 1].id
    this.state = {
      showReplies: true,
      tweets: this.props.tweets,
      selectedTweets: [],
    }
  }

  buildTweets() {
    let nt = this.state.showReplies ? this.state.tweets : this.state.tweets.filter(tweet => !tweet.reply )
    return nt.map((tweet, i) => {
      if (tweet.thread) {
        return this.handleThread(tweet, i)
      } else {
        return(
          <div className=" tweet-container text-center" key={i}>
            <div className="tweet" tweet-id={tweet.twitter_id} >
              <TweetEmbed id={tweet.twitter_id} options={{conversation: 'none', align: 'center' }}/>
              <div>
                <button className="btn btn-danger" onClick={this.hideTweet}>Hide</button>
                <Selector handleChange={this.handleSelectorChange}/>
              </div>
            </div>
          </div>
        )
      }
    })
  }

  handleThread(tweet, i) {
    const tweets = tweet.thread.map((tweet, ii) => {
      return(
        <TweetEmbed key={ii} id={tweet} options={{conversation: 'none', align: 'center' }}/>
      )
    })
    return(
      <div className="tweet-container thread-container text-center" key={i}>
        <div className="tweet" tweet-id={tweet.twitter_id} >
          <div className="thread">
            {tweets}
          </div>
          <div>
            <button className="btn btn-danger" onClick={this.hideTweet}>Hide</button>
            <Selector handleChange={this.handleSelectorChange}/>
          </div>
        </div>
      </div>
    )
  }

  handleSelectorChange(event) {
    const bucket = event.target.value;
    const tweetId = event.target.parentNode.parentNode.parentNode.getAttribute('tweet-id')
    const newSelectedTweets = this.state.selectedTweets;
    newSelectedTweets.push({ tweet_id: tweetId, twee: bucket })
    this.setState({ selectedTweets: newSelectedTweets })
  }

  hideTweet(event) {
    event.target.parentNode.parentNode.parentNode.style.display = 'none'
  }

  replies() {
    if (this.state.showReplies) {
      this.setState({ showReplies: false })
    } else {
      this.setState({ showReplies: true })
    }
  }

  addTweets() {
    fetch(`/api/v1/tweets/${this.lastTweetId}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.pushNewTweets(data)
      });
  }

  pushNewTweets(data) {
    const newTweets = this.state.tweets.concat(data)
    this.setState({ tweets: newTweets })
    this.lastTweetId = this.state.tweets[this.state.tweets.length - 1].id
  }

  buildHiddenForm() {
    return(
      <form action="/edit-thread">
        <input type="hidden" value={JSON.stringify(this.state.selectedTweets)} name="mapped_tweets"/>
        <input type="hidden" value={JSON.stringify(window.tweeSchema)} name="twee_schema" />
        <input type="submit" value="forward" className="btn btn-primary" />
      </form>
    )
  }

  render() {
    const tweets = this.buildTweets();
    const hiddenForm = this.buildHiddenForm();
    return(
      <div className="tweets-container">
        <div className="spacer">
          <a href="/" className="btn btn-primary navs">Back</a>
          {hiddenForm}
        </div>
        <div className="tweets-title">
          <h1>Tweets</h1>
          {"Show Replies \u00a0"}
          <input type="checkbox" checked={this.state.showReplies} onChange={this.replies}/>
        </div>
        <div className="tweets">
          {tweets}
        </div>
        <button className="btn" onClick={this.addTweets}> Load More </button>
      </div>
    )
  }
}
