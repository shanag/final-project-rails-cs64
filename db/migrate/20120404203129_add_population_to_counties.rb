class AddPopulationToCounties < ActiveRecord::Migration
  def up
    add_column :counties, :population_2008, :integer
    add_column :counties, :population_2009, :integer
  end

  def down
    remove_column :counties, :population_2009
    remove_column :counties, :population_2008
  end
end
