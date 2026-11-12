"use client";

import { FormEvent, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { createUserProfile } from "../user-profile";

const messageFor = (code?: string) => {
  if (code === "auth/email-already-in-use") return "May account na ang email na ito. Mag-sign in na lang, beh!";
  if (code === "auth/invalid-email") return "Pakitingnan kung tama ang email address.";
  if (code === "auth/weak-password") return "Gumamit ng mas matibay na password na may hindi bababa sa 8 characters.";
  if (code === "auth/operation-not-allowed") return "Hindi pa naka-enable ang Email/Password sign-in sa Firebase project.";
  if (code === "auth/network-request-failed") return "Mahina ang koneksyon. Subukan natin ulit.";
  return "Hindi nagawa ang account. Pakisubukan ulit.";
};

export default function SignupPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const credential = await createUserWithEmailAndPassword(auth, String(form.get("email") || "").trim(), String(form.get("password") || ""));
      const fullName = String(form.get("fullName") || "").trim();
      await updateProfile(credential.user, { displayName: fullName });
      await createUserProfile(credential.user, fullName);
      window.location.assign("/account");
    } catch (error) {
      setMessage(messageFor((error as { code?: string }).code));
      setSubmitting(false);
    }
  }
  return <main className="signup-page"><a className="signup-brand" href="/">Beh, kain kita!</a><section className="signup-card" aria-labelledby="signup-title"><p className="signup-kicker">✦ Tara, food trip!</p><h1 id="signup-title">Gawa tayo ng account, beh!</h1><p className="signup-subtitle">May account ka na? <a href="/signin">Sign in</a></p><form onSubmit={submit}><label>Full name<input name="fullName" autoComplete="name" placeholder="Anong tawag namin sa’yo?" required/></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="beh@example.com" required/></label><label>Password<input name="password" type="password" autoComplete="new-password" placeholder="Gumawa ng password" minLength={8} required/></label><small className="password-hint">Gumamit ng hindi bababa sa 8 characters.</small><button type="submit" disabled={submitting}>{submitting ? "Ginagawa ang account…" : "Gumawa ng account →"}</button>{message&&<p className="signup-message signup-error" role="alert">{message}</p>}</form><p className="signup-privacy">Ang iyong food trips at mga bet na kainan ay mananatiling iyo.</p></section></main>;
}
