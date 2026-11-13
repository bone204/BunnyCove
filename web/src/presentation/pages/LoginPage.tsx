"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import { Card, Button, Input, useToast } from "../components/common";
import { Header } from "../components/layout/Header";
import { useI18n } from "../../infrastructure/locales/useI18n";
import { useLocalizedError } from "../../infrastructure/locales/useLocalizedError";
import { authRepository } from "../../infrastructure/repositories/rtk-auth.repository";

const loginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập email hoặc tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const { getLocalizedError } = useLocalizedError();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const isEmail = values.identifier.includes("@");
    const payload = isEmail
      ? { email: values.identifier, password: values.password }
      : { username: values.identifier, password: values.password };

    try {
      await authRepository.login(payload);
      showToast(t("auth.login_success", "Đăng nhập thành công! Chào mừng trở lại."), "success");
      router.push("/");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      const message = (err as Error).message;
      const localized = getLocalizedError(code, message);
      setServerError(localized);
      showToast(localized, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Mascot / Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-3xl mb-4 shadow-sm">
              🐰
            </div>
            <h1 className="font-serif text-3xl font-bold text-[var(--foreground)] tracking-tight">
              {t("auth.welcome_back", "Chào mừng trở lại!")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              {t("auth.login_subtitle", "Đăng nhập để tiếp tục chơi và trò chuyện cùng bạn bè.")}
            </p>
          </div>

          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-[var(--destructive)] text-sm font-medium">
                  {serverError}
                </div>
              )}

              <Input
                label={t("auth.identifier_label", "Email hoặc Tên đăng nhập")}
                placeholder="bunny@cove.com hoặc thobaymau"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.identifier?.message}
                {...register("identifier")}
              />

              <Input
                label={t("auth.password_label", "Mật khẩu")}
                placeholder="••••••••"
                type="password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                {t("auth.login_button", "Đăng nhập")}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--text-secondary)]">
              <span>{t("auth.no_account", "Chưa có tài khoản?")} </span>
              <Link
                href="/register"
                className="font-semibold text-[var(--primary)] hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                {t("auth.register_now", "Đăng ký ngay")} <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

