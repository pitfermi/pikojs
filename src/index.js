/* 
 * pikojs
 *
 * Copyright (c) 2018 pitfermi (Petros Mavridis). 
 *
 * pikojs's license follows:
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * This license applies to all parts of pikojs that are not externally
 * maintained libraries.
 */

var axios = require('axios');
var cheerio = require('cheerio');

/**
 * Initialize Piko object
 * @param {object} options 
 * @return {void}
 */
function Piko(options) {
    this._options = {
        host: options.hostname || null,
        username: options.username || 'pvserver',
        password: options.password || 'pvwr',
        port: options.port || '80'
    };
}

/**
 * Fetch HTML from the Piko webpage using Promises.
 * Note that getData returns a Promise
 * @return {Promise<object>}
 */
Piko.prototype.getData = async function () {
    try {
        const url = `${this._options.host}:${this._options.port}`;

        return this.parseHTML(
            (
                await axios(url, {
                    method: 'get',
                    auth: {
                        username: this._options.username,
                        password: this._options.password
                    }
                })
            ).data
        );
    } catch (error) {
        console.log(error);
    }
};

/**
 * Parse the HTML for the various values 
 * using CSS selectors
 * @param {string} htmlPage htmlpage string to be parsed
 * @return {object}        
 */
Piko.prototype.parseHTML = function (htmlPage) {

    var $ = cheerio.load(htmlPage);

    let currentACPowerValue = this.fixValue($('body > form > font > table:nth-child(2) tr:nth-child(4) > td:nth-child(3)').text().trim());
    let dailyEnergyValue = this.fixValue($('body > form > font > table:nth-child(2) tr:nth-child(6) > td:nth-child(6)').text().trim());
    let totalEnergyValue = this.fixValue($('body > form > font > table:nth-child(2) tr:nth-child(4) > td:nth-child(6)').text().trim());
    let statusValue = $('body > form > font > table:nth-child(2) tr:nth-child(8) > td:nth-child(3)').text().trim();

    return {
        currentACPower: {
            value: currentACPowerValue,
            unit: 'W'
        },
        dailyEnergy: {
            value: dailyEnergyValue,
            unit: 'kWh'
        },
        totalEnergy: {
            value: totalEnergyValue,
            unit: 'kWh'
        },
        status: statusValue
    };
}

/**
 * Fix value in case '0' is represented as 'x x x...'
 * @param {string} value
 * @return {number}
 */
Piko.prototype.fixValue = (value) => {
    if (typeof value === 'string') {
        value = value.trim();
    }
    return (value.includes("x x x") ? 0 : parseFloat(value));
}

module.exports = Piko;