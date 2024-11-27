import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function getUserData() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    redirect('/login');
  }

  try {
    const userData = JSON.parse(userCookie.value);
    return userData;
  } catch (error) {
    redirect('/');
  }
}