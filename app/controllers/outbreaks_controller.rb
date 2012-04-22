class OutbreaksController < ApplicationController
  inherit_resources

  layout "outbreaks_layout"

  protected

  def collection
    @outbreaks = Outbreak.order('first_illness DESC').page(params[:page] || 1)
  end
end


