## Project Title
Foodborne Illness Outbreaks in the United States, 2008-2009

Visualization CS-171/64, Harvard University

## Domain Goals
By doing this project, I hope to better understand how outbreaks move geographically over time. I would also like to explore the following:

+ most common locations of outbreaks
+ most common bacterial and viral etiologies of outbreaks
+ most common food vehicles of outbreaks
+ average number of people sickened for each foodborne illness outbreak in the US

I originally intended to look at foodborne illness in the US from 1998-2009, however I changed the scope of my project because I received additional data from the CDC. I submitted a formal written request for data upon the start of this project, and the CDC has provided me with additional information regarding the reporting counties within each state, and the dates of first/last illness onset for outbreaks involving > 5 people.

## Data
### Data Source
The data for this visualization comes from two separate databases at the Center for Disease Control (CDC): 

+ EFORS (Electronic Foodborne Outbreak Reporting System) database, and 
+ NORS (National Outbreak Reporting) database

The data was provided by the CDC in response to a formal request that I made at the time of my project proposal. The data was delivered in multiple .xls workbooks, with several worksheets that needed to be reconciled. Per my request, I was able to obtain a rootID for each outbreak to help match the data to each outbreak.

### Data Issues
Issues with this data:

+ Multiple values are allowed for a single variable.  For example, if two foods were reported for a single outbreak, these foods are captured as two records within the Foods Table rather than as two variables, as would be seen within a flat database. To deal with this problem, I loaded the data into multiple database tables (more below).

+ The implicated food variable (in the Implicated Foods table) is a free-text field.  This characteristic means that similar or identical foods may be entered in different ways.  For example “ground beef” could be entered as “beef”, “hamburger”, “taco meat” or “lasagna”, to name just a few of the possibilities. 

+ The Where Eaten categories in the EFORS and NORS databases use different text for the same category names. To solve this problem, I used Google Refine text facets to change the column names, and to cluster categories where appropriate so that the same text was used for both spreadsheets.

+ The data columns were distributed over multiple spreadsheets that needed to be reconciled. 

I used Google Refine to import each individual spreadsheet and then export it as a .csv file. I then wrote a Ruby program to parse all the csv files and load the data.


### Data Attributes
The data attributes that will be used in this visualization include:

+ Number of outbreaks per day/month
+ Location of outbreaks per day/month (county and state)
+ Etiology of each outbreak (Genus, Species, and Serotype)
+ Number of illnesses
+ Number of hospitalizations
+ Number of deaths 
+ Type of food vehicle
+ Food commodity group
+ Date of first illness onset
+ Date of last illness onset
