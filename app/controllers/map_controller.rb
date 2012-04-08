class MapController < ApplicationController
  respond_to :html

  def homepage
    @outbreaks_min = Outbreak.years_08_to_09.minimum(:adjusted_illnesses)
    @outbreaks_max = Outbreak.years_08_to_09.maximum(:adjusted_illnesses)
    @outbreaks_json = Rabl::Engine.new(Rails.root.join("app/views/outbreaks/index.rabl").read, :format => :json).render(self, {})
    @counties_json = Rails.root.join("lib/data/map/us-counties.json").read
    @states_json = Rails.root.join("lib/data/map/us-states.json").read
  end
end
