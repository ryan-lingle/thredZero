Rails.application.routes.draw do
  root to: 'pages#index'
  get '/twitter/auth', to: 'twitter#auth', as: :twitter
  get '/auth/twitter/callback', to: 'twitter#callback', as: :callback
  get '/tweets', to: "twitter#tweets", as: :tweets
  get '/load_tweets', to: "twitter#load_tweets", as: :load_tweets
  get '/edit-thread', to: "twitter#edit_thread", as: :edit_thread
  namespace :api do
    namespace :v1 do
      get '/tweets/:last_id', to: "twitter#add_tweets", as: :add_tweets
    end
  end
end
