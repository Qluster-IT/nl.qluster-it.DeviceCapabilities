
function getDriverId(id) {
  return id.substring(id.lastIndexOf(':')+1);
}
function getOwnerUri(id) {
  return id.substring(0,id.lastIndexOf(':'));
}

module.exports = { getDriverId, getOwnerUri };