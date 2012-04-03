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
