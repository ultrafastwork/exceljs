import BaseXform from '../base-xform.js';

class ExtLstXform extends BaseXform {
  get tag() {
    return 'a:extLst';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);
    xmlStream.openNode('a:ext', {
      uri: '{FF2B5EF4-FFF2-40B4-BE49-F238E27FC236}',
    });
    xmlStream.leafNode('a16:creationId', {
      'xmlns:a16': 'http://schemas.microsoft.com/office/drawing/2014/main',
      id: '{00000000-0008-0000-0000-000002000000}',
    });
    xmlStream.closeNode();
    if (model && model.decorative !== undefined) {
      xmlStream.openNode('a:ext', {
        uri: '{C183D7F6-B498-43B3-948B-1728B52AA6E4}',
      });
      xmlStream.leafNode('adec:decorative', {
        'xmlns:adec': 'http://schemas.microsoft.com/office/drawing/2017/decorative',
        val: model.decorative && model.decorative !== '0' ? '1' : '0',
      });
      xmlStream.closeNode();
    }
    xmlStream.closeNode();
  }

  parseOpen(node) {
    switch (node.name) {
      case this.tag:
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
}

export default ExtLstXform;
