'use strict';

const ContactDAO = require('../dao/contact');
const internals = {
    getPath: '/v1/contact/$id'
};

/**
 * @typedef {Object} ContactInsertUpdate
 * @property {string} name
 * @property {string} company
 * @property {string} small_image_url
 * @property {string} large_image_url
 * @property {string} email
 * @property {string} website
 * @property {number} birthday
 * @property {string} street_address
 * @property {string} city
 * @property {string} state
 * @property {string} country 'US' || 'CA'
 * @property {string} postal_code
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} work_phone
 * @property {string} home_phone
 * @property {string} mobile_phone
 */

/**
 * Contact Service class
 * @class
 */
class ContactService {

    /**
     * constructor - Contact Service Constructor
     *
     * @param  {Object} db Promisified sqlite DB
     */
    constructor(db) {
        this._db = db;
        this.contactDAO = new ContactDAO(db);
    }


    /**
     * create - Create a Contact
     *
     * @param  {ContactInsertUpdate} params Data to create
     * @return {Promise<string>} URI of the newly created resource
     */
    create(params) {
        return this.contactDAO.create(params)
            .then((id) => {
                return internals.getPath.replace('$id', id);
            });
    }
}

module.exports = ContactService;
