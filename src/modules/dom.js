const _menuTabs = document.getElementById('tc_menu_tabs');

export default {
  clock: document.getElementById('clock'),
  score: document.getElementById('tc_score'),
  scoreMod: document.getElementById('tc_score_mod'),
  earning: document.getElementById('tc_earning'),
  earningMod: document.getElementById('tc_earning_mod'),
  click: document.getElementById('tc_click'),
  clickMod: document.getElementById('tc_click_mod'),
  menuTabs: document.getElementById('tc_menu_tabs'),
  buildingsWrapper: document.getElementById('tc_buildings'),
  upgradesWrapper: document.getElementById('tc_upgrades'),
  menuTabBuildings: _menuTabs.querySelector('.buildings'),
  menuTabUpgrades: _menuTabs.querySelector('.upgrades'),
  unitName: document.getElementById('unit_name'),
  unitAbbreviation: document.getElementById('unit_abbr'),
  unitDescription: document.getElementById('unit_description'),
  unitMoreInfo: document.getElementById('unit_more_info'),
  toaster: document.getElementById('toaster')
};
