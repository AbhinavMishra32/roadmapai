"use client"
import { clsx, type ClassValue } from "clsx"
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useCheckUserToken() {
  const router = useRouter();
  return async () => {
    const userToken = Cookies.get('userToken');
    if (!userToken) {
      router.push('/signin');
    }
  };
}