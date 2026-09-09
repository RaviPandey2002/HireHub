"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const CommonForm = ({
  action,
  formControls,
  buttonText,
  isBtnDisabled,
  btnType,
  formData,
  setFormData,
  handleFileChange,
}) => {
  function renderInputByComponentType(getCurrentControl) {
    let content = null;

    switch (getCurrentControl.componentType) {
      case "input":
        content = (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={getCurrentControl.name}>
              {getCurrentControl.label}
            </Label>
            <Input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [event.target.name]: event.target.value,
                })
              }
            />
          </div>
        );
        break;

      case "textarea":
        content = (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={getCurrentControl.name}>
              {getCurrentControl.label}
            </Label>
            <textarea
              rows={4}
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [event.target.name]: event.target.value,
                })
              }
              className="flex min-h-[90px] w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        );
        break;

      case "file":
        content = (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={getCurrentControl.name}>
              {getCurrentControl.label}
            </Label>
            <label
              htmlFor={getCurrentControl.name}
              className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-sm text-gray-600 dark:text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span>Click to upload PDF (max 5 MB)</span>
              <Input
                onChange={handleFileChange}
                id={getCurrentControl.name}
                type="file"
                className="sr-only"
              />
            </label>
          </div>
        );
        break;

      default:
        content = (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={getCurrentControl.name}>
              {getCurrentControl.label}
            </Label>
            <Input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [event.target.name]: event.target.value,
                })
              }
            />
          </div>
        );
        break;
    }

    return content;
  }

  return (
    <form action={action}>
      <div className="space-y-5">
        {formControls.map((control) => (
          <div key={control.name}>
            {renderInputByComponentType(control)}
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Button
          type={btnType || "submit"}
          disabled={isBtnDisabled}
          className="w-full sm:w-auto"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}
