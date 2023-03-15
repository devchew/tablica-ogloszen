import express from 'express'
import { getAllNotices } from '../services/notices';
import { parseAlerts } from '../services/alert';


const router = express.Router();

router.get('/', async (req, res) => {
    const notices = await getAllNotices().catch(() => []) || [];
    res.render('home', {title: 'Tablica ogłoszeń', notices, alerts: parseAlerts(req.query?.error as string | string[])});
});
export default router
