import { useForm } from "react-hook-form";
import AnimatedButton from "../../Common/Components/Molecules/AnimatedButton";
import { InputField } from "../../Common/Components/Molecules/InputField";
import { useEffect, useState } from "react";
import { Option } from "../../Common/Components/Attribut/Option";
import { SelectField } from "../../Common/Components/Organisms/SelectField";

type FormValues = {
  username: string;
  password: string;
  fullname: string;
  email: string;
  unit: string;
  fakultas: string;
  prodi: string;
};

export function CreateUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    console.log("FORM DATA:", data);
  };

  const [userMultiple, setUserMultiple] = useState<Option[]>([]);
  const [userSingle, setUserSingle] = useState<Option | null>(null);

  useEffect(() => {
    console.log(userMultiple);
  }, [userMultiple]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <SelectField
        label="User"
        mode="multiple"
        value={userMultiple}
        placeholder="Select data"
        onChange={setUserMultiple}
        options={[
          { label: "Adam", value: "adam", group: "Admin" },
          { label: "Johnu", value: "johnu", group: "Admin" },
          { label: "Budi", value: "budi", group: "User" },
          { label: "Siti", value: "siti", group: "User" },
        ]}
        renderItem={(opt, selected) => (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500" />

              <div className="flex flex-col">
                <span className="text-sm font-medium">{opt.label}</span>
                <span className="text-xs text-gray-400">{opt.value}</span>
              </div>
            </div>

            {selected && (
              <span className="text-green-500 text-xs font-medium">
                ✓ Selected
              </span>
            )}
          </div>
        )}
      />

      <InputField
        id="username"
        label="Username"
        placeholder="Enter username"
        register={register("username", {
          required: "Username wajib diisi",
          minLength: {
            value: 3,
            message: "Minimal 3 karakter",
          },
        })}
        error={errors.username?.message}
      />
      <InputField
        id="password"
        label="Password"
        type="password"
        register={register("password", {
          required: "Password wajib diisi",
          minLength: {
            value: 6,
            message: "Minimal 6 karakter",
          },
        })}
        error={errors.password?.message}
      />
      <InputField
        id="fullname"
        label="Full Name"
        placeholder="e.g. Dr. Jane Doe"
        register={register("fullname", {
          required: "Nama wajib diisi",
        })}
        error={errors.fullname?.message}
      />
      <InputField
        id="email"
        label="Email Address"
        type="email"
        register={register("email", {
          required: "Email wajib diisi",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Format email tidak valid",
          },
        })}
        error={errors.email?.message}
      />
      <InputField
        id="unit"
        label="Unit"
        placeholder="Department unit"
        register={register("unit")}
        error={errors.unit?.message}
      />
      <InputField
        id="fakultas"
        label="Fakultas"
        placeholder="Department unit"
        register={register("fakultas")}
        error={errors.fakultas?.message}
      />
      <InputField
        id="prodi"
        label="Prodi"
        register={register("prodi")}
        error={errors.prodi?.message}
      />

      <div className="col-span-1 md:col-span-2 pt-4">
        <AnimatedButton
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform indigo-shadow"
          icon=""
        >
          Register New Account
        </AnimatedButton>
      </div>
    </form>
  );
}
