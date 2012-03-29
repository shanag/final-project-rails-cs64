class Food < ActiveRecord::Base
  has_and_belongs_to_many :outbreaks

  validates :food, :presence => true  
end
