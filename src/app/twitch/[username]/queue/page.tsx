import { validateRequest } from '@/util/auth_validate';

export default async function Queue() {
  const { user } = await validateRequest();
  console.log('User:',user);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900">
      Your Queue
    </main>
  );
}