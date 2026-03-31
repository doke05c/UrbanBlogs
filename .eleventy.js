module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("src/report_card.duckdb");
  eleventyConfig.addPassthroughCopy("src/js/");
};
