desc 'Load FIPS codes'
task :load_fips_codes => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/FIPS_counties.csv')
  raise "couldn't find FIPS_counties.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
    
    c = County.find_or_create_by_county(:county => row[1])
    c.update_attributes(
      :fips_code => row[0]
    )
    
    msg = (c.nil? || c.id.nil?) ? "problem adding FIPS code #{row[0].inspect}" : "#{c.id} fips code added"
    puts msg
  end
end

desc 'Load US Population Estimates'
task :load_us_pop => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/intercensal_pop_data_counties.csv')
  raise "couldn't find intercensal_pop_data_counties.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
    
    c = County.find_by_county(row[6])
    if (c)
      c.update_attributes(
        :population_2008 => row[16],
        :population_2009 => row[17]
      )
      
      msg = (c.nil? || c.id.nil?) ? "problem adding US pop estimate #{row[0].inspect}" : "#{c.id} US pop estimate added"
      puts msg
    end

  end
end


desc 'Load Puerto Rican Population Estimates'
task :load_puerto_rico_pop => :environment do
  require 'csv'

  csv_path = Rails.root.join('lib/data/intercensal_pop_data_puerto_rico.csv')
  raise "couldn't find intercensal_pop_data_puerto_rico.csv" unless csv_path.exist?
  
  CSV.foreach(csv_path, headers: true) do |row|
    
    c = County.find_by_county(row[0])
    if (c)
      c.update_attributes(
        :population_2008 => row[10],
        :population_2009 => row[11]
      )
      
      msg = (c.nil? || c.id.nil?) ? "problem adding Puerto Rico pop estimate #{row[0].inspect}" : "#{c.id} PR pop estimate added"
      puts msg
    end
  end
end

