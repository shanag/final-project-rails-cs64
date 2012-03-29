class CreateLocations < ActiveRecord::Migration
  def up
    create_table :locations do |t|
      t.string :location
      t.timestamps
    end
  end

  def down
    drop_table :locations
  end
end
