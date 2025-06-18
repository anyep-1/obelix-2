"use client";
import React from "react";
import ReusableKategoriInput from "./ReuseableKategoriInput";
import ReusableRtItem from "./ReuseableRtItem";

const ReusableForm = ({ fields, data, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-2 block font-medium">
                {field.label}
              </label>
              <select
                id={field.name}
                name={field.name}
                value={data[field.name] || ""}
                onChange={onChange}
                disabled={field.disabled}
                required={field.required}
                className="w-full p-2 border rounded"
              >
                <option value="">Pilih {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        if (field.type === "text") {
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-2 block font-medium">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                value={data[field.name] || ""}
                onChange={onChange}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded"
              />
            </div>
          );
        }

        if (field.type === "textarea") {
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-2 block font-medium">
                {field.label}
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={data[field.name] || ""}
                onChange={onChange}
                required={field.required}
                rows={4}
                className="w-full p-2 border rounded"
              />
            </div>
          );
        }

        if (field.type === "checkboxGroup") {
          return (
            <fieldset key={field.name} className="space-y-2">
              <legend className="mb-2 font-medium text-gray-900">
                {field.label}
              </legend>
              <div className="flex flex-wrap gap-4">
                {field.options.map((opt) => (
                  <div className="flex items-center gap-2" key={opt.value}>
                    <input
                      type="checkbox"
                      id={`${field.name}-${opt.value}`}
                      name={field.name}
                      value={opt.value}
                      checked={data[field.name]?.includes(opt.value.toString())}
                      onChange={(e) => field.onCheckboxChange(e)}
                    />
                    <label htmlFor={`${field.name}-${opt.value}`}>
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          );
        }

        if (field.type === "kategori-input") {
          return (
            <div key={field.name}>
              <label className="mb-3 block font-medium">{field.label}</label>
              <ReusableKategoriInput
                kategori={data.kategori}
                onChange={(index, key, value) => {
                  const newKategori = [...data.kategori];
                  newKategori[index] = {
                    ...newKategori[index],
                    [key]:
                      key === "min" || key === "max" || key === "nilai"
                        ? parseInt(value) || 0
                        : value,
                  };
                  onChange({
                    target: { name: "kategori", value: newKategori },
                  });
                }}
              />
            </div>
          );
        }

        if (field.type === "date") {
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="mb-2 block font-medium">
                {field.label}
              </label>
              <input
                type="date"
                id={field.name}
                name={field.name}
                value={data[field.name] || ""}
                onChange={onChange}
                required={field.required}
                className="w-full p-2 border rounded"
              />
            </div>
          );
        }

        if (field.type === "rt-list") {
          return (
            <div key={field.name} className="mb-4">
              <label className="mb-3 block font-medium">{field.label}</label>
              {field.value.map((rtItem, idx) => (
                <ReusableRtItem
                  key={idx}
                  rt={rtItem}
                  index={idx}
                  onChange={(index, key, value) =>
                    field.onChange(index, key, value)
                  }
                />
              ))}
            </div>
          );
        }

        return null;
      })}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Simpan
      </button>
    </form>
  );
};

export default ReusableForm;
