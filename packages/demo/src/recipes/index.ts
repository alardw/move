import type { Recipe } from './types';
import { badgeRecipes } from './component/Badge';
import { buttonRecipes } from './component/Button';
import { drawerRecipes } from './component/Drawer';
import { listRecipes } from './component/List';
import { loginRecipes } from './composite/authentication/Login';
import { mfaRecipes } from './composite/authentication/Mfa';
import { searchFilterRecipes } from './composite/data/SearchFilter';
import { tableRecipes } from './composite/data/Table';
import { sidebarRecipes } from './composite/navigation/Sidebar';
import { detailPageRecipes } from './composite/page/Detail';
import { listPageRecipes } from './composite/page/List';
import { overviewPageRecipes } from './composite/page/Overview';

export const recipes: Recipe[] = [
  ...badgeRecipes,
  ...buttonRecipes,
  ...drawerRecipes,
  ...listRecipes,
  ...loginRecipes,
  ...mfaRecipes,
  ...searchFilterRecipes,
  ...sidebarRecipes,
  ...tableRecipes,
  ...detailPageRecipes,
  ...listPageRecipes,
  ...overviewPageRecipes,
];
