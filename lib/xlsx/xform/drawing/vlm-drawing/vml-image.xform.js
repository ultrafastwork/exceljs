const BaseXform = require('../../base-xform');

class VmlImageform extends BaseXform {
  get tag() {
    return 'v:imagedata';
  }

  render(xmlStream, model) {
    xmlStream.leafNode(this.tag, {
      'o:relid': model.rId,
      'o:title': model.title,
    });
  }

  parseOpen(node) {
    switch (node.name) {
      case this.tag:
        this.reset();
        this.model = {
          rId: node.attributes['o:relid'],
          title: node.attributes['o:title'],
        };
        return true;
      default:
        return true;
    }
  }

  parseText() {}

  parseClose(name) {
    switch (name) {
      case this.tag:
        return false;
      default:
        // unprocessed internal nodes
        return true;
    }
  }

  reconcile(model, options) {
    if (model && model.rId && options.rels) {
      const rel = options.rels[model.rId];
      if (rel && rel.Target) {
        const match = rel.Target.match(/.*\/media\/(.+[.][a-zA-Z]{3,4})/);
        if (match) {
          const name = match[1];
          const mediaId = options.mediaIndex && options.mediaIndex[name];
          if (mediaId !== undefined) {
            model.index =
              options.media && options.media[mediaId] && options.media[mediaId].index !== undefined
                ? options.media[mediaId].index
                : mediaId;
          }
        }
      }
    }
    return undefined;
  }
}

module.exports = VmlImageform;
