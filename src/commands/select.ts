import fetch from "node-fetch";
import signale from "signale";
import prompts from "prompts";
import licenses from "../../licenses-json/licenses.json";
import { generate } from "./generate";

export const select = async (isForced: boolean, isMarkdown: boolean) => {
  try {
    const licenseChoices = licenses.map((license) => ({
      title: license.title,
      value: license["spdx-id"],
      descripton: undefined,
    })).sort((a: any, b: any) => a.title.localeCompare(b.title));

    const { licenseId } = await prompts({
      type: 'select',
      name: 'licenseId',
      message: 'Pick a license',
      choices: licenseChoices,
      initial: 1
    });
    if (licenseId) {
      generate(licenseId, isForced, isMarkdown);
    }
  } catch(error) {
    signale.error(error);
  }
};
