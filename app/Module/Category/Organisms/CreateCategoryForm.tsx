"use client";

import { useState } from "react";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { SelectFieldLite } from "../../Common/Components/Organisms/SelectFieldLite";

export function CreateCategoryForm() {
  const [role, setRole] = useState("");

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField id="kategori" label="Kategori" placeholder="Enter kategori" />
      <SelectFieldLite
        label="Sub Kategori"
        id="sub_kategori"
        value={role}
        onChange={setRole}
        placeholder="Pilih kategori"
        options={[
          { label: "Admin", value: "admin" },
          { label: "Operator", value: "operator" },
        ]}
      />

      <div className="col-span-1 md:col-span-2 pt-4">
        <AnimatedButton
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform indigo-shadow"
          icon=""
        >
          Register New Category
        </AnimatedButton>
      </div>
    </form>
  );
}
