import { Notice, UUID } from '../models/notice';
import { v4 as uuid, validate } from 'uuid';
import { db } from './database';
import { keygen } from './key-gen';

const noticesAddress = '/notices';

export const getAllNotices = (): Promise<Notice[]> => db
    .getObject<{[key: UUID]: Notice}>(noticesAddress)
    .then(notices => Object.values(notices))
    .then(notices => notices.filter(({active}) => active).sort((a,b) => b.date - a.date));
export const createNotice = (): Promise<Notice> => {
    const newNotice: Notice = {
        id: uuid(),
        date: +new Date(),
        editKey: keygen(),
        active: false,
        title: "",
        body: "",
        excerpt: "",
        readTime: 0,
        views: 0
    }
    return db.push(`${noticesAddress}/${newNotice.id}`, newNotice).then(_=>newNotice);
}

export const updateNotice = (notice: Partial<Notice> & {id: Notice['id']}): Promise<void> => {
    return validate(notice.id)
        ? db.push(`${noticesAddress}/${notice.id}`, notice, false)
        : Promise.reject()
}

export const getNotice = (id: UUID): Promise<Notice> => validate(id) ? db
    .getObject<Notice>(`${noticesAddress}/${id}`) : Promise.reject()
