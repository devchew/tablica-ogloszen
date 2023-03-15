import express, { Request, Response } from 'express'
import { validate } from 'uuid';
import { createNotice, getNotice, updateNotice } from '../services/notices';
import { Notice } from '../models/notice';
import { parseAlerts } from '../services/alert';

const excerptLength = 50;
const createExcerpt = (body: string): string => body.length > excerptLength ? `${body.substring(0, excerptLength)} ...` : body

const calculateReadTime = (body: string): number => {
    const wps = 3;
    const words = body.trim().split(/\s+/).length;
    return Math.ceil(words / wps);
}

const updateNoticeViews = (notice: Notice): Notice => ({...notice, views: notice.views + 1})

const router = express.Router();

router.get('/notice/add', (req: Request, res: Response) => createNotice()
        .then(notice => res.redirect(`/notice/${notice.id}/edit?key=${notice.editKey}`))
        .catch(() => res.redirect('/')));

router.get('/notice/:id/edit', async (req: Request, res: Response) => getNotice(req.params.id)
    .then((notice) => {
        if (req.query?.key !== notice.editKey) {
            return res.redirect(`/notice/${notice.id}/?error=wrongKey`)
        }
        return res.render('notice-edit', {
            title: `Edytujesz ogłsozenie: ${notice.title}`,
            notice,
            postUri: `/notice/${notice.id}/edit`,
            alerts: parseAlerts(req.query?.error as string | string[])
        });
    })
    .catch(() => res.redirect('/'))
);

router.post('/notice/:id/edit', async (req: Request, res: Response) => {
    if (!validate(req.params.id)) {
        return res.redirect('/');
    }

    return updateNotice({
        id: req.params.id,
        ...(req.body?.title ? {title: req.body?.title} : {}),
        ...(req.body?.body ? {
            body: req.body.body,
            excerpt: createExcerpt(req.body.body),
            readTime: calculateReadTime(req.body.body)
        } : {}),
    })
        .then(() => res.redirect(`/notice/${req.params.id}/`))
        .catch(() => res.redirect('/'))
    }
);
router.get('/notice/:id', async (req: Request, res: Response) => {
    if (!validate(req.params.id)) {
        return res.redirect('/');
    }

    return getNotice(req.params.id)
        .then(notice=>updateNotice(updateNoticeViews(notice)).then(_=>notice))
        .then(notice =>
            res.render('notice', {
                title: `Ogłsozenie: ${notice.title}`, notice,
                editUri: `/notice/${notice.id}/edit`,
                alerts: parseAlerts(req.query?.error as string | string[])
            }))
        .catch(() => res.redirect('/'));
});

export default router
