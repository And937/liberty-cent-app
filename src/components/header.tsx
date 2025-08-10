"use client";

import { LibertyCentLogo } from "@/components/liberty-cent-logo";
import Link from 'next/link';
import { Button } from './ui/button';
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <LibertyCentLogo />
            <h1 className="text-2xl font-bold text-foreground">
              LibertyCent
            </h1>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary">Trade</Link>
            <Link href="/account" className="text-sm font-medium text-muted-foreground hover:text-primary">Personal Account</Link>
            <Link href="/info" className="text-sm font-medium text-muted-foreground hover:text-primary">Info</Link>
            <Link href="/support" className="text-sm font-medium text-muted-foreground hover:text-primary">Support</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {loading ? null : user ? (
            <Button onClick={handleLogout} variant="outline">Logout</Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/signup">Sign Up</Link></Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
