class Api::V1::TwitterController < ApplicationController
  def add_tweets
    last_id = params[:last_id]
    tweets = Tweet.json_list_for(current_user, last_id)
    render json: tweets
  end
end
