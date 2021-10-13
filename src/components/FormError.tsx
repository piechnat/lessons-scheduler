import React, { useState } from "react";

type FormErrorProps = { variable?: any; check: ValidateCallbackType };
type RenderCallbackType = (message: string) => JSX.Element;
type FormErrorComponentType = (props: FormErrorProps) => JSX.Element;
type ReturnSubmitCallbackType = (callback?: SubmitCallbackType) => SubmitCallbackType;
type SubmitCallbackType = (e: React.FormEvent<HTMLFormElement>) => void;
type ValidateCallbackType = (variable?: any) => boolean | string;

function useFormError(
  render: RenderCallbackType
): [FormErrorComponentType, ReturnSubmitCallbackType] {
  const [isSubmitted, setSubmitted] = useState(false);
  function handleSubmit(onSubmit?: SubmitCallbackType): SubmitCallbackType {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      onSubmit && onSubmit(e);
    };
  }
  function FormError({ variable, check }: FormErrorProps): JSX.Element {
    const result = isSubmitted && check(variable);
    return typeof result === "string" ? render(result) : <></>;
  }
  return [FormError, handleSubmit];
}

export default useFormError;
