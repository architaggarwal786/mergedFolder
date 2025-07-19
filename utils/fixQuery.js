module.exports = function fixQuery(query) {
  const fixed = {};
  for (const key in query) {
    if (typeof query[key] === 'string') {
      fixed[key] = query[key].trim().toLowerCase();
    } else {
      fixed[key] = query[key];
    }
  }
  return fixed;
};
