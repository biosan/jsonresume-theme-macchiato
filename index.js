const fs = require('fs');
const handlebars = require('handlebars');
const handlebarsWax = require('handlebars-wax');
// const addressFormat = require('address-format');
const moment = require('moment');
const Swag = require('swag');

try {
  window.Swag.registerHelpers(handlebars);
} catch (e) {
  Swag.registerHelpers(handlebars);
}

handlebars.registerHelper({
  removeProtocol: url => url.replace(/.*?:\/\//g, ''),
  concat: (...args) => args.filter(arg => typeof arg !== 'object').join(''),
  // Arguments: {address, city, subdivision, postalCode, countryCode}
  // formatAddress: (...args) => addressFormat(args).join(' '),
  formatAddress: (...args) => args.filter(arg => typeof arg !== 'object').join(' '),
  formatDate: date => moment(date).format('MM/YYYY'),
  // lowercase: s => s.toLowerCas(),
});

function render(resume) {
  const dir = `${__dirname}/src`;
  const css = fs.readFileSync(`${dir}/style.css`, 'utf-8');
  const resumeTemplate = fs.readFileSync(`${dir}/resume.hbs`, 'utf-8');

  const Handlebars = handlebarsWax(handlebars);

  Handlebars.partials(`${dir}/partials/**/*.{hbs,js}`);

  return Handlebars.compile(resumeTemplate)({
    style: `<style>${css}</style>`,
    resume,
  });
}

module.exports = {
  render,
};
