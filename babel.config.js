module.exports = {
  // assumptions: {
  //   setPublicClassFields: false,
  // },
  presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
  plugins: [["@babel/plugin-proposal-class-properties", { loose: false }]],
};
