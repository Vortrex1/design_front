"use client"

import { useState } from "react"
import Link from "next/link"
import { Coffee, Menu, X, ShoppingCart, Heart, User } from "lucide-react"

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-primary-foreground/10 bg-foreground/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-accent" />
          <span className="text-lg font-bold text-primary-foreground">
            CoffeMaker
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#products"
            className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          >
            Products
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          >
            About
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <Link
            href="#"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <User className="h-4 w-4" />
            Sign In
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-primary-foreground/10 bg-foreground/95 px-6 py-6 backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-4">
            <Link
              href="#products"
              className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex items-center gap-4 pt-2">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
                aria-label="Favorites"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <User className="h-4 w-4" />
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
