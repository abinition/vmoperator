exports = module.exports = {
  /*
   * About Page
   */
  about: function (req, rsp) {
    rsp.render("marketing/about", {
      layout : "marketing/layout",
      active: "about"
    });
  },
  
  /*
   * Privacy Page
   */
  privacy: function (req, rsp) {
    rsp.render("marketing/privacy", {
      layout : "marketing/layout",
      active: "privacy"
    });
  },

  /*
   * Terms of Service Page
   */
  tos: function (req, rsp) {
    rsp.render("marketing/tos", {
      layout : "marketing/layout",
      active: "tos"
    });
  },

  /*
   * FAQ Page
   */
  faq: function (req, rsp) {
    rsp.render("marketing/faq", {
      layout : "marketing/layout",
      active: "faq"
    });
  },

  /*
   * Meet the Experts Page
   */
  experts: function (req, rsp) {
    rsp.render("marketing/experts", {
      layout : "marketing/layout",
      active: "experts"
    });
  },

  /*
   * News Page
   */
  news: function (req, rsp) {
    rsp.render("marketing/news/index", {
      layout : "marketing/layout",
      active: "news",
      subnav: "index"
    });
  },

  /*
   * News > Media Kit Page
   */
  news_media_kit: function (req, rsp) {
    rsp.render("marketing/news/kit", {
      layout : "marketing/layout",
      active: "news",
      subnav: "kit"
    });
  },

  /*
   * News > Media Coverage Page
   */
  news_media_coverage: function (req, rsp) {
    rsp.render("marketing/news/coverage", {
      layout : "marketing/layout",
      active: "news",
      subnav: "coverage"
    });
  },

  /*
   * News > Image Library Page
   */
  news_image_library: function (req, rsp) {
    rsp.render("marketing/news/library", {
      layout : "marketing/layout",
      active: "news",
      subnav: "library"
    });
  },
  
  /*
   * Terms and conditions Page
   */
  terms_and_conditions: function (req, rsp) {
    rsp.render("tos", {
      layout: "layouts/unauthorized"
    })
  }
}
