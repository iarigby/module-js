import path from 'path'
import { ArgumentParser } from 'argparse'
import { Partitions } from './partitions'
import { RunOpts } from './runs'
export const config = {
    subject: 'შესავალი ციფრულ ტექნოლოგიებში 2020'
}
export const env = {
    STUDENTS_DATA_PATH: `../../classroom-api/students.json`,
    CLASSROOM_CREDENTIALS_PATH: `../../classroom-api/credentials.json`,
    CLASSROOM_TOKEN_PATH: `../../classroom-api/token.json`
}
interface EnvOptions {
    hw: HwConfig,
    slice?: number,
    download: boolean,
    runOpts: RunOpts
}

export function getArgs(): EnvOptions {
    const parser = new ArgumentParser({
        addHelp: true
    })
    parser.addArgument(['-w', '--hw'], {help: 'id of the homework'})
    parser.addArgument(['-s', '--slice'], {help: 'check first n homeworks'})
    parser.addArgument(['-t', '--trial'], {help: 'dont save output/print emails not send'})
    parser.addArgument(['-d', '--download'], {help: 'whether to download or use existing file'})
    parser.addArgument(['-e', '--restart'], {help: 'not working: delete all previous run data'})
    parser.addArgument(['-r', '--rerun'], {help: 'not working: delete previous run data'})
    parser.addArgument(['-c', '--continue'], {help: 'continue from userId'})
    parser.addArgument(['-o', '--omit'], {help: 'skip all in category'})
    parser.addArgument(['-f', '--force'], {help: 'force check of id'})
    parser.addArgument(['-k', '--skip'], {help: 'skip check of id'})
    parser.addArgument(['-l', '--late'], {help: 'ignore late of id'})
    const args = parser.parseArgs()
    const hwId: string = args['hw']

    if (!hwId) {
        console.log('provide submission id')
        process.exit(1)
    }

    const hwConfig = homeworks.find(e => e.id == hwId)!

    if (!hwConfig) {
        console.log('provide valid submission id')
        process.exit(1)
    }
    let download = true
    if (args.download == 'false') {
        download = false
    }
    const omit: string[] = (args.omit || '').split(',')
    const force = args.force?.split(',')
    if (force && force.length) {
        if (! hwConfig.force) {
            hwConfig.force = []
        }
        hwConfig.force = hwConfig.force.concat(force)
    }
    const skip = args.skip?.split(',')
    if (skip) {
        if (!hwConfig.skip) {
            hwConfig.skip = []
        }
        hwConfig.skip = hwConfig.skip.concat(skip)
    }
    const late = args.late?.split(',')
    if (late) {
        if (!hwConfig.exceptions ) {
            hwConfig.exceptions = {}
        }
        if (!hwConfig.exceptions.late) {
            hwConfig.exceptions.late = []
        }
        hwConfig.exceptions.late = hwConfig.exceptions.late.concat(late)
    }
    return {
        hw: hwConfig,
        slice: args.slice,
        download: download,
        runOpts: {
            trial: args.trial == 'true',
            restart: args.restart == 'true',
            rerun: args.rerun == 'true',
            continue: args.continue,
            omit: omit
        }
    }
}
export function setEnv(): EnvOptions {
    Object.entries(env).map(([k, v]) => process.env[k] = path.resolve(__dirname, v))
    return getArgs()
}

export function testerPath(hwId: string) {
    // ვაიიმეეე
    const result: any = {};
    const testFiles = {'index': '', 'login': '_login', 'register': '_register'}
    Object.keys(testFiles).forEach(file =>
        // @ts-ignore
        result[file] = path.resolve(__dirname, `../resources/${hwId}tests${testFiles[file]}.js`)
    )
    return result
}
export interface HwConfig {
    id: string,
    name: string,
    exceptions?: Partitions<string[]>,
    manualChecks?: string[],
    force?: string[],
    skip?: string[]
}
export const homeworks: HwConfig[] = [
    {
        id: 'hw9',
        name: 'დავალება 9: ვებ აპლიკაცია',
        exceptions: {
            // late: ['gsamk19', 'aeris19', 'akuba19', 'ninchkh19', 'kpant19']
            // late: ['atutb19', 'edane19]
        },
        manualChecks: []
    },
    {
        id: 'final_project',
        name: 'ფინალური პროექტი'
    }
];
