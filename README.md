<img src="https://github.com/shaunwo/superhero-standing/blob/29350ac033f9c636918cb36cf30c5002fabace37/public/img/superhero-standing-logo.png" width="250" alt="Superhero Standing Logo" />

by Shaun Worcester

## Objective

An application where users can find their favorite superheroes (via a search, or by clicking around on the site), rank them, and share their own stories (and images) about each. There would be a leader board to show the most popular superheroes (who has the most “votes” from the community), which images have the most votes, and some threaded comments where users can discuss the pros and cons of each superhero.

## Audience

Superhero enthusiests of ALL ages that have some time to kill and care to discuss their opinions with fellow fans. Possibly some in the industry as well that are wondering what the general public thinks of different superheroes and various looks from different artists over the years for said superhero.

## Data Source

API: [https://superheroapi.com](https://superheroapi.com)

APP DB: PostgreSQL

I will pull some base info on each superhero from the API, but the user info, comments, rankings and other functionality will be store in the PostgreSQL DB that I will build.

Images (user profile pics + community-provided superhero images) will be stored on AWS S3.

## Approach

### Tech Stack

React, Express, and Node

### Database Schema

![Superhero Standing DB Schema](https://github.com/shaunwo/superhero-standing/blob/29350ac033f9c636918cb36cf30c5002fabace37/Superhero%20Standing%20DB%20Schema.png)

## Sensitive Information

-    Usernames and Passwords \* Passwords will be stored with Flask Bcrypt
-    Rankings, follows, and other features of a User’s profile if they choose to keep their account private

## Functionality

This will be a mobile-friendly website and I plan to make an evenly-focused full-stack application. This will be an interactive community site where fans can engage with others about the favorite superheroes.

## User Flow

![Superhero Standing User Flow Diagram](https://github.com/shaunwo/superhero-standing/blob/acb5f02a39ab1f1ea7b74369d7826511899a0b8c/Superhero%20Standing%20User%20Flow%20Diagram.png)

## Features

-    A beautifu, clean interface that will appeal to the masses
-    Making it as simple as possible for users to find his/her favorite superheros and see the leader board(s) in various areas

## Stretch Goals

-    Login with Facebook, Google, etc.
-    Set up emails alerts where a user would receive an e-mail when others comment on a thread that the user created or is watching
-    Option to look for possible friends through a user’s social media sites and/or address book

## Possible Issues

-    I have a clear vision of how I want the threaded comments to work (with indented replies), but don't know how to code that at the moment
-    I went through the Redux lessons and want to set up a Store and Reducer for this application, but that's the part of coding for this project that I'm the least confident in, at the moment.

### Instructions for Running Code

To get this application running, download the code and run the following in the Terminal:

#### Backend API

1. `cd backend`
2. `npm i`
3. `psql < superhero_standing.sql` <-- once PostgreSQL is running
4. `nodemon server.js`

#### Frontend Application

Make sure that PostgreSQL is running, and then you can run the commands below that will run the Backend and Frontend together, using the **_concurrently_** package.

1. `cd frontend`
2. `npm i`
3. `npm start`

Go to [http://localhost:3000/](http://localhost:3000/) in your browser to run/view the application.
