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

  isBrokenQuestion: (q: Question) => boolean;
  isSelected: (
    qid: string,
    option: Option,
    type: "radio" | "checkbox"
  ) => boolean;

  handleChange: (
    qid: string,
    option: Option,
    type: "radio" | "checkbox"
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
    isBrokenQuestion,
    isSelected,
    handleChange,
    handleExtraChange,
    setAnswers,
    handleSubmit,
  } = props;

  console.log(errors)

  return (
    <>
      <header className="mb-16">
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-2">
          Academic Experience & Facilities
        </h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {filteredData.map((q) => {
          const broken = isBrokenQuestion(q);

          return (
            <div key={q.id} className="space-y-4">
              <label className="font-bold block">{q.pertanyaan}</label>

              {broken ? (
                <div className="p-4 bg-red-50 text-red-600 border rounded-lg">
                  Broken question detected
                </div>
              ) : (
                <>
                  {(q.tipe === "radio" || q.tipe === "checkbox") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {q.pilihan.map((opt) => (
                        <SelectableOption
                          key={opt.value}
                          id={`${q.id}-${opt.value}`}
                          name={q.id}
                          type={q.tipe as "radio" | "checkbox"}
                          label={opt.label}
                          value={opt.value}
                          checked={isSelected(q.id, opt, q.tipe as "radio" | "checkbox")}
                          onChange={() =>
                            handleChange(q.id, opt, q.tipe as "radio" | "checkbox")
                          }
                          withInput={opt.freetext}
                          inputValue={
                            answers[q.id]?.extra?.[opt.value] || ""
                          }
                          onInputChange={(val) =>
                            handleExtraChange(q.id, opt.value, val)
                          }
                        />
                      ))}
                    </div>
                  )}

                  {q.tipe === "rating" && (
                    <RatingScale
                      value={answers[q.id]?.value as number}
                      onChange={(val) =>
                        setAnswers((p) => ({
                          ...p,
                          [q.id]: { value: val },
                        }))
                      }
                    />
                  )}
                </>
              )}

              {errors[q.id] && !broken && (
                <p className="text-red-500 text-sm">{errors[q.id]}</p>
              )}
            </div>
          );
        })}

        <AnimatedButton
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform indigo-shadow"
          icon=""
        >
          Finish Survey
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