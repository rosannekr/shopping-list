# shopList
Set up:

Create `.env` file in project directory and add
```
DB_NAME=todos
DB_PASS=YOUR_PASSWORD
```
(replace `YOUR_PASSWORD` with password)
Type `mysql -u root -p` to access the MySQL CLI using your password.
In the MySQL CLI, type `create database shopList;` to create a database in MySQL.


outside mysql, navegate to shoplist foleder, npm install
to create database - node run mitrate
to load seed data - node run seed 

then "cd client" and "npm install"

from separate terminals, "npm start" from both shoplist and client folders 


To-do list

to add: 

1. basic styling
2. make items editable? see non-optimal, 1
3. add less common suggestions in search bar instead of auto adding, ordered by frequency
4. calculate correlation between items, and suggest items with high correlation to current items
5. extend react router to past lists
6. list of all products along with lists
7. feedback after added from previous week is clicked
8. clear input after submited

to clean up:
1. api 
2. fetch functions in front end
3. add hooks
4. text parsing and plural handling needs to apply to neew input as well as seed data
5. change past lists to all lists
6 add completed date to hypothetical past items
7. fix week to be automatically started when attempting to add an item manually
7. delete items at end of week that are not completed
22. change seed weeks to fewer items

bugs
1. date bugs, sunday rounding up to monday instead of down
2. make past lists link work from within a past list

non-optimal
1. individual instances should have input text saved in database separately to product name, to allow for additional detail. 
  it would also make plurals situation better 
2. frequency calculation needs refining - 
  example: to next increases the number of weeks without increasing the items, making fewer show up as frequent purchases
  need to figure out how to grab 10 most frequent, and or exclude future purchases from autoadd 
3. auto generate shouldn't disapear once there are items? well it would be ok if search/suggestion bar were there 
