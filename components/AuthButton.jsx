"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { AuthModal } from "./AuthModal";
import { signOut } from "@/app/actions";

const AuthButton = ({ user }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  if (user) {
    return (
      <form action={signOut}>
        <Button
          className="gap-2 "
          variant="ghost"
          size="lg"
          type="submit"
          
        >
          Sign Out
        </Button>
      </form>
    );
  }
  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="outline"
        size="sm"
        className="bg-violet-200 gap-2 "
      >
        <LogIn className="w-4 h-4" />
        Sign in
      </Button>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AuthButton;
