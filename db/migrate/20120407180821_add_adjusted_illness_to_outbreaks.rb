class AddAdjustedIllnessToOutbreaks < ActiveRecord::Migration
  def up
    add_column :outbreaks, :adjusted_illnesses, :decimal
  end

  def down
    remove_column :outbreaks, :adjusted_illnesses
  end
end
