# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120329172507) do

  create_table "counties", :force => true do |t|
    t.string   "county"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "counties_outbreaks", :id => false, :force => true do |t|
    t.integer "outbreak_id"
    t.integer "county_id"
  end

  create_table "foods", :force => true do |t|
    t.string   "food"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "foods_outbreaks", :id => false, :force => true do |t|
    t.integer "outbreak_id"
    t.integer "food_id"
  end

  create_table "locations", :force => true do |t|
    t.string   "location"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "locations_outbreaks", :id => false, :force => true do |t|
    t.integer "outbreak_id"
    t.integer "location_id"
  end

  create_table "outbreaks", :force => true do |t|
    t.integer  "efors_id"
    t.integer  "nors_id"
    t.string   "reporting_state"
    t.string   "reporting_county"
    t.datetime "first_illness"
    t.datetime "last_illness"
    t.integer  "illnesses"
    t.integer  "hospitalizations"
    t.integer  "deaths"
    t.string   "genus"
    t.string   "serotype"
    t.string   "species"
    t.string   "commodity_group"
    t.string   "cdc_type"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

  create_table "outbreaks_states", :id => false, :force => true do |t|
    t.integer "outbreak_id"
    t.integer "state_id"
  end

  create_table "states", :force => true do |t|
    t.string   "state"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
