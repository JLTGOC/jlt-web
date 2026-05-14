export interface MenuNode {
  key?: string;
  icon?: React.ReactNode;
  label: string;
  path?: string;
  subItems?: MenuNode[];
}

export interface NavItem extends MenuNode {
  id: string;
  icon: React.ReactNode;
}

function normalizePath(path: string): string {
  if (path === "/") return "/";
  return path.replace(/\/+$/, "");
}

export function isPathActive(path: string, currentPath: string): boolean {
  const normalizedPath = normalizePath(path);
  const normalizedCurrentPath = normalizePath(currentPath);

  if (normalizedPath === "/") {
    return normalizedCurrentPath === "/";
  }

  return (
    normalizedCurrentPath === normalizedPath ||
    normalizedCurrentPath.startsWith(`${normalizedPath}/`)
  );
}

export function isNodeActive(node: MenuNode, currentPath: string): boolean {
  if (node.path && isPathActive(node.path, currentPath)) return true;
  return !!node.subItems?.some((subItem) => isNodeActive(subItem, currentPath));
}

export function getFirstNavigablePath(node: MenuNode): string | undefined {
  if (node.path) return node.path;
  for (const subItem of node.subItems ?? []) {
    const nestedPath = getFirstNavigablePath(subItem);
    if (nestedPath) return nestedPath;
  }
  return undefined;
}

export function isItemActive(item: NavItem, currentPath: string): boolean {
  if (isNodeActive(item, currentPath)) return true;
  const sectionPrefix = getFirstNavigablePath(item)?.split("/")[1];
  if (sectionPrefix && isPathActive(`/${sectionPrefix}`, currentPath)) {
    return true;
  }
  return false;
}

export function isSubItemActive(
  subItem: MenuNode,
  currentPath: string,
): boolean {
  return isNodeActive(subItem, currentPath);
}

export function getActiveIndex(items: NavItem[], currentPath: string): number {
  return items.findIndex((item) => isItemActive(item, currentPath));
}

export function getActiveItem(
  items: NavItem[],
  currentPath: string,
): NavItem | null {
  return items.find((item) => isItemActive(item, currentPath)) ?? null;
}
