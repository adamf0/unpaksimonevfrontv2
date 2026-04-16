import AdminPanelTemplateServer from "../../Common/Components/Template/AdminPanelTemplateServer";
import { ToastProvider } from "../../Common/Context/ToastContext";
import { TemplateAnswerProvider } from "../Context/TemplateAnswareProvider";
import { TemplateQuestionProvider } from "../Context/TemplateQuestionProvider";
import TemplateTemplate from "../Template/TemplateQuestionTemplate";

export default function TemplatePage() {
  return (
    <ToastProvider>
      <TemplateQuestionProvider>
        <TemplateAnswerProvider>
          <AdminPanelTemplateServer>
            <TemplateTemplate />
          </AdminPanelTemplateServer>
        </TemplateAnswerProvider>
      </TemplateQuestionProvider>
    </ToastProvider>
  );
}