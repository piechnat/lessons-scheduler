import React, { useCallback, useRef, useState } from "react";

type FormErrorProps<T> = {
  value: T;
  check: (value: T) => boolean | string;
};

function useFormError(templateCallback: (message: string) => JSX.Element) {
  const formState = useRef({
    isSubmitted: false,
    errors: [] as Array<boolean>,
    renderError: templateCallback,
    update: useState(0)[1],
  });
  function FormError<T>({ value, check }: FormErrorProps<T>): JSX.Element {
    const form = formState.current,
      result = check(value),
      notValid = typeof result === "string";
    let componentIndex = useRef(form.errors.length).current; 
    if (process.env.NODE_ENV === "development" && console.log.name === "disabledLog") {
      // if detected second fake render in StrictMode
      componentIndex--;
    }
    form.errors[componentIndex] = notValid;
    return form.isSubmitted && notValid ? form.renderError(result as string) : <></>;
  }
  function handleSubmit(submitCallback?: (isValid: boolean) => void) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = formState.current,
        isValid = !form.errors.some((error) => error);
      if (!form.isSubmitted && !isValid) {
        form.update((value) => value + 1);
      }
      form.isSubmitted = true;
      if (submitCallback) {
        submitCallback(isValid);
      }
    };
  }
  return { FormError: useCallback(FormError, []), handleSubmit: useCallback(handleSubmit, []) };
}

export default useFormError;
