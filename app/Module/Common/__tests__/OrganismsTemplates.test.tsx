import "./mocks/apiMocks";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import React from "react";

// Import components
import Header from "../Components/Organisms/Header";
import Modal from "../Components/Organisms/Modal";
import { SelectField } from "../Components/Organisms/SelectField";
import { SelectFieldLite } from "../Components/Organisms/SelectFieldLite";
import Sidebar from "../Components/Organisms/Sidebar";
import AdminPanelTemplate, { useAdminPanel } from "../Components/Template/AdminPanelTemplate";
import AdminPanelTemplateServer from "../Components/Template/AdminPanelTemplateServer";
import { FilterSidebar } from "../Components/Template/FilterSidebar";
import UserPanelTemplate from "../Components/Template/UserPanelTemplate";

// Import mock variables
import { mockPush, mockRedirect, mockGetCookie, mockPathname } from "./mocks/apiMocks";

describe("Header Organism Component", () => {
  it("should render title and user profile info", () => {
    const handleToggle = vi.fn();
    render(
      <Header
        onToggleSidebar={handleToggle}
        title="Daftar Pengguna"
        user={{ name: "Rian", role: "admin" }}
      />
    );

    expect(screen.getByText("Daftar Pengguna")).toBeDefined();
    expect(screen.getByText("Rian")).toBeDefined();
    expect(screen.getByText("admin")).toBeDefined();

    const toggleBtn = screen.getByText("menu");
    fireEvent.click(toggleBtn);
    expect(handleToggle).toHaveBeenCalled();
  });
});

describe("Modal Organism Component", () => {
  it("should render header, children, and close if visible", () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Hapus Data">
        <div>Apakah Anda yakin?</div>
      </Modal>
    );

    expect(screen.getByText("Hapus Data")).toBeDefined();
    expect(screen.getByText("Apakah Anda yakin?")).toBeDefined();

    const backdrop = screen.getByText("Apakah Anda yakin?").closest(".fixed.inset-0");
    fireEvent.click(backdrop!);
    expect(handleClose).toHaveBeenCalled();
  });

  it("should render nothing if open is false", () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Tutup">
        <div>Tersembunyi</div>
      </Modal>
    );
    expect(container.textContent).toBe("");
  });

  it("should not trigger onClose when clicking inside the modal content card", () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} title="Hapus Data">
        <div>Apakah Anda yakin?</div>
      </Modal>
    );

    const content = screen.getByText("Apakah Anda yakin?");
    fireEvent.click(content);
    
    expect(handleClose).not.toHaveBeenCalled();
  });
});

describe("SelectField Component (Floating UI)", () => {
  const options = [
    { value: "m-1", label: "Matematika" },
    { value: "f-2", label: "Fisika" },
  ];

  it("should show options dropdown on click, select options, and close", async () => {
    const handleChange = vi.fn();
    render(
      <SelectField
        label="Mata Kuliah"
        placeholder="Pilih..."
        mode="single"
        value={null}
        onChange={handleChange}
        options={options}
      />
    );

    // Initial state: shows placeholder
    expect(screen.getByText("Pilih...")).toBeDefined();

    // Click trigger to open dropdown
    const trigger = screen.getByText("Pilih...");
    fireEvent.click(trigger);

    // Option should be in document
    const optMath = screen.getByText("Matematika");
    expect(optMath).toBeDefined();

    // Click Matematika option
    fireEvent.click(optMath);

    expect(handleChange).toHaveBeenCalledWith(options[0]);
  });

  it("should render multiple selected options as chips and allow removal", () => {
    const handleChange = vi.fn();
    render(
      <SelectField
        label="Mata Kuliah"
        mode="multiple"
        value={[options[0], options[1]]}
        onChange={handleChange}
        options={options}
      />
    );

    // Should display selected chips
    expect(screen.getByText("Matematika")).toBeDefined();
    expect(screen.getByText("Fisika")).toBeDefined();

    // Remove first item
    const removeBtns = screen.getAllByText("×");
    fireEvent.click(removeBtns[0]); // clicks Matematika's remove icon

    expect(handleChange).toHaveBeenCalledWith([options[1]]);
  });

  it("should dismiss dropdown on click outside", async () => {
    render(
      <div>
        <div data-testid="outside">Luar</div>
        <SelectField
          label="Mata Kuliah"
          placeholder="Pilih..."
          mode="single"
          value={null}
          onChange={vi.fn()}
          options={options}
        />
      </div>
    );

    // Click to open
    fireEvent.click(screen.getByText("Pilih..."));
    expect(screen.getByText("Matematika")).toBeDefined();

    // Click outside
    fireEvent.mouseDown(screen.getByTestId("outside"));

    // Dropdown should close
    await waitFor(() => {
      expect(screen.queryByText("Matematika")).toBeNull();
    });
  });
});

