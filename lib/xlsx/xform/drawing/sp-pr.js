const BaseXform = require('../base-xform');
const XfrmXform = require('./xfrm-xform');

class SpPrXform extends BaseXform {
  constructor() {
    super();

    this.map = {
      'a:xfrm': new XfrmXform(),
    };
  }

  get tag() {
    return 'xdr:spPr';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);
    this.map['a:xfrm'].render(xmlStream, model);
    xmlStream.openNode('a:prstGeom', {prst: 'rect'});
    xmlStream.leafNode('a:avLst');
    xmlStream.closeNode();
    xmlStream.closeNode();
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }

    switch (node.name) {
      case this.tag:
        this.reset();
        break;
      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parser.parseOpen(node);
        }
        break;
    }
    return true;
  }

  parseText() {}

  parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        this.model = this.map['a:xfrm'].model;
        return false;
      default:
        return true;
    }
  }
}

module.exports = SpPrXform;
