import React from "react";

interface MetaInfoItemProps {
  label: string;
  children: React.ReactNode;
}

const MetaInfoItem = ({ label, children }: MetaInfoItemProps) => (
  <div className="flex flex-1 flex-col text-xs">
    <h3 className="mb-1 font-bold">{label}</h3>
    <div className="break-keep text-center">{children}</div>
  </div>
);

export default MetaInfoItem;
