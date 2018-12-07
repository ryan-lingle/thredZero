Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  root to: 'pages#index'
  get '/twitter/auth', to: 'twitter#auth', as: :twitter
  get '/auth/twitter/callback', to: 'twitter#callback', as: :callback
end
