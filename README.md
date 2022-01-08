# Relation Notion Pages

While this repo _now_ only works for my specific use case I'm working on making it more modular and therefore reusable by others.

---

## Intro

Aim of this program is to link entries from two pages in Notion. When importing entries from another data source in Notion from csv you will loose the link you might have done in another program.

This tool will read all entries for two pages, building indexes on the fly and then will link all the data on the built-in `relation` type.

## Bird-eye view of specific use case

This repo works with two Notion pages: Titles and Authors.
Each Title (/book) is written by one or more author (sometimes left blank).

When imported as `.csv` into Notion the titles' authors are filled as `text` type and not as a `relation` type. By creating an extra column on the Titles page of type `relation` and by running this script the Titles entries will get all the authors as `text` and add the author as a `relation` field.

## Tech

Built in JS you need to have [Node (and NPM)](https://nodejs.org/en/download/) installed on your machine.

Then you need to configure this repository with your own keys; duplicate `.env.template` and rename it `.env`. You will need to get your own [Notion API key](https://developers.notion.com/docs#step-1-create-an-integration) you need to follow through steps 1 & 2 to get all the required environment variables.

As long as your columns are named like mine this script will links pages from your books and titles together. This part is being worked on so it's more modular.

Use `yarn start` in your terminal from this repo's root.
