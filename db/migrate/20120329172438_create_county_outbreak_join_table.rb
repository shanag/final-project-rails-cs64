class CreateCountyOutbreakJoinTable < ActiveRecord::Migration
  def up
    create_table :counties_outbreaks, :id => false do |t|
      t.integer :outbreak_id
      t.integer :county_id
    end
    add_index :counties_outbreaks, :outbreak_id
    add_index :counties_outbreaks, :county_id
  end

  def down
    drop_table :counties_outbreaks
  end
end
