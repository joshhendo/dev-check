import * as args from 'command-line-args'
import {checkProject, CheckProjectOptions} from "./index";

void async function() {
  const optionDefinitions: args.OptionDefinition[] = [
    { name: 'exclude', alias: 'e', type: String, multiple: true },
    { name: 'directory', type: String, multiple: false, defaultOption: true }
  ];

  const options: any = args(optionDefinitions);

  if (!options.directory) {
    console.error('Must specify directory');
    return 1;
  }

  const checkOptions: CheckProjectOptions = {
    ignoreDirs: options.exclude || null,
  };

  const depsUsedNotInstalled = await checkProject(options.directory, checkOptions);

  if (depsUsedNotInstalled.length > 0) {
    console.log(`Dependencies used but not in prod dependencies: ${depsUsedNotInstalled.join(',')}`);
    process.exit(1);
  }

  console.log('Everything looks good');
  process.exit(0);
}();