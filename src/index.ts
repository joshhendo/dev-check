import * as fs from 'fs';
import * as depcheck from 'depcheck';
const readPkg = require('read-pkg');
import * as _ from 'lodash';
import {promisify} from 'es6-promisify';

const readDirPromise = promisify(fs.readdir);

function depCheckPromise(directory: string, opts: depcheck.Options): Promise<depcheck.Results> {
  return new Promise(function (resolve, reject) {
    depcheck(directory, opts, (result) => {
      if (!result || result.dependencies === undefined) {
        reject();
      } else {
        resolve(result);
      }
    })
  });
}

export interface CheckProjectOptions {
  ignoreDirs?: string[];
  ignoreMatches?: string[];
}

async function getDependenciesUsed(directory: string, ignoreDirs: string[], ignoreMatches: string[]): Promise<string[]> {
  const depOptions: depcheck.Options = {
    ignoreBinPackage: true,
    ignoreDirs: ignoreDirs || [
      'sandbox',
      'dist',
      'bower_components',
      'test',
      'tests'
    ] ,
    ignoreMatches: ignoreMatches || [
      'grunt-*'
    ],
    parsers: { // the target parsers
      '*.js': depcheck.parser.es6,
      '*.jsx': depcheck.parser.jsx
    },
    detectors: [ // the target detectors
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration
    ],
    specials: [ // the target special parsers
      depcheck.special.eslint,
      depcheck.special.webpack
    ],
  };

  const depResult = await depCheckPromise(directory, depOptions);

  return _.keys(depResult.using);
}

async function getPackagesInstalled(directory: string): Promise<string[]> {
  const pkgResult = await readPkg({cwd: directory});
  return _.keys(pkgResult.dependencies);
}

export async function checkProject(directory: string, opts?: CheckProjectOptions) {
  try {
    await readDirPromise(directory);
  } catch (err) {
    throw new Error('Could not access specified directory: ' + err);
  }

  const depUsed = await getDependenciesUsed(directory, opts.ignoreDirs, opts.ignoreMatches);
  const depInstalled = await getPackagesInstalled(directory);

  return _.difference(depUsed, depInstalled);
}