# Inventory Tracker

> MVP

## Set Up

```sh
 git clone git@github.com:superbuggy/inventory-tracker.git
 cd inventory-tracker/
 npm i
 # optional
 cp db/test-data.csv ~/Downloads/
```

Test .csv in `db/test-data.csv`.

## Implementation Notes

The backend expects a boolean value for the availability fields. The frontend deals with a string and derives the boolean value for the backend from the presence of a `'y'` in the string from the frontend representation of the availability of the product: `Yes`, `yes`, `y`, or `Y` will be `true`, all else `false`.
