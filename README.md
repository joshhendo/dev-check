# dev-check
A static analysis tool for NodeJS project to ensure that no dev dependency is imported by production code.

## Why
If your deployment processes involves installing all dependencies for testing or compiling, and then pruning all the devDependencies to bundle the remaining files for deployment, you want to be sure that none of the production code depends on any package inside devDependencies. This tool aims to be a light-weight static analysis check that ensures that all the imports inside production code are included in the production dependencies.

## How
This package heavily relies upon [depcheck](https://www.npmjs.com/package/depcheck), a package which can scan files and determine what packages are being imported. Simply excluding all directories that don't include production code (e.g. testing directories). To use, install and run the following from within the directory you want to check

`dep-check .`

By default, it will not exclude any directories. Under most circumstances, you will want to pass in at least one directory (e.g. a tests directory) that includes code which uses `devDependencies`.

Specifying directories to be excluded is done by passing in `-e` (or `--exclude`) with the directory or directories to ignore. Pass in multiple directories as a comma separated list. For example:

`dep-check -e tests,scripts .`

## Future Improvements
This project is designed to remain very lightweight, but there are some future improvements that are needed.
  - Ability to specify file mask instead of excluding directories. This will allow projects where test files are mixed in with production code to use this tool
  - Ability to be able to check files based on an ignore file. For example, if you have a `.dockerignore` file, you may want to check that all the files that will be bundled with your Docker image will be
