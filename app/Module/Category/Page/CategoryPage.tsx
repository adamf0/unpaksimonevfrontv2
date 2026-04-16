import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import { ToastProvider } from "../../Common/Context/ToastContext";
import { CategoryProvider } from "../Context/CategoryProvider";
import CategoryTemplate from "../Template/CategoryTemplate";

export default function CategoryPage() {
  return (
    <ToastProvider>
      <CategoryProvider>
        <AdminPanelTemplateServer>
          <CategoryTemplate />
        </AdminPanelTemplateServer>
      </CategoryProvider>
    </ToastProvider>
  );
}
