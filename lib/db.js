'use strict';

const BPromise = require('bluebird');
const path = require('path');
const sqlite3 = BPromise.promisifyAll(require('sqlite3'));
const contactsCreationScript = `
  CREATE TABLE IF NOT EXISTS
  CONTACT
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    small_image_url VARCHAR(100),
    large_image_url VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    website VARCHAR(100),
    birthday INTEGER,
    street_address VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    country VARCHAR(2),
    postal_code VARCHAR(7),
    latitude REAL,
    longitude REAL
  )
`;
const phoneCreationScript = `
  CREATE TABLE IF NOT EXISTS
  PHONE
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    contact_id INTEGER NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(10),
    number VARCHAR(15),
    FOREIGN KEY(contact_id) REFERENCES contact(id)
  )
`;

module.exports = (server, options, next) => {
    let dbPath = path.resolve('lib', 'db', 'index.db');
    let db = new sqlite3.Database(dbPath);

    db.runAsync(contactsCreationScript)
        .then(() => {
            return db.runAsync(phoneCreationScript);
        })
        .then(() => {
            server.expose('db', db);
        })
        .done(next, next);
};

module.exports.attributes = {
    name: 'sqlite-plugin'
};
