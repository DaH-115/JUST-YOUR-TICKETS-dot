import React from "react";

interface MetaInfoItemProps {
  label: string;
  children: React.ReactNode;
}

const MetaInfoItem = ({ label, children }: MetaInfoItemProps) => (
  <div className="flex flex-1 flex-col">
    <h3 className="mb-1 text-xs font-bold">{label}</h3>
    <div className="break-keep text-center text-sm">{children}</div>
  </div>
);

export default MetaInfoItem;
