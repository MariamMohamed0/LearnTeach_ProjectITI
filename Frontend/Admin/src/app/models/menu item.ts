import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface SidebarItem {
  label: string;
  icon: IconDefinition;
  route: string;
  active?: boolean;
}
