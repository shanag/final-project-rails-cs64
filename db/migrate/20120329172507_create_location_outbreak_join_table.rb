class CreateLocationOutbreakJoinTable < ActiveRecord::Migration
  def up
    create_table :locations_outbreaks, :id => false do |t|
      t.integer :outbreak_id
      t.integer :location_id
    end
  end

  def down
    drop_table :locations_outbreaks
  end
end
