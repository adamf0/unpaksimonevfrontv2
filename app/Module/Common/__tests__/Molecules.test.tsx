import "./mocks/apiMocks";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";

// Import molecules
import { ActionButtons } from "../Components/Molecules/ActionButtons";
import AnimatedButton from "../Components/Molecules/AnimatedButton";
import { CKEditorField } from "../Components/Molecules/CKEditorField";
import Divider from "../Components/Molecules/Divider";
import { FilterButton } from "../Components/Molecules/FilterButton";
import { HistoryButton } from "../Components/Molecules/HistoryButton";
import { InputField } from "../Components/Molecules/InputField";
import ModalFooter from "../Components/Molecules/ModalFooter";
import ModalHeader from "../Components/Molecules/ModalHeader";
import { Pagination } from "../Components/Molecules/Pagination";
import { SearchInput } from "../Components/Molecules/SearchInput";
import { SelectChip } from "../Components/Molecules/SelectChip";
import { SelectDropdownItem } from "../Components/Molecules/SelectDropdownItem";
import { SelectSearch } from "../Components/Molecules/SelectSearch";
import { TextareaField } from "../Components/Molecules/TextareaField";

describe("ActionButtons Molecule", () => {
  it("should render list of action items", () => {
    const handleEdit = vi.fn();
    const actions = [
      { name: "edit", icon: "edit", onClick: handleEdit, className: "btn-edit" },
    ];

    render(<ActionButtons items={actions} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeDefined();
    expect(btn.className).toContain("btn-edit");
    fireEvent.click(btn);
    expect(handleEdit).toHaveBeenCalled();
  });
});

describe("AnimatedButton Molecule", () => {
  it("should render label, icon, and trigger click events", () => {
    const handleClick = vi.fn();
    render(
      <AnimatedButton onClick={handleClick} icon="add">
        Tambah
      </AnimatedButton>
    );

    const btn = screen.getByRole("button");
    expect(btn.textContent).toContain("Tambah");
    expect(screen.getByText("add")).toBeDefined();

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalled();
  });

  it("should render children directly when no icon is present", () => {
    render(<AnimatedButton>Plain Text</AnimatedButton>);
    expect(screen.getByText("Plain Text")).toBeDefined();
  });
});

describe("Divider Molecule", () => {
  it("should render divider message or lines", () => {
    render(<Divider>Atau login dengan</Divider>);
    expect(screen.getByText("Atau login dengan")).toBeDefined();
  });
});

describe("FilterButton Molecule", () => {
  it("should render and display count indicator if count > 0", () => {
    const { rerender } = render(<FilterButton count={0} />);
    expect(screen.queryByText("0")).toBeNull();

    rerender(<FilterButton count={3} />);
    expect(screen.getByText("3")).toBeDefined();
  });
});

describe("HistoryButton Molecule", () => {
  it("should render active state and badges correctly", () => {
    const { rerender } = render(<HistoryButton count={5} active={false} />);
    expect(screen.getByText("5")).toBeDefined();
    const btn = screen.getByRole("button");
    expect(btn.className).not.toContain("!border");

    rerender(<HistoryButton count={5} active={true} />);
    const btnActive = screen.getByRole("button");
    expect(btnActive.className).toContain("!border");
  });
});

describe("InputField Molecule", () => {
  it("should render label and placeholder correctly", () => {
    render(<InputField id="username" label="User Name" placeholder="e.g. jdoe" />);
    expect(screen.getByText("User Name")).toBeDefined();
    expect(screen.getByPlaceholderText("e.g. jdoe")).toBeDefined();
  });

  it("should render error message below field if error is defined", () => {
    render(<InputField id="pwd" label="Password" error="Sandi salah" />);
    expect(screen.getByText("Sandi salah")).toBeDefined();
  });
});

describe("ModalHeader Molecule", () => {
  it("should render title, icon name, and description", () => {
    render(
      <ModalHeader
        title="Hapus Akun"
        icon="delete"
        description="Yakin hapus data ini?"
      />
    );
    expect(screen.getByText("Hapus Akun")).toBeDefined();
    expect(screen.getByText("delete")).toBeDefined();
    expect(screen.getByText("Yakin hapus data ini?")).toBeDefined();
  });
});

describe("ModalFooter Molecule", () => {
  it("should render children and apply alignment style classes", () => {
    render(
      <ModalFooter align="center">
        <button>Tombol</button>
      </ModalFooter>
    );

    expect(screen.getByText("Tombol")).toBeDefined();
    const footer = screen.getByText("Tombol").parentElement;
    expect(footer?.className).toContain("justify-center");
  });
});

describe("Pagination Molecule", () => {
  it("should display results count and enable/disable navigation buttons", () => {
    const handleChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={30}
        showing={10}
        onChange={handleChange}
      />
    );

    expect(screen.getByText(/Showing/)).toBeDefined();
    expect(screen.getByText("10")).toBeDefined();
    expect(screen.getByText("30")).toBeDefined();

    // Current page 1: Left chevron should be disabled
    const buttons = screen.getAllByRole("button");
    // prevBtn is first button
    const prevBtn = buttons[0] as HTMLButtonElement;
    expect(prevBtn.disabled).toBe(true);

    // Click page 2
    const page2Btn = screen.getByText("2");
    fireEvent.click(page2Btn);
    expect(handleChange).toHaveBeenCalledWith(2);
  });
});

