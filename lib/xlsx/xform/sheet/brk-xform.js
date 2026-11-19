import BaseXform from '../base-xform.js';

class BrkXform extends BaseXform {
  get tag() {
    return 'brk';
  }

  render(xmlStream, model) {
    xmlStream.leafNode('brk', model);
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      this.model = {
        id: node.attributes.id !== undefined ? parseInt(node.attributes.id, 10) : undefined,
        max: node.attributes.max !== undefined ? parseInt(node.attributes.max, 10) : undefined,
        min: node.attributes.min !== undefined ? parseInt(node.attributes.min, 10) : undefined,
        man: node.attributes.man !== undefined ? parseInt(node.attributes.man, 10) : undefined,
      };
      return true;
    }
    return false;
  }

  parseClose() {
    return false;
  }
}

export default BrkXform;
