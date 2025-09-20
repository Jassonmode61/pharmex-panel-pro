const KEY='phx-theme';  // 'dark' | 'light' | 'system'
export function setTheme(mode){
  localStorage.setItem(KEY, mode);
  applyTheme(mode);
}
export function getTheme(){
  return localStorage.getItem(KEY) || 'system';
}
export function applyTheme(mode=getTheme()){
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode==='dark' || (mode==='system' && prefersDark);
  root.dataset.theme = isDark?'dark':'light';
}
// sayfa yüklenince uygulansın
export function initTheme(){ applyTheme(); }