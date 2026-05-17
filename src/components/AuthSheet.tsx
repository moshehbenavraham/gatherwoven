import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface AuthSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthSheet: React.FC<AuthSheetProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const headingId = useId();
  const descriptionId = useId();
  const emailId = useId();
  const passwordId = useId();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on Escape and auto-focus the email field on open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    // Defer focus to next frame so the sheet is mounted/animated in first.
    const id = window.requestAnimationFrame(() => {
      emailInputRef.current?.focus();
    });
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.cancelAnimationFrame(id);
    };
  }, [isOpen, onClose]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) throw error;

        toast({
          title: 'Account created!',
          description: 'You can now sign in with your credentials.'
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.'
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop — decorative, click-to-close is a mouse affordance only.
          Keyboard users close via Escape or the explicit Close button. */}
      <div
        className="fixed inset-0 bg-black opacity-50 z-[1000]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[#1A1A1A] z-[1001] shadow-2xl transition-transform duration-300 ${isOpen ? 'animate-slide-in-right' : ''}`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sign-in panel"
          className="absolute top-8 right-8 text-white hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA76FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-sm transition-colors"
        >
          <X size={24} aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="flex flex-col h-full px-10 pt-24 pb-10">
          <h2 id={headingId} className="text-white text-4xl font-medium mb-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h2>
          <p id={descriptionId} className="text-gray-400 text-sm mb-8">
            {isSignUp
              ? 'Join us to create and manage your events'
              : 'Welcome back! Please sign in to continue'}
          </p>

          <form onSubmit={handleAuth} className="flex flex-col gap-6" noValidate>
            <div>
              <label htmlFor={emailId} className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                Email
              </label>
              <input
                id={emailId}
                ref={emailInputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#FA76FF] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor={passwordId} className="block text-white text-sm font-medium mb-2 uppercase tracking-wide">
                Password
              </label>
              <input
                id={passwordId}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="w-full bg-white/10 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-[#FA76FF] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FA76FF] text-black font-medium py-3 px-6 uppercase text-sm border border-black hover:bg-[#ff8fff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gray-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FA76FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1A1A] rounded-sm transition-colors text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
