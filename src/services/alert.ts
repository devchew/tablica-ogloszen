import { Alert, Severity } from '../models/Ui';

export const createAlert = (title: Alert['title'] , description: Alert['description'] = "", severity: Alert['severity'] = Severity.info): Alert => ({
    description,
    title,
    severity
})

export const alerts: {[key: string]: Alert} = {
    'wrongKey': createAlert('błędny klucz', 'brak dostępu', Severity.warning)
}

export const parseAlerts = (query: string | string[]): Alert[] => {
    if (!query) {
        return [];
    }
    const keys = Array.isArray(query) ? query : [query];
    return keys.map(key => alerts[key] || false).filter(Boolean)
}
