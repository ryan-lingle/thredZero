class TwitterController < ApplicationController
  def auth
    @callback_url = "http://127.0.0.1:3000/auth/twitter/callback"
    $consumer = OAuth::Consumer.new(ENV["TWITTER_PUBLIC"],ENV["TWITTER_SECRET"], :site => "https://api.twitter.com")
    @request_token = $consumer.get_request_token(:oauth_callback => @callback_url)
    $token = @request_token.token
    session[:token_secret] = @request_token.secret
    redirect_to @request_token.authorize_url(:oauth_callback => @callback_url)
  end

  def callback
    hashi = { oauth_token: $token, oauth_token_secret: session[:token_secret]}
    @request_token  = OAuth::RequestToken.from_hash($consumer, hashi)
    @access_token = @request_token.get_access_token(oauth_verifier: params["oauth_verifier"])
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV["TWITTER_PUBLIC"]
      config.consumer_secret     = ENV["TWITTER_SECRET"]
      config.access_token        = @access_token.token
      config.access_token_secret = @access_token.secret
    end
    twitter_id = client.user.id
    user = User.find_or_create_by(twitter_id: twitter_id)
    user.name = client.user.name
    user.screen_name = client.user.screen_name
    user.token = @access_token.token
    user.secret = @access_token.secret
    user.save
    session[:user_id] = user.id
    redirect_to root_path
  end

  def load_tweets
    if current_user.tweets.empty?
      current_user.load_all_tweets
    else
      current_user.load_new_tweets
    end
    redirect_to tweets_path
  end

  def tweets
    @tweets = current_user.tweets_json
  end

  def edit_thread
    mapped_tweets = JSON.parse(params[:mapped_tweets])
    twee_schema = JSON.parse(params[:twee_schema])
    @thread = Tweet.thread_array(twee_schema, mapped_tweets)
  end
end
