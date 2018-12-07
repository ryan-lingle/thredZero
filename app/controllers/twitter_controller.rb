class TwitterController < ApplicationController
  def auth
    @callback_url = "http://127.0.0.1:3000/auth/twitter/callback"
    $consumer = OAuth::Consumer.new(ENV["TWITTER_PUBLIC"],ENV["TWITTER_SECRET"], :site => "https://api.twitter.com")
    @request_token = $consumer.get_request_token(:oauth_callback => @callback_url)
    $token = @request_token.token
    $token_secret = @request_token.secret
    redirect_to @request_token.authorize_url(:oauth_callback => @callback_url)
  end

  def callback
    hashi = { oauth_token: $token, oauth_token_secret: $token_secret}
    @request_token  = OAuth::RequestToken.from_hash($consumer, hashi)
    @access_token = @request_token.get_access_token(oauth_verifier: params[:oauth_verifier])
    client = Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV["TWITTER_PUBLIC"]
      config.consumer_secret     = ENV["TWITTER_SECRET"]
      config.access_token        = @access_token.token
      config.access_token_secret = @access_token.secret
    end
    binding.pry
  end
end
