import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CreateUserForm } from "../Organisms/CreateUserForm";

const mockContextValue = {
  state: {
    sourceFakultas: [{ KodeFakultas: "FT", NamaFakultas: "Fakultas Teknik" }],
    sourceProdi: [{ KodeProdi: "TI", NamaProdi: "Informatika", KodeFakultas: "FT" }],
    selected: null as any,
  },
  actionAccount: vi.fn(),
  setState: vi.fn(),
  loadData: vi.fn(),
};

vi.mock("../Context/AccountProvider", () => ({
  useAccountContext: () => mockContextValue,
}));

vi.mock("../../Common/Context/ToastContext", () => ({
  useToast: () => ({
    pushToast: vi.fn(),
  }),
}));

vi.mock("../../Common/Components/Molecules/InputField", () => ({
  InputField: ({ id, label, value, onChange, register, error, type }: any) => (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        data-testid={`input-${id}`}
        type={type || "text"}
        value={value}
        onChange={onChange}
        {...register}
      />
      {error && <span>{error}</span>}
    </div>
  ),
}));

vi.mock("../../Common/Components/Organisms/SelectField", () => ({
  SelectField: ({ label, value, onChange, options, placeholder }: any) => (
    <div data-testid={`select-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <label>{label}</label>
      <select
        data-testid={`select-el-${label.toLowerCase().replace(/\s+/g, "-")}`}
        value={value?.value ?? ""}
        onChange={(e) => {
          const selected = options.find((opt: any) => opt.value === e.target.value);
          onChange(selected || null);
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock("../../Common/Components/Molecules/AnimatedButton", () => ({
  default: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

describe("CreateUserForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockContextValue.state.selected = null;
  });

  it("should validate and submit user details successfully", async () => {
    const user = userEvent.setup();
    mockContextValue.actionAccount.mockResolvedValueOnce("new-user-uuid");

    render(<CreateUserForm />);

    const nameInput = screen.getByTestId("input-name");
    const usernameInput = screen.getByTestId("input-username");
    const passwordInput = screen.getByTestId("input-password");
    const fullnameInput = screen.getByTestId("input-fullname");
    const levelSelect = screen.getByTestId("select-el-level");

    await user.type(nameInput, "Jane Doe");
    await user.type(usernameInput, "janedoe");
    await user.type(passwordInput, "secure123");
    await user.type(fullnameInput, "Jane Doe M.Si");

    // Select admin role
    fireEvent.change(levelSelect, { target: { value: "admin" } });

    const submitBtn = screen.getByRole("button", { name: /Register New Account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockContextValue.actionAccount).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          username: "janedoe",
          password: "secure123",
        }),
        "create"
      );
    });
  });

  it("should show validations if passwords and levels are missing", async () => {
    render(<CreateUserForm />);

    const submitBtn = screen.getByRole("button", { name: /Register New/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Level wajib dipilih")).toBeInTheDocument();
  });
});
