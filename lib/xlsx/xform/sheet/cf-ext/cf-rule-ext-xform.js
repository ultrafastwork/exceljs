import {v4 as uuidv4} from '../../../../utils/uuid.js';
import BaseXform from '../../base-xform.js';
import CompositeXform from '../../composite-xform.js';
import DatabarExtXform from './databar-ext-xform.js';
import IconSetExtXform from './icon-set-ext-xform.js';
import FExtXform from './f-ext-xform.js';

const extIcons = {
  '3Triangles': true,
  '3Stars': true,
  '5Boxes': true,
};

class CfRuleExtXform extends CompositeXform {
  constructor() {
    super();

    this.map = {
      'x14:dataBar': (this.databarXform = new DatabarExtXform()),
      'x14:iconSet': (this.iconSetXform = new IconSetExtXform()),
      'xm:f': (this.fExtXform = new FExtXform()),
    };
  }

  get tag() {
    return 'x14:cfRule';
  }

  static isExt(rule) {
    // is this rule primitive?
    if (rule.type === 'dataBar') {
      return DatabarExtXform.isExt(rule);
    }
    if (rule.type === 'iconSet') {
      if (rule.custom || extIcons[rule.iconSet]) {
        return true;
      }
    }
    return false;
  }

  prepare(model) {
    if (CfRuleExtXform.isExt(model)) {
      model.x14Id = `{${uuidv4()}}`.toUpperCase();
    }
  }

  render(xmlStream, model) {
    if (!CfRuleExtXform.isExt(model)) {
      return;
    }

    switch (model.type) {
      case 'dataBar':
        this.renderDataBar(xmlStream, model);
        break;
      case 'iconSet':
        this.renderIconSet(xmlStream, model);
        break;
    }
  }

  renderDataBar(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      type: 'dataBar',
      id: model.x14Id,
    });

    this.databarXform.render(xmlStream, model);

    xmlStream.closeNode();
  }

  renderIconSet(xmlStream, model) {
    xmlStream.openNode(this.tag, {
      type: 'iconSet',
      priority: model.priority,
      id: model.x14Id || `{${uuidv4()}}`,
    });

    this.iconSetXform.render(xmlStream, model);

    xmlStream.closeNode();
  }

  createNewModel({attributes}) {
    return {
      type: attributes.type,
      x14Id: attributes.id,
      priority: BaseXform.toIntValue(attributes.priority),
    };
  }

  onParserClose(name, parser) {
    switch (name) {
      case 'x14:dataBar':
      case 'x14:iconSet':
        Object.assign(this.model, parser.model);
        break;

      case 'xm:f':
        this.model.formulae = this.model.formulae || [];
        this.model.formulae.push(parser.model);
        break;
    }
  }
}

export default CfRuleExtXform;
