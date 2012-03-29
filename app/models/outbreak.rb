class Outbreak < ActiveRecord::Base
  has_and_belongs_to_many :states
  has_and_belongs_to_many :counties
  has_and_belongs_to_many :foods
  has_and_belongs_to_many :locations
  
  validates :reporting_state, :first_illness, :illnesses, :presence => true

  paginates_per 25
end
