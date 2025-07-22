"use client";

import { useState } from "react";
import { Share2, Download, Copy, Check, MessageCircle, Send, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackShareClick, trackDownloadClick } from "@/lib/analytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareDownloadButtonsProps {
  id: number;
  title: string;
  type: "movie" | "tv";
  overview?: string;
  releaseDate?: string;
  rating?: number;
  posterUrl?: string;
}

export default function ShareDownloadButtons({
  id,
  title,
  type,
  overview,
  releaseDate,
  rating,
  posterUrl,
}: ShareDownloadButtonsProps) {
  const [copied, setCopied] = useState(false);

  // إنشاء URL مع معلومات SEO
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const itemUrl = `${baseUrl}/${type}/${id}`;

  // إنشاء نص المشاركة مع تفاصيل SEO
  const shareText = `${title} ${releaseDate ? `(${new Date(releaseDate).getFullYear()})` : ""}
${overview ? overview.slice(0, 150) + (overview.length > 150 ? "..." : "") : ""}
${rating ? `⭐ ${rating.toFixed(1)}/10` : ""}
Watch on MoviesDB: ${itemUrl}`;

  const shareData = {
    title: `${title} - MoviesDB`,
    text: shareText,
    url: itemUrl,
  };

  // نسخ الرابط
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(itemUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // Track Analytics event
      trackShareClick(title, id, 'copy_link');
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // مشاركة عبر Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Track Analytics event
        trackShareClick(title, id, 'native_share');
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback to copying
      copyToClipboard();
    }
  };

  // مشاركة عبر WhatsApp
  const shareWhatsApp = () => {
    const whatsappText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${whatsappText}`, "_blank");
    // Track Analytics event
    trackShareClick(title, id, 'whatsapp');
  };

  // مشاركة عبر Telegram
  const shareTelegram = () => {
    const telegramText = encodeURIComponent(shareText);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(itemUrl)}&text=${telegramText}`, "_blank");
    // Track Analytics event
    trackShareClick(title, id, 'telegram');
  };

  // مشاركة عبر Twitter
  const shareTwitter = () => {
    const twitterText = encodeURIComponent(`Check out "${title}" on MoviesDB! ${rating ? `⭐ ${rating.toFixed(1)}/10` : ""}`);
    window.open(`https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(itemUrl)}`, "_blank");
    // Track Analytics event
    trackShareClick(title, id, 'twitter');
  };

  // مشاركة عبر Facebook
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemUrl)}`, "_blank");
    // Track Analytics event
    trackShareClick(title, id, 'facebook');
  };

  // تحميل معلومات الفيلم/المسلسل كملف نصي
  const downloadInfo = () => {
    const info = `${title}
${releaseDate ? `Release Date: ${releaseDate}` : ""}
${rating ? `Rating: ${rating.toFixed(1)}/10` : ""}
${overview ? `\nOverview:\n${overview}` : ""}

Watch on MoviesDB: ${itemUrl}

Downloaded from MoviesDB at ${new Date().toLocaleString()}`;

    const blob = new Blob([info], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_info.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Track Analytics event
    trackDownloadClick(title, id);
  };

  // تحميل الصورة
  const downloadPoster = async () => {
    if (!posterUrl) return;

    try {
      const response = await fetch(posterUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, "_")}_poster.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Track Analytics event
      trackDownloadClick(`${title} Poster`, id);
    } catch (err) {
      console.error("Failed to download poster:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* زر المشاركة */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 border-white/20 text-white">
          <DropdownMenuItem onClick={handleNativeShare} className="hover:bg-white/10">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyToClipboard} className="hover:bg-white/10">
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/20" />
          <DropdownMenuItem onClick={shareWhatsApp} className="hover:bg-white/10">
            <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareTelegram} className="hover:bg-white/10">
            <Send className="h-4 w-4 mr-2 text-blue-400" />
            Telegram
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareTwitter} className="hover:bg-white/10">
            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={shareFacebook} className="hover:bg-white/10">
            <Facebook className="h-4 w-4 mr-2 text-blue-600" />
            Facebook
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* زر التحميل */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/90 border-white/20 text-white">
          <DropdownMenuItem onClick={downloadInfo} className="hover:bg-white/10">
            <Download className="h-4 w-4 mr-2" />
            Download Info
          </DropdownMenuItem>
          {posterUrl && (
            <DropdownMenuItem onClick={downloadPoster} className="hover:bg-white/10">
              <Download className="h-4 w-4 mr-2" />
              Download Poster
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
