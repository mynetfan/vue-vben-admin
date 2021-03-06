/**
 * Application configuration
 */

import type { ProjectConfig } from '/@/types/config';
import { computed, ref } from 'vue';

import { ThemeModeEnum } from '/@/enums/appEnum';
import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';

import projectSetting from '/@/settings/projectSetting';
import { getLocal } from '/@/utils/helper/persistent';
import {
  updateGrayMode,
  updateColorWeak,
  updateHeaderBgColor,
  updateSidebarBgColor,
} from '/@/logics/theme';

import { appStore } from '/@/store/modules/app';
import { deepMerge } from '/@/utils';

// TODO Theme switching
export function useThemeMode(mode: ThemeModeEnum) {
  const modeRef = ref(mode);
  const html = document.documentElement;
  const clsList = html.classList;

  const change = () => {
    clsList.contains(mode) ? clsList.remove(mode) : clsList.add(mode);
  };
  return {
    runChangeThemeMode: change,
    mode: computed(() => modeRef.value),
  };
}

// Initial project configuration
export function initAppConfigStore() {
  let projCfg: ProjectConfig = getLocal(PROJ_CFG_KEY) as ProjectConfig;
  projCfg = deepMerge(projectSetting, projCfg || {});

  try {
    const {
      colorWeak,
      grayMode,
      headerSetting: { bgColor: headerBgColor } = {},
      menuSetting: { bgColor } = {},
    } = projCfg;
    // if (
    //   themeColor !== primaryColor &&
    //   themeColor &&
    //   process.env.VUE_APP_USE_THEME_REPLACER !== 'TRUE'
    // ) {
    //   updateTheme(themeColor);
    // }
    headerBgColor && updateHeaderBgColor(headerBgColor);
    bgColor && updateSidebarBgColor(bgColor);
    grayMode && updateGrayMode(grayMode);
    colorWeak && updateColorWeak(colorWeak);
  } catch (error) {
    console.log(error);
  }
  appStore.commitProjectConfigState(projCfg);
}
