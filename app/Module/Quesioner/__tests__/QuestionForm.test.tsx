import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import QuestionForm from "../Organisms/QuestionForm";

// Mock next/image to prevent failing on asset imports
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => (
    <img src={typeof src === "string" ? src : "mock-src"} alt={alt} className={className} />
  ),
}));

vi.mock("../../Common/Components/Molecules/AnimatedButton", () => ({
  default: ({ children, disabled, className }: any) => (
    <button disabled={disabled} className={className} type="submit">
      {children}
    </button>
  ),
}));

vi.mock("../Molecules/RatingScale", () => ({
  default: () => <div data-testid="mock-rating-scale" />,
}));

vi.mock("../Molecules/SelectableOption", () => ({
  default: ({ label, onChange }: any) => (
    <div>
      <span>{label}</span>
      <button data-testid="btn-change-option" onClick={onChange}>Change</button>
    </div>
  ),
}));

describe("QuestionForm Component", () => {
  const mockQuestions = [
    {
      id: "q-1",
      uuid: "q-1",
      pertanyaan: "Bagaimana materi perkuliahan?",
      required: true,
      created: "admin",
      createdBy: "admin",
      tipe: "radio",
      fullpath: "Evaluasi Dosen",
      pilihan: [{ label: "Sangat Baik", value: "opt-1", freetext: false }],
    },
  ];

  const mockAnswers = {};
  const mockErrors = {};
  const mockIsBroken = vi.fn(() => false);
  const mockIsSelected = vi.fn(() => false);
  const mockHandleChange = vi.fn();
  const mockHandleExtra = vi.fn();
  const mockSetAnswers = vi.fn();
  const mockHandleSubmit = vi.fn((e) => e.preventDefault());

  it("should render grouped topics header and questions options", () => {
    render(
      <QuestionForm
        filteredData={mockQuestions}
        answers={mockAnswers}
        errors={mockErrors}
        toast={null}
        loading={false}
        isBrokenQuestion={mockIsBroken}
        isSelected={mockIsSelected}
        handleChange={mockHandleChange}
        handleExtraChange={mockHandleExtra}
        setAnswers={mockSetAnswers}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByText("Evaluasi Dosen")).toBeInTheDocument();
    expect(screen.getByText("Bagaimana materi perkuliahan?")).toBeInTheDocument();
    expect(screen.getByText("Sangat Baik")).toBeInTheDocument();

    const changeBtn = screen.getByTestId("btn-change-option");
    fireEvent.click(changeBtn);
    expect(mockHandleChange).toHaveBeenCalled();
  });

  it("should display empty state message if no questions exist", () => {
    render(
      <QuestionForm
        filteredData={[]}
        answers={mockAnswers}
        errors={mockErrors}
        toast={null}
        loading={false}
        isBrokenQuestion={mockIsBroken}
        isSelected={mockIsSelected}
        handleChange={mockHandleChange}
        handleExtraChange={mockHandleExtra}
        setAnswers={mockSetAnswers}
        handleSubmit={mockHandleSubmit}
      />
    );

    expect(screen.getByText("No Questionnaire Available")).toBeInTheDocument();
  });
});
