Rails.application.routes.draw do
  root 'documents#index'
  resources :documents, only: [:new, :create, :show, :edit, :update]
end
