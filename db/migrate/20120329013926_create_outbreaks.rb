class CreateOutbreaks < ActiveRecord::Migration
  def up
    create_table :outbreaks do |t|
      t.string :reporting_state
      t.string :reporting_county
      t.datetime :first_illness
      t.datetime :last_illness
      t.integer :illnesses
      t.integer :hospitalizations
      t.integer :deaths
      t.string :genus
      t.string :serotype
      t.string :species
      t.string :commodity_group
      t.timestamps
    end
  end

  def down
    drop_table :outbreaks
  end
end
