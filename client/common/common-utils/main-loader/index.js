import delay from 'lodash.delay';

export function hideMainLoader() {
  const mainLoader = document.getElementById('main-loader');

  mainLoader.className = `${mainLoader.className} hide`;

  delay(() => {
    mainLoader.style.display = 'none';
  }, 500);
}
