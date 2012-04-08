desc 'Calculate num cases per 1000 people'
task :calculate_severity => :environment do

  #num cases per 1000 people --> (cases/total_population) * 1000
  #Note: in the case of multi-county outbreaks, use the combined population of involved counties
  
  outbreaks = Outbreak.years_08_to_09
  
  outbreaks.each do |o|

    reporting_county = County.find_by_county(o.reporting_county)
    all_counties_pop = 0

    if (reporting_county)
      if o.first_illness.to_date >= Date.new(2008, 1, 1) && o.first_illness.to_date <= Date.new(2008, 12, 31) 
        all_counties_pop += reporting_county.try(:population_2008) unless reporting_county.population_2008.nil?
      elsif o.first_illness.to_date > Date.new(2009, 1, 1) && o.first_illness.to_date <= Date.new(2009, 12, 31) 
        all_counties_pop += reporting_county.try(:population_2009) unless reporting_county.population_2009.nil?
      end
    end

    o.counties.each do |c|
      if o.first_illness.to_date >= Date.new(2008, 1, 1) && o.first_illness.to_date <= Date.new(2008, 12, 31) 
        all_counties_pop += c.population_2008 unless c.population_2008.nil?
      elsif o.first_illness.to_date >= Date.new(2009, 1, 1) && o.first_illness.to_date <= Date.new(2009, 12, 31) 
        all_counties_pop += c.population_2009 unless c.population_2009.nil?
      end
    end

    if (all_counties_pop > 0)
      o.update_attributes(:adjusted_illnesses => (o.illnesses / all_counties_pop.to_f) * 100000)
      puts "adjusted illnesses is #{o.adjusted_illnesses}"
    end
  end
end

