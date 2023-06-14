import { OdisUtils } from "@celo/identity";
import { ISocialConnect } from "./ISocialConnect";
import { Wallet, ethers } from "ethers";
import { ALFAJORES_CUSD_ADDRESS, ALFAJORES_RPC, DEK_PRIVATE_KEY, FA_CONTRACT, FA_PROXY_ADDRESS, ISSUER_PRIVATE_KEY, ODIS_PAYMENTS_CONTRACT, ODIS_PAYMENTS_PROXY_ADDRESS, STABLE_TOKEN_CONTRACT } from "./constants";
import { AuthSigner, OdisContextName, AuthenticationMethod } from "@celo/identity/lib/odis/query";

import { WebBlsBlindingClient } from "./webBlindingClient";

let provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
let issuer = new Wallet(ISSUER_PRIVATE_KEY!, provider);
let serviceContext = OdisUtils.Query.getServiceContext(OdisContextName.ALFAJORES);
let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey);
let quotaFee = ethers.utils.parseEther("0.01");
let authSigner: AuthSigner = {
  authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
  rawKey: DEK_PRIVATE_KEY!
};
let federatedAttestationsContract = new ethers.Contract(
  FA_PROXY_ADDRESS!,
  FA_CONTRACT.abi,
  issuer
);
let odisPaymentsContract = new ethers.Contract(
  ODIS_PAYMENTS_PROXY_ADDRESS!,
  ODIS_PAYMENTS_CONTRACT.abi,
  issuer
);
let stableTokenContract = new ethers.Contract(
  ALFAJORES_CUSD_ADDRESS!,
  STABLE_TOKEN_CONTRACT.abi,
  issuer
);

let sc: ISocialConnect = {
  issuerAddress: issuer.address,
  federatedAttestationsContract,
  odisPaymentsContract,
  stableTokenContract,
  authSigner,
  serviceContext,
  quotaFee,
  blindingClient
};

async function getObfuscatedIdentifier(identifier: string, type: string) {
  let identType: any;
  if (type === "twitter") {
    identType = OdisUtils.Identifier.IdentifierPrefix.TWITTER;
  } else if (type === "phone") {
    identType = OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER;
  }
  let obfuscatedIdentifier = (
    await OdisUtils.Identifier.getObfuscatedIdentifier(
      identifier,
      identType,
      sc!.issuerAddress,
      sc!.authSigner,
      sc!.serviceContext,
      undefined,
      undefined,
      sc!.blindingClient
    )
  ).obfuscatedIdentifier;
  return obfuscatedIdentifier;
}

export async function registerAttestation(identifier: string, account: string, type: string) {
  try {
    // check and top up ODIS quota
    await checkAndTopUpODISQuota();
    let nowTimestamp = Math.floor(new Date().getTime() / 1000);
    let obfuscatedIdentifier = await getObfuscatedIdentifier(identifier, type);
    const output = await sc!.federatedAttestationsContract.registerAttestationAsIssuer(
      obfuscatedIdentifier,
      account,
      nowTimestamp
    );
    console.log(output)
    alert("Address mapped.");
  } catch (error) {
    console.log(error)
  }
}

async function checkAndTopUpODISQuota() {
  const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
    sc!.issuerAddress,
    sc!.authSigner,
    sc!.serviceContext
  );
  if (remainingQuota < 1) {
    let currentAllowance = await sc!.stableTokenContract.allowance(
      sc!.issuerAddress,
      sc!.odisPaymentsContract.address
    );
    let enoughAllowance = false;
    if (sc!.quotaFee.gt(currentAllowance)) {
      let approvalTxReceipt = await sc!.stableTokenContract
        .increaseAllowance(
          sc!.odisPaymentsContract.address,
          sc!.quotaFee
        );
      enoughAllowance = approvalTxReceipt.status;
    } else {
      enoughAllowance = true;
    }
    if (enoughAllowance) {
      let odisPayment = await sc!.odisPaymentsContract
        .payInCUSD(
          sc!.issuerAddress,
          sc!.quotaFee
        );
    } else {
      throw "ODIS => cUSD approval failed";
    }
  }
}

export async function lookupAddress(username: string) {
  const identifier = (await OdisUtils.Identifier.getObfuscatedIdentifier(
    username,
    OdisUtils.Identifier.IdentifierPrefix.TWITTER,
    sc!.issuerAddress,
    sc!.authSigner,
    sc!.serviceContext
  )).obfuscatedIdentifier

  // query onchain mappings
  const attestations = await sc!.federatedAttestationsContract.lookupAttestations(identifier, [sc!.issuerAddress])
  console.log(attestations)
  return attestations.accounts
}