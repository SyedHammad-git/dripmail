import { SignIn } from "@clerk/nextjs";

import AuthShell from "@/components/AuthShell";



export default function SignInPage() {

  return (

    <AuthShell>

      <SignIn

        appearance={{

          elements: {

            rootBox: "w-full",

            card: "shadow-none border-none p-0 w-full bg-transparent",

            headerTitle: "text-2xl font-bold text-dm-navy tracking-tight",

            headerSubtitle: "text-dm-body text-sm",

            socialButtonsBlockButton:

              "border border-dm-border rounded-field text-dm-navy text-sm font-medium hover:bg-dm-tint-light transition-colors",

            dividerLine: "bg-dm-border",

            dividerText: "text-dm-muted text-xs",

            formFieldLabel: "text-dm-navy text-sm font-medium",

            formFieldInput:

              "border border-dm-border rounded-field text-sm text-dm-navy focus:border-dm-primary focus:ring-2 focus:ring-dm-primary/10",

            formButtonPrimary:

              "bg-dm-primary hover:bg-dm-primary/90 text-sm font-semibold rounded-field normal-case shadow-none",

            footerActionLink: "text-dm-primary font-semibold hover:text-dm-primary/80",

            identityPreviewEditButton: "text-dm-primary",

            formFieldAction: "text-dm-primary",

            footer: "hidden",

          },

        }}

      />

    </AuthShell>

  );

}