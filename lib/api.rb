module Map 
  class API < Grape::API
    version 'v1', :using => :header, :vendor => 'map', :format => :json
    prefix 'api'
    error_format :json
    logger Rails.logger


    # api/outbreaks
    # api/outbreaks/346
    resource :outbreaks do
      get nil, :rabl => 'outbreaks/index' do
        @outbreaks = Outbreak.all
      end

      segment '/:id' do
        get nil, :rabl => 'outbreaks/show' do
          @outbreak = Outbreak.find(params[:id])
        end
      end
    end
  
  end
end
