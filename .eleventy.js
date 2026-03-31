module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("src/report_card.duckdb");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@duckdb/duckdb-wasm/dist": "duckdb"
  });

  eleventyConfig.setServerOptions({
    port: 8080,
    domDiff: false,
    showAllHosts: true,
    
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp"
    }
  });

};
