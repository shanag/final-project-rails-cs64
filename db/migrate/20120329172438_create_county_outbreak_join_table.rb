class CreateCountyOutbreakJoinTable < ActiveRecord::Migration
  def up
    create_table :counties_outbreaks, :id => false do |t|
      t.integer :outbreak_id
      t.integer :county_id
    end
  end

  def down
    drop_table :counties_outbreaks
  end
end
