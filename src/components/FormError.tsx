import React, { useCallback, useRef, useState } from "react";

type FormErrorProps<T> = {
  variable: T;
  check: (variable: T) => boolean | string;
};

type RenderCallback = (message: string) => JSX.Element;

type State = {
  isSubmitted: boolean;
  errors: Array<boolean>;
  render: RenderCallback;
  update: React.Dispatch<React.SetStateAction<number>>;
};

function useFormError(template: RenderCallback) {
  const stateRef = useRef<State>({
    isSubmitted: false,
    errors: [],
    render: template,
    update: useState(0)[1],
  });
  console.log("useFormError " + stateRef.current.errors);
  function FormError<T>({ variable, check }: FormErrorProps<T>): JSX.Element {
    const state = stateRef.current;
    const componentIndex = useRef(state.errors.length).current;
    console.log("FormError Render " + componentIndex);
    const result = check(variable);
    const notValid = typeof result === "string";
    state.errors[componentIndex] = notValid;
    return state.isSubmitted && notValid ? state.render(result as string) : <></>;
  }
  function handleSubmit(onSubmit?: (isValid: boolean) => void) {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const state = stateRef.current;
      const isValid = !state.errors.some((error) => error);
      if (!state.isSubmitted && !isValid) {
        state.update((value) => value + 1);
      }
      state.isSubmitted = true;
      onSubmit && onSubmit(isValid);
    };
  }
  return { FormError: useCallback(FormError, []), handleSubmit: useCallback(handleSubmit, []) };
}

export default useFormError;
