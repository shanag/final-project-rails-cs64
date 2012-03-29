class CreateFoods < ActiveRecord::Migration
  def up
    create_table :foods do |t|
      t.string :food
      t.timestamps
    end
  end

  def down
    drop_table :foods
  end
end
