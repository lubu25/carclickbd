import { ReactNode } from "react";

const Container = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <main className={`${className || ""} container mx-auto w-full px-4 sm:px-5 lg:px-0`}>
      {children}
    </main>
  );
};

export default Container;
