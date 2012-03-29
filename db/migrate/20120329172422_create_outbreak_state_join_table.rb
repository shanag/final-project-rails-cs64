class CreateOutbreakStateJoinTable < ActiveRecord::Migration
  def up
    create_table :outbreaks_states, :id => false do |t|
      t.integer :outbreak_id
      t.integer :state_id
    end
  end

  def down
    drop_table :outbreaks_states
  end
end
