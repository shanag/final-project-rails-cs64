require 'api'

FinalProject::Application.routes.draw do
  mount Map::API => '/'
 
  resources :outbreaks, :only => [:show, :index]
  
  root :to => 'map#homepage'
end
