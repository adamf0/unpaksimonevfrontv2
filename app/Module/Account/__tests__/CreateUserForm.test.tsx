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

vi.mock("../../Common/External/APICall", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        data: [
          {
            dn: "CN=Jane,OU=Accounts",
            username: "janedoe",
            name: "Jane Doe",
            email: "jane@unpak.ac.id",
            employee_id: "4102309999",
            matched_group: "adm_pusat",
          },
        ],
      },
    }),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
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
    <div data-testid={`select-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
      <label>{label}</label>
      <select
        data-testid={`select-el-${label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
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

  it("should validate and submit user SSO mapping details successfully", async () => {
    const user = userEvent.setup();
    mockContextValue.actionAccount.mockResolvedValueOnce("new-user-uuid");

    render(<CreateUserForm />);

    const ldapSelect = await screen.findByTestId("select-el-akun-sso-ldap");
    const levelSelect = screen.getByTestId("select-el-level-akses-simonev");

    // Select LDAP account
    fireEvent.change(ldapSelect, { target: { value: "janedoe" } });

    // Select admin level
    fireEvent.change(levelSelect, { target: { value: "admin" } });

    const submitBtn = screen.getByRole("button", { name: /Map SSO Account/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockContextValue.actionAccount).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          username: "janedoe",
        }),
        "create"
      );
    });
  });

  it("should show validations if level is missing", async () => {
    render(<CreateUserForm />);

    const submitBtn = screen.getByRole("button", { name: /Map SSO Account/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Level wajib dipilih")).toBeInTheDocument();
  });
});
