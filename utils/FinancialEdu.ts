const Videos = {
  Budgeting: [
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
  Savings: [
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
  Investing: ["YsLjDxvebAk", "5dVmzw1Xbao", "ch_SawrXmpY", "MN7yfV4UuCI"],
  Management: [
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

export const buttons = ["Budgeting", "Savings", "Investing", "Management"];

export default function SelectCategory(category: string | undefined) {
  if (category === undefined) return Videos.Budgeting;

  if (buttons.includes(category))
    return Videos[category as keyof typeof Videos];

  return Videos.Budgeting;
}
