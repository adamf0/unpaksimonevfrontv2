import { ActionItem } from "../../Common/Components/Attribut/ActionItem";
import { TemplateItem } from "../../TemplateQuestionBank/Attribut/TemplateItem";

interface ActionTableAdapterConfig {
  baseActions: Record<any, (item: TemplateItem) => ActionItem>;
  actionMap: Record<string, any[]>;
}

export class ActionTableAdapter {
  private item: TemplateItem;
  private config: ActionTableAdapterConfig;

  constructor(item: TemplateItem, config: ActionTableAdapterConfig) {
    this.item = item;
    this.config = config;
  }

  public toActionItems(): ActionItem[] {
    const keys = this.config.actionMap[this.item.status] ?? [];

    return keys.map((key) => this.config.baseActions[key](this.item));
  }
}