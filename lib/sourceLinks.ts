export const CLAUDE_CODE_REPO = "https://github.com/openonion/claude-code";

export function ghBlob(path: string) {
  return `${CLAUDE_CODE_REPO}/blob/main/src/${path}`;
}

export function ghTree(path: string) {
  return `${CLAUDE_CODE_REPO}/tree/main/src/${path}`;
}
