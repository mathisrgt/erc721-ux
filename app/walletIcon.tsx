import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={48} height={1} {...props}>
    <title>{"Rectangle 5"}</title>
    <path fill="#063855" fillRule="evenodd" d="M0 0h48v1H0z" />
  </svg>
)
export default SvgComponent
