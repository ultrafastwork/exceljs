const BaseXform = require('../base-xform');

// DocumentFormat.OpenXml.Drawing.Transform2D
class XfrmXform extends BaseXform {
  constructor() {
    super();
    this.map = {};
  }

  get tag() {
    return 'a:xfrm';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      rot: model && model.rotation ? model.rotation * 60000 : undefined,
      flipH: model && model.horizontalFlip ? '1' : undefined,
      flipV: model && model.verticalFlip ? '1' : undefined,
    });
    const off = (model && model.off) || {};
    const ext = (model && model.ext) || {};
    const x = off.offsetX !== undefined ? off.offsetX : off.x;
    const y = off.offsetY !== undefined ? off.offsetY : off.y;
    const cx = ext.extentX !== undefined ? ext.extentX : ext.cx;
    const cy = ext.extentY !== undefined ? ext.extentY : ext.cy;
    xmlStream.leafNode('a:off', {
      x: x !== undefined ? x : 0,
      y: y !== undefined ? y : 0,
    });
    xmlStream.leafNode('a:ext', {
      cx: cx !== undefined ? cx : 0,
      cy: cy !== undefined ? cy : 0,
    });
    xmlStream.closeNode();
  }

  parseOpen(node) {
    if (this.parser) {
      this.parser.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.model = {
          rotation: node.attributes.rot ? parseInt(node.attributes.rot, 10) / 60000 : undefined,
          horizontalFlip: node.attributes.flipH ? node.attributes.flipH === '1' : undefined,
          verticalFlip: node.attributes.flipV ? node.attributes.flipV === '1' : undefined,
        };
        break;
      case 'a:off':
        if (
          this.model &&
          ((node.attributes.x && node.attributes.x !== '0') ||
            (node.attributes.y && node.attributes.y !== '0'))
        ) {
          this.model.off = {
            offsetX: node.attributes.x,
            offsetY: node.attributes.y,
          };
        }
        break;
      case 'a:ext':
        if (
          this.model &&
          ((node.attributes.cx && node.attributes.cx !== '0') ||
            (node.attributes.cy && node.attributes.cy !== '0'))
        ) {
          this.model.ext = {
            extentX: node.attributes.cx,
            extentY: node.attributes.cy,
          };
        }
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
        return false;
      default:
        return true;
    }
  }
}

module.exports = XfrmXform;
