import { ReactNode } from "react"

type MyComponentProps = {
    children: ReactNode;
};

export const Container = ({children}:MyComponentProps) => {
    return(
        <div className="max-w-[1280px] mx-auto p-5">
            {children}
        </div>
    )
}