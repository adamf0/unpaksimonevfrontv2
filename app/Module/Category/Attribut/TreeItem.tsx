export interface TreeItem {
  uuid: string;
  name: string;
  deletedat: string|null;
  type?: "folder" | "file";
  children?: TreeItem[];
}