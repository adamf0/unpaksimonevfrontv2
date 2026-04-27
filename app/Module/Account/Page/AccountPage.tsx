import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import { ToastProvider } from "../../Common/Context/ToastContext";
import { AccountProvider } from "../Context/AccountProvider";
import AccountTemplate from "../Template/AccountTemplate";

export default function AccountPage() {
  return (
    <ToastProvider>
      <AccountProvider>
        <AdminPanelTemplateServer>
          <AccountTemplate />
        </AdminPanelTemplateServer>
      </AccountProvider>
    </ToastProvider>
  );
}