describe("SelectFieldLite Component", () => {
  it("should render native select element and trigger changes", () => {
    const handleChange = vi.fn();
    const options = [
      { value: "a", label: "Aktif" },
      { value: "n", label: "Nonaktif" },
    ];

    render(
      <SelectFieldLite
        label="Status"
        placeholder="Pilih Status"
        value="a"
        onChange={handleChange}
        options={options}
      />
    );

    expect(screen.getByText("Status")).toBeDefined();
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("a");

    fireEvent.change(select, { target: { value: "n" } });
    expect(handleChange).toHaveBeenCalledWith("n");
  });
});

describe("Sidebar Organism Component", () => {
  it("should render items lists and trigger click handlers", () => {
    const handleHome = vi.fn();
    const handleLogout = vi.fn();

    const menu = [{ icon: "home", label: "Home", active: true, onClick: handleHome }];
    const bottom = [{ icon: "logout", label: "Logout", danger: true, onClick: handleLogout }];

    render(
      <Sidebar
        isOpen={true}
        MENU_ITEMS={menu}
        BOTTOM_ITEMS={bottom}
      />
    );

    expect(screen.getByText("Unpak Simonev")).toBeDefined();
    const homeBtn = screen.getByText("Home");
    const logoutBtn = screen.getByText("Logout");

    fireEvent.click(homeBtn);
    expect(handleHome).toHaveBeenCalled();

    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalled();
  });
});

describe("UserPanelTemplate Layout Component", () => {
  it("should render children", () => {
    render(<UserPanelTemplate><div>Halaman User</div></UserPanelTemplate>);
    expect(screen.getByText("Halaman User")).toBeDefined();
  });
});

describe("AdminPanelTemplate Layout Component", () => {
  const mockUser: any = {
    Name: "Dosen Budi",
    Level: "fakultas",
    Email: "budi@unpak.ac.id",
  };

  beforeEach(() => {
    mockPush.mockClear();
    sessionStorage.clear();
  });

  it("should render layout, sidebar navigation menus, and header", () => {
    render(
      <AdminPanelTemplate userProfile={mockUser}>
        <div data-testid="children">Konten Admin</div>
      </AdminPanelTemplate>
    );

    expect(screen.getByTestId("children")).toBeDefined();
    expect(screen.getByText("Dosen Budi")).toBeDefined();

    // Verify navigation sidebar hides admin-only pages ("Account", "Kategori") for "fakultas" level
    expect(screen.queryByText("Account")).toBeNull();
    expect(screen.queryByText("Kategori")).toBeNull();

    // Dashboard should be visible
    expect(screen.getByText("Dashboard")).toBeDefined();
  });

  it("should show all menus for admin level users", () => {
    const adminUser = { ...mockUser, Level: "admin" };
    render(
      <AdminPanelTemplate userProfile={adminUser}>
        <div />
      </AdminPanelTemplate>
    );

    expect(screen.getByText("Account")).toBeDefined();
    expect(screen.getByText("Kategori")).toBeDefined();
  });

  it("should handle resize adjustments to toggle sidebar defaults", () => {
    render(
      <AdminPanelTemplate userProfile={mockUser}>
        <div />
      </AdminPanelTemplate>
    );

    // Trigger window resize event
    window.innerWidth = 500;
    fireEvent(window, new Event("resize"));

    // Check sidebar styling (hidden)
    const sidebar = document.getElementById("sidebar");
    expect(sidebar?.className).toContain("-translate-x-full");

    window.innerWidth = 1024;
    fireEvent(window, new Event("resize"));
    expect(sidebar?.className).toContain("translate-x-0");
  });

  it("should clear session and redirect to logout route on clicking logout button", () => {
    render(
      <AdminPanelTemplate userProfile={mockUser}>
        <div />
      </AdminPanelTemplate>
    );

    sessionStorage.setItem("access_token", "test-token");

    const logoutBtn = screen.getByText("Logout");
    fireEvent.click(logoutBtn);

    expect(sessionStorage.getItem("access_token")).toBeNull();
    expect(mockPush).toHaveBeenCalledWith("/action/logout");
  });
});

