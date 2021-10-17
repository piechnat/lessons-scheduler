import React, { memo, SFC, useCallback, useEffect, useMemo, useState } from "react";

type FormErrorProps<T> = { variable: T; check: (variable: T) => boolean | string };

function useFormError(render: (message: string) => JSX.Element) {
  const [isSubmitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState(0);
  console.log("useFormError " + errors);

  function FormError<T>({ variable, check }: FormErrorProps<T>): JSX.Element {
    console.log("FormError Render ");
    const result = check(variable);
    const error = typeof result === "string";
    
    if (error) setErrors((v) => v + 1);
    
    return isSubmitted && error ? render(result as string) : <></>;
  };

  function handleSubmit(onSubmit?: (isValid: boolean) => void) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSubmitted(true);
      onSubmit && onSubmit(errors === 0);
      alert(errors);
    };
  }
  
  return { FormError: useMemo(() => FormError, []), handleSubmit: useCallback(handleSubmit, [errors]) };
}

export default useFormError;
