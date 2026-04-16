import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import { ToastProvider } from "../../Common/Context/ToastContext";
import { QuestionBankProvider } from "../Context/QuestionBankProvider";
import BankSoalTemplate from "../Template/BankSoalTemplate";

export default function BankSoalPage() {
  return (
    <ToastProvider>
      <QuestionBankProvider>
        <AdminPanelTemplateServer>
          <BankSoalTemplate />
        </AdminPanelTemplateServer>
      </QuestionBankProvider>
    </ToastProvider>
  );
}
