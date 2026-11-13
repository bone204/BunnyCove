"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, Button, Input, useToast } from "../components/common";
import { Header } from "../components/layout/Header";
import { useI18n } from "../../infrastructure/locales/useI18n";
import { useLocalizedError } from "../../infrastructure/locales/useLocalizedError";
import { authRepository } from "../../infrastructure/repositories/rtk-auth.repository";

const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    username: z
      .string()
      .min(3, "Tên đăng nhập tối thiểu 3 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ chứa chữ cái, số và dấu gạch dưới"),
    displayName: z.string().min(2, "Tên hiển thị tối thiểu 2 ký tự"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
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
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await authRepository.register({
        email: values.email,
        username: values.username,
        displayName: values.displayName,
        password: values.password,
      });

      showToast(t("auth.register_success", "Đăng ký thành công! Chào mừng đến với Bunny Cove."), "success");
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

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 text-3xl mb-3 shadow-sm">
              ✨
            </div>
            <h1 className="font-serif text-3xl font-bold text-[var(--foreground)] tracking-tight">
              {t("auth.create_account", "Tạo tài khoản mới")}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5">
              {t("auth.register_subtitle", "Tham gia cộng đồng Bunny Cove ngay hôm nay!")}
            </p>
          </div>

          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="p-3.5 rounded-xl bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-[var(--destructive)] text-sm font-medium">
                  {serverError}
                </div>
              )}

              <Input
                label={t("auth.display_name_label", "Tên hiển thị")}
                placeholder="Thỏ Trắng"
                leftIcon={<Sparkles className="w-5 h-5" />}
                error={errors.displayName?.message}
                {...register("displayName")}
              />

              <Input
                label={t("auth.username_label", "Tên đăng nhập")}
                placeholder="thobaymau"
                leftIcon={<User className="w-5 h-5" />}
                error={errors.username?.message}
                {...register("username")}
              />

              <Input
                label={t("auth.email_label", "Địa chỉ Email")}
                placeholder="bunny@cove.com"
                type="email"
                leftIcon={<Mail className="w-5 h-5" />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label={t("auth.password_label", "Mật khẩu")}
                placeholder="••••••••"
                type="password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Input
                label={t("auth.confirm_password_label", "Xác nhận mật khẩu")}
                placeholder="••••••••"
                type="password"
                leftIcon={<ShieldCheck className="w-5 h-5" />}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="mt-2"
              >
                {t("auth.register_button", "Tạo tài khoản")}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--text-secondary)]">
              <span>{t("auth.already_have_account", "Đã có tài khoản?")} </span>
              <Link
                href="/login"
                className="font-semibold text-[var(--primary)] hover:underline cursor-pointer"
              >
                {t("auth.login_now", "Đăng nhập ngay")}
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
