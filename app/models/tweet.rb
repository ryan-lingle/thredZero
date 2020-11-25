class Tweet < ApplicationRecord
  belongs_to :user

  def self.json_list_for(user, last_id)
    tweets= Tweet.where("tweet_id <= '#{last_id}'", "user_id == #{user.id}").order(tweet_id: :desc).first(50)
    thread_index = false
    tweets_w_threads = []
    tweets.each_with_index do |tweet, i|
      if thread_index
        tweets_w_threads[thread_index][:thread].unshift(tweet.tweet_id.to_s)
        if tweet.in_reply_to_user_id != user.twitter_id.to_s
          tweets_w_threads[thread_index][:twitter_id] = tweet.tweet_id.to_s
          thread_index = false
        end
      elsif tweet.in_reply_to_user_id == user.twitter_id.to_s
        thread_index = i
        tweets_w_threads[i] = { thread: [tweet.tweet_id.to_s] }
      else
        tweets_w_threads[i] = {
          id: tweet.id,
          twitter_id: tweet.tweet_id.to_s,
          reply: tweet.reply,
          retweet: tweet.retweet,
        }
      end
    end
    tweets_w_threads.compact.to_json
  end

  def self.thread_array(twee_schema, mapped_tweets)
    twee_arrays = {}
    twee_schema.keys.each { |k| twee_arrays[k] = [] }
    mapped_tweets.each do |t|
      twee_arrays[t["twee"]].push(t["tweet_id"])
    end
    return add_children_to("ROOT", twee_arrays, twee_schema).to_json
  end

  def self.add_children_to(twee, twee_arrays, twee_schema)
    set = { name: twee, tweets: twee_arrays[twee], header: twee_schema[twee]["header"] }
    twee_schema[twee]["children"].each { |c| set[:tweets].push(add_children_to(c, twee_arrays, twee_schema))}
    return set
  end
end
