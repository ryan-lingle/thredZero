class CreateTweets < ActiveRecord::Migration[5.2]
  def change
    create_table :tweets do |t|
      t.references :user, foreign_key: true
      t.text :content
      t.bigint :tweet_id
      t.boolean :reply
      t.boolean :retweet
      t.string :in_reply_to_user_id
      t.timestamps
    end
  end
end
