const Videos = {
  financial_foundation: [
    "Q0uXGQu55GM",
    "HQzoZfc3GwQ",
    "3pslPbfpnzk",
    "vmZpnpze0",
    "IXsb3aoXbVk",
    "zVcwvCL2C2c",
    "ms1nTeFO7ps",
    "fIJ86j0HIxM",
    "85TrbjGcfZk",
    "zLr72gEkvp0",
    "J6oHchaCxvM",
    "ibGT401qDWw",
    "AIOR1x7fPcQ",
  ],
  Investing_and_building_wealth: [
    "vmZpnpze0",
    "4j2emMn7UaI",
    "sK1BJ_259AM",
    "vV6hJ_j09m8",
    "HBiF7aLbYIU",
    "ms1nTeFO7ps",
    "FP7IVNN4bI",
    "JgOecvGJj7E",
    "Z1bU3dE7Rdc",
    "hPTrtp098vg",
    "fIJ86j0HIxM",
    "d0br2h829uk",
    "85TrbjGcfZk",
    "cPcF8Jx6ptE",
    "AIOR1x7fPcQ",
  ],
  Investing_planing_and_future_goals: [
    "YsLjDxvebAk",
    "5dVmzw1Xbao",
    "ch_SawrXmpY",
    "MN7yfV4UuCI",
  ],
  Debt_management: [
    "WNm_ez1h7Tc",
    "B4XVb36nls0",
    "MpADdBwXMm0",
    "zVcwvCL2C2c",
    "4j2emMn7UaI",
    "Py3rkSwsbyw",
    "fIJ86j0HIxM",
    "Py4NYvdQmhA",
    "zLr72gEkvp0",
    "J6oHchaCxvM",
    "zNTNWQmf1DE",
    "PxGOUQF_CT4",
    "AIOR1x7fPcQ",
  ],
};

export const buttons = [
  { slug: "financial_foundation", title: "Financial foundation" },
  {
    slug: "Investing_and_building_wealth",
    title: "Investing and building wealth",
  },
  {
    slug: "Investing_planing_and_future_goals",
    title: "Investing planing and future goals",
  },
  { slug: "Debt_management", title: "Debt management and student loans" },
];
export const buttonIcons = [
  require("../assets/icons/foundation.png"),
  require("../assets/icons/save.png"),
  require("../assets/icons/plan.png"),
  require("../assets/icons/debt.png"),
];

export function SelectCategory(category: string | undefined) {
  if (!category) return Videos.financial_foundation;

  const selectedButton = buttons.find((button) => button.slug === category);
  if (selectedButton) return Videos[selectedButton.slug as keyof typeof Videos];

  return Videos.financial_foundation;
}
