const dict = {
  tr: { profile:"Profil", notifications:"Bildirimler", save:"Kaydet" },
  en: { profile:"Profile", notifications:"Notifications", save:"Save" }
};
export function i18nInit(){
  const stored = localStorage.getItem("lang") || "tr";
  document.documentElement.lang = stored;
}
export function t(key){
  const lang = document.documentElement.lang || "tr";
  return (dict[lang] && dict[lang][key]) || key;
}