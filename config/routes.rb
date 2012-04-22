require 'api'

FinalProject::Application.routes.draw do
  mount Map::API => '/'
 
  resources :outbreaks, :only => [:show, :index]
 
  match '/background', :to => 'site#background', :as => :background

  root :to => 'map#homepage'
end
