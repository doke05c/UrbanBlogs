module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy("src");
  eleventyConfig.addPassthroughCopy({
    "node_modules/@duckdb/duckdb-wasm/dist": "duckdb"
  });

  eleventyConfig.setServerOptions({
    port: 8080,
    domDiff: false,
    showAllHosts: true,
    
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    }
  });

  eleventyConfig.addGlobalData("env", process.env.NODE_ENV);

};
