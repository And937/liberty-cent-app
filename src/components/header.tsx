
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
      <div className="container mx-auto flex justify-between items-center">
        {/* --- Left Side --- */}
        <div className="flex items-center gap-6">
          {/* Logo and App Name (visible on all screen sizes) */}
          <Link href="/" className="flex items-center gap-3">
            <LibertyCentLogo />
            <h1 className="text-2xl font-bold text-foreground">
              LibertyCent
            </h1>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --- Right Side (Desktop) --- */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* --- Right Side (Mobile) --- */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b">
                   <h2 className="text-lg font-semibold">{t('menu')}</h2>
                   <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-6 w-6" />
                   </Button>
                </div>

                <nav className="flex-1 flex flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={handleLinkClick} className="text-lg font-medium text-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="p-4 border-t mt-auto">
                   {loading ? null : user ? (
                      <Button onClick={handleLogout} variant="outline" className="w-full">{t('logout')}</Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button asChild variant="ghost" className="w-full" onClick={handleLinkClick}><Link href="/login">{t('login')}</Link></Button>
                        <Button asChild className="w-full" onClick={handleLinkClick}><Link href="/signup">{t('signup')}</Link></Button>
                      </div>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}