import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/loginSchema";
import type { LoginService } from "../types/types";

type LoginFormProps = {
  selectedService: LoginService;
  onBack: () => void;
  onSubmit: (values: z.infer<typeof loginSchema>) => void;
};

export default function LoginForm({
  selectedService,
  onBack,
  onSubmit,
}: LoginFormProps) {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: z.infer<typeof loginSchema>) {
    onSubmit(values);
  }

  return <div>loginForm</div>;
}
