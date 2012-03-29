class CreateLocationOutbreakJoinTable < ActiveRecord::Migration
  def up
    create_table :locations_outbreaks, :id => false do |t|
      t.integer :outbreak_id
      t.integer :location_id
    end
    add_index :locations_outbreaks, :outbreak_id
    add_index :locations_outbreaks, :location_id
  end

  def down
    drop_table :locations_outbreaks
  end
end
