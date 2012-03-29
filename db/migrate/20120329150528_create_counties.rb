class CreateCounties < ActiveRecord::Migration
  def up
    create_table :counties do |t|
      t.string :county
      t.timestamps
    end
  end

  def down
    drop_table :counties
  end
end
