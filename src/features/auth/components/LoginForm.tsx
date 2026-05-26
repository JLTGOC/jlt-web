import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FormEventHandler } from "react";
import { loginSchema } from "../schemas/loginSchema";
import { LoginFormView } from "./LoginFormView";

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void;
  isLoading?: boolean;
};

export default function LoginForm({
  onSubmit,
  isLoading = false,
}: LoginFormProps) {
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const handleFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    void handleSubmit(onSubmit)(event);
  };

  return (
    <LoginFormView
      control={control}
      isLoading={isLoading}
      onSubmit={handleFormSubmit}
    />
  );
}
