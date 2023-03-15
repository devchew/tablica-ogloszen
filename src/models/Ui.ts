export enum Severity {
    primary = 'primary',
    secondary = 'secondary',
    success = 'success',
    danger = 'danger',
    warning = 'warning',
    info = 'info',
    light = 'light',
    dark = 'dark',
}

export interface Alert {
    severity: Severity
    title: string
    description: string
}
