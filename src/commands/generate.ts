import * as fs from "fs";
import signale, { Signale } from "signale";
import prompts from "prompts";
import { isExist } from "../utils/isExist";
import licenses from "../../licenses-json/licenses.json";

export const generate = async (id: string, isForced: boolean, isMarkdown: boolean) => {
  const license = licenses.find((license) => license["spdx-id"] === id);
  
  if (license === undefined) {
    signale.error(`"${id}" was not found.`);
    return;
  }

  signale.success(`"${license.title}" was found!`);

  const createInteractive = new Signale({interactive: true});

  const licenseFileName = isMarkdown ? 'LICENSE.md' : 'LICENSE';
  const licenseText = isMarkdown ? '# LICENSE\n\n' + license.content : license.content;

  createInteractive.await(`Creating "${licenseFileName}"...`);

  if (isExist(licenseFileName)) {
    createInteractive.warn(`"${licenseFileName}" already exists.`);
    if (!isForced) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'Overwrite existing LICENSE file??',
        initial: true
      });
      if (!overwrite) {
        createInteractive.info('Canceled.');
        return;
      }
    }
  }

  fs.writeFileSync(licenseFileName, licenseText);

  createInteractive.success(`"${licenseFileName}" was created!`);

  // signale.info(`See also: ${license.seeAlso.join(', ')}`);
  signale.note('Don\'t forget to replace the press holder with your value.');
};
