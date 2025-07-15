// lib/toast.ts
import { toast } from 'sonner';

export const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast[type](msg);
};
