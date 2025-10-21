
"use client";

import { useState } from "react";
import { LibertyCentLogo } from "@/components/liberty-cent-logo";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useAuth } from "@/context/auth-context";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/context/language-context";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: t('nav_trade') },
    { href: "/account", label: t('nav_account') },
    { href: "/info", label: t('nav_info') },
    { href: "/support", label: t('nav_support') },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b mb-8">
      <div className="container mx-auto">
        {/* --- Desktop Header --- */}
        <div className="hidden md:flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <LibertyCentLogo />
              <h1 className="text-2xl font-bold text-foreground">
                LibertyCent
              </h1>
            </Link>
            <nav className="flex items-center gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {loading ? null : user ? (
              <Button onClick={handleLogout} variant="outline">{t('logout')}</Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost"><Link href="/login">{t('login')}</Link></Button>
                <Button asChild><Link href="/signup">{t('signup')}</Link></Button>
              </div>
            )}
          </div>
        </div>

        {/* --- Mobile Header --- */}
        <div className="md:hidden flex flex-col gap-4">
            <div className="flex justify-center items-center relative">
                <Link href="/" className="flex items-center gap-3">
                    <LibertyCentLogo />
                    <h1 className="text-2xl font-bold text-foreground">
                        LibertyCent
                    </h1>
                </Link>
            </div>
            <div className="flex justify-between items-center">
                <LanguageSwitcher />
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent 
                    side="right" 
                    className="w-[300px] sm:w-[400px] bg-cover bg-center"
                    style={{ backgroundImage: "url(/my-menu-bg.jpg)" }}
                >
                    {/* Overlay for glass effect */}
                    <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"></div>

                    <div className="relative flex flex-col h-full z-10 p-4">
                        <div className="flex justify-end items-center mb-4">
                            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white hover:bg-white/10">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="text-center mb-8">
                             <h2 className="text-3xl font-bold text-white [text-shadow:0_0_10px_theme(colors.white/0.5)]">{t('menu')}</h2>
                        </div>
                        <nav className="flex-1 flex flex-col gap-3">
                            {navLinks.map((link) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                onClick={handleLinkClick} 
                                className="text-lg font-medium text-white text-center p-3 rounded-full bg-white/20 backdrop-blur-lg border border-white/20 hover:bg-white/30"
                            >
                                {link.label}
                            </Link>
                            ))}
                        </nav>
                        <div className="border-t border-white/10 mt-auto pt-4">
                            {loading ? null : user ? (
                                <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent text-white hover:bg-white/10 hover:text-white">{t('logout')}</Button>
                            ) : (
                                <div className="flex flex-col gap-2">
                                <Button asChild variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white" onClick={handleLinkClick}><Link href="/login">{t('login')}</Link></Button>
                                <Button asChild className="w-full bg-white/20 backdrop-blur-lg border border-white/20 text-white hover:bg-white/30" onClick={handleLinkClick}><Link href="/signup">{t('signup')}</Link></Button>
                                </div>
                            )}
                        </div>
                    </div>
                </SheetContent>
                </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}