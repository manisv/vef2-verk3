import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static' // Notaðu node middleware
import categories from '../routes/categories'
import questions from '../routes/questions'
import answers from '../routes/answers'

const app = new Hono()

// Þjóna stöðum (static files) úr public möppunni
app.use('/*', serveStatic({ root: './public' }))

// Tengja endapunktana
app.route('/categories', categories)
app.route('/questions', questions)
app.route('/answers', answers)

export default app