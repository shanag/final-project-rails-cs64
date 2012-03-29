class OutbreaksController < ApplicationController
  inherit_resources

  layout "data_layout"

  protected

  def collection
    @outbreaks = Outbreak.order('first_illness DESC').page(params[:page] || 1)
  end
end


