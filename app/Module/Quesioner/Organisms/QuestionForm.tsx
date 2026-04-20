import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { AnswerState } from "../Attribut/AnswerState";
import { Option } from "../Attribut/Option";
import { Question } from "../Attribut/Question";
import RatingScale from "../Molecules/RatingScale";
import SelectableOption from "../Molecules/SelectableOption";

type Props = {
  filteredData: Question[];
  answers: AnswerState;
  errors: Record<string, string>;
  toast: string | null;
  loading: boolean;

  isBrokenQuestion: (q: Question) => boolean;
  isSelected: (
    qid: string,
    option: Option,
    type: "radio" | "multiple",
  ) => boolean;

  handleChange: (
    qid: string,
    option: Option,
    type: "radio" | "multiple",
  ) => void;

  handleExtraChange: (qid: string, optVal: string, val: string) => void;

  setAnswers: React.Dispatch<React.SetStateAction<AnswerState>>;
  handleSubmit: (e: React.FormEvent) => void;
};

export default function QuestionForm(props: Props) {
  const {
    filteredData,
    answers,
    errors,
    toast,
    loading,
    isBrokenQuestion,
    isSelected,
    handleChange,
    handleExtraChange,
    setAnswers,
    handleSubmit,
  } = props;

  const groupedData: Record<string, Question[]> = filteredData.reduce(
    (acc, item) => {
      const key = item.fullpath;

      if (!acc[key]) acc[key] = [];

      acc[key].push(item);

      return acc;
    },
    {} as Record<string, Question[]>,
  );

  // console.log("filteredData", filteredData); //groupkan dulu dari fullpath
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-10">
        {Object.entries(groupedData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([group, questions]) => (
            <div key={group}>
              <header className="mb-16">
                <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">
                  {group}
                </h2>
              </header>

              {questions.map((q) => {
                const broken = isBrokenQuestion(q);

                return (
                  <div key={q.uuid} className="space-y-4">
                    <label className="font-bold block">{q.pertanyaan}</label>

                    {broken ? (
                      <div className="p-4 bg-red-50 text-red-600 border rounded-lg">
                        Broken question detected
                      </div>
                    ) : (
                      <>
                        {(q.tipe === "radio" || q.tipe === "multiple") && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {q.pilihan.map((opt) => (
                              <SelectableOption
                                key={opt.value}
                                id={`${q.uuid}-${opt.value}`}
                                name={q.uuid}
                                type={q.tipe as "radio" | "multiple"}
                                label={opt.label}
                                value={opt.value}
                                checked={isSelected(
                                  q.uuid,
                                  opt,
                                  q.tipe as "radio" | "multiple",
                                )}
                                onChange={() =>
                                  handleChange(
                                    q.uuid,
                                    opt,
                                    q.tipe as "radio" | "multiple",
                                  )
                                }
                                withInput={opt.freetext}
                                inputValue={
                                  answers[q.uuid]?.extra?.[opt.value] || ""
                                }
                                onInputChange={(val) =>
                                  handleExtraChange(q.uuid, opt.value, val)
                                }
                              />
                            ))}
                          </div>
                        )}

                        {q.tipe === "rating" && (
                          <RatingScale
                            value={
                              answers[q.uuid]?.value &&
                              typeof answers[q.uuid]?.value === "object" &&
                              !Array.isArray(answers[q.uuid]?.value)
                                ? Number(
                                    (answers[q.uuid]?.value as Option).label,
                                  )
                                : undefined
                            }
                            onChange={(val) => {
                              const selected = q.pilihan.find(
                                (p) => p.label === val.toString(),
                              );

                              if (!selected) return;

                              setAnswers((prev) => ({
                                ...prev,
                                [q.uuid]: {
                                  value: selected,
                                },
                              }));
                            }}
                          />
                        )}
                      </>
                    )}

                    {errors[q.uuid] && !broken && (
                      <p className="text-red-500 text-sm">{errors[q.uuid]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

        <AnimatedButton
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform indigo-shadow disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:from-gray-300 disabled:to-gray-400"
          icon=""
        >
          {loading ? "Kirim Data..." : "Survei Selesai"}
        </AnimatedButton>
      </form>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-yellow-100 text-yellow-800 px-4 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
