import { TreeItem } from "./TreeItem";

export interface FlattenedItem
  extends Omit<TreeItem, "children"> {
  depth: number;
  parentUuid: string | null;
}