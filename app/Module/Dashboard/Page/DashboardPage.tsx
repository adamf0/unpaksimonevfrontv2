import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import Card from "../Molecules/Card";

export default function DashboardPage() {
  return (
    <AdminPanelTemplateServer>
      
      {/* METRICS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Responses" value="12,842" icon="forum" />
        <Card title="Active Surveys" value="48" icon="assignment_turned_in" />
        <Card title="Departments" value="14" icon="domain" />
      </section>

    </AdminPanelTemplateServer>
  );
}