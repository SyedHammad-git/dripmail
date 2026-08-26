import { SignUp } from "@clerk/nextjs";
import AuthShell from "@/components/AuthShell";

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUp
        // routing aur path hata diye hain taake .env file wale variables use hon
        signInUrl="/sign-in"
        fallbackRedirectUrl="/" 
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-sm border border-stroke rounded-2xl p-6 md:p-8 bg-white w-full",
            headerTitle: "text-xl font-semibold text-navy",
            headerSubtitle: "text-sm text-muted mb-4",
            socialButtonsBlockButton:
              "border border-stroke rounded-lg text-navy hover:bg-tint transition-all",
            dividerLine: "bg-stroke",
            dividerText: "text-muted text-xs",
            formFieldLabel: "text-navy text-xs font-medium",
            formFieldInput:
              "border border-stroke rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm py-2 px-3 bg-white",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold normal-case py-2.5",
            footerActionText: "text-muted text-xs",
            footerActionLink: "text-primary font-semibold hover:underline",
            identityPreviewEditButton: "text-primary",
          },
        }}
      />
    </AuthShell>
  );
}