"use client";

import { SelectChip } from "../Molecules/SelectChip";
import { SelectDropdownItem } from "../Molecules/SelectDropdownItem";
import { SelectSearch } from "../Molecules/SelectSearch";
import { Option } from "../Attribut/Option";

import { useMemo, useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { createPortal } from "react-dom";

type Props = {
  label?: string;
  placeholder?: string;
  renderItem?: (opt: Option, selected: boolean) => React.ReactNode;
  mode: "single" | "multiple";
  value: Option | Option[] | null;
  onChange: (v: any) => void;
  options: Option[];
  error?: any;
};

export function SelectField(props: Props) {
  const { value, onChange, options, mode } = props;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 8] } },
      {
        name: "preventOverflow",
        options: {
          boundary: typeof window !== "undefined" ? document.body : undefined,
        },
      },
    ],
  });

  /** =========================
   * NORMALIZE VALUE
   * ========================= */
  const selected: Option[] = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  /** =========================
   * FILTER SEARCH
   * ========================= */
  const filtered = useMemo(() => {
    if (!search) return options;

    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  /** =========================
   * TOGGLE SELECT
   * ========================= */
  const toggle = (opt: Option) => {
    if (mode === "single") {
      onChange(opt);
      setOpen(false);
      return;
    }

    const exists = selected.find((s) => s.value === opt.value);

    if (exists) {
      onChange(selected.filter((s) => s.value !== opt.value));
    } else {
      onChange([...selected, opt]);
    }
  };

  /** =========================
   * REMOVE CHIP
   * ========================= */
  const remove = (opt: Option) => {
    onChange(selected.filter((s) => s.value !== opt.value));
  };

  /** =========================
   * CLICK OUTSIDE (CLOSE)
   * ========================= */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;

      const target = e.target as Node;

      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        popperElement &&
        !popperElement.contains(target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, popperElement]);

  return (
    <div className="relative w-full space-y-2" ref={wrapperRef}>
      <label className="text-sm">{props.label}</label>

      {/* TRIGGER */}
      <div
        ref={setReferenceElement}
        onClick={() => setOpen(true)}
        className={`w-full bg-surface-container-low ${selected.length === 0 ? "p-3" : "px-3 py-2.5"} rounded-lg flex flex-wrap gap-2 cursor-pointer`}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500 text-sm">{props.placeholder}</span>
        ) : (
          selected.map((o: Option) => (
            <SelectChip
              key={o.value}
              label={o.label}
              onRemove={() => remove(o)}
            />
          ))
        )}
      </div>

      {props.error && <p className="text-xs text-red-500 font-medium">{props.error}</p>}

      {/* DROPDOWN */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={setPopperElement}
            style={{
              ...styles.popper,
              zIndex: 9999,
              width: referenceElement?.offsetWidth,
            }}
            {...attributes.popper}
            className="bg-surface-container-low shadow-lg rounded-lg overflow-hidden"
          >
            <SelectSearch value={search} onChange={setSearch} />

            <div className="max-h-60 overflow-auto">
              {filtered.map((opt: Option) => {
                const isSelected = selected.some((v) => v.value === opt.value);

                return (
                  <SelectDropdownItem
                    key={opt.value}
                    option={opt}
                    selected={isSelected}
                    onClick={() => toggle(opt)}
                    renderItem={props.renderItem}
                  />
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
