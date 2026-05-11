"use client";

import Card from "../../Common/Components/Atoms/Card";
import Icon from "../../Common/Components/Atoms/Icon";
import { useAdminPanel } from "../../Common/Components/Template/AdminPanelTemplate";
import { useTemplateQuestionContext } from "../Context/TemplateQuestionProvider";

export function LaunchCard() {
  const { setMode } = useAdminPanel();
  const { questionQuery } = useTemplateQuestionContext();

  const isBankSoalEmpty =
    !questionQuery?.banksoal ||
    (Array.isArray(questionQuery.banksoal) &&
      questionQuery.banksoal.length === 0) ||
    !questionQuery?.banksoal?.value;

  return (
    <Card className="!bg-indigo-900 rounded-xl p-8 text-white relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-900 opacity-90"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3">
          Preview Questionnaire Template
        </h3>

        <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
          Review the questionnaire structure, categories, answer options, and
          question flow before publishing.
        </p>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setMode("preview")}
            disabled={isBankSoalEmpty}
            className="w-full bg-white text-indigo-900 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-xl disabled:opacity-60"
          >
            <Icon name={"frame_inspect"} />
            Preview
          </button>
        </div>
      </div>

      <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
    </Card>
  );
}
