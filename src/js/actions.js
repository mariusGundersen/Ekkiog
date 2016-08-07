export const RESIZE = 'resize';
export const GL = 'gl';
export const SET_SELECTED_TOOL = 'setSelectedTool';
export const TOGGLE_MAIN_MENU = 'toggleMainMenu';

export function setSelectedTool(tool){
  return {
    type: SET_SELECTED_TOOL,
    tool
  };
}

export function toggleMainMenu(){
  return {
    type: TOGGLE_MAIN_MENU
  };
}