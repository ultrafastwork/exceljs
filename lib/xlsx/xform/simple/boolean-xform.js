import BaseXform from '../base-xform.js';

class BooleanXform extends BaseXform {
  constructor(options) {
    super();

    this.tag = options.tag;
    this.attr = options.attr;
  }

  render(xmlStream, model) {
    if (model) {
      xmlStream.openNode(this.tag);
      xmlStream.closeNode();
    }
  }

  parseOpen(node) {
    if (node.name === this.tag) {
      if (this.attr) {
        const val = node.attributes[this.attr];
        this.model = !(val === '0' || val === 'false');
      } else {
        this.model = true;
      }
    }
  }

  parseText() {}

  parseClose() {
    return false;
  }
}

export default BooleanXform;
