class MapController < ApplicationController
  respond_to :html

  def homepage
    @outbreaks_json = Rabl::Engine.new(Rails.root.join("app/views/outbreaks/index.rabl").read, :format => :json).render(self, {})
  end
end
