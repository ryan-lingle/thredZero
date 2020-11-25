class User < ApplicationRecord
  has_many :tweets

  def client
    Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV["TWITTER_PUBLIC"]
      config.consumer_secret     = ENV["TWITTER_SECRET"]
      config.access_token        = token
      config.access_token_secret = secret
    end
  end

  def load_new_tweets
    # tweets.each do |t|
    #   begin
    #     client.status(t.tweet_id)
    #   rescue Twitter::Error::NotFound
    #     t.destroy
    #   end
    # end
    load_(client.user_timeline(since_id: tweets.first.tweet_id, count: 200))
  end

  def load_all_tweets
    current_min_tweet = min_tweet
    min_tweet ? load_(client.user_timeline(max_id: current_min_tweet, count: 200)) : load_(client.user_timeline(count: 200))
    while current_min_tweet != min_tweet
      current_min_tweet = min_tweet
      load_(client.user_timeline(max_id: min_tweet, count: 200))
    end
  end

  def min_tweet
    tweets.last ? tweets.last.tweet_id : nil
  end

  def load_(tweets)
    tweets.each do |tweet|
      this_tweet = Tweet.find_or_create_by(tweet_id: tweet.id)
      this_tweet.user = self
      this_tweet.content = tweet.full_text
      this_tweet.reply = tweet.reply?
      this_tweet.retweet = tweet.retweet?
      this_tweet.in_reply_to_user_id = tweet.in_reply_to_user_id
      this_tweet.save!
    end
  end

  def tweets_json
    most_recent_tweet_id = tweets.order(tweet_id: :desc).first.tweet_id
    Tweet.json_list_for(self, most_recent_tweet_id)
  end
end
