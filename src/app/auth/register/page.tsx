import { cn } from "@/lib/utils";
import RegisterForm from "./components/form";

export default function Register() {
  return (
    <main
      className={cn(
        "flex h-screen w-screen flex-col items-center justify-center px-4 py-8",
      )}
    >
      <RegisterForm />
    </main>
  );
}
