import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import DashboardMetrics from "../Molecules/DashboardMetrics";

export default function DashboardPage() {
  return (
    <AdminPanelTemplateServer>
      <DashboardMetrics />
    </AdminPanelTemplateServer>
  );
}