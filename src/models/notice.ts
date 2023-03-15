export type UUID = string

export interface Notice {
    id: UUID
    editKey: string
    title: string
    date: number
    body: string
    excerpt: string
    active: boolean
    views: number
    readTime: number
}
