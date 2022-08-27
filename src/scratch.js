// Get the whole scratchpad reserved for this extension (on an element or core) or get a single property of it
function getScratch(cyOrEle, name) {
  if (cyOrEle.scratch('_cyNodeEditing') === undefined) {
    cyOrEle.scratch('_cyNodeEditing', {});
  }

  var scratch = cyOrEle.scratch('_cyNodeEditing');
  var retVal = name === undefined ? scratch : scratch[name];
  return retVal;
}

// Set a single property on scratchpad of an element or the core
function setScratch(cyOrEle, name, val) {
  getScratch(cyOrEle)[name] = val;
}

module.exports = {
  getScratch,
  setScratch,
};
