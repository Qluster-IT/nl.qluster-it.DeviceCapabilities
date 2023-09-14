
function getDriverId(id) {
  return id.substring(id.lastIndexOf(':')+1);
}

module.exports = { getDriverId };