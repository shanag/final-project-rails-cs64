class AddFipsCodeToCounties < ActiveRecord::Migration
  def up
    add_column :counties, :fips_code, :integer
  end

  def down
    remove_column :counties, :fips_code
  end
end
