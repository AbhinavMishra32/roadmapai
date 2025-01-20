import { clsx, type ClassValue } from "clsx"
import { Cookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function useCheckUserToken() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const userToken = cookies.get('userToken');
  if (!userToken) {
      navigate('/signin');
  }
}