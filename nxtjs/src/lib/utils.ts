import { clsx, type ClassValue } from "clsx"
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useCheckUserToken() {
  const router = useRouter();
  return async () => {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('userToken');
    if (!userToken) {
      router.push('/signin');
    }
  };
}