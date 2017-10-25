
// these should mirror shared/hashcat_types.go based on HashcatAttackMode
const HC_STRAIGHT = 0
const HC_BF = 3
const ENG_HC = 1

export default {
  // server/storage/schemas.go based on WorkerCrackEngine
  ENGINE_HASHCAT: ENG_HC,

  FILE_ENGINE: 0,
  FILE_TASK: 1,

  TASK_START: 'start',
  TASK_STOP: 'stop',

  HASHCAT_ATTACKMODE_STRAIGHT: HC_STRAIGHT,
  HASHCAT_ATTACKMODE_COMBINATION: 1,
  HASHCAT_ATTACKMODE_BF: HC_BF,
  HASHCAT_ATTACK_MODES: [
    {
      name: 'Dictionary/Straight',
      id: HC_STRAIGHT,
      default: true
    },
    {
      name: 'Brute Force',
      id: HC_BF
    }
  ],
  GOCRACK_ENGINES: [
    {
      name: 'Hashcat',
      id: ENG_HC
    }
  ],
  ENGINE_FILE_TYPES: [
    {
      name: 'Dictionary',
      id: 0
    },
    {
      name: 'Brute Force Mask(s)',
      id: 1
    },
    {
      name: 'Mangling Rule(s)',
      id: 2
    }
  ],
  TASK_FILE_FOR_ENGINE: [
    {
      name: 'All',
      id: 0
    },
    {
      name: 'Hashcat',
      id: ENG_HC
    }
  ],
  TASK_STATUSES: ['Queued', 'Running', 'Stopped', 'Error', 'Exhausted', 'Finished'],
  TASK_PRIORITIES: [
    { text: 'High (up to 4 GPUs)', value: 0 },
    { text: 'Normal (up to 2 GPUs)', value: 1 },
    { text: 'Low (1 GPU)', value: 2 }
  ]
}
