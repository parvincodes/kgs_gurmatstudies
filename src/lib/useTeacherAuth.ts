"use client";

import { useEffect, useState } from "react";

const PASSCODE_KEY = "kgs_upload_passcode";
const NAME_KEY = "kgs_teacher_name";

export function useTeacherAuth() {
  const [passcode, setPasscodeState] = useState("");
  const [name, setNameState] = useState("");
  const [checkingPasscode, setCheckingPasscode] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  useEffect(() => {
    // One-time client-only hydration from sessionStorage — SSR has no
    // access to it, so this can't be a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPasscodeState(sessionStorage.getItem(PASSCODE_KEY) ?? "");
    setNameState(sessionStorage.getItem(NAME_KEY) ?? "");
  }, []);

  function setName(value: string) {
    setNameState(value);
    sessionStorage.setItem(NAME_KEY, value);
  }

  async function verifyPasscode(candidate: string) {
    setCheckingPasscode(true);
    setPasscodeError(null);
    try {
      const res = await fetch("/api/materials", {
        headers: { "x-upload-passcode": candidate },
      });
      if (res.ok) {
        setPasscodeState(candidate);
        sessionStorage.setItem(PASSCODE_KEY, candidate);
        return true;
      }
      const data = await res.json().catch(() => null);
      setPasscodeError(
        res.status === 401
          ? "That passcode didn't work. Try again."
          : (data?.error ?? "Something went wrong. Try again."),
      );
      sessionStorage.removeItem(PASSCODE_KEY);
      return false;
    } catch {
      setPasscodeError("Couldn't reach the server. Try again.");
      return false;
    } finally {
      setCheckingPasscode(false);
    }
  }

  function logout() {
    sessionStorage.removeItem(PASSCODE_KEY);
    setPasscodeState("");
  }

  return {
    passcode,
    name,
    setName,
    checkingPasscode,
    passcodeError,
    verifyPasscode,
    logout,
  };
}
