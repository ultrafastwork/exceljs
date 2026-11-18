const {parseRange} = require('./drawing-range');

class Image {
  constructor(worksheet, model) {
    this.worksheet = worksheet;
    this.model = model;
  }

  get model() {
    switch (this.type) {
      case 'background':
        return {
          type: this.type,
          imageId: this.imageId,
          sheetImageId: this.sheetImageId,
        };
      case 'image':
        return {
          type: this.type,
          imageId: this.imageId,
          hyperlinks: this.range.hyperlinks,
          ...(this.rotation !== undefined ? {rotation: this.rotation} : {}),
          ...(this.ext !== undefined ? {ext: this.ext} : {}),
          ...(this.off !== undefined ? {off: this.off} : {}),
          ...(this.props !== undefined ? {props: this.props} : {}),
          range: {
            tl: this.range.tl.model,
            br: this.range.br && this.range.br.model,
            ext: this.range.ext,
            editAs: this.range.editAs,
          },
          sheetImageId: this.sheetImageId,
        };
      default:
        throw new Error('Invalid Image Type');
    }
  }

  set model({type, rotation, ext, off, imageId, range, hyperlinks, props, sheetImageId}) {
    this.type = type;
    this.imageId = imageId;
    this.sheetImageId = sheetImageId;
    this.rotation = rotation !== undefined ? rotation : range && range.rotation;
    this.ext = ext;
    this.off = off;
    this.props = props;

    if (type === 'image') {
      this.range = parseRange(range, hyperlinks, this.worksheet);
    }
  }
}

module.exports = Image;
