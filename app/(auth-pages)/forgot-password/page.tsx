// app/(auth-pages)/forgot-password/page.tsx
import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, type Message } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

function SuccessState({ email }: { email: string }) {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-4">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <div className="space-y-2 pt-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email?
          </p>
          <form className="space-y-2">
            <Button
              variant="ghost"
              className="text-sm underline-offset-4 text-primary hover:text-primary/90"
              formAction={forgotPasswordAction}
            >
              Click to resend
            </Button>
          </form>
        </div>
        <div className="pt-4">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </CardContent>
      <CardFooter className="border-t p-6">
      </CardFooter>
    </Card>
  );
}

function RequestResetForm({ searchParams }: { searchParams: Message }) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button 
            className="w-full"
            formAction={forgotPasswordAction}
          >
            Send reset link
          </Button>

          <FormMessage message={searchParams} />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t p-6">
        <div className="flex flex-col space-y-4 text-center">
          <Link
            href="/sign-in"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}


export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
 // Check for both new and old message formats
 const isSuccess = 
 (searchParams && 'type' in searchParams && searchParams.type === 'success') ||
 (searchParams && 'success' in searchParams);

const messageText = 
 'message' in searchParams 
   ? searchParams.message 
   : 'success' in searchParams 
     ? searchParams.success 
     : 'error' in searchParams 
       ? searchParams.error 
       : '';

const email = messageText.match(/sent to (.+@.+\..+)/)?.[1] || "";

return (
 <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background/50 to-muted/50">
   {isSuccess ? (
     <SuccessState email={email} />
   ) : (
     <RequestResetForm searchParams={searchParams} />
   )}
 </div>
);
}