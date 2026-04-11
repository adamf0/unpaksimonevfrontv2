"use client";

import { useSelect } from "@/app/Module/Hooks/useSelect";
import { SelectChip } from "../Molecules/SelectChip";
import { SelectDropdownItem } from "../Molecules/SelectDropdownItem";
import { SelectSearch } from "../Molecules/SelectSearch";
import { Option } from "../Attribut/Option";

import { useState } from "react";
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
};

export function SelectField(props: Props) {
  const {
    ref,
    open,
    setOpen,
    search,
    setSearch,
    selected,
    toggle,
    remove,
    grouped,
  } = useSelect(props);

  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);

  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
      {
        name: "preventOverflow",
        options: {
          boundary: typeof window !== "undefined" ? document.body : undefined,
        },
      },
    ],
  });

  return (
    <div className="relative w-full space-y-2" ref={ref}>
      <label className="text-sm">{props.label}</label>

      {/* TRIGGER */}
      <div
        ref={setReferenceElement}
        onClick={() => setOpen(true)}
        className="w-full bg-surface-container-low p-3 rounded-lg flex flex-wrap gap-2 cursor-pointer"
      >
        {selected.length === 0 ? (
          <span className="text-gray-400">{props.placeholder}</span>
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

      {/* DROPDOWN (PORTAL OUTSIDE FORM) */}
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
              {Object.entries(grouped).map(([group, items]: any) => (
                <div key={group}>
                  {group !== "default" && (
                    <div className="p-2 text-xs text-gray-400">{group}</div>
                  )}

                  {items.map((opt: Option) => (
                    <SelectDropdownItem
                      key={opt.value}
                      option={opt}
                      selected={selected.some(
                        (v: Option) => v.value === opt.value,
                      )}
                      onClick={() => toggle(opt)}
                      renderItem={props.renderItem}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
