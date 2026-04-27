import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import { ToastProvider } from "../../Common/Context/ToastContext";
import { KuesionerReportProvider } from "../Context/KuesionerReportContext";
import ReportTemplate from "../Template/ReportTemplate";

export default function ReportPage() {
  return (
    <ToastProvider>
      <KuesionerReportProvider>
        <AdminPanelTemplateServer>
          <ReportTemplate />
        </AdminPanelTemplateServer>
      </KuesionerReportProvider>
    </ToastProvider>
  );
}
