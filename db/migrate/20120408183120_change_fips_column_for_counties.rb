class ChangeFipsColumnForCounties < ActiveRecord::Migration
  def up
    change_table :counties do |t|
      t.change :fips_code, :string
    end
  end

  def down
    change_table :counties do |t|
      t.change :fips_code, :integer
    end
  end
end
