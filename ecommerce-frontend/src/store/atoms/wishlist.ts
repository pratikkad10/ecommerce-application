import { atom } from 'recoil';

export const wishlistIdsState = atom<string[]>({
  key: 'wishlistIdsState',
  default: [],
});
