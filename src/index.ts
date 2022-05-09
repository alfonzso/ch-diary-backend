import 'express-async-errors';
import app from './loaders/express';

const port = process.env.PORT || 8080;

// listen to our express app
app.listen(port, () => {
  console.log(`Our Application is up and running on port ${port}`);
});
