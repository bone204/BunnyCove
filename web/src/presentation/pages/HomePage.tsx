"use client";

import React from "react";
import { ThemeToggle } from "@/presentation/components/common/ThemeToggle";
import { Sparkles } from "lucide-react";

export function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐰</span>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-[var(--foreground)] tracking-tight">
                Bunny Cove
              </span>
              <span className="text-xs text-[var(--text-secondary)] -mt-1 font-sans">
                Cozy Social Universe
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Cozy Gaming & Realtime Chat</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-[var(--foreground)] leading-tight tracking-tight">
            Vũ trụ game ấm cúng <br className="hidden sm:inline" />
            <span className="text-[var(--primary)]">kết nối bạn bè</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-lg mx-auto font-sans leading-relaxed">
            Chơi Cờ Caro 15x15, Bingo 5x5, gửi sticker thỏ độc quyền và trò chuyện thời gian thực trong một không gian mộc mạc, thư thái.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              type="button"
              className="w-full sm:w-auto px-8 h-13 py-3.5 rounded-2xl bg-[var(--primary)] text-white dark:text-[var(--background)] font-semibold btn-shadow hover:brightness-105 active:scale-98 transition-all duration-150 cursor-pointer select-none"
            >
              Tạo phòng chơi mới 🐰
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-8 h-13 py-3.5 rounded-2xl border-1.5 border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] font-semibold hover:border-[var(--primary)] active:scale-98 transition-all duration-150 cursor-pointer select-none shadow-sm"
            >
              Nhập mã vào phòng
            </button>
          </div>
        </div>

        {/* Features Preview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 w-full text-left">
          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] card-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-carrot)]/15 flex items-center justify-center text-2xl">
              🥕
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Cờ Caro Gomoku 15x15</h3>
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              Đối kháng trí tuệ lượt đi 30s, quân Cà rốt và Nơ hồng, lưu trữ kết quả và tính điểm ELO xếp hạng.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] card-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-stamp)]/15 flex items-center justify-center text-2xl">
              🐾
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Cozy Bingo 5x5</h3>
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              Gọi số luân phiên, dập dấu chân thỏ rực rỡ, hoàn thành 5 hàng B-I-N-G-O để bùng nổ chiến thắng.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] card-shadow space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 flex items-center justify-center text-2xl">
              💬
            </div>
            <h3 className="text-lg font-bold text-[var(--foreground)]">Chat & 8 Thỏ Biểu Cảm</h3>
            <p className="text-sm text-[var(--text-secondary)] font-sans">
              Bộ sticker thỏ độc quyền, sửa và thu hồi tin nhắn tức thì, gửi ảnh Cloudinary siêu nét.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]/50 py-6 text-center text-xs text-[var(--text-secondary)] font-sans">
        <div className="container mx-auto px-4">
          Bunny Cove &copy; 2026 &bull; Honey Oak & Sweet Cream Edition
        </div>
      </footer>
    </div>
  );
}