describe("SearchInput Molecule", () => {
  it("should propagate input changes to onChange", () => {
    const handleChange = vi.fn();
    render(<SearchInput value="test" onChange={handleChange} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("test");

    fireEvent.change(input, { target: { value: "search val" } });
    expect(handleChange).toHaveBeenCalledWith("search val");
  });
});

describe("SelectChip Molecule", () => {
  it("should render label and trigger remove event", () => {
    const handleRemove = vi.fn();
    render(<SelectChip label="Informatika" onRemove={handleRemove} />);
    expect(screen.getByText("Informatika")).toBeDefined();
    const removeBtn = screen.getByText("×");
    fireEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalled();
  });
});

describe("SelectDropdownItem Molecule", () => {
  it("should render label, selected state checks, and trigger clicks", () => {
    const handleClick = vi.fn();
    const option = { value: "opt-1", label: "Option One" };
    render(
      <SelectDropdownItem
        option={option}
        selected={true}
        onClick={handleClick}
      />
    );

    expect(screen.getByText("Option One")).toBeDefined();
    const container = screen.getByText("Option One").closest(".cursor-pointer");
    expect(container?.querySelector(".bg-primary")).not.toBeNull();
    fireEvent.click(container!);
    expect(handleClick).toHaveBeenCalled();
  });
});

describe("SelectSearch Molecule", () => {
  it("should trigger onChange values", () => {
    const handleChange = vi.fn();
    render(<SelectSearch value="query" onChange={handleChange} />);
    const input = screen.getByPlaceholderText("Search...") as HTMLInputElement;
    expect(input.value).toBe("query");

    fireEvent.change(input, { target: { value: "new-query" } });
    expect(handleChange).toHaveBeenCalledWith("new-query");
  });
});

describe("TextareaField Molecule", () => {
  it("should render label, placeholder and errors", () => {
    render(
      <TextareaField
        id="desc"
        label="Deskripsi"
        placeholder="Keterangan..."
        error="Wajib diisi"
      />
    );

    expect(screen.getByLabelText("Deskripsi")).toBeDefined();
    expect(screen.getByPlaceholderText("Keterangan...")).toBeDefined();
    expect(screen.getByText("Wajib diisi")).toBeDefined();
  });
});

describe("CKEditorField Molecule (Mocked)", () => {
  it("should render mocked editor, apply sanitize rules, and trigger onChange", async () => {
    const handleChange = vi.fn();
    render(
      <CKEditorField
        id="editor-1"
        label="Konten Rich Text"
        value="<p>Awal</p>"
        onChange={handleChange}
        placeholder="Ketik disini..."
      />
    );

    expect(screen.getByText("Konten Rich Text")).toBeDefined();

    // Verify mock-ckeditor rendered
    const textarea = screen.getByTestId("mock-ckeditor") as HTMLTextAreaElement;
    expect(textarea.value).toBe("<p>Awal</p>");

    // Trigger changes with dangerous scripts
    fireEvent.change(textarea, {
      target: { value: "<p>Halo <script>alert(1)</script><b>Tebal</b></p>" },
    });

    // The handler should trigger, but DOMPurify must sanitize the script out
    expect(handleChange).toHaveBeenCalled();
    // Verify script tags are stripped: "<p>Halo <b>Tebal</b></p>"
    const outputHtml = handleChange.mock.calls[0][0];
    expect(outputHtml).toContain("<p>Halo ");
    expect(outputHtml).toContain("<b>Tebal</b>");
    expect(outputHtml).not.toContain("<script>");
  });
});
