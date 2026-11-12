import { APP_NAME } from '@kavach/shared';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <main className={cn('flex min-h-screen flex-col items-center justify-center gap-2 p-6')}>
      <h1 className="text-3xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="text-muted-foreground">Hello from the web app.</p>
    </main>
  );
}
