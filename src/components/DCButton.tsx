import React from "react";

type DCButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  ms?: number;
  [propName: string]: any;
};

const DCButton = ({ onClick, ms = 100, ...rest }: DCButtonProps) =>
  onClick ? (
    <button type="button" {...rest} onClick={() => setTimeout(onClick, ms)}></button>
  ) : (
    <button type="button" {...rest}></button>
  );

export default DCButton; // delayed click button
