"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Plus, KeyRound, ArrowRight } from "lucide-react";
import { Header } from "../components/layout/Header";
import { Button, Card, Badge, Avatar, Input, Dialog, useToast } from "../components/common";
import { useI18n } from "../../infrastructure/locales/useI18n";
import { useAppSelector } from "../../infrastructure/rtk/store";

export function HomePage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");

  const handleCreateRoom = () => {
    showToast(
      t("home.create_room_toast", "Đang khởi tạo phòng mới... (Sẵn sàng ở Phase tiếp theo!)"),
      "info"
    );
  };

  const handleJoinSubmit = () => {
    const code = roomCodeInput.trim().toUpperCase();
    if (!code) {
      setJoinError("Vui lòng nhập mã phòng gồm 6 ký tự");
      return;
    }
    if (code.length !== 6) {
      setJoinError("Mã phòng phải có đúng 6 ký tự");
      return;
    }

    setJoinError("");
    setIsJoinDialogOpen(false);
    showToast(`Đang kết nối vào phòng ${code}...`, "success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      {/* Centralized Header with Auth & Theme & Language */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 pt-6 sm:pt-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold select-none">
            <Sparkles className="w-4 h-4 text-[var(--primary)]" />
            <span>Cozy Social Gaming Universe</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--foreground)] leading-tight tracking-tight">
            Vũ trụ game ấm cúng <br className="hidden sm:inline" />
            <span className="text-[var(--primary)]">kết nối bạn bè</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto font-sans leading-relaxed">
            Chơi Cờ Caro 15x15, Bingo 5x5, gửi sticker thỏ độc quyền và trò chuyện thời gian thực
            trong một không gian gỗ mộc mạc, ngọt ngào và thư thái.
          </p>

          {/* User Welcome Pill if Logged In */}
          {isAuthenticated && user && (
            <div className="inline-flex items-center gap-3 p-2 pr-4 rounded-full bg-[var(--surface)] border border-[var(--border)] shadow-sm">
              <Avatar src={user.avatarUrl} name={user.displayName} size="sm" isOnline={true} />
              <div className="text-left text-xs">
                <p className="font-bold text-[var(--foreground)]">{user.displayName}</p>
                <p className="text-[var(--text-secondary)]">Đã đăng nhập sẵn sàng chơi</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={handleCreateRoom}
              className="w-full sm:w-auto"
            >
              Tạo phòng chơi mới 🐰
            </Button>

            <Button
              variant="secondary"
              size="lg"
              leftIcon={<KeyRound className="w-5 h-5" />}
              onClick={() => {
                setRoomCodeInput("");
                setJoinError("");
                setIsJoinDialogOpen(true);
              }}
              className="w-full sm:w-auto"
            >
              Nhập mã vào phòng
            </Button>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-14 w-full text-left">
          <Card interactive className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-carrot)]/15 border border-[var(--accent-carrot)]/30 flex items-center justify-center text-2xl shadow-sm">
                🥕
              </div>
              <Badge variant="ready">15x15 Gomoku</Badge>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Cờ Caro Trí Tuệ</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              Đối kháng căng thẳng lượt đi 30s, quân Cà rốt và Nơ hồng, tính điểm ELO xếp hạng thời
              gian thực.
            </p>
          </Card>

          <Card interactive className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-stamp)]/15 border border-[var(--accent-stamp)]/30 flex items-center justify-center text-2xl shadow-sm">
                🐾
              </div>
              <Badge variant="rank">5x5 B-I-N-G-O</Badge>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Cozy Bingo Vui Nhộn</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              Gọi số luân phiên, dập dấu chân thỏ rực rỡ, hoàn thành 5 hàng chiến thắng để giành điểm
              thưởng lớn.
            </p>
          </Card>

          <Card interactive className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-2xl shadow-sm">
                💬
              </div>
              <Badge variant="roomCode">Realtime Chat</Badge>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)]">Chat & 8 Sticker Thỏ</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-sans">
              Bộ sticker thỏ độc quyền, sửa và thu hồi tin nhắn trong phòng, chia sẻ hình ảnh chất
              lượng cao.
            </p>
          </Card>
        </div>

        {/* 1:1 Parity Component Gallery Preview */}
        <div className="w-full max-w-5xl mx-auto mt-16 pt-10 border-t border-[var(--border)] text-left">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--foreground)]">
                Cross-Platform Shared Components
              </h2>
              <p className="text-sm text-[var(--text-secondary)] font-sans">
                Đồng bộ 1:1 chuẩn xác giữa Web và Flutter Mobile (Border-radius, Tokens, Typography, States)
              </p>
            </div>
            <Badge variant="ready">1:1 Web & Mobile Parity</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges & Avatars */}
            <Card className="space-y-4">
              <h4 className="font-bold text-base text-[var(--foreground)]">Badges & Avatars</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="roomCode">BNY-888</Badge>
                <Badge variant="ready">SẴN SÀNG</Badge>
                <Badge variant="rank">TOP 1 ELO</Badge>
                <Badge variant="neutral">KHÁCH</Badge>
                <Badge variant="error">ĐÃ RỜI PHÒNG</Badge>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <Avatar size="lg" isHost={true} isOnline={true} name="Host Bunny" />
                <Avatar size="md" isOnline={true} name="Player Two" />
                <Avatar size="sm" isOnline={false} name="Player Three" />
                <Avatar size="xs" name="Guest" />
              </div>
            </Card>

            {/* Buttons & Dialog Triggers */}
            <Card className="space-y-4">
              <h4 className="font-bold text-base text-[var(--foreground)]">Button Variants</h4>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">
                  Primary
                </Button>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
                <Button variant="danger" size="sm">
                  Danger
                </Button>
              </div>
              <div className="pt-2">
                <Link href="/login">
                  <Button
                    variant="secondary"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Trải nghiệm Đăng nhập / Đăng ký
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Join Room Dialog Modal */}
      <Dialog
        isOpen={isJoinDialogOpen}
        onClose={() => setIsJoinDialogOpen(false)}
        type="confirm"
        title="Tham gia phòng chơi"
        message="Nhập mã phòng 6 ký tự gồm chữ và số do bạn bè chia sẻ để vào cùng chơi."
        confirmText="Vào phòng ngay"
        cancelText="Đóng"
        onConfirm={handleJoinSubmit}
      >
        <div className="pt-2">
          <Input
            placeholder="Ví dụ: BNY123"
            value={roomCodeInput}
            onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
            maxLength={6}
            error={joinError}
            className="text-center font-mono font-bold tracking-widest uppercase text-lg"
          />
        </div>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)]/50 py-8 text-center text-xs text-[var(--text-secondary)] font-sans mt-16">
        <div className="container mx-auto px-4 space-y-2">
          <p className="font-medium text-[var(--foreground)]">
            🐰 Bunny Cove - Cozy Social Gaming Universe
          </p>
          <p>
            Phát triển với Kiến trúc Sạch 3 lớp (Domain - Application - Infrastructure) đồng bộ 1:1
            Web & Flutter Mobile.
          </p>
        </div>
      </footer>
    </div>
  );
}
