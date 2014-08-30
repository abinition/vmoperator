/*
 * Serve JSON to our AngularJS client
 */

exports.gem = function (req, res) {
  res.json({
    gem: "Gem Message"
  });

};
