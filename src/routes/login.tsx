import * as React from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const Route = createFileRoute('/login')({
  component: Login,
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    } as LoginFormValues,
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);

      try {
        const result = await authClient.signIn.email({
          email: value.email,
          password: value.password,
        });

        if (result.error) {
          console.error(result.error);
          setSubmitError(result.error.message || 'Failed to sign in');
        } else {
          navigate({ to: '/' });
        }
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.Field
              name="email"
              validators={{
                onChange: z.email('Please enter a valid email address'),
              }}
            >
              {(field) => (
                <FormField>
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Email</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        type="email"
                        placeholder="name@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={form.state.isSubmitting}
                        aria-invalid={field.state.meta.errors.length > 0}
                        aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                      />
                    </FormControl>
                    {field.state.meta.errors.length > 0 && (
                      <FormMessage id={`${field.name}-error`}>
                        {String(field.state.meta.errors[0]?.message || 'Invalid email address')}
                      </FormMessage>
                    )}
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: z.string().min(6, 'Password must be at least 6 characters'),
              }}
            >
              {(field) => (
                <FormField>
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Password</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        type="password"
                        placeholder="Enter your password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={form.state.isSubmitting}
                        aria-invalid={field.state.meta.errors.length > 0}
                        aria-describedby={field.state.meta.errors.length > 0 ? `${field.name}-error` : undefined}
                      />
                    </FormControl>
                    {field.state.meta.errors.length > 0 && (
                      <FormMessage id={`${field.name}-error`}>
                        {String(field.state.meta.errors[0]?.message || 'Invalid password')}
                      </FormMessage>
                    )}
                  </FormItem>
                </FormField>
              )}
            </form.Field>

            {submitError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
