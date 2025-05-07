import "react-icons";
import type { IconBaseProps } from "react-icons/lib";
declare module "react-icons" {
  // IconType 반환을 JSX.Element로 강제 재정의
  export type IconType = (props: IconBaseProps) => JSX.Element;
}