describe("AdminPanelTemplateServer Component (RSC)", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockRedirect.mockClear();
    mockGetCookie.mockClear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should redirect to /action/logout?r=Ex if access_token cookie is missing", async () => {
    mockGetCookie.mockReturnValue(undefined); // token not found

    await AdminPanelTemplateServer({ children: <div /> });

    expect(mockRedirect).toHaveBeenCalledWith("/action/logout?r=Ex");
  });

  it("should fetch user whoami details and redirect to F0 if user level is not allowed", async () => {
    mockGetCookie.mockReturnValue({ value: "test-jwt-token" });

    // Mock fetch response for whoami (Level: mahasiswa, which is disallowed)
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Name: "Andi", Level: "mahasiswa" }),
    });

    await AdminPanelTemplateServer({ children: <div /> });

    expect(mockRedirect).toHaveBeenCalledWith("/action/logout?r=F0");
  });

  it("should redirect to E1 if response is not ok", async () => {
    mockGetCookie.mockReturnValue({ value: "test-jwt-token" });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    await AdminPanelTemplateServer({ children: <div /> });

    expect(mockRedirect).toHaveBeenCalledWith("/action/logout?r=E1");
  });

  it("should redirect to E0 if fetch throws error", async () => {
    mockGetCookie.mockReturnValue({ value: "test-jwt-token" });

    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await AdminPanelTemplateServer({ children: <div /> });

    expect(mockRedirect).toHaveBeenCalledWith("/action/logout?r=E0");

    errSpy.mockRestore();
  });

  it("should render child templates when user is authenticated with allowed roles", async () => {
    mockGetCookie.mockReturnValue({ value: "test-jwt-token" });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Name: "Dosen Rian", Level: "prodi" }),
    });

    const result = await AdminPanelTemplateServer({
      children: <div data-testid="rsc-children">Daftar Mata Kuliah</div>,
    });

    // Check if it renders AdminPanelTemplate wrapping children
    render(result);
    expect(screen.getByTestId("rsc-children")).toBeDefined();
    expect(screen.getByText("Dosen Rian")).toBeDefined();
  });

  it("should return early with dummy static user if NEXT_EXPORT is true", async () => {
    const originalEnv = process.env.NEXT_EXPORT;
    process.env.NEXT_EXPORT = "true";

    const result = await AdminPanelTemplateServer({
      children: <div data-testid="rsc-children">Static Content</div>,
    });

    render(result);
    expect(screen.getByTestId("rsc-children")).toBeDefined();
    expect(screen.getByText("Static User")).toBeDefined();

    process.env.NEXT_EXPORT = originalEnv;
  });
});

describe("FilterSidebar Compound Template Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should mount and show slide sidebar in portal", () => {
    const handleClose = vi.fn();
    render(
      <FilterSidebar open={true} onClose={handleClose} title="Saring Data">
        <div>Filter Body</div>
      </FilterSidebar>
    );

    expect(screen.getByText("Saring Data")).toBeDefined();
    expect(screen.getByText("Filter Body")).toBeDefined();

    // Click overlay to close
    const overlay = document.querySelector(".fixed.inset-0.bg-black\\/30");
    expect(overlay).not.toBeNull();
    fireEvent.click(overlay!);
    expect(handleClose).toHaveBeenCalled();
  });

  it("should dismiss on Escape keydown", () => {
    const handleClose = vi.fn();
    render(
      <FilterSidebar open={true} onClose={handleClose}>
        <div />
      </FilterSidebar>
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalled();
  });

  it("should add and remove scroll lock styles from body", () => {
    const { rerender } = render(
      <FilterSidebar open={true} onClose={vi.fn()}>
        <div />
      </FilterSidebar>
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <FilterSidebar open={false} onClose={vi.fn()}>
        <div />
      </FilterSidebar>
    );
    expect(document.body.style.overflow).toBe("");
  });
});
