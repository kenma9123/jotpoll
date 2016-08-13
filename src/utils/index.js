export * from './createReducer';

export const truncate = (string, len = 30) => {
  if (string && string.length > len) {
    return string.substring(0, len) + '...';
  } else {
    return string;
  }
}
