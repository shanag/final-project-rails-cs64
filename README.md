## Project Title
### Foodborne Illness Outbreaks in the United States, 2008-2009

## Getting Started
To set up the project, you will need to have git, Ruby 1.9 (and RubyGems) and the "bundler" gem installed.

Then, do the following basic setup:

`git clone git@github.com:shanag/final-project-rails-cs64.git`
`bundle install`
`rake db:create db:migrate`

Run the rake tasks to load the data (be patient, it takes a while):

`rake load_cdc_data`
`rake load_geo_census_data`
`rake calculate_severity`

Start the server:

`rails s thin`

Finally, go to http://localhost:3000. Or, you can skip all this and just check out the Heroku app: http://floating-ocean-1736.herokuapp.com

## About this Project 
This is my final project for a Harvard University SEAS course, Visualization CS-171/64 (Spring 2012). The main goal of this project is to examine foodborne illness outbreak characteristics for the years 2008-2009 in the US. To accomplish this, a choropleth map is used to show outbreak location and severity (derived from num illnesses/day/1000 people) with temporal filtering.

This project also displays the following data for outbreaks within the selected time range:
+ most common locations
+ most common etiologies
+ most common food vehicles
+ number of illnesses for each outbreak 

The original project scope included foodborne illness in the US from 1998-2009. However, after the project start date the CDC provided additional data regarding the reporting counties within each state, and the dates of first/last illness onset for outbreaks involving > 5 people. The project scope was revised to focus on the more granular outbreak data for the years 2008-2009.

## Data Sources
The data for this visualization includes:

+ foodborne outbreak data from the CDC
+ FIPS county codes from the USDA
+ intercensal population data for counties from the US Census Bureau

The foodborne outbreak data comes from two separate databases at the Center for Disease Control (CDC): 

+ EFORS (Electronic Foodborne Outbreak Reporting System) database, and 
+ NORS (National Outbreak Reporting) database

The data was provided by the CDC in response to a formal request that was made at the time of the project proposal. The data was delivered in multiple .xls workbooks, with several worksheets that needed to be reconciled. Each outbreak has a rootID which is used to label corresponding data points.

### Additional Resources
The following publication provided information about the domain topic, and guidelines for using outbreak data:
http://www.who.int/foodsafety/publications/foodborne_disease/Section_4.pdf, 

