require 'net/http'
require 'uri'
require 'json'

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def twitter
    # client = Twitter::Streaming::Client.new do |config|
    #   config.consumer_key        = ENV["TWITTER_PUBLIC"]
    #   config.consumer_secret     = ENV["TWITTER_SECRET"]
    #   config.access_token        = params["oauth_token"]
    #   config.access_token_secret = params["oauth_verifier"]
    # end
    uri = URI("https://api.twitter.com/oauth/authenticate?oauth_token=#{params["oauth_token"]}")
    Net::HTTP.get(uri)
    uri = URI.parse("https://api.twitter.com")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Post.new("/oauth/access_token")
    request.set_form_data({ 'oauth_verifier': params["oauth_verifier"] })
    response = http.request(request)
    binding.pry
  end

  def failure
    raise
  end
end
