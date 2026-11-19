import CompositeXform from '../../composite-xform.js';
import ColorXform from '../../style/color-xform.js';
import CfvoXform from './cfvo-xform.js';

class DatabarXform extends CompositeXform {
  constructor() {
    super();

    this.map = {
      cfvo: (this.cfvoXform = new CfvoXform()),
      color: (this.colorXform = new ColorXform()),
    };
  }

  get tag() {
    return 'dataBar';
  }

  render(xmlStream, model) {
    xmlStream.openNode(this.tag);

    const cfvo = model.cfvo || [{type: 'min'}, {type: 'max'}];
    const color = model.color || {argb: 'FF638EC6'};

    cfvo.forEach(item => {
      this.cfvoXform.render(xmlStream, item);
    });
    this.colorXform.render(xmlStream, color);

    xmlStream.closeNode();
  }

  createNewModel() {
    return {
      cfvo: [],
    };
  }

  onParserClose(name, parser) {
    switch (name) {
      case 'cfvo':
        this.model.cfvo.push(parser.model);
        break;
      case 'color':
        this.model.color = parser.model;
        break;
    }
  }
}

export default DatabarXform;
