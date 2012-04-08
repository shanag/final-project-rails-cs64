class Outbreak < ActiveRecord::Base
  has_and_belongs_to_many :states
  has_and_belongs_to_many :counties
  has_and_belongs_to_many :foods
  has_and_belongs_to_many :locations
  
  validates :reporting_state, :first_illness, :illnesses, :presence => true

  paginates_per 25

  scope :years_08_to_09, lambda { 
    where("first_illness BETWEEN ? AND ?", Date.new(2008, 1, 1), Date.new(2009, 12, 31))
    where("illnesses IS NOT NULL")
  }

end
