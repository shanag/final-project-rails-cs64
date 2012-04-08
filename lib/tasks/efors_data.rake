desc 'Load cdc data'
task :load_cdc_data => [:load_EFORS_data, :load_NORS_data] do
end

desc 'Load EFORS data'
task :load_EFORS_data => [:load_EFORS_outbreaks, :load_EFORS_states, :load_EFORS_counties, :load_EFORS_foods] do
end
  
desc 'Load EFORS outbreaks'
task :load_EFORS_outbreaks => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/EFORS_FoodborneOutbreaks.csv')
  raise "couldn't find EFORS_FoodborneOutbreaks.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
    
    o = Outbreak.find_or_create_by_efors_id(:efors_id => row[0])
    o.update_attributes(
      :reporting_state => row[1],
      :reporting_county => row[2], 
      :first_illness => row[3], 
      :last_illness => row[4], 
      :illnesses => row[7],
      :hospitalizations => row[8],
      :deaths => row[9],
      :genus => row[10],
      :serotype => row[22],
      :species => row[16],
      :commodity_group => row[41],
      :cdc_type => "EFORS"
    )
    
    #Create state
    s = State.find_or_create_by_state(:state => row[1])
    
    #Create county
    c = County.find_or_create_by_county(:county => row[2])
   
    #Where eaten data. Cleaned with Google Refine
    l = Location.find_or_create_by_location(row[35])
    o.locations << l
    
    l = Location.find_or_create_by_location(row[36])
    o.locations << l
    
    l = Location.find_or_create_by_location(row[37])
    o.locations << l
    
    msg = (o.nil? || o.id.nil?) ? "problem creating EFORS Outbreak #{row[0].inspect}" : "#{o.id} outbreak created"
    puts msg
  end
end

desc 'Load EFORS states'
task :load_EFORS_states => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/EFORS_States.csv')
  raise "couldn't find EFORS_States.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
   
    o = Outbreak.find_by_efors_id(row[0])
    s = State.find_or_create_by_state(row[1])
    if (o)
      o.states << s
    else
      msg = "problem creating EFORS State #{row[0].inspect}" 
      puts msg
    end
  end
end

desc 'Load EFORS counties'
task :load_EFORS_counties => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/EFORS_Counties.csv')
  raise "couldn't find EFORS_Counties.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
   
    o = Outbreak.find_by_efors_id(row[0])
    c = County.find_or_create_by_county(row[1])
    if (o)
      o.counties << c
    else
      msg = "problem creating EFORS County #{row[0].inspect}" 
      puts msg
    end
  end
end

desc 'Load EFORS foods'
task :load_EFORS_foods => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/EFORS_Foods.csv')
  raise "couldn't find EFORS_Foods.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
   
    o = Outbreak.find_by_efors_id(row[0])
    f = Food.find_or_create_by_food(row[1])
    if (o)
      o.foods << f
    else
      msg = "problem creating EFORS Food #{row[0].inspect}" 
      puts msg
    end
  end
end


