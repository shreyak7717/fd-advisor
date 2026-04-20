"use client";
import { useState } from "react";
import { FDRate } from "@/types";
import { FDList } from "@/components/fd/FDList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { MessageSquare, TrendingUp, BookOpen } from "lucide-react";
import clsx from "clsx";

type Tab = "rates" | "chat" | "booking";

export default function Home() {
  const [selectedFD, setSelectedFD] = useState<FDRate | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("rates");

  const handleSelectFD = (fd: FDRate) => {
    setSelectedFD(fd);
    // Auto-switch to chat after selecting an FD on mobile
    setActiveTab("chat");
  };

  return (
    <div className="h-screen overflow-hidden bg-ink-50 flex flex-col">
      {/* Top header */}
      <header className="bg-ink-900 text-white px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="w-8 h-8 rounded-lg bg-saffron-500 flex items-center justify-center font-display font-bold text-sm shadow-sm">
          म
        </div>
        <div>
          <h1 className="font-display font-bold text-base leading-tight">Arth Saathi - अर्थ साथी</h1>
          <p className="text-[10px] text-ink-400 devanagari">आपका विश्वसनीय FD सलाहकार</p>
        </div>
        {selectedFD && (
          <div className="ml-auto text-right">
            <p className="text-[10px] text-ink-400 devanagari">चुना गया</p>
            <p className="text-xs font-bold text-saffron-400 devanagari">
              {selectedFD.interest_rate}% · {selectedFD.tenor_months}M
            </p>
          </div>
        )}
      </header>

      {/* Desktop: 3-column layout */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
        {/* Column 1: FD rates */}
        <div className="w-80 border-r border-ink-200 flex flex-col min-h-0 overflow-hidden">
          <FDList selectedFD={selectedFD} onSelect={handleSelectFD} />
        </div>

        {/* Column 2: Chat */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ChatWindow currentFD={selectedFD} />
        </div>

        {/* Column 3: Booking */}
        <div className="w-80 border-l border-ink-200 flex flex-col min-h-0 overflow-hidden bg-white">
          <div className="px-4 pt-4 pb-3 border-b border-ink-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-saffron-500" />
              <h2 className="font-display font-bold text-ink-900 text-base">बुकिंग</h2>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <BookingFlow selectedFD={selectedFD} />
          </div>
        </div>
      </div>

      {/* Mobile: Tab layout */}
      <div className="flex lg:hidden flex-1 min-h-0 overflow-hidden flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === "rates" && (
            <FDList selectedFD={selectedFD} onSelect={handleSelectFD} />
          )}
          {activeTab === "chat" && (
            <ChatWindow currentFD={selectedFD} />
          )}
          {activeTab === "booking" && (
            <div className="h-full bg-white">
              <BookingFlow selectedFD={selectedFD} />
            </div>
          )}
        </div>

        {/* Bottom tab bar */}
        <nav className="bg-white border-t border-ink-100 flex">
          {(
            [
              { key: "rates",   label: "FD दरें",  Icon: TrendingUp },
              { key: "chat",    label: "चैट",       Icon: MessageSquare },
              { key: "booking", label: "बुकिंग",    Icon: BookOpen }
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium devanagari transition-colors",
                activeTab === key
                  ? "text-saffron-600"
                  : "text-ink-400 hover:text-ink-600"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5",
                  activeTab === key ? "text-saffron-500" : "text-ink-300"
                )}
              />
              {label}
              {key === "booking" && selectedFD && (
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-500" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
