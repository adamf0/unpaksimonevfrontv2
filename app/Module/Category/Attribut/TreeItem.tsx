export interface TreeItem {
  id: string;
  uuid: string;
  name: string;
  type?: "folder" | "file";
  children?: TreeItem[];
}