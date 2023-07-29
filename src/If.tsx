import React, { ReactNode } from "react";

interface IIfProps {
  condition: boolean;
  renderFunc?: Function;
  children?: ReactNode;
}

const If = ({ condition, renderFunc, children }: IIfProps) => {
  if (!condition) return null;

  if (typeof renderFunc === "function") return renderFunc();

  return children;
};

export default If;
