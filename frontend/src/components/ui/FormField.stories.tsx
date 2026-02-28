import React from "react";
import FormField from "./FormField";

const meta = {
  title: "UI/FormField",
  component: FormField,
  tags: ["autodocs"],
  decorators: [
    (Story) => React.createElement("div", { style: { width: 340 } }, React.createElement(Story)),
  ],
};

export default meta;

export const Default = {
  render: () =>
    React.createElement(
      FormField,
      { id: "email", label: "Email", hint: "We'll never share your email.", required: true },
      React.createElement("input", { id: "email", type: "email", className: "w-full px-3 py-2.5 input", defaultValue: "" })
    ),
};

export const ErrorState = {
  render: () =>
    React.createElement(
      FormField,
      {
        id: "email-error",
        label: "Email",
        hint: "We'll never share your email.",
        error: "Please provide a valid email address.",
        required: true,
      },
      React.createElement("input", { id: "email-error", type: "email", className: "w-full px-3 py-2.5 input", defaultValue: "bad-email" })
    ),
};
