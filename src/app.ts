import express, { Application } from 'express'
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { db } from './services/database';
import home from './controllers/home';
import notice from './controllers/notice';
import { formatRelative, intervalToDuration, formatDuration } from 'date-fns'
import { pl } from 'date-fns/locale'

const app: Application = express()

const port: number = 3001

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.engine('.hbs', engine({
    extname: '.hbs', helpers: {
        toRelativeDate: (date?: number) => {
            if (!date) {
                return " - ";
            }
            return formatRelative(date, new Date(), {locale: pl});
        },
        secondsToString: (seconds: number) => {
            if (!seconds) {
                return " - ";
            }
            return formatDuration(intervalToDuration({
                start: 0,
                end: seconds * 1000
            }), {locale: pl});
        }
    },
}));
app.use('/assets',express.static('./src/views/assets'))

app.set('view engine', '.hbs');
app.set('views', './src/views');

app.use(home);
app.use(notice);

app.listen(port, function () {
    db.reload();
    console.log(`App is listening on port ${port} !`)
})
