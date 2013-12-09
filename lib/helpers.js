var util = require('util');

var error2text = {
  "error.email": "Invalid email <span class='hide'>%s</span>",
  "account.email.exists": "Email, already exists. <a href='/login'>Login</a> <span class='hide'>%s</span>",
  "invalid.username": "Invalid username <span class='hide'>%s</span>",
  "error.required": "%s is required",
  "error.minLength": "%s must be at last 4 characters"
}

var ignoreFields = ["confirmPassword"];

exports.parseErrors = function(body){
  var errors = ["Sorry, something went wrong"];
  if (body && body.validationErrors) {
    errors = [];
    for(var field in body.validationErrors)(function (field) {
      if (ignoreFields.indexOf(field) == -1) {
        if (typeof error2text[body.validationErrors[field]] !== "undefined") {
          errors.push(util.format(error2text[body.validationErrors[field]], field));
        } else {
          errors.push(field + ": " + body.validationErrors[field]);
        }
      }
    })(field)
  }
  return errors;
}

exports.isMember = function (profile, networkId) {
  var member = false;
  if (profile.networks && profile.networks.length > 0) {
    profile.networks.forEach(function (network) {
      if (network.id == networkId) {
        member = true;
      }
      return;
    });
  }
  return member;
}