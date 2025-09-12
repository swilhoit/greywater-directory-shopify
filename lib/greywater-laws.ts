import stateData from '../greywater-state-directory.json'

export interface StateInfo {
  legalStatus: string
  governingCode: string
  permitThresholdGpd: number | null
  permitRequired: string
  indoorUseAllowed: boolean
  outdoorUseAllowed: boolean
  approvedUses: string[]
  keyRestrictions: string[]
  recentChanges: string | null
  primaryAgency: string
  agencyContact: string
  agencyPhone: string | null
  governmentWebsite: string
  regulatoryClassification: string
  summary: string
}

export interface StateMetadata {
  title: string
  lastUpdated: string
  dataSource: string
  totalStates: number
  summary: string
}

export function getAllStates(): string[] {
  return Object.keys(stateData.states).sort()
}

export function getStateInfo(stateName: string): StateInfo | null {
  const states = stateData.states as { [key: string]: StateInfo }
  return states[stateName] || null
}

export function getStateSlug(stateName: string): string {
  return stateName.toLowerCase().replace(/\s+/g, '-')
}

export function getStateFromSlug(slug: string): string | null {
  const states = getAllStates()
  return states.find(state => getStateSlug(state) === slug) || null
}

export function getMetadata(): StateMetadata {
  return stateData.metadata
}

export function getStatesByLegalStatus(): { [key: string]: string[] } {
  const states = stateData.states as { [key: string]: StateInfo }
  const grouped: { [key: string]: string[] } = {}
  
  Object.entries(states).forEach(([stateName, info]) => {
    const status = info.legalStatus
    if (!grouped[status]) {
      grouped[status] = []
    }
    grouped[status].push(stateName)
  })
  
  return grouped
}

export function getProgressiveStates(): string[] {
  const states = stateData.states as { [key: string]: StateInfo }
  const progressive: string[] = []
  
  Object.entries(states).forEach(([stateName, info]) => {
    if (info.regulatoryClassification.toLowerCase().includes('progressive') ||
        info.regulatoryClassification.toLowerCase().includes('comprehensive') ||
        (info.permitThresholdGpd && info.permitThresholdGpd > 0)) {
      progressive.push(stateName)
    }
  })
  
  return progressive.sort()
}

export function getRestrictiveStates(): string[] {
  const states = stateData.states as { [key: string]: StateInfo }
  const restrictive: string[] = []
  
  Object.entries(states).forEach(([stateName, info]) => {
    if (info.legalStatus.toLowerCase().includes('prohibited') ||
        info.legalStatus.toLowerCase().includes('no formal') ||
        info.legalStatus.toLowerCase().includes('no specific') ||
        info.regulatoryClassification.toLowerCase().includes('prohibited') ||
        info.regulatoryClassification.toLowerCase().includes('no policy')) {
      restrictive.push(stateName)
    }
  })
  
  return restrictive.sort()
}