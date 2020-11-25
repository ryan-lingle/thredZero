module ApplicationHelper
  def current_user
    if session[:user_id]
      User.find(session[:user_id])
    else
      nil
    end
  rescue
    session[:user_id] = nil
    nil
  end

  def signed_in?
    !current_user.nil?
  end
end
