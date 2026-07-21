export const THEME_KEY = "absolutepitch:theme";

export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    var dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;
