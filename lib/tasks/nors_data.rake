desc 'Load NORS data'
task :load_NORS_data => [:load_NORS_outbreaks, :load_NORS_states, :load_NORS_counties, :load_NORS_foods] do
end

desc 'Load NORS outbreaks'
task :load_NORS_outbreaks => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/NORS_FoodborneOutbreaks.csv')
  raise "couldn't find NORS_FoodborneOutbreaks.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
    
    o = Outbreak.find_or_create_by_nors_id(:nors_id => row[0])
    o.update_attributes(
      :reporting_state => row[1],
      :reporting_county => row[2], 
      :first_illness => row[3], 
      :last_illness => row[4], 
      :illnesses => row[7],
      :hospitalizations => row[8],
      :deaths => row[9],
      :genus => row[10],
      :serotype => row[18],
      :species => row[14],
      :commodity_group => row[29],
      :cdc_type => "NORS"
    )
    
    #Where eaten data. Cleaned with Google Refine
    l = Location.find_or_create_by_location(row[26])
    o.locations << l
    
    l = Location.find_or_create_by_location(row[27])
    o.locations << l
    
    l = Location.find_or_create_by_location(row[28])
    o.locations << l
    
    msg = (o.nil? || o.id.nil?) ? "problem creating NORS Outbreak #{row[0].inspect}" : "#{o.id} outbreak created"
    puts msg
  end
end

desc 'Load NORS states'
task :load_NORS_states => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/NORS_States.csv')
  raise "couldn't find NORS_States.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
   
    o = Outbreak.find_by_nors_id(row[0])
    s = State.find_or_create_by_state(row[1])
    if (o)
      o.states << s
    else
      msg = "problem creating NORS State #{row[0].inspect}" 
      puts msg
    end
  end
end

desc 'Load NORS counties'
task :load_NORS_counties => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/NORS_Counties.csv')
  raise "couldn't find NORS_Counties.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
   
    o = Outbreak.find_by_nors_id(row[0])
    c = County.find_or_create_by_county(row[1])
    if (o)
      o.counties << c
    else
      msg = "problem creating NORS County #{row[0].inspect}" 
      puts msg
    end
  end
end

desc 'Load NORS foods'
task :load_NORS_foods => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/NORS_Foods.csv')
  raise "couldn't find NORS_Foods.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
   
    o = Outbreak.find_by_nors_id(row[0])
    f = Food.find_or_create_by_food(row[1])
    if (o)
      o.foods << f
    else
      msg = "problem creating NORS Food #{row[0].inspect}" 
      puts msg
    end
  end
end


