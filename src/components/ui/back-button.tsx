import { Button } from "antd";
import { useRouter } from "next/navigation";
import { CgChevronLeft } from "react-icons/cg";
interface BackButtonProps {
  label?: string;
  className?: string;
}

export function BackButton({ label = "Back", className }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      className="mb-6 group transition-all hover:pl-2"
    >
      <CgChevronLeft className="mr-2 h-4 w-4 transition-all group-hover:mr-3" />
      {label}
    </Button>
  );
}
