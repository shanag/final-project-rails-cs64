class CreateFoodOutbreakJoinTable < ActiveRecord::Migration
  def up
    create_table :foods_outbreaks, :id => false do |t|
      t.integer :outbreak_id
      t.integer :food_id
    end
  end

  def down
    drop_table :foods_outbreaks
  end
end
