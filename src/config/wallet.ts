import { setupWalletSelector } from "@near-wallet-selector/core";
import type { WalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

export const initWalletSelector = async (): Promise<{
  selector: WalletSelector;
  modal: WalletSelectorModal;
}> => {
  const selector = await setupWalletSelector({
    network: "mainnet",
    modules: [
      setupMeteorWallet()
    ],
    debug: true
  });

  const modal = setupModal(selector, {
    contractId: "v2.ref-finance.near",
    theme: "dark",
    description: "Please select a wallet to continue"
  });

  return { selector, modal };
}; 