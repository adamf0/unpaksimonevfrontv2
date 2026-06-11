import "./mocks/apiMocks";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

// Import atoms
import Badge from "../Components/Atoms/Badge";
import Button from "../Components/Atoms/Button";
import Card from "../Components/Atoms/Card";
import Checkbox from "../Components/Atoms/Chekbox";
import Container from "../Components/Atoms/Container";
import Icon from "../Components/Atoms/Icon";
import ImageOverlayAtom from "../Components/Atoms/ImageOverlayAtom";
import Input from "../Components/Atoms/Input";
import Label from "../Components/Atoms/Label";
import ModalButton from "../Components/Atoms/ModalButton";
import ModalIcon from "../Components/Atoms/ModalIcon";
import { SelectOptionIndicator } from "../Components/Atoms/SelectOptionIndicator";
import Text from "../Components/Atoms/Text";

// Import shadcn UI components for direct coverage tests
import { Badge as UiBadge } from "../../../../components/ui/badge";
import { Button as UiButton } from "../../../../components/ui/button";
import {
  Card as UiCard,
  CardHeader as UiCardHeader,
  CardFooter as UiCardFooter,
  CardTitle as UiCardTitle,
  CardAction as UiCardAction,
  CardDescription as UiCardDescription,
  CardContent as UiCardContent,
} from "../../../../components/ui/card";

describe("Badge Atom Component", () => {
  it("should render children and apply default style class", () => {
    render(<Badge>Draft</Badge>);
    const el = screen.getByText("Draft");
    expect(el).toBeDefined();
    expect(el.className).toContain("bg-primary");
  });

  it("should support changing variants", () => {
    render(<Badge variant="danger">Error</Badge>);
    const el = screen.getByText("Error");
    expect(el.className).toContain("bg-red-100");
  });
});

describe("Button Atom Component", () => {
  it("should render children and trigger click handlers", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByText("Click Me");
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalled();
  });
});

describe("Card Atom Component", () => {
  it("should render and combine custom className values", () => {
    render(<Card className="my-card">Card Content</Card>);
    const card = screen.getByText("Card Content");
    expect(card).toBeDefined();
    expect(card.className).toContain("my-card");
  });
});

describe("Checkbox Atom Component", () => {
  it("should render checkbox and trigger onChange", () => {
    const handleChange = vi.fn();
    render(<Checkbox checked={false} onChange={handleChange} />);
    const cb = screen.getByRole("checkbox");
    expect(cb).toBeDefined();
    fireEvent.click(cb);
    expect(handleChange).toHaveBeenCalled();
  });
});

describe("Container Atom Component", () => {
  it("should render wrapper with flex/layout classes", () => {
    render(<Container>Container Body</Container>);
    expect(screen.getByText("Container Body")).toBeDefined();
  });
});

describe("Icon Atom Component", () => {
  it("should render icon text matching material symbols format", () => {
    render(<Icon name="search" className="text-xl" />);
    const icon = screen.getByText("search");
    expect(icon).toBeDefined();
    expect(icon.className).toContain("material-symbols-outlined");
    expect(icon.className).toContain("text-xl");
  });
});

describe("ImageOverlayAtom Atom Component", () => {
  it("should render backdrop and overlay filters", () => {
    render(<ImageOverlayAtom src="/logo.png" alt="logo" />);
    const els = document.getElementsByClassName("absolute");
    expect(els.length).toBeGreaterThan(0);
  });
});

describe("Input Atom Component", () => {
  it("should render basic input field and trigger change events", () => {
    const handleChange = vi.fn();
    render(<Input value="Test" onChange={handleChange} placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here") as HTMLInputElement;
    expect(input.value).toBe("Test");
    fireEvent.change(input, { target: { value: "New Value" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("should trigger blur handlers and support react-hook-form registration", () => {
    const handleBlur = vi.fn();
    const mockRegister = {
      name: "test-field",
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    };
    render(<Input register={mockRegister} onBlur={handleBlur} placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");

    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalled();
    expect(mockRegister.onBlur).toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "New Value" } });
    expect(mockRegister.onChange).toHaveBeenCalled();
  });
});

describe("Label Atom Component", () => {
  it("should render label text associated with input id", () => {
    render(<Label htmlFor="test-input">My Label</Label>);
    const label = screen.getByText("My Label");
    expect(label).toBeDefined();
    expect(label.getAttribute("for")).toBe("test-input");
  });
});

describe("ModalButton Atom Component", () => {
  it("should render confirm or cancel styled buttons", () => {
    const handleAction = vi.fn();
    render(<ModalButton variant="danger" onClick={handleAction}>Hapus</ModalButton>);
    const btn = screen.getByText("Hapus");
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalled();
    expect(btn.className).toContain("bg-error");
  });
});

describe("ModalIcon Atom Component", () => {
  it("should render icon container themed according to status variant", () => {
    render(<ModalIcon variant="success" name="check" />);
    const icon = screen.getByText("check");
    expect(icon).toBeDefined();
  });
});

describe("SelectOptionIndicator Atom Component", () => {
  it("should render inner dot element when selected is true", () => {
    const { container } = render(<SelectOptionIndicator selected={true} />);
    // container has outer div, which contains an inner dot div when selected
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.firstChild).not.toBeNull();
    expect((outerDiv.firstChild as HTMLElement).className).toContain("bg-primary");
  });

  it("should render empty border circle when selected is false", () => {
    const { container } = render(<SelectOptionIndicator selected={false} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.firstChild).toBeNull();
  });
});

describe("Text Atom Component", () => {
  it("should render custom paragraph class", () => {
    render(<Text className="custom-txt">Paragraph Text</Text>);
    const el = screen.getByText("Paragraph Text");
    expect(el).toBeDefined();
    expect(el.tagName).toBe("P");
    expect(el.className).toBe("custom-txt");
  });
});

describe("shadcn UI Badge Component", () => {
  it("should support rendering as another child element using asChild", () => {
    render(
      <UiBadge asChild>
        <a href="#link">Link Badge</a>
      </UiBadge>
    );
    const badge = screen.getByText("Link Badge");
    expect(badge).toBeDefined();
    expect(badge.tagName).toBe("A");
  });
});

describe("shadcn UI Button Component", () => {
  it("should support rendering as another child element using asChild", () => {
    render(
      <UiButton asChild>
        <a href="#button">Link Button</a>
      </UiButton>
    );
    const btn = screen.getByText("Link Button");
    expect(btn).toBeDefined();
    expect(btn.tagName).toBe("A");
  });
});

describe("shadcn UI Card Components", () => {
  it("should render all card sub-sections and apply custom classnames", () => {
    render(
      <UiCard size="sm">
        <UiCardHeader>
          <UiCardTitle>My Title</UiCardTitle>
          <UiCardDescription>My Subtitle</UiCardDescription>
          <UiCardAction>Action Text</UiCardAction>
        </UiCardHeader>
        <UiCardContent>Card Body</UiCardContent>
        <UiCardFooter>Card Footer</UiCardFooter>
      </UiCard>
    );

    expect(screen.getByText("My Title")).toBeDefined();
    expect(screen.getByText("My Subtitle")).toBeDefined();
    expect(screen.getByText("Action Text")).toBeDefined();
    expect(screen.getByText("Card Body")).toBeDefined();
    expect(screen.getByText("Card Footer")).toBeDefined();
  });
});
