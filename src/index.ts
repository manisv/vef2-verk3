import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static' // Notaðu node middleware
import categories from '../routes/categories'
import questions from '../routes/questions'
import answers from '../routes/answers'
import { cors } from 'hono/cors';

const app = new Hono()

// Enable CORS
app.use(cors());

// Þjóna stöðum (static files) úr public möppunni
app.use('/*', serveStatic({ root: './public' }))

// Tengja endapunktana
app.route('/categories', categories)
app.route('/questions', questions)
app.route('/answers', answers)

export default app