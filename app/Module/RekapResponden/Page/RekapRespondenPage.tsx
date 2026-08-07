import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import { ToastProvider } from "../../Common/Context/ToastContext";
import RekapRespondenTemplate from "../Template/RekapRespondenTemplate";

export default function RekapRespondenPage() {
  return (
    <ToastProvider>
      <AdminPanelTemplateServer>
        <RekapRespondenTemplate />
      </AdminPanelTemplateServer>
    </ToastProvider>
  );
}
